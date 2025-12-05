const MARKS = {
  FETCH_START: "log-fetch-start",
  FIRST_BYTE: "log-first-byte",
  FIRST_RENDER: "log-first-render",
} as const;

/** Clear all performance marks and measures. */
function clear(): void {
  performance.clearMarks(MARKS.FETCH_START);
  performance.clearMarks(MARKS.FIRST_BYTE);
  performance.clearMarks(MARKS.FIRST_RENDER);
  performance.clearMeasures("ttfb");
  performance.clearMeasures("ttfr");
}

/** Mark the start of a fetch operation. Clears previous marks. */
function start(): void {
  clear();
  performance.mark(MARKS.FETCH_START);
}

/** Mark when the first byte is received. Only marks once per cycle. */
function firstByte(): void {
  if (performance.getEntriesByName(MARKS.FIRST_BYTE, "mark").length > 0) return;
  performance.mark(MARKS.FIRST_BYTE);
}

/** Get Time to First Byte (ms), or null if not available. */
function getTTFB(): number | null {
  try {
    const measure = performance.measure("ttfb", MARKS.FETCH_START, MARKS.FIRST_BYTE);
    return Math.round(measure.duration);
  } catch {
    return null;
  }
}

/** Get Time to First Render (ms), or null if not available. */
function getTTFR(): number | null {
  try {
    performance.mark(MARKS.FIRST_RENDER);
    const measure = performance.measure("ttfr", MARKS.FETCH_START, MARKS.FIRST_RENDER);
    return Math.round(measure.duration);
  } catch {
    return null;
  }
}

export const perf = {
  clear,
  start,
  firstByte,
  getTTFB,
  getTTFR,
};
