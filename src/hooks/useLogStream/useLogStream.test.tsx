import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PerformanceMetricsProvider } from "@/contexts/performanceMetrics";
import { useLogStream } from "./useLogStream";

const wrapper = ({ children }: { children: ReactNode }) => (
  <PerformanceMetricsProvider>{children}</PerformanceMetricsProvider>
);

describe("useLogStream", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockStreamResponse = (chunks: string[]) => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        chunks.forEach((chunk) => {
          controller.enqueue(encoder.encode(chunk));
        });
        controller.close();
      },
    });

    return {
      ok: true,
      body: stream,
      headers: new Headers(),
    };
  };

  it("streams and parses logs successfully", async () => {
    const chunks = ['{"_time": 1, "message": "test1"}\n', '{"_time": 2, "message": "test2"}\n'];

    vi.mocked(fetch).mockResolvedValue(mockStreamResponse(chunks) as unknown as Response);

    const { result } = renderHook(() => useLogStream("http://test.com"), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.logs).toHaveLength(2);
    });

    expect(result.current.logs[0]).toEqual({ _time: 1, message: "test1" });
    expect(result.current.logs[1]).toEqual({ _time: 2, message: "test2" });
    expect(result.current.isLoading).toBe(false);
  });

  it("handles chunked JSON", async () => {
    const chunks = ['{"_time": 1, "message":', ' "split"}\n'];

    vi.mocked(fetch).mockResolvedValue(mockStreamResponse(chunks) as unknown as Response);

    const { result } = renderHook(() => useLogStream("http://test.com"), { wrapper });

    await waitFor(() => {
      expect(result.current.logs).toHaveLength(1);
    });

    expect(result.current.logs[0]).toEqual({ _time: 1, message: "split" });
  });

  it("handles fetch error", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useLogStream("http://test.com"), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.error?.message).toBe("Network error");
    expect(result.current.isLoading).toBe(false);
  });

  it("aborts the stream", async () => {
    const stream = new ReadableStream({
      start() {
        // Keep stream open
      },
    });

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      body: stream,
      headers: new Headers(),
    } as unknown as Response);

    const { result, unmount } = renderHook(() => useLogStream("http://test.com"), { wrapper });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.abort();
    });

    // Abort updates state
    expect(result.current.isLoading).toBe(false);

    // Also unmount should abort
    unmount();
  });
});
