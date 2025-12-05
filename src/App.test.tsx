import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders the log table", () => {
    render(<App />);
    expect(screen.getByRole("grid", { name: "Log Table" })).toBeInTheDocument();
  });
});
