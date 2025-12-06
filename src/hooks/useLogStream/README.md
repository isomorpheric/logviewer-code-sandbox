# useLogStream & ndjsonParser

## Overview

This module handles the fetching and parsing of the Newline Delimited JSON (NDJSON) log stream. It is designed to be resilient, performant, and provide real-time updates as data arrives.

## Key Components

### 1. `useLogStream(url: string)`

A custom React hook that manages the lifecycle of the log stream.

- **Streaming Fetch**: Uses the native `fetch` API with `response.body.getReader()` to read chunks as they arrive over the network.
- **AbortController**: Supports cancelling the stream via the `abort` function exposed to the UI.
- **State Management**:
  - `logs`: Array of parsed `LogEntry` objects.
  - `loading`: Boolean status.
  - `progress`: `loaded` (bytes) and `total` (content-length) for progress bars.
  - `error`: Capture network or parsing errors (though individual bad lines are skipped).

### 2. `ndjsonParser`

A utility for incrementally parsing chunked NDJSON data.

- **Buffer Handling**: Maintains a string buffer for incomplete lines. When a chunk arrives, it is appended to the buffer.
- **Line Splitting**: Splits the buffer by newline characters `\n`.
- **Boundary Management**: The last segment of a split is always kept in the buffer as it might be incomplete (unless the stream has ended).
- **JSON Parsing**: Attempts to `JSON.parse()` each complete line.
  - **Graceful Failure**: If a line is invalid JSON, it is logged to the console but does not crash the application.
  - **Normalization**: Converts the raw `_time` field to a Date object immediately upon parsing.

## Usage

```typescript
const { logs, loading, error, progress, abort, retry } = useLogStream('http://api/logs');

// Render
if (error) return <ErrorDisplay error={error} retry={retry} />;
return <ProgressBar loaded={progress.loaded} total={progress.total} />;
```
