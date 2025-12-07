import { PerformanceMetricsProvider } from "@/contexts/performanceMetrics";
import { LogViewer } from "./views/LogViewer";

function App() {
  return (
    <PerformanceMetricsProvider>
      <LogViewer />
    </PerformanceMetricsProvider>
  );
}

export default App;
