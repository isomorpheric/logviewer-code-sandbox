import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PerformanceMetricsProvider } from "@/contexts";
import type { LogEntry } from "@/types";
import { LogTable } from "./LogTable";

const mockLogs: LogEntry[] = [
  { _time: 1627890000000, message: "Log 1" }, // 2021-08-02T07:40:00.000Z
  { _time: 1627890001000, message: "Log 2" }, // 2021-08-02T07:40:01.000Z
];

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<PerformanceMetricsProvider>{ui}</PerformanceMetricsProvider>);
};

describe("LogTable", () => {
  it("renders logs and headers", () => {
    renderWithProvider(<LogTable logs={mockLogs} />);
    expect(screen.getByText("Time")).toBeInTheDocument();
    expect(screen.getByText("Event")).toBeInTheDocument();
    expect(screen.getByText(/Log 1/)).toBeInTheDocument();
    expect(screen.getByText(/Log 2/)).toBeInTheDocument();
  });

  it("renders empty state correctly with headers", () => {
    renderWithProvider(<LogTable logs={[]} />);
    const grid = screen.getByRole("grid");
    expect(grid).toBeInTheDocument();
    expect(screen.getByText("Time")).toBeInTheDocument();
  });

  it("applies custom width and height", () => {
    renderWithProvider(<LogTable logs={[]} width={800} height="500px" />);
    const grid = screen.getByRole("grid");
    // Width/height is on the Card wrapper, not the grid
    expect(grid.parentElement).toHaveStyle({ width: "800px", height: "500px" });
  });
});
