# Performance Metrics

Tracks **Time to First Byte (TTFB)** and **Time to First Render (TTFR)** using the browser's Performance API.

## API

```ts
const { 
  ttfb,            // number | null — Time to First Byte (ms)
  ttfr,            // number | null — Time to First Render (ms)
  markFetchStart,  // () => void — Call when fetch starts
  markFirstByte,   // () => void — Call when first data chunk arrives
  markFirstRender  // () => void — Call when first content renders
} = usePerformanceMetrics();
```

## Usage

```tsx
// useLogStream.tsx — marks fetch lifecycle
const { markFetchStart, markFirstByte } = usePerformanceMetrics();

markFetchStart();   // on fetch start
markFirstByte();    // on first chunk received

// LogList.tsx — marks render lifecycle
const { markFirstRender } = usePerformanceMetrics();

markFirstRender();  // on first log row rendered

// StatusBar.tsx — displays metrics
const { ttfb, ttfr } = usePerformanceMetrics();
```

## Architecture

- **`timing.ts`** — Low-level Performance API utilities (marks, measures)
- **`PerformanceMetricsContext.tsx`** — React state layer
