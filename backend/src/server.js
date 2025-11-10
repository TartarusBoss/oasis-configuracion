// backend/src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

// Routes and DB are imported conditionally so the app can run without a DB for simple admin UI.
let usuariosRoutes, reservasRoutes, escenariosRoutes, sequelize;
import { metricsMiddleware } from './lib/metrics.js';
import { getLastEvents, getCountsPerMinute } from './lib/logs.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(express.json());

// Permitir solicitudes desde el frontend (localhost:5173)
app.use(cors());

// Healthcheck para que no aparezca "Cannot GET /"
app.get("/", (req, res) => res.json({ status: "ok" }));

// Rutas de la API (se montan condicionalmente si USE_MYSQL=true)

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

// Metrics endpoint
app.get('/metrics', metricsMiddleware);

// Simple in-app log viewer endpoints (no external tools required)
// GET /admin/logs?limit=100  -> returns recent login events
app.get('/admin/logs', (req, res) => {
  const limit = parseInt(req.query.limit || '100', 10) || 100;
  res.json(getLastEvents(limit));
});

// Serve admin UI
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'ui.html'));
});

// GET /admin/login-counts -> returns counts per minute since process start
app.get('/admin/login-counts', (req, res) => {
  res.json(getCountsPerMinute());
});

// POST /admin/simulate-login -> create an in-memory login event for testing without DB
app.post('/admin/simulate-login', (req, res) => {
  const { correo, status } = req.body || {};
  if (!correo) return res.status(400).json({ error: 'correo required' });
  try {
    // lazy import to avoid circular issues
    import('./lib/logs.js').then(mod => {
      try { mod.recordLoginAttempt(correo, status || 'attempt'); } catch (e) {}
      res.json({ ok: true });
    }).catch(err => res.status(500).json({ error: err.message }));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// If USE_MYSQL=true then load DB + routes; otherwise skip DB and the API routes that require models.
(async () => {
  try {
    if (process.env.USE_MYSQL === 'true') {
      // lazy import to avoid requiring sqlite3 when user wants lightweight UI only
      const dbMod = await import('./db.js');
      sequelize = dbMod.default || dbMod;
      await sequelize.authenticate();
      // load models and routes
      await import('./models/index.js');
      usuariosRoutes = (await import('./routes/usuarios.js')).default;
      reservasRoutes = (await import('./routes/reservas.js')).default;
      escenariosRoutes = (await import('./routes/escenarios.js')).default;
      app.use('/api/usuarios', usuariosRoutes);
      app.use('/api/reservas', reservasRoutes);
      app.use('/api/escenarios', escenariosRoutes);
      console.log('✅ Conectado a la BD y rutas API montadas');
    } else {
      console.log('ℹ️ USE_MYSQL not set — running in lightweight mode (admin UI available, DB routes disabled)');
    }
  } catch (err) {
    console.error('❌ Error al inicializar DB/rutas:', err);
  }
})();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api/docs`);
});
