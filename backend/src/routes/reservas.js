import { Router } from "express";
import { Op } from "sequelize";
import Reserva from "../models/Reserva.js";
import Usuario from "../models/Usuario.js";
import Escenario from "../models/Escenario.js";
import auth from "../middleware/auth.js";
import {
  ALLOWED_SLOTS,
  RESERVATION_DURATION_MIN,
  MAX_DAYS_AHEAD,
  CUTOFF_HOURS_BEFORE,
  parseDateTime,
  isOverlap,
} from "../utils/reservaUtils.js";

const router = Router();

/**
 * @openapi
 * /api/reservas:
 *   get:
 *     summary: Obtener todas las reservas
 *     tags:
 *       - Reservas
 *     responses:
 *       200:
 *         description: Lista de reservas
 */
router.get("/", async (req, res) => {
  try {
    // Soporta filtros por escenarioId, fecha y hora_inicio
    const { escenarioId, fecha, hora_inicio } = req.query;
    const where = {};
    if (escenarioId) where.escenarioId = escenarioId;
    if (fecha) where.fecha = fecha;
    if (hora_inicio) where.hora_inicio = hora_inicio;

    const reservas = await Reserva.findAll({ where, include: [Usuario, Escenario] });
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener reservas" });
  }
});

/**
 * @openapi
 * /api/reservas:
 *   post:
 *     summary: Crear una nueva reserva
 *     tags:
 *       - Reservas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuarioId:
 *                 type: integer
 *               escenarioId:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date
 *               hora_inicio:
 *                 type: string
 *               duracion_minutos:
 *                 type: integer
 *               estado:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reserva creada con éxito
 */
// Crear reserva con validaciones:
// - franja horaria permitida
// - duración fija 120 minutos
// - no solapamiento en mismo escenario y fecha
// - solo hasta 7 días en adelante (incluido hoy)
// Función auxiliar para contar reservas activas de un usuario
async function contarReservasActivas(usuarioId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return await Reserva.count({
    where: {
      usuarioId,
      fecha: {
        [Op.gte]: today
      },
      estado: "ACTIVA"
    }
  });
}

router.post("/", auth, async (req, res) => {
  try {
    // usuarioId se toma del token para evitar suplantación
    const actorId = req.user?.id;
    if (!actorId) return res.status(401).json({ error: "No autorizado" });
    const { escenarioId, fecha, hora_inicio, duracion_minutos } = req.body;

    // Verificar límite de reservas activas (excepto para admin)
    if (req.user.rol !== 'admin') {
      const reservasActivas = await contarReservasActivas(actorId);
      if (reservasActivas >= 3) {
        return res.status(400).json({ 
          error: "Ya tienes 3 reservas activas. Debes cancelar alguna reserva existente antes de poder hacer una nueva." 
        });
      }
    }

    // Validaciones básicas
    if (!escenarioId || !fecha || !hora_inicio)
      return res.status(400).json({ error: "Faltan campos obligatorios" });

    if (!ALLOWED_SLOTS.includes(hora_inicio))
      return res.status(400).json({ error: "La hora seleccionada no está disponible. Por favor, elige uno de los horarios permitidos." });

    if (duracion_minutos !== RESERVATION_DURATION_MIN)
      return res.status(400).json({ error: `Todas las reservas deben tener una duración de ${RESERVATION_DURATION_MIN} minutos` });

    // Validación de fecha
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear la hora a medianoche
    
    const targetDate = new Date(fecha + "T00:00:00");
    
    // Verificar que no sea una fecha pasada
    if (targetDate < today) {
      return res.status(400).json({ error: "Lo sentimos, no es posible hacer reservas para fechas pasadas. Por favor, selecciona una fecha futura." });
    }

    // Límite 1 semana
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + MAX_DAYS_AHEAD);

    if (targetDate > maxDate) {
      return res.status(400).json({ error: `Las reservas solo se pueden hacer con hasta ${MAX_DAYS_AHEAD} días de anticipación. Por favor, elige una fecha más cercana.` });
    }

  // comprobar existencia de usuario y escenario
  const usuario = await Usuario.findByPk(actorId);
    const escenario = await Escenario.findByPk(escenarioId);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    if (!escenario) return res.status(404).json({ error: "Escenario no encontrado" });

    // comprobar solapamientos
    const newStart = parseDateTime(fecha, hora_inicio);
    const newEnd = new Date(newStart.getTime() + duracion_minutos * 60000);

    const mismas = await Reserva.findAll({ where: { escenarioId, fecha } });
    for (const r of mismas) {
      const existingStart = parseDateTime(r.fecha, r.hora_inicio);
      const existingEnd = new Date(existingStart.getTime() + r.duracion_minutos * 60000);
      if (isOverlap(newStart, newEnd, existingStart, existingEnd)) {
        return res.status(409).json({ error: "Lo sentimos, este escenario ya está reservado para ese horario. Por favor, elige otro horario u otro escenario." });
      }
    }

    const nueva = await Reserva.create({ usuarioId: actorId, escenarioId, fecha, hora_inicio, duracion_minutos, estado: "ACTIVA" });
    res.status(201).json(nueva);
  } catch (err) {
    res.status(500).json({ error: "Error al crear reserva", details: err.message });
  }
});

/**
 * @openapi
 * /api/reservas/{id}:
 *   delete:
 *     summary: Eliminar una reserva por ID
 *     tags:
 *       - Reservas
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reserva eliminada
 */
// Eliminar reserva: solo si faltan al menos 12 horas para el inicio
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await Reserva.findByPk(id);
    if (!reserva) return res.status(404).json({ message: "Reserva no encontrada" });
    const actor = req.user;
    console.log('DELETE /api/reservas/' + id + ' actor:', actor, 'reserva.usuarioId:', reserva.usuarioId);
    const start = parseDateTime(reserva.fecha, reserva.hora_inicio);
    const now = new Date();
    const diffMs = start - now;
    const cutoffMs = CUTOFF_HOURS_BEFORE * 60 * 60 * 1000;

    // Si no es admin, aplicar la restricción de cancelación
    if (actor.rol !== 'admin' && diffMs < cutoffMs) {
      return res.status(400).json({ error: `Lo sentimos, las reservas solo se pueden cancelar con al menos ${CUTOFF_HOURS_BEFORE} horas de anticipación.` });
    }

    // Solo puede cancelar el propietario o un admin
    if (reserva.usuarioId !== actor.id && actor.rol !== "admin") return res.status(403).json({ error: "No tienes permiso para cancelar esta reserva" });
    await Reserva.destroy({ where: { id } });
    res.json({ message: "Reserva eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar reserva" });
  }
});

// Editar reserva: se puede editar escenario, fecha y hora (con mismas validaciones)
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await Reserva.findByPk(id);
    if (!reserva) return res.status(404).json({ error: "Reserva no encontrada" });

    console.log('PUT /api/reservas/' + id + ' actor:', req.user, 'reserva.usuarioId:', reserva.usuarioId);


    const { escenarioId, fecha, hora_inicio } = req.body;
    const duracion_minutos = reserva.duracion_minutos; // preserva duración

    // Si se cambian fecha/hora, validar reglas
    const newFecha = fecha ?? reserva.fecha;
    const newHora = hora_inicio ?? reserva.hora_inicio;
    if (!ALLOWED_SLOTS.includes(newHora))
      return res.status(400).json({ error: "Hora inválida" });

    // Límite 1 semana
    const today = new Date();
    const targetDate = new Date(newFecha + "T00:00:00");
    const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    maxDate.setDate(maxDate.getDate() + MAX_DAYS_AHEAD);
    const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (targetDate < minDate || targetDate > maxDate)
      return res.status(400).json({ error: `Solo se pueden reservar entre hoy y ${MAX_DAYS_AHEAD} días` });

    const newStart = parseDateTime(newFecha, newHora);
    const newEnd = new Date(newStart.getTime() + duracion_minutos * 60000);

    const checkEscenarioId = escenarioId ?? reserva.escenarioId;
    const mismas = await Reserva.findAll({ where: { escenarioId: checkEscenarioId, fecha: newFecha } });
    for (const r of mismas) {
      if (r.id === reserva.id) continue; // skip self
      const existingStart = parseDateTime(r.fecha, r.hora_inicio);
      const existingEnd = new Date(existingStart.getTime() + r.duracion_minutos * 60000);
      if (isOverlap(newStart, newEnd, existingStart, existingEnd)) {
        return res.status(409).json({ error: "No se puede modificar la reserva al horario seleccionado porque ya existe otra reserva en ese escenario. Por favor, elige otro horario u otro escenario." });
      }
    }

    // Sólo propietario o admin puede editar
    const actor = req.user;
    if (reserva.usuarioId !== actor.id && actor.rol !== "admin") return res.status(403).json({ error: "No tienes permiso para editar esta reserva" });

    // Actualizar campos permitidos
    reserva.escenarioId = checkEscenarioId;
    reserva.fecha = newFecha;
    reserva.hora_inicio = newHora;
    await reserva.save();
    res.json(reserva);
  } catch (err) {
    res.status(500).json({ error: "Error al editar reserva", details: err.message });
  }
});

// Obtener historial por usuario
router.get('/usuario/:usuarioId', auth, async (req, res) => {
  try {
    const { usuarioId } = req.params;
    // sólo el propio usuario o admin puede ver el historial
    const actor = req.user;
    if (actor.id !== Number(usuarioId) && actor.rol !== 'admin') return res.status(403).json({ error: 'No autorizado' });
    const reservas = await Reserva.findAll({ where: { usuarioId }, include: [Escenario] });
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener historial' });
  }
});

export default router;
