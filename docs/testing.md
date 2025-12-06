# Testing Strategy

## Overview

The test suite uses **Vitest** as the test runner and **React Testing Library** for component interaction. The strategy focuses on both unit logic (parsing, formatting) and component behavior (rendering, user interaction).

## Current Coverage

### 1. Unit Tests (`src/**/*.test.ts`)

- **`ndjsonParser`**:
  - Handles chunked data boundaries correctly.
  - Skips malformed or empty lines.
  - Returns valid `LogEntry` objects.
- **`formatTime`**:
  - Validates ISO 8601 output.

### 2. Hook Logic Tests (`src/hooks/**/*.test.tsx`)

- **`useLogStream`**:
  - Simulates streaming `fetch` responses.
  - Verifies state updates for `logs`, `loading`, and `progress`.
  - Tests `abort` and `retry` functionality.
  - Verifies error handling states.

### 3. Component Tests (`src/components/**/*.test.tsx`)

- **`LogRow`**:
  - Toggles expansion state.
  - Renders formatted time and JSON code blocks.
  - Verifies "Copy" button interaction.
- **`LogTable`**:
  - Renders headers and row content.
  - Integrates virtualization (mocked or shallow).
  - Verifies ARIA roles and accessibility attributes.
- **`Timeline`**:
  - Verifies aggregation of logs into time buckets.
  - Renders correct number of SVG bars.
  - Handles empty states.

### 4. Integration Tests (`src/tests/integration/`)

- **`app.integration.test.tsx`**:
  - Renders the full `App` with providers.
  - Verifies critical user flows (loading -> rendering -> interaction).

## Running Tests

```bash
npm run test        # Run all tests
npm run coverage    # Generate coverage report
```

## Future Coverage Goals

- **E2E Tests**: Add Playwright tests to verify full browser behavior and scrolling performance.
- **Accessibility**: Automated audits using `axe-core` during test runs.
- **Visual Regression**: Snapshot testing for `LogTable` and `Timeline` states.
- **Fuzz Testing**: Test `ndjsonParser` with random/corrupted input streams.
