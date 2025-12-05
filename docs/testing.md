# Testing

## Current Coverage

The test suite uses **Vitest** and **React Testing Library**.

### Unit Tests

- **`ndjsonParser`**: Chunk splitting, boundary handling, malformed JSON skipping
- **`useLogStream`**: Streaming state, incremental parsing, abort/retry, error handling
- **`formatTime`**: ISO 8601 date formatting

### Component Tests

- **`LogRow`**: Expansion toggle, multiline JSON display, copy-to-clipboard
- **`LogTable`**: Header rendering, row expansion integration, aria attributes, copy action

### Integration Tests

- **`App`**: Basic render smoke test

## Future Coverage

_To be expanded with additional detail._

- E2E tests (Playwright)
- Accessibility audits (axe-core)
- Error boundary scenarios
- Performance benchmarks
