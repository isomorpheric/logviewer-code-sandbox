import type { LogEntry } from "@/types";
import type { BucketedData, TimeBucket, TimeRange } from "./types";

/**
 * Extracts the time range (min/max) from a list of log entries.
 * Returns null if the list is empty.
 */
export function getTimeRange(logs: LogEntry[]): TimeRange | null {
  if (logs.length === 0) return null;

  let min = logs[0]._time;
  let max = logs[0]._time;

  for (const log of logs) {
    if (log._time < min) min = log._time;
    if (log._time > max) max = log._time;
  }

  return { min, max };
}

/**
 * Creates evenly-spaced time buckets between min and max timestamps.
 */
export function createTimeBuckets(min: number, max: number, count: number): TimeBucket[] {
  // Handle edge case where min === max (all logs at same time)
  if (min === max) {
    return [{ start: min, end: max }];
  }

  const bucketSize = (max - min) / count;
  const buckets: TimeBucket[] = [];

  for (let i = 0; i < count; i++) {
    buckets.push({
      start: min + i * bucketSize,
      end: min + (i + 1) * bucketSize,
    });
  }

  return buckets;
}

/**
 * Assigns logs to buckets and counts how many fall into each bucket.
 */
export function assignLogsToBuckets(logs: LogEntry[], buckets: TimeBucket[]): BucketedData[] {
  // Initialize counts
  const bucketedData: BucketedData[] = buckets.map((bucket) => ({
    bucket,
    count: 0,
  }));

  if (buckets.length === 0) return bucketedData;

  const min = buckets[0].start;
  const max = buckets[buckets.length - 1].end;
  const bucketSize = buckets.length === 1 ? 1 : (max - min) / buckets.length;

  for (const log of logs) {
    // Calculate which bucket this log belongs to
    let bucketIndex = Math.floor((log._time - min) / bucketSize);

    // Clamp to valid range (handles edge case where log._time === max)
    bucketIndex = Math.max(0, Math.min(bucketIndex, buckets.length - 1));

    bucketedData[bucketIndex].count++;
  }

  return bucketedData;
}

/**
 * Generates Y-axis tick values (e.g., 0, 100, 200, 300).
 * Produces evenly spaced ticks from 0 to a rounded max value.
 */
export function calculateYAxisTicks(maxCount: number, tickCount: number): number[] {
  if (maxCount === 0) return [0];

  // Round up to a number for the max
  const magnitude = 10 ** Math.floor(Math.log10(maxCount));
  const niceMax = Math.ceil(maxCount / magnitude) * magnitude;

  const step = niceMax / (tickCount - 1);
  const ticks: number[] = [];

  for (let i = 0; i < tickCount; i++) {
    ticks.push(Math.round(i * step));
  }

  return ticks;
}

/**
 * Formats a timestamp for the X-axis label.
 * Shows date and time in a readable format.
 */
export function formatAxisTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toISOString().replace("T", " ").slice(0, 19);
}
