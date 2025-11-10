// backend/src/lib/logs.js
// Simple in-memory log recorder for login attempts.
// No external dependencies. Stores recent events in memory and provides
// aggregation per-minute since process start.

const events = [];

/**
 * Record a login-related event.
 * @param {{correo:string}} correo
 * @param {string} status - 'attempt' | 'success' | 'failure'
 */
export function recordLoginAttempt(correo, status = 'attempt') {
  try {
    events.push({ ts: Date.now(), correo: correo ?? null, status });
    // keep memory bounded: trim to last 10k entries
    if (events.length > 10000) events.splice(0, events.length - 10000);
  } catch (e) {
    // best-effort; never throw
  }
}

/**
 * Return last N events (most recent first)
 */
export function getLastEvents(limit = 100) {
  return events.slice(-limit).reverse();
}

/**
 * Return counts per minute since process start.
 * Returns an array of { minute: ISOString, count }
 */
export function getCountsPerMinute() {
  const map = new Map();
  for (const e of events) {
    const d = new Date(e.ts);
    d.setSeconds(0, 0);
    const key = d.toISOString();
    map.set(key, (map.get(key) || 0) + 1);
  }
  const out = Array.from(map.entries()).map(([minute, count]) => ({ minute, count }));
  out.sort((a, b) => a.minute.localeCompare(b.minute));
  return out;
}

export default { recordLoginAttempt, getLastEvents, getCountsPerMinute };
