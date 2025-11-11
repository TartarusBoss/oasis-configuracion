import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Almacenamiento en memoria de logs
let logs = [];
let loginCounts = {};

// Actualizar contador por minuto
function updateMinuteCounter() {
  const now = new Date();
  const minuteKey = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()).toISOString();
  
  if (!loginCounts[minuteKey]) {
    loginCounts[minuteKey] = 0;
  }
  loginCounts[minuteKey]++;
}

// Registrar un log
export function logLoginAttempt(correo, status) {
  logs.push({
    ts: Date.now(),
    correo,
    status
  });

  // Mantener solo los últimos 500 logs
  if (logs.length > 500) {
    logs.shift();
  }

  updateMinuteCounter();
}

// Endpoint para obtener logs
router.get('/logs', (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 100;
  const result = logs.slice(-limit);
  res.json(result);
});

// Endpoint para obtener contadores por minuto
router.get('/login-counts', (req, res) => {
  const counts = Object.entries(loginCounts).map(([minute, count]) => ({
    minute,
    count
  })).sort((a, b) => new Date(a.minute) - new Date(b.minute));
  res.json(counts);
});

// Endpoint para simular un login
router.post('/simulate-login', (req, res) => {
  const { correo, status } = req.body;
  logLoginAttempt(correo || 'test@example.com', status || 'success');
  res.json({ success: true });
});

// Servir el HTML del admin
router.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, '../admin/ui.html');
  res.sendFile(htmlPath);
});

export default router;
