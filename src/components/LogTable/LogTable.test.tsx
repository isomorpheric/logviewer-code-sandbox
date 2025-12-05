import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PerformanceMetricsProvider } from "@/contexts";
import type { LogEntry } from "@/types";
import { LogTable } from "./LogTable";

const mockLogs: LogEntry[] = [
  { _time: 1627890000000, message: "Log 1" }, // 2021-08-02T07:40:00.000Z
  { _time: 1627890001000, message: "Log 2" }, // 2021-08-02T07:40:01.000Z
];

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

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

  describe("row expansion", () => {
    it("expands row on click and shows multiline JSON", () => {
      renderWithProvider(<LogTable logs={mockLogs} />);

      // Find and click the first row button
      const rowButtons = screen.getAllByRole("button", { expanded: false });
      fireEvent.click(rowButtons[0]);

      // After expansion, should show formatted JSON with indentation
      expect(screen.getByText(/"message": "Log 1"/)).toBeInTheDocument();
    });

    it("collapses expanded row on second click", () => {
      renderWithProvider(<LogTable logs={mockLogs} />);

      // Expand first row
      const rowButton = screen.getAllByRole("button", { expanded: false })[0];
      fireEvent.click(rowButton);

      // Verify expanded
      expect(screen.getByRole("button", { expanded: true })).toBeInTheDocument();

      // Collapse
      fireEvent.click(screen.getByRole("button", { expanded: true }));

      // Should no longer show multiline JSON details
      expect(screen.queryByText(/"message": "Log 1"/)).not.toBeInTheDocument();
    });

    it("maintains aria-expanded attribute state", () => {
      renderWithProvider(<LogTable logs={mockLogs} />);

      const rowButton = screen.getAllByRole("button")[0];
      expect(rowButton).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(rowButton);
      expect(rowButton).toHaveAttribute("aria-expanded", "true");

      fireEvent.click(rowButton);
      expect(rowButton).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("copy action", () => {
    it("copies formatted JSON to clipboard when copy button clicked", () => {
      renderWithProvider(<LogTable logs={mockLogs} />);

      // Expand first row to reveal copy button
      const rowButton = screen.getAllByRole("button")[0];
      fireEvent.click(rowButton);

      // Click copy button
      const copyButton = screen.getByText("Copy JSON");
      fireEvent.click(copyButton);

      // Verify clipboard was called with formatted JSON
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        JSON.stringify(mockLogs[0], null, 2)
      );
    });
  });
});
