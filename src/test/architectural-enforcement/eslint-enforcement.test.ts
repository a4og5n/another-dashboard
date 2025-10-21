/**
 * ESLint Enforcement Tests
 *
 * Ensures ESLint passes on the entire codebase to catch:
 * - Unused variables (not prefixed with _)
 * - Explicit any types
 * - React Hooks violations
 * - Next.js best practices
 *
 * This test runs ESLint programmatically to ensure pre-commit
 * hooks will catch linting errors before they reach CI.
 */

import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";

describe("ESLint Enforcement", () => {
  it(
    "should have no ESLint errors or warnings in src directory",
    () => {
    try {
      // Run ESLint on src directory
      const output = execSync("pnpm eslint src --max-warnings=0", {
        encoding: "utf-8",
        cwd: process.cwd(),
      });

      // If we get here, ESLint passed
      expect(output).toBeDefined();
    } catch (error) {
      // ESLint failed - extract the error message
      const errorOutput =
        error instanceof Error && "stdout" in error
          ? (error.stdout as string)
          : String(error);

      // Fail the test with the ESLint output
      throw new Error(
        `ESLint found errors or warnings:\n\n${errorOutput}\n\nRun 'pnpm lint' to see details.`,
      );
    }
    },
    30000,
  ); // 30 second timeout for ESLint on src directory

  it(
    "should have no ESLint errors or warnings in scripts directory",
    () => {
    try {
      // Run ESLint on scripts directory
      const output = execSync("pnpm eslint scripts --max-warnings=0", {
        encoding: "utf-8",
        cwd: process.cwd(),
      });

      // If we get here, ESLint passed
      expect(output).toBeDefined();
    } catch (error) {
      // ESLint failed - extract the error message
      const errorOutput =
        error instanceof Error && "stdout" in error
          ? (error.stdout as string)
          : String(error);

      // Fail the test with the ESLint output
      throw new Error(
        `ESLint found errors or warnings in scripts:\n\n${errorOutput}\n\nRun 'pnpm lint' to see details.`,
      );
    }
    },
    15000,
  ); // 15 second timeout for ESLint on scripts directory
});
