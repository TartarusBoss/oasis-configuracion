// backend/src/routes/usuarios.js
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import dotenv from "dotenv";
import { loginCounter, registerCounter } from '../lib/metrics.js';
import { recordLoginAttempt } from '../lib/logs.js';

dotenv.config();

const router = Router();

// Registro
router.post("/register", async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;
    if (!nombre || !correo || !password) return res.status(400).json({ error: "Faltan campos" });

    const existing = await Usuario.findOne({ where: { correo } });
    if (existing) return res.status(409).json({ error: "Correo ya registrado" });

    const hash = bcrypt.hashSync(password, 10);
    const nuevoUsuario = await Usuario.create({ nombre, correo, password: hash, rol: rol ?? "user" });
    registerCounter.inc({ status: 'success' });
    res.status(201).json({ id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, correo: nuevoUsuario.correo });
  } catch (err) {
    try { registerCounter.inc({ status: 'failure' }); } catch(e){}
    res.status(500).json({ error: "Error al crear usuario", details: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;
    console.log('Intento de login para:', correo);
    // record lightweight event for in-app log viewing
    try { recordLoginAttempt(correo, 'attempt'); } catch(e){}
    
    if (!correo || !password) {
      console.log('Error: Faltan credenciales');
      return res.status(400).json({ error: "Faltan credenciales" });
    }

    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
      try { loginCounter.inc({ status: 'failure' }); } catch(e){}
      console.log('Error: Usuario no encontrado');
      try { recordLoginAttempt(correo, 'failure'); } catch(e){}
      return res.status(401).json({ error: "El usuario no existe" });
    }

    const ok = bcrypt.compareSync(password, usuario.password);
    if (!ok) {
      try { loginCounter.inc({ status: 'failure' }); } catch(e){}
      console.log('Error: Contraseña incorrecta');
      try { recordLoginAttempt(correo, 'failure'); } catch(e){}
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }
    
    console.log('Login exitoso para:', usuario.correo);

    try { loginCounter.inc({ status: 'success' }); } catch(e){}
    try { recordLoginAttempt(usuario.correo, 'success'); } catch(e){}

  const token = jwt.sign({ id: usuario.id, correo: usuario.correo, nombre: usuario.nombre, rol: usuario.rol }, process.env.JWT_SECRET ?? "secret", { expiresIn: "8h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Error en login" });
  }
});

// Lista de usuarios (para administración simple)
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: ["id", "nombre", "correo", "rol"] });
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Eliminar usuario
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const filas = await Usuario.destroy({ where: { id } });
    if (!filas) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

export default router;
