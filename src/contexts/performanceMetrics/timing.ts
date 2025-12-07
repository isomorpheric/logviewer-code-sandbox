/**
 * Low-level Performance API utilities for timing measurements.
 */

const MARKS = {
  FETCH_START: "log-fetch-start",
  FIRST_BYTE: "log-first-byte",
  FIRST_RENDER: "log-first-render",
} as const;

const MEASURES = {
  TTFB: "ttfb",
  TTFR: "ttfr",
} as const;

/** Clear all performance marks and measures for a fresh timing cycle. */
export function clearAllMarks(): void {
  performance.clearMarks(MARKS.FETCH_START);
  performance.clearMarks(MARKS.FIRST_BYTE);
  performance.clearMarks(MARKS.FIRST_RENDER);
  performance.clearMeasures(MEASURES.TTFB);
  performance.clearMeasures(MEASURES.TTFR);
}

/** Mark the start of a fetch operation. */
export function markFetchStart(): void {
  performance.mark(MARKS.FETCH_START);
}

/** Mark when the first byte is received. */
export function markFirstByte(): void {
  performance.mark(MARKS.FIRST_BYTE);
}

/** Mark when the first render occurs. */
export function markFirstRender(): void {
  performance.mark(MARKS.FIRST_RENDER);
}

/** Measure TTFB (fetch start → first byte). Returns ms or null if marks unavailable. */
export function measureTTFB(): number | null {
  try {
    const measure = performance.measure(MEASURES.TTFB, MARKS.FETCH_START, MARKS.FIRST_BYTE);
    return Math.round(measure.duration);
  } catch {
    return null;
  }
}

/** Measure TTFR (fetch start → first render). Returns ms or null if marks unavailable. */
export function measureTTFR(): number | null {
  try {
    const measure = performance.measure(MEASURES.TTFR, MARKS.FETCH_START, MARKS.FIRST_RENDER);
    return Math.round(measure.duration);
  } catch {
    return null;
  }
}
