import { LoadingSkeleton } from "../ui/LoadingSkeleton";
import styles from "./Timeline.module.css";

export const TimelineSkeleton = ({ height }: { height: number }) => {
  return (
    <div className={styles.container} style={{ height }} role="img" aria-label="Loading timeline">
      <div className={styles.yAxis}>
        {/* Y-axis ticks placeholders */}
        <LoadingSkeleton width="2rem" height="0.75rem" />
        <LoadingSkeleton width="2rem" height="0.75rem" />
        <LoadingSkeleton width="2rem" height="0.75rem" />
        <LoadingSkeleton width="2rem" height="0.75rem" />
        <LoadingSkeleton width="2rem" height="0.75rem" />
      </div>

      <div className={styles.chartArea}>
        <div className={styles.bars} style={{ alignItems: "flex-end", gap: "8px" }}>
          {/* 5 vertical bars as requested */}
          <LoadingSkeleton width="100%" height="40%" />
          <LoadingSkeleton width="100%" height="70%" />
          <LoadingSkeleton width="100%" height="50%" />
          <LoadingSkeleton width="100%" height="80%" />
          <LoadingSkeleton width="100%" height="60%" />
        </div>
        <div className={styles.xAxis} style={{ marginTop: "8px" }}>
          <LoadingSkeleton width="100%" height="0.625rem" />
        </div>
      </div>
    </div>
  );
};
