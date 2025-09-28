// backend/src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import usuariosRoutes from "./routes/usuarios.js";
import reservasRoutes from "./routes/reservas.js";
import sequelize from "./db.js";
import "./models/index.js"; // carga modelos y relaciones

dotenv.config();

const app = express();
app.use(express.json());

// Permitir solicitudes desde el frontend (localhost:5173)
app.use(cors());

// Healthcheck para que no aparezca "Cannot GET /"
app.get("/", (req, res) => res.json({ status: "ok" }));

// Rutas de la API
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/reservas", reservasRoutes);

// Swagger
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "API Oasis", version: "1.0.0" },
    servers: [{ url: "http://localhost:4000" }],
  },
  apis: ["./src/routes/*.js"],
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Conexión a la BD
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la BD");
  } catch (err) {
    console.error("❌ Error de conexión:", err);
  }
})();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api/docs`);
});
