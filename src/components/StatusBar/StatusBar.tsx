import { Card } from "@/components/ui/Card";
import { usePerformanceMetrics } from "@/contexts/PerformanceMetrics";
import styles from "./StatusBar.module.css";

interface StatusBarProps {
  loadedBytes: number;
  totalBytes: number | null;
  logCount: number;
  isLoading: boolean;
  error: Error | null;
  onAbort?: () => void;
  onRetry?: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

export const StatusBar = ({
  loadedBytes,
  totalBytes,
  logCount,
  isLoading,
  error,
  onAbort,
  onRetry,
}: StatusBarProps) => {
  const { ttfb, ttfr } = usePerformanceMetrics();

  const progress = totalBytes ? Math.round((loadedBytes / totalBytes) * 100) : null;

  return (
    <Card padding="sm" className={styles.statusBar}>
      <div className={styles.metrics}>
        {ttfb !== null && (
          <span className={styles.metric}>
            <span className={styles.label}>TTFB:</span>
            <span className={styles.value}>{ttfb}ms</span>
          </span>
        )}

        {ttfr !== null && (
          <span className={styles.metric}>
            <span className={styles.label}>TTFR:</span>
            <span className={styles.value}>{ttfr}ms</span>
          </span>
        )}

        <span className={styles.metric}>
          <span className={styles.label}>Loaded:</span>
          <span className={styles.value}>
            {formatBytes(loadedBytes)}
            {totalBytes && ` / ${formatBytes(totalBytes)}`}
          </span>
        </span>

        {progress !== null && (
          <span className={styles.metric}>
            <span className={styles.label}>Progress:</span>
            <span className={styles.value}>{progress}%</span>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
          </span>
        )}

        <span className={styles.metric}>
          <span className={styles.label}>Logs:</span>
          <span className={styles.value}>{formatNumber(logCount)}</span>
        </span>

        {isLoading && (
          <span className={styles.status}>
            <span className={styles.loadingDot} />
            Loading...
          </span>
        )}

        {error && <span className={styles.error}>Error: {error.message}</span>}
      </div>

      <div className={styles.actions}>
        {isLoading && onAbort && (
          <button type="button" className={styles.button} onClick={onAbort}>
            Abort
          </button>
        )}
        {error && onRetry && (
          <button type="button" className={styles.button} onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    </Card>
  );
};
