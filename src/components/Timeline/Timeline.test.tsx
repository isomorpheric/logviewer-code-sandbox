import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { LogEntry } from "@/types";
import { Timeline } from "./Timeline";
import {
  assignLogsToBuckets,
  calculateYAxisTicks,
  createTimeBuckets,
  formatAxisTime,
  getTimeRange,
} from "./utils";

// ============================================================================
// Test Data
// ============================================================================

const createLog = (time: number): LogEntry => ({ _time: time });

const sampleLogs: LogEntry[] = [
  createLog(1000),
  createLog(2000),
  createLog(3000),
  createLog(4000),
  createLog(5000),
];

// ============================================================================
// getTimeRange Tests
// ============================================================================

describe("getTimeRange", () => {
  it("returns null for empty array", () => {
    expect(getTimeRange([])).toBeNull();
  });

  it("returns same min/max for single log", () => {
    const result = getTimeRange([createLog(1000)]);
    expect(result).toEqual({ min: 1000, max: 1000 });
  });

  it("finds correct min/max for multiple logs", () => {
    const result = getTimeRange(sampleLogs);
    expect(result).toEqual({ min: 1000, max: 5000 });
  });

  it("handles unsorted logs", () => {
    const unsorted = [createLog(3000), createLog(1000), createLog(5000), createLog(2000)];
    const result = getTimeRange(unsorted);
    expect(result).toEqual({ min: 1000, max: 5000 });
  });
});

// ============================================================================
// createTimeBuckets Tests
// ============================================================================

describe("createTimeBuckets", () => {
  it("creates correct number of buckets", () => {
    const buckets = createTimeBuckets(0, 1000, 4);
    expect(buckets).toHaveLength(4);
  });

  it("creates evenly spaced buckets", () => {
    const buckets = createTimeBuckets(0, 1000, 4);
    expect(buckets).toEqual([
      { start: 0, end: 250 },
      { start: 250, end: 500 },
      { start: 500, end: 750 },
      { start: 750, end: 1000 },
    ]);
  });

  it("handles min === max (single point in time)", () => {
    const buckets = createTimeBuckets(1000, 1000, 4);
    expect(buckets).toHaveLength(1);
    expect(buckets[0]).toEqual({ start: 1000, end: 1000 });
  });
});

// ============================================================================
// assignLogsToBuckets Tests
// ============================================================================

describe("assignLogsToBuckets", () => {
  it("returns empty array for empty buckets", () => {
    const result = assignLogsToBuckets(sampleLogs, []);
    expect(result).toEqual([]);
  });

  it("assigns logs to correct buckets", () => {
    const buckets = createTimeBuckets(1000, 5000, 4);
    // Buckets: [1000-2000], [2000-3000], [3000-4000], [4000-5000]
    // Logs at: 1000, 2000, 3000, 4000, 5000
    const result = assignLogsToBuckets(sampleLogs, buckets);

    expect(result[0].count).toBe(1); // 1000
    expect(result[1].count).toBe(1); // 2000
    expect(result[2].count).toBe(1); // 3000
    expect(result[3].count).toBe(2); // 4000, 5000 (5000 is at boundary, goes to last bucket)
  });

  it("handles all logs in single bucket", () => {
    const buckets = createTimeBuckets(0, 10000, 2);
    const clusteredLogs = [createLog(100), createLog(200), createLog(300)];
    const result = assignLogsToBuckets(clusteredLogs, buckets);

    expect(result[0].count).toBe(3);
    expect(result[1].count).toBe(0);
  });
});

// ============================================================================
// calculateYAxisTicks Tests
// ============================================================================

describe("calculateYAxisTicks", () => {
  it("returns [0] for maxCount of 0", () => {
    expect(calculateYAxisTicks(0, 5)).toEqual([0]);
  });

  it("generates correct number of ticks", () => {
    const ticks = calculateYAxisTicks(100, 5);
    expect(ticks).toHaveLength(5);
  });

  it("rounds to nice numbers", () => {
    const ticks = calculateYAxisTicks(97, 5);
    // Should round up to 100, then divide: 0, 25, 50, 75, 100
    expect(ticks).toEqual([0, 25, 50, 75, 100]);
  });

  it("handles large numbers", () => {
    const ticks = calculateYAxisTicks(8500, 5);
    // Should round up to 9000
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(8500);
  });
});

// ============================================================================
// formatAxisTime Tests
// ============================================================================

describe("formatAxisTime", () => {
  it("formats timestamp as readable date-time", () => {
    // 2024-08-21T10:30:00.000Z
    const timestamp = new Date("2024-08-21T10:30:00.000Z").getTime();
    const result = formatAxisTime(timestamp);
    expect(result).toBe("2024-08-21 10:30:00");
  });
});

// ============================================================================
// Timeline Component Tests
// ============================================================================

describe("Timeline Component", () => {
  it("renders empty state when no logs provided", () => {
    render(<Timeline logs={[]} />);
    expect(screen.getByText("No data to display")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "Timeline of log events");
  });

  it("renders bars when logs are provided", () => {
    render(<Timeline logs={sampleLogs} bucketCount={4} />);
    // Should not show empty state
    expect(screen.queryByText("No data to display")).not.toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "Timeline of log events");
  });

  it("renders Y-axis ticks", () => {
    render(<Timeline logs={sampleLogs} bucketCount={4} />);
    // Should have "0" as the first tick
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("applies custom height", () => {
    const { container } = render(<Timeline logs={sampleLogs} height={200} />);
    const timelineContainer = container.firstChild as HTMLElement;
    expect(timelineContainer).toHaveStyle({ height: "200px" });
  });
});
