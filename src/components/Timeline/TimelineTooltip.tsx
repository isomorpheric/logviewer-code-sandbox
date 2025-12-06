import { Card } from "@/components/ui/Card";
import styles from "./TimelineTooltip.module.css";

interface TimelineTooltipProps {
  count: number;
  visible: boolean;
  x: number;
  y: number;
}

const formatLogCount = (count: number): string => {
  return count.toLocaleString("en-US");
};

export const TimelineTooltip = ({ count, visible, x, y }: TimelineTooltipProps) => {
  if (!visible) return null;

  return (
    <div
      className={styles.tooltip}
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <Card padding="sm" className={styles.tooltipCard}>
        <div className={styles.tooltipContent}>
          <span className={styles.count}>{formatLogCount(count)}</span>
          <span className={styles.label}>{count === 1 ? "log" : "logs"}</span>
        </div>
      </Card>
    </div>
  );
};
