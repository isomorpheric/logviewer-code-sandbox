import { clsx } from "clsx";
import styles from "./LoadingSkeleton.module.css";

export interface LoadingSkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const LoadingSkeleton = ({
  width = "100%",
  height = "100%",
  className,
}: LoadingSkeletonProps) => {
  return (
    <div
      className={clsx(styles.skeleton, className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
};
