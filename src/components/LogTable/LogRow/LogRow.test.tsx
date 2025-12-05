import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { LogEntry } from "@/types";
import { LogRow } from "./LogRow";

const mockLog: LogEntry = {
  _time: 1627890000000, // 2021-08-02T07:40:00.000Z
  message: "Test log message",
  level: "info",
};

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe("LogRow", () => {
  it("renders log summary correctly", () => {
    render(<LogRow log={mockLog} />);
    expect(screen.getByText(/Test log message/)).toBeInTheDocument();
    // Check that the time column displays the ISO date
    const timeElement = screen.getAllByText(/2021-08-02T07:40:00.000Z/)[0];
    expect(timeElement).toBeInTheDocument();
  });

  it("expands and collapses details on click", () => {
    render(<LogRow log={mockLog} />);

    // Details should not be visible initially
    expect(screen.queryByText(/"level": "info"/)).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(screen.getByRole("button", { expanded: false }));
    expect(screen.getByText(/"level": "info"/)).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(screen.getByRole("button", { expanded: true }));
    expect(screen.queryByText(/"level": "info"/)).not.toBeInTheDocument();
  });

  it("displays formatted multiline JSON when expanded", () => {
    render(<LogRow log={mockLog} />);
    fireEvent.click(screen.getByRole("button", { expanded: false }));

    // Use a selector that targets the pre tag specifically since _time appears in both summary and details
    const pre = screen.getByText((content, element) => {
      return element?.tagName === "PRE" && content.includes("_time");
    });

    // Check for indentation (2 spaces) and newlines
    // Note: _time is stored as a number (timestamp) in the raw data
    const content = pre.textContent || "";
    expect(content).toContain(
      '{\n  "_time": 1627890000000,\n  "message": "Test log message",\n  "level": "info"\n}'
    );
  });

  it("copies JSON to clipboard", () => {
    render(<LogRow log={mockLog} />);

    // Expand to see the copy button
    fireEvent.click(screen.getByRole("button"));

    const copyButton = screen.getByText("Copy JSON");
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(JSON.stringify(mockLog, null, 2));
  });
});
