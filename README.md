# Log Viewer

A high-performance, streaming log viewer built with React 19.

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

- **No Heavy UI Frameworks**: Uses **CSS Modules** for zero-runtime overhead and scoped styling, avoiding the weight of Material UI or Tailwind.
- **No External State Libraries**: All state is managed via **React Hooks** and **Context**. Complex logic is encapsulated in custom hooks like `useLogStream` and `useVirtualization`.
- **Streaming First**: Data is parsed incrementally from the NDJSON stream. I do not wait for the full download; rows render as soon as bytes arrive.
- **Custom Virtualization**: To handle thousands of logs with **variable row heights** (expanded vs. collapsed), I implemented a lightweight virtualization engine from scratch.

### Deep Dive Documentation

- **[Streaming Logic](src/hooks/useLogStream/README.md)**: How I fetch, chunk, and parse NDJSON.
- **[Virtualization Engine](src/hooks/useVirtualization/README.md)**: Implementation of the variable-height scroll container.
- **[Performance Metrics](src/contexts/README.md)**: How I track and display TTFR.
- **[Timeline Visualization](src/components/Timeline/README.md)**: Aggregation strategy for the bar chart.

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
npm run test        # Run all tests
npm run test:ui     # Open the Vitest UI
npm run coverage    # Generate coverage report
```

Refer to [docs/testing.md](docs/testing.md) for the detailed strategy.

## Trade-offs & Future Wishlist

Given more time, I would implement:
- **Preserved Expansion State**: A FIFO queue to remember which rows were expanded after they scroll off-screen.
- **Advanced Filtering**: Client-side text search or log-level filtering.
- **E2E Tests**: Playwright setup for full browser scrolling scenarios.

See the [Wishlist in docs/plan.md](docs/plan.md#4-wishlist-future) for a complete list.
