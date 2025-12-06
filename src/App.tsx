import { ErrorBoundary } from "react-error-boundary";
import { LogTable } from "@/components/LogTable";
import { StatusBar } from "@/components/StatusBar";
import { Timeline } from "@/components/Timeline";
import { ErrorFallback } from "@/components/ui/ErrorFallback";
import { PerformanceMetricsProvider } from "@/contexts/PerformanceMetrics";
import { useLogStream } from "@/hooks";
import styles from "./App.module.css";

function App() {
  const { logs, isLoading, error, loadedBytes, totalBytes, abort, retry, isComplete } =
    useLogStream(import.meta.env.VITE_LOG_FILE_URL);

  return (
    <PerformanceMetricsProvider>
      <main className={styles.root}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Timeline logs={logs} bucketCount={5} isLoading={!isComplete} />
          <LogTable logs={logs} isLoading={isLoading} />
          <StatusBar
            loadedBytes={loadedBytes}
            totalBytes={totalBytes}
            logCount={logs.length}
            isLoading={isLoading}
            error={error}
            onAbort={abort}
            onRetry={retry}
          />
        </ErrorBoundary>
      </main>
    </PerformanceMetricsProvider>
  );
}

export default App;
