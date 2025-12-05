import styles from "./LogTableHeader.module.css";

export const LogTableHeader = () => {
  return (
    <div role="rowgroup" className={styles.header}>
      <div role="row" className={styles.headerRow}>
        <div role="columnheader" className={styles.headerTime}>
          Time
        </div>
        <div role="columnheader" className={styles.headerEvent}>
          Event
        </div>
      </div>
    </div>
  );
};
