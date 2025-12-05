# Plan: Log Viewer

Refer to `docs/acceptance_criteria.md` for Acceptance Criteria and Constraints.

### Implementation

#### Tests
- Vitest + RTL coverage
- `ndjsonParser`: chunked boundaries, bad lines skipped
- `useLogStream`: incremental emission, abort/retry paths
- Date formatting (ISO 8601)
- `LogTable` behaviors: expansion toggles, keyboard nav, copy/paste action
- Include notes section for future coverage

#### Two-column table
- Render `Time` and `Event` columns only
- Normalize `_time` to ISO 8601 via shared `dateFormatter`
- Render event column as stable, single-line JSON (`JSON.stringify(event)`)
- Truncate/tooltip long values; keep raw string copyable

#### Expand/collapse rows
- Track `isExpanded` per row; toggle via click or Enter/Space
- Pretty-print expanded view with `JSON.stringify(event, null, 2)`
- Ensure virtualization handles changing height
- "Copy" Button for single-line and full pretty JSON

#### Streaming NDJSON + TTFB
- Use `useLogStream(url)` to consume response body stream
- Parse NDJSON incrementally; push events to state immediately
- Render rows without waiting for full download
- Show status for bytes loaded and errors; keep retry/abort controls responsive

## 1. Architecture & Setup

Lightweight, performance-focused React application using Vite. Rely on custom hooks for streaming data fetching and a custom virtualization engine for rendering. Would use Tanstack Router in a real application, but skipping it here because of [acceptance criteria constraints](acceptance_criteria.md).

### Tech Stack

- **Core**: React 19, TypeScript
- **Build**: Vite
- **Styling**: CSS Modules (scoped, zero-runtime cost styles)
- **Testing**: Vitest + React Testing Library
- **State/Logic**: Custom Hooks (no external state libs like Redux/Zustand)

### Directory Structure

- `src/components/`: UI components (`LogTable`, `Timeline`)
- `src/hooks/`: Logic (`useLogStream`, `useVirtualization`, `useKeyboardNav`)
- `src/utils/`: Helpers (`ndjsonParser`, `dateFormatter`)

## 2. Key Features & Implementation

### A. Streaming Data & Caching

**Goal**: Optimize TTFB and prevent unnecessary re-fetches

- Implement `useLogStream(url)`:
  - Use `fetch` and `ReadableStream` to process chunks.
  - Use `AbortController` for cancellation.
  - Cache `logs` and `status` in a module-level cache or Context; if cached, serve immediately.
  - Track loaded bytes vs total bytes for loading indicator.
  - Surface loading state, streamed bytes, and errors with retry/cancel controls; render as chunks arrive.
  - Graceful failure: skip bad JSON lines and keep errors in state; keep UI interactive on failures.

### B. Virtualized Log Table

**Goal**: Render thousands of logs efficiently with minimal dependencies.

- Manage a scrollable container.
- Track `scrollTop` and container height.
- Maintain a registry of row heights (expansion changes height).
- Render only items in `[startIndex, endIndex]`.
- Use absolute positioning or transform translations for rows.
- Support variable height with dynamic measurement via `useLayoutEffect`.
- Attach `ResizeObserver` to recompute viewport height, column widths, and visible window on resize.
- **Note**: When implementing virtualization, consider switching from fixed CSS column widths (e.g., `200px`) to dynamic JS-based sizing (using `ResizeObserver`) to handle viewport changes and responsive layouts more robustly.

### C. Log Rows & Interaction

- Design:
  - Columns: `Time` (ISO), `Event` (JSON).
  - Alternating row colors (CSS `:nth-child`).
- Interaction:
  - Toggle `isExpanded` on click or Enter/Space; update virtual list height map.
  - Provide "Copy Line" / "Copy JSON" buttons in expanded view.
  - Support keyboard navigation: `ArrowUp`/`ArrowDown` move focus; `Enter`/`Space` toggle expansion.
  - Provide hover tooltips on truncated JSON or timeline bars with bucket/count or full value previews without expanding.

### D. Timeline Component (Bonus)

**Goal**: Visualize distribution of logs.

- Aggregate logs by time bucket (e.g., per minute/hour) as they stream in.
- Render a simple SVG bar chart
- Features:
  - X-axis: Time ranges (e.g., "2024-08-21 08:00:00").
  - Y-axis: Log count (approximate scale).
  - Styling: Teal bars, clean white background, minimal grid lines.
- Keep implementation lightweight: no charting libraries; use raw SVG `rect` elements.

### E. Accessibility (A11y)

- Apply `role="grid"` and `aria-expanded`.
- Ensure rows are focusable with visible outlines.
- Make JSON content screen-reader friendly (truncate for focus view, full for detail).
- Use `aria-live` for status bar updates (loading/errors); support keyboard shortcuts for expand/collapse and jump-to-latest.

## 3. Testing Strategy (Vitest)

- **Unit Tests**:
  - `ndjsonParser`: Verify chunk splitting and JSON parsing.
  - `useLogStream`: Mock `fetch` stream; verify state updates.
- **Component Tests**:
  - `VirtualList`: Verify only visible items render.
  - `LogTable`: Verify expansion logic and keyboard navigation events.
- **Integration**:
  - End-to-end flow mock (stream -> parse -> render).

## 4. Extra Details: Best Practices & Enhancements

1. **Syntax Highlighting**: Apply simple key/value coloring in expanded JSON for readability.
2. **Copy-to-Clipboard**: Provide a small action bar in expanded view.
3. **Substring Search (Bonus)**: Add a lightweight filter bar before virtualization; debounce input and filter against single-line JSON strings.
4. **Error Boundaries**: Wrap the list to catch JSON parse errors gracefully.
5. **User Preferences**: Persist options like "Wrap Lines" or "Dark Mode" in `localStorage` if included.
