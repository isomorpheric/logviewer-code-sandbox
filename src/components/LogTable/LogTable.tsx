import type { LogEntry } from "@/types";
import { LogRow } from "./LogRow";
import styles from "./LogTable.module.css";
import { LogTableHeader } from "./LogTableHeader";

interface Props {
  logs: LogEntry[];
  width?: string | number;
  height?: string | number;
}

export const LogTable = ({ logs, width = "100%", height = "100%" }: Props) => {
  return (
    <div role="grid" aria-label="Log Table" className={styles.root} style={{ width, height }}>
      <LogTableHeader />
      <div role="rowgroup" className={styles.listContainer}>
        {logs.map((log, index) => (
          <LogRow key={`${log._time}-${index}`} log={log} />
        ))}
      </div>
    </div>
  );
};
