import { useCallback, useEffect, useRef } from "react";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { usePerformanceMetrics } from "@/contexts";
import { useVirtualization } from "@/hooks";
import type { LogEntry } from "@/types";
import { LogRow } from "../LogRow";
import styles from "./LogList.module.css";

interface Props {
  logs: LogEntry[];
  isLoading?: boolean;
}

const SKELETON_ROW_COUNT = 10;

export const LogList = ({ logs, isLoading = false }: Props) => {
  const { recordFirstByte, recordFirstRender } = usePerformanceMetrics();
  const hasRecordedMetrics = useRef(false);

  const { containerRef, startIndex, endIndex, totalHeight, offsetY, setRowHeight } =
    useVirtualization({
      itemCount: logs.length,
      estimatedRowHeight: 28,
      overscan: 5,
    });

  useEffect(() => {
    if (logs.length > 0 && !hasRecordedMetrics.current) {
      hasRecordedMetrics.current = true;
      recordFirstByte();
      recordFirstRender();
    }
  }, [logs.length, recordFirstByte, recordFirstRender]);

  const handleRowHeightChange = useCallback(
    (index: number) => (height: number) => {
      setRowHeight(index, height);
    },
    [setRowHeight]
  );

  const showSkeleton = isLoading && logs.length === 0;
  const visibleLogs = logs.slice(startIndex, endIndex);

  return (
    <div ref={containerRef} role="rowgroup" className={styles.scrollContainer}>
      {showSkeleton ? (
        <div className={styles.skeletonContainer}>
          {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton rows never reorder
            <div key={index} className={styles.skeletonRow}>
              <LoadingSkeleton width="var(--col-time-width)" height="1em" />
              <LoadingSkeleton height="1em" className={styles.skeletonEvent} />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.innerContainer} style={{ height: totalHeight }}>
          <div className={styles.visibleWindow} style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleLogs.map((log, localIndex) => {
              const actualIndex = startIndex + localIndex;
              return (
                <LogRow
                  key={`${log._time}-${actualIndex}`}
                  log={log}
                  index={actualIndex}
                  onHeightChange={handleRowHeightChange(actualIndex)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
