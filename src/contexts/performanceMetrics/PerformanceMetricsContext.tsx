import { createContext, type ReactNode, useCallback, useContext, useRef, useState } from "react";
import * as timing from "./timing";

export interface PerformanceMetricsContextValue {
  ttfb: number | null;
  ttfr: number | null;
  markFetchStart: () => void;
  markFirstByte: () => void;
  markFirstRender: () => void;
}

const PerformanceMetricsContext = createContext<PerformanceMetricsContextValue | null>(null);

interface PerformanceMetricsProviderProps {
  children: ReactNode;
}

/**
 * PerformanceMetricsProvider tracks and exposes key performance indicators
 * using the browser's Performance API.
 *
 * - **TTFB (Time to First Byte)**: Time from fetch start to first data chunk.
 * - **TTFR (Time to First Render)**: Time from fetch start to first log row rendered.
 */
export function PerformanceMetricsProvider({ children }: PerformanceMetricsProviderProps) {
  const [ttfb, setTTFB] = useState<number | null>(null);
  const [ttfr, setTTFR] = useState<number | null>(null);
  const hasMarkedFirstByte = useRef(false);

  const markFetchStart = useCallback(() => {
    timing.clearAllMarks();
    setTTFB(null);
    setTTFR(null);
    hasMarkedFirstByte.current = false;
    timing.markFetchStart();
  }, []);

  const markFirstByte = useCallback(() => {
    if (hasMarkedFirstByte.current) return;
    hasMarkedFirstByte.current = true;

    timing.markFirstByte();
    setTTFB(timing.measureTTFB());
  }, []);

  const markFirstRender = useCallback(() => {
    setTTFR((current) => {
      if (current !== null) return current;
      timing.markFirstRender();
      return timing.measureTTFR();
    });
  }, []);

  return (
    <PerformanceMetricsContext.Provider
      value={{ ttfb, ttfr, markFetchStart, markFirstByte, markFirstRender }}
    >
      {children}
    </PerformanceMetricsContext.Provider>
  );
}

/**
 * usePerformanceMetrics provides access to the performance metrics context.
 */
export function usePerformanceMetrics(): PerformanceMetricsContextValue {
  const context = useContext(PerformanceMetricsContext);
  if (!context) {
    throw new Error("usePerformanceMetrics must be used within a PerformanceMetricsProvider");
  }
  return context;
}
