import { useCallback, useEffect, useRef, useState } from "react";
import type { LogEntry } from "@/types";
import { perf } from "@/utils";
import { parseNDJSONChunk } from "./ndjsonParser";

interface UseLogStreamResult {
  logs: LogEntry[];
  isLoading: boolean;
  error: Error | null;
  loadedBytes: number;
  totalBytes: number | null;
  abort: () => void;
  retry: () => void;
}

export function useLogStream(url: string): UseLogStreamResult {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [loadedBytes, setLoadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState<number | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const bufferRef = useRef<string>("");

  const resetForNewStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    perf.start();
    setIsLoading(true);
    setError(null);
    setLoadedBytes(0);
    setTotalBytes(null);
    setLogs([]);
    bufferRef.current = "";

    return controller;
  }, []);

  const fetchLogStream = useCallback(
    async (signal: AbortSignal): Promise<ReadableStreamDefaultReader<Uint8Array>> => {
      const response = await fetch(url, { signal });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const contentLength = response.headers.get("Content-Length");
      setTotalBytes(contentLength ? Number(contentLength) : null);

      return response.body.getReader();
    },
    [url]
  );

  const processChunk = useCallback((chunk: string) => {
    const { results, newBuffer } = parseNDJSONChunk<LogEntry>(chunk, bufferRef.current);
    bufferRef.current = newBuffer;

    if (results.length > 0) {
      setLogs((prevLogs) => [...prevLogs, ...results]);
    }
  }, []);

  const flushRemainingBuffer = useCallback(() => {
    const remaining = bufferRef.current.trim();
    bufferRef.current = "";

    if (!remaining) return;

    try {
      const parsed = JSON.parse(remaining) as LogEntry;
      setLogs((prevLogs) => [...prevLogs, parsed]);
    } catch {
      console.warn("Failed to parse remaining buffer:", remaining);
    }
  }, []);

  const handleStreamError = useCallback((err: unknown): boolean => {
    if (err instanceof Error && err.name === "AbortError") {
      return true; // Signal that we should exit early (abort handled elsewhere)
    }

    const errorToSet = err instanceof Error ? err : new Error("Unknown error occurred");
    setError(errorToSet);
    return false;
  }, []);

  const readStream = useCallback(
    async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
      const decoder = new TextDecoder();
      let isFirstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (isFirstChunk) {
          perf.firstByte();
          isFirstChunk = false;
        }

        setLoadedBytes((prev) => prev + value.byteLength);
        const chunk = decoder.decode(value, { stream: true });
        processChunk(chunk);
      }
    },
    [processChunk]
  );

  const streamLogs = useCallback(async () => {
    const controller = resetForNewStream();

    try {
      const reader = await fetchLogStream(controller.signal);
      await readStream(reader);
      flushRemainingBuffer();
    } catch (err) {
      const wasAborted = handleStreamError(err);
      if (wasAborted) return;
    } finally {
      setIsLoading(false);
    }
  }, [resetForNewStream, fetchLogStream, readStream, flushRemainingBuffer, handleStreamError]);

  useEffect(() => {
    streamLogs();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [streamLogs]);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    streamLogs();
  }, [streamLogs]);

  return { logs, isLoading, error, loadedBytes, totalBytes, abort, retry };
}
