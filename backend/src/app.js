import express from "express";
import cors from "cors";
import reservasRoutes from "./routes/reservas.js";
import adminRoutes from "./routes/admin.js";
import { sequelize } from "./models/index.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", reservasRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => res.json({ status: "ok" }));

// Probar conexión a la base de datos
sequelize
  .authenticate()
  .then(() => console.log("✅ Conectado a la base de datos MySQL"))
  .catch((err) => console.error("❌ Error de conexión:", err));

export default app;
