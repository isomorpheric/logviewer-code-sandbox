import { Card } from "@/components/ui/Card";
import { usePerformanceMetrics } from "@/contexts/performanceMetrics";
import { Button } from "../ui/Button";
import styles from "./StatusBar.module.css";
import StatusBarSkeleton from "./StatusBarSkeleton";

interface StatusBarProps {
  loadedBytes: number;
  totalBytes: number | null;
  logCount: number;
  isLoading: boolean;
  isComplete: boolean;
  error: Error | null;
  onAbort?: () => void;
  onRetry?: () => void;
  width?: string | number;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0.0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / k ** i).toFixed(1)} ${sizes[i]}`;
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

const Metric = ({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number | null;
  unit?: string;
}) => {
  return (
    <span className={styles.metric}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      {unit && <span className={styles.unit}>{unit}</span>}
    </span>
  );
};

const ProgressBar = ({ progress }: { progress: number | null }) => {
  if (progress === null) return;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      <span className={styles.label}>Progress: {progress}%</span>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

/**
 * StatusBar displays real-time performance metrics and stream status.
 *
 * Metrics:
 * - TTFB (Time to First Byte): Time from request start to first byte received.
 * - TTFR (Time to First Render): Time until the first log row is painted.
 * - Loaded: Bytes received vs Total bytes (if Content-Length is available).
 * - Logs: Total number of parsed log entries.
 *
 * Controls:
 * - Abort: Cancels the active stream.
 * - Retry: Restarts the stream after an error.
 */
export const StatusBar = ({
  loadedBytes,
  totalBytes,
  logCount,
  isLoading,
  isComplete,
  error,
  onAbort,
  onRetry,
  width = "100%",
}: StatusBarProps) => {
  const { ttfb, ttfr } = usePerformanceMetrics();

  // Show skeleton only if we're still loading and no error has occurred
  if (!ttfb && !ttfr && isLoading && !error) {
    return <StatusBarSkeleton />;
  }

  const ttfbDisplay = ttfb ?? "—";
  const ttfrDisplay = ttfr ?? "—";
  const progress = totalBytes ? Math.round((loadedBytes / totalBytes) * 100) : null;

  const totalLoaded = `${formatBytes(loadedBytes)} ${totalBytes ? ` / ${formatBytes(totalBytes)}` : ""}`;

  return (
    <Card
      padding="sm"
      className={styles.statusBar}
      style={{ width }}
      aria-live="polite"
      data-testid="statusbar"
    >
      <div className={styles.metrics}>
        <Metric label="TTFB:" value={ttfbDisplay} unit={ttfb !== null ? "ms" : undefined} />
        <Metric label="TTFR:" value={ttfrDisplay} unit={ttfr !== null ? "ms" : undefined} />
        <Metric label="Loaded:" value={totalLoaded} />
        <ProgressBar progress={progress} />
        <Metric label="Logs:" value={formatNumber(logCount)} />

        {isLoading && progress === null && (
          <span className={styles.status}>
            <span className={styles.loadingDot} />
            Loading...
          </span>
        )}

        {error && <span className={styles.error}>Error: {error.message}</span>}
      </div>

      <div className={styles.actions}>
        {!isComplete && onAbort && !error && (
          <Button size="sm" onClick={onAbort} variant="destructive">
            Abort
          </Button>
        )}
        {error && onRetry && (
          <Button size="sm" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    </Card>
  );
};
