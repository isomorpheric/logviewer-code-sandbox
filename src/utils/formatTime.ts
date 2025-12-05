/**
 * Formats a Unix timestamp (milliseconds) to ISO 8601 string.
 * This is intentionally minimal for performance - no validation overhead.
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns ISO 8601 formatted date string
 */
export function formatTime(timestamp: number): string {
  return new Date(timestamp).toISOString();
}
