import { ErrorBoundary } from "react-error-boundary";
import { LogTable } from "@/components/LogTable";
import { StatusBar } from "@/components/StatusBar";
import { ErrorFallback } from "@/components/ui/ErrorFallback";
import { PerformanceMetricsProvider } from "@/contexts";
import { useLogStream } from "@/hooks";
import styles from "./App.module.css";

function App() {
  const { logs, isLoading, error, loadedBytes, totalBytes, abort, retry } = useLogStream(
    import.meta.env.VITE_LOG_FILE_URL
  );

  return (
    <PerformanceMetricsProvider>
      <main className={styles.root}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <StatusBar
            loadedBytes={loadedBytes}
            totalBytes={totalBytes}
            logCount={logs.length}
            isLoading={isLoading}
            error={error}
            onAbort={abort}
            onRetry={retry}
          />
          <LogTable logs={logs} isLoading={isLoading} width="80%" height="66dvh" />
        </ErrorBoundary>
      </main>
    </PerformanceMetricsProvider>
  );
}

export default App;
