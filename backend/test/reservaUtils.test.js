import { isOverlap, parseDateTime } from '../src/utils/reservaUtils.js';

test('isOverlap detects overlapping intervals', () => {
  const aStart = parseDateTime('2025-11-10', '08:00:00');
  const aEnd = parseDateTime('2025-11-10', '10:00:00');
  const bStart = parseDateTime('2025-11-10', '09:00:00');
  const bEnd = parseDateTime('2025-11-10', '11:00:00');
  expect(isOverlap(aStart, aEnd, bStart, bEnd)).toBe(true);
});

test('isOverlap detects non-overlap', () => {
  const aStart = parseDateTime('2025-11-10', '08:00:00');
  const aEnd = parseDateTime('2025-11-10', '10:00:00');
  const bStart = parseDateTime('2025-11-10', '10:00:00');
  const bEnd = parseDateTime('2025-11-10', '12:00:00');
  expect(isOverlap(aStart, aEnd, bStart, bEnd)).toBe(false);
});
