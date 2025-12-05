import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";
import styles from "./Card.module.css";

export interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  style?: CSSProperties;
}

export const Card = ({ children, className, padding = "md", style }: CardProps) => {
  return (
    <div className={clsx(styles.card, styles[`padding-${padding}`], className)} style={style}>
      {children}
    </div>
  );
};
