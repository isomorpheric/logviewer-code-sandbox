import { z } from "zod";

/**
 * LogEntrySchema defines the shape of raw log entries.
 */
export const LogEntrySchema = z
  .object({
    _time: z.number(), // Unix timestamp in milliseconds
    // all other fields are unknown
  })
  .catchall(z.unknown());

/**
 * LogEntry represents a single parsed log event.
 */
export type LogEntry = z.infer<typeof LogEntrySchema>;
