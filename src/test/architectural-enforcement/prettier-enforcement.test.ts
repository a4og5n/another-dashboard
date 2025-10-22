/**
 * Prettier Enforcement Tests
 *
 * Ensures Prettier formatting is applied consistently across the codebase.
 * Runs format:check to catch formatting issues before they reach CI.
 *
 * This test helps maintain code consistency and prevents formatting-related
 * CI failures by catching issues during local development.
 */

import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";

describe("Prettier Enforcement", () => {
  it("should have consistent Prettier formatting across all files", () => {
    try {
      // Run Prettier check on entire project
      const output = execSync("pnpm prettier --check .", {
        encoding: "utf-8",
        cwd: process.cwd(),
      });

      // If we get here, Prettier check passed
      expect(output).toContain("All matched files use Prettier code style!");
    } catch (error) {
      // Prettier check failed - extract the error message
      const errorOutput =
        error instanceof Error && "stdout" in error
          ? (error.stdout as string)
          : String(error);

      // Fail the test with the Prettier output
      throw new Error(
        `Prettier found formatting issues:\n\n${errorOutput}\n\nRun 'pnpm format' to fix formatting issues.`,
      );
    }
  }, 30000); // 30 second timeout for Prettier check
});
