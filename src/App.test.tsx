import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders without crashing", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole("main")).toBeInTheDocument();
    });
  });

  it("renders the log table", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole("grid", { name: "Log Table" })).toBeInTheDocument();
    });
  });
});
