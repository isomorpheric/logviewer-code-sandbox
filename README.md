# Log Viewer

A high-performance, streaming log viewer built with React. It streams in logs and renders them in a virtualized table, with optimizations for TTFB and TTFR (for the row).

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js**: v18 or higher (LTS recommended)

## Quick Start

This application is optimized for **Fast Time-To-First-Byte (TTFB)** and **Time-To-First-Render (TTFR)**. To see it in its best light, I recommend running the production build.

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build & Preview (Recommended)**
   ```bash
   npm start
   ```
   This runs `npm run build` followed by `npm run preview`. It serves the optimized production assets, ensuring you experience the virtualization and streaming logic as intended.

   > **Note**: Open [http://localhost:4173](http://localhost:4173) (or the port shown in your terminal) to view the app.

---

## Development

If you prefer to explore the code with hot-reloading:

```bash
npm run dev
```

## Architecture & Key Decisions

This project was built with a strict focus on performance and minimal dependencies, adhering to the challenge constraints.

- **No Heavy UI Frameworks**: Uses **CSS Modules** for zero-runtime overhead.
- **No External State Libraries**: All state is managed via **React Hooks** and **Context**. Complex logic is encapsulated in custom hooks like `useLogStream`.
- **Streaming First**: Data is parsed incrementally from the NDJSON stream. I do not wait for the full download; rows render as soon as bytes arrive.
- **Virtualization**: To handle thousands of logs with **variable row heights** (expanded vs. collapsed), I use **TanStack Virtual**. I initially built a custom engine but migrated for better stability and performance (see [ADR](src/hooks/useVirtualization/README.md)).
- **Precision Metrics**:  Real-time TTFB and TTFR tracking using the browser's Performance API

### Deep Dive Documentation

- **[Streaming Logic](src/hooks/useLogStream)**: How I fetch, chunk, and parse NDJSON.
- **[Virtualization Decision](src/hooks/useVirtualization)**: Why I switched from custom virtualization to TanStack Virtual.
- **[Performance Metrics](src/lib/performanceMetrics)**: How I track and display TTFR.
- **[Timeline Visualization](src/components/Timeline)**: Aggregation strategy for the bar chart.

## Features

- **Performance**: Instant rendering of incoming data; low memory footprint.
- **UX**: Two-column layout (Time/Event), expandable rows with pretty-printed JSON, and keyboard navigation.
- **Visualization**: Timeline view showing log distribution over time.
- **Accessibility**: Semantic grid roles, focus management, and ARIA attributes.
- **Resilience**: Graceful handling of network errors and malformed JSON lines.

See [docs/acceptance_criteria.md](docs/acceptance_criteria.md) for the full requirements.

## Testing

I use **Vitest** and **React Testing Library**. The suite covers unit logic (parsers), component interactions, and integration flows.

```bash
npm run test        # Run all tests (watch mode)
npm run test:run    # Run all tests once
npm run test:ui     # Open the Vitest UI
```

Refer to [docs/testing.md](docs/testing.md) for the detailed strategy.

## Trade-offs & Future Wishlist

Given more time, I would implement the following features to enhance scalability and developer experience.

**Top Priorities:**
- **Client-Side Search & Facets (Web Worker)**: Offload regex search and facet aggregation to a worker thread to maintain 60fps scrolling.
- **Export Data**: Download filtered or full datasets as `.json`/`.ndjson`.

See the detailed [Wishlist Section of docs/plan.md](docs/plan.md#3-wishlist-future) for more.
