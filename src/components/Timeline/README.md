# Timeline Component

> [!IMPORTANT]
> In a real production application, I would have likely leaned on a charting library for the component ui, the core functions however would remain mostly the same.


## Overview

The `Timeline` component visualizes the distribution of log events over time using a lightweight SVG bar chart. It allows users to quickly spot bursts of activity or silence.

## Implementation Details

### Aggregation

- **Input**: Receives the full array of `LogEntry` objects.
- **Bucketing**: Iterates through logs and groups them into time buckets (e.g., 1 minute or computed dynamic intervals based on the total time range).
- **Normalization**: Finds the maximum count in any bucket to scale the Y-axis height of the bars relative to the container height.

### Rendering

- **SVG**: Uses raw `<svg>` and `<rect>` elements. This avoids the heavy bundle size of charting libraries (like D3, Chart.js, or Recharts).
- **Responsiveness**: The SVG scales via CSS, but the bucket calculation might re-run if the time range changes significantly.
- **Interactivity**:
  - Hovering over a bar displays a tooltip with the time range and log count (via `TimelineTooltip`).

## Performance Considerations

- The aggregation is memoized (`useMemo`) to prevent recalculation on every render unless the logs array changes.
- Rendering hundreds of `<rect>` elements is generally performant, but the number of buckets is limited (e.g., to the pixel width of the container or a fixed number like 60-100) to avoid DOM bloat.
