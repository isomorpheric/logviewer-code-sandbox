# Performance Metrics Context

## Overview

This module provides a centralized way to track and display performance metrics, specifically focusing on **Time to First Render (TTFR)**.

## Components

### `PerformanceMetricsContext`

A React Context that holds:
- `metrics`: An object containing recorded metrics (e.g., `ttfr`).
- `markRenderStart()`: Call this when the fetch/render process begins.
- `markRenderEnd()`: Call this when the first meaningful content is painted.

### `PerformanceMetricsProvider`

Wraps the application and manages the state of metrics. It uses the standard `performance.mark` and `performance.measure` APIs under the hood for browser devtools integration.

## Usage

1. **Start**: When `useLogStream` initiates a request, `markRenderStart()` is called.
2. **End**: When the `LogTable` renders its first row, `markRenderEnd()` is called.
3. **Display**: The `StatusBar` component consumes the context to display the TTFR in milliseconds.

```typescript
// In LogTable.tsx
useEffect(() => {
  if (logs.length > 0) {
    markRenderEnd();
  }
}, [logs]);
```
