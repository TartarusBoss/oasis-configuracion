import express from "express";
import { Reserva, Usuario, Escenario } from "../models/index.js";

const router = express.Router();

router.get("/hello", (req, res) => {
  res.json({ message: "Hola desde el backend 👋" });
});

router.get("/reservas", async (req, res) => {
  try {
    const reservas = await Reserva.findAll({
      include: [Usuario, Escenario],
    });
    res.json(reservas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener reservas" });
  }
});

export default router;
