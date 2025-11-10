import { Router } from "express";
import Escenario from "../models/Escenario.js";

const router = Router();

// Obtener todos los escenarios
router.get("/", async (req, res) => {
  try {
    const escenarios = await Escenario.findAll();
    res.json(escenarios);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener escenarios" });
  }
});

export default router;
