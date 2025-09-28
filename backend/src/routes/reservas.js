import { Router } from "express";
import Reserva from "../models/Reserva.js";
import Usuario from "../models/Usuario.js";
import Escenario from "../models/Escenario.js";

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
    const reservas = await Reserva.findAll({
      include: [Usuario, Escenario],
    });
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
router.post("/", async (req, res) => {
  try {
    const nueva = await Reserva.create(req.body);
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
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const filas = await Reserva.destroy({ where: { id } });
    if (!filas) return res.status(404).json({ message: "Reserva no encontrada" });
    res.json({ message: "Reserva eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar reserva" });
  }
});

export default router;
