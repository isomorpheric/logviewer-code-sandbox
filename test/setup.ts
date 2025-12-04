import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Ensure cleanup after each test to avoid cross-test pollution
afterEach(() => {
  cleanup();
});
