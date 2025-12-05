import { Card } from "@/components/ui/Card";
import type { LogEntry } from "@/types";
import { LogList } from "./LogList";
import styles from "./LogTable.module.css";
import { LogTableHeader } from "./LogTableHeader";

interface Props {
  logs: LogEntry[];
  isLoading?: boolean;
  width?: string | number;
  height?: string | number;
}

export const LogTable = ({ logs, isLoading = false, width = "100%", height = "100%" }: Props) => {
  return (
    <Card padding="none" className={styles.cardWrapper} style={{ width, height }}>
      <div role="grid" aria-label="Log Table" className={styles.root}>
        <LogTableHeader />
        <LogList logs={logs} isLoading={isLoading} />
      </div>
    </Card>
  );
};
