// utilidades para reservas (exportadas para test y reuso)
export const ALLOWED_SLOTS = ["08:00:00", "10:00:00", "14:00:00", "16:00:00", "18:00:00"];
export const RESERVATION_DURATION_MIN = 120;
export const MAX_DAYS_AHEAD = 7;
export const CUTOFF_HOURS_BEFORE = 12;

export function parseDateTime(fecha /* YYYY-MM-DD */, hora /* HH:MM:SS */) {
  return new Date(`${fecha}T${hora}`);
}

export function isOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}
