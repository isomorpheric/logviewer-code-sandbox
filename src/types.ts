import { z } from "zod";

/**
 * LogEntrySchema defines the shape of raw log entries.
 * Note: _time is kept as a number (Unix timestamp in ms) for performance.
 * Formatting to ISO 8601 happens lazily during render to optimize TTFB.
 */
export const LogEntrySchema = z
  .object({
    _time: z.number(), // Unix timestamp in milliseconds
    cid: z.string().optional(),
    channel: z.string().optional(),
    level: z.string().optional(),
    message: z.string().optional(),
    context: z.string().optional(),
  })
  .catchall(z.unknown());

export type LogEntry = z.infer<typeof LogEntrySchema>;
