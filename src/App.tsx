import { LogTable } from "@/components/LogTable";
import styles from "./App.module.css";
import { mockLogs } from "./tests/fixtures/logEntries";

function App() {
  return (
    <main className={styles.root}>
      <LogTable logs={mockLogs} width="80%" height="66dvh" />
    </main>
  );
}

export default App;
