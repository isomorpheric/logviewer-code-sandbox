import { createContext, type ReactNode, useCallback, useContext, useState } from "react";
import { perf } from "@/utils";

interface PerformanceMetricsContextValue {
  ttfb: number | null;
  ttfr: number | null;
  recordFirstByte: () => void;
  recordFirstRender: () => void;
}

const PerformanceMetricsContext = createContext<PerformanceMetricsContextValue | null>(null);

interface PerformanceMetricsProviderProps {
  children: ReactNode;
}

export function PerformanceMetricsProvider({ children }: PerformanceMetricsProviderProps) {
  const [ttfb, setTTFB] = useState<number | null>(null);
  const [ttfr, setTTFR] = useState<number | null>(null);

  const recordFirstByte = useCallback(() => {
    setTTFB((current) => {
      if (current !== null) return current;
      return perf.getTTFB();
    });
  }, []);

  const recordFirstRender = useCallback(() => {
    setTTFR((current) => {
      if (current !== null) return current;
      return perf.getTTFR();
    });
  }, []);

  return (
    <PerformanceMetricsContext.Provider value={{ ttfb, ttfr, recordFirstByte, recordFirstRender }}>
      {children}
    </PerformanceMetricsContext.Provider>
  );
}

export function usePerformanceMetrics(): PerformanceMetricsContextValue {
  const context = useContext(PerformanceMetricsContext);
  if (!context) {
    throw new Error("usePerformanceMetrics must be used within a PerformanceMetricsProvider");
  }
  return context;
}
