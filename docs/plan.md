# Plan: Log Viewer

Refer to `docs/acceptance_criteria.md` for Acceptance Criteria and Constraints.

## 1. Completed Features

### Core & Architecture
- [x] Vitest + RTL coverage
- [x] `ndjsonParser`: chunked boundaries, bad lines skipped
- [x] `useLogStream`: incremental emission, abort/retry paths
- [x] Date formatting (ISO 8601)
- [x] `src/utils/performanceMarks.ts` - centralized Performance API marks
- [x] `PerformanceMetricsProvider` context for cross-cutting metrics
- [x] `usePerformanceMetrics` hook for consuming TTFR

### Log Table & Virtualization
- [x] `LogTable` behaviors: expansion toggles, copy/paste action
- [x] Two-column layout: `Time` and `Event`
- [x] Normalize `_time` to ISO 8601 via shared `dateFormatter`
- [x] Render event column as stable, single-line JSON (`JSON.stringify(event)`)
- [x] Track `isExpanded` per row; toggle via click or Enter/Space
- [x] Pretty-print expanded view with `JSON.stringify(event, null, 2)`
- [x] "Copy" Button for single-line and full pretty JSON
- [x] `useVirtualization` hook with scroll/height tracking
- [x] Variable row heights via height map and ResizeObserver
- [x] Overscan for smooth scrolling

### Streaming & UX
- [x] Use `useLogStream(url)` to consume response body stream
- [x] Parse NDJSON incrementally; push events to state immediately
- [x] Render rows without waiting for full download
- [x] Show status for bytes loaded and errors; keep retry/abort controls responsive
- [x] StatusBar: Display TTFR, bytes loaded, progress, log count, loading/error status
- [x] Abort/Retry action buttons

### UI Components
- [x] Reusable Card component with theme variables
- [x] Configurable padding (none, sm, md, lg)

## 2. Architecture & Setup (Reference)

Lightweight, performance-focused React application using Vite. Rely on custom hooks for streaming data fetching and a custom virtualization engine for rendering.

### Tech Stack
- **Core**: React 19, TypeScript
- **Build**: Vite
- **Styling**: CSS Modules (scoped, zero-runtime cost styles)
- **Testing**: Vitest + React Testing Library
- **State/Logic**: Custom Hooks (no external state libs)

### Directory Structure
- `src/components/`: UI components (`LogTable`, `Timeline`)
- `src/hooks/`: Logic (`useLogStream`, `useVirtualization`, `useKeyboardNav`)
- `src/utils/`: Helpers (`ndjsonParser`, `dateFormatter`)

## 3. Pending Tasks (Immediate)

### Documentation Cleanup
- **README.md**:
  - Improve "Getting Started" section.
  - Add explicit instructions on how to run tests.
  - Add "How It Works" section linking to module-level READMEs.
  - Link to the Wishlist in `docs/plan.md`.
- **Testing Docs**:
  - Review and update `docs/testing.md`.
- **Critical Code Documentation (Collocated)**:
  - Create or update `README.md` files in component/hook directories:
    - `src/hooks/useLogStream/README.md`: Streaming logic & `ndjsonParser`.
    - `src/hooks/useVirtualization/README.md`: Virtualization engine details.
    - `src/contexts/README.md`: Performance metrics strategy.
    - `src/components/Timeline/README.md`: Timeline aggregation logic.

## 4. Wishlist (Future)

These are features I would add if I had more time.

- **Expanded Row State**:
  - Implement a FIFO queue (max 3) to preserve expanded state of rows when they scroll off-screen and back.
- **Enhanced Error Handling**:
  - Capture and display context for failed JSON lines.
  - Improve UI feedback for stream interruptions.
- **Additional Suggestions**:
  - **Client-side Filter/Search**: text input to filter visible logs.
  - **Log Level Highlighting**: Visual distinction for error/warn/info if detected in JSON.
  - **Export**: Button to download currently loaded logs as a file.
  - **Theme Toggle**: Persist Dark/Light mode preference.
