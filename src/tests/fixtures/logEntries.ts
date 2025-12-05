import type { LogEntry } from "@/types";

/**
 * Mock log entries with Unix timestamps (milliseconds).
 * Timestamps are kept as numbers for performance optimization.
 */
export const mockLogs: LogEntry[] = [
  {
    _time: 1724324812592, // 2024-08-22T10:46:52.592Z
    cid: "api",
    channel: "conf:policies",
    level: "info",
    message: "loading policy",
    context: "cribl",
    policy: {
      args: ["groupName", "macroId"],
      template: [
        "GET /m/${groupName}/search/macros/${macroId}",
        "GET /m/${groupName}/search/macros/${macroId}/*",
      ],
      description: "Members with this policy can view and use the macro",
      title: "Read Only",
    },
  },
  {
    _time: 1724324776596, // 2024-08-22T10:46:16.596Z
    cid: "api",
    channel: "ShutdownMgr",
    level: "info",
    message: "Shutdown:CB:Complete",
    name: "ServiceRpcMgr.master",
  },
  {
    _time: 1724324740596, // 2024-08-22T10:45:40.596Z
    cid: "api",
    channel: "telemetry",
    level: "error",
    message: "failed to report search product usage",
    error: {
      message: "Unknown product search",
      stack:
        "Error\n    at new CriblError (/home/janusz/dev/cribl/dist/sluice/bin/cribl.bundle.js:4828:20)\n    at new RESTError (/home/janusz/dev/cribl/dist/sluice/bin/cribl.bundle.js:619343:9)\n    at LocalMembersMgr.filterToProduct (/home/janusz/dev/cribl/dist/sluice/bin/cribl.bundle.js:619768:19)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async ProductUsageReporter.getUsageReport (/home/janusz/dev/cribl/dist/sluice/bin/cribl.bundle.js:703935:30)\n    at async RpcMgr.handleRequest (/home/janusz/dev/cribl/dist/sluice/bin/cribl.bundle.js:625242:32)",
    },
  },
  {
    _time: 1724324668596, // 2024-08-22T10:44:28.596Z
    cid: "api",
    channel: "Roles",
    level: "info",
    message: "resolving role policies",
    role: "__system_search_results__",
    policies: ["POST /search/jobs/*/receive-results", "GET /search/jobs/*/stages/*/results"],
  },
  {
    _time: 1724324596596, // 2024-08-22T10:43:16.596Z
    cid: "api",
    channel: "Service",
    level: "info",
    message: "service process started",
    pid: 1954767,
    status: 200,
    elapsed: 1564,
  },
  {
    _time: 1724324452596, // 2024-08-22T10:40:52.596Z
    cid: "api",
    channel: "ProcessMetrics",
    level: "info",
    message: "stats",
    cpuPerc: 1.91,
    eluPerc: 1.32,
    mem: {
      heap: 137,
      heapTotal: 157,
      ext: 1,
      rss: 309,
      buffers: 0,
    },
  },
];
