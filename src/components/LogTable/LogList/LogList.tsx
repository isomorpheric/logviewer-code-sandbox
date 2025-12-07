import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef } from "react";
import { usePerformanceMetrics } from "@/contexts/performanceMetrics";
import type { LogEntry } from "@/types";
import { LogRow } from "../LogRow";
import styles from "./LogList.module.css";
import { LogListSkeleton } from "./LogListSkeleton";

interface Props {
  logs: LogEntry[];
  isLoading?: boolean;
}

/**
 * LogList renders the virtualized list of log entries.
 *
 * It uses @tanstack/react-virtual to handle large datasets efficiently by only rendering
 * rows that are currently visible in the viewport. It also triggers performance metrics recording
 * (TTFB/TTFR) when the first logs are rendered.
 */
export const LogList = ({ logs, isLoading = false }: Props) => {
  const { markFirstByte, markFirstRender } = usePerformanceMetrics();
  const hasRecordedMetrics = useRef(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: logs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 28,
    overscan: 5,
  });

  useEffect(() => {
    if (logs.length > 0 && !hasRecordedMetrics.current) {
      hasRecordedMetrics.current = true;
      markFirstByte();
      markFirstRender();
    }
  }, [logs.length, markFirstByte, markFirstRender]);

  const showSkeleton = isLoading && logs.length === 0;

  return (
    <div ref={parentRef} role="rowgroup" className={styles.scrollContainer}>
      {showSkeleton ? (
        <LogListSkeleton />
      ) : (
        <div
          className={styles.innerContainer}
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const log = logs[virtualItem.index];
            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={rowVirtualizer.measureElement}
                className={styles.virtualRow}
                style={{
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <LogRow log={log} index={virtualItem.index} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
