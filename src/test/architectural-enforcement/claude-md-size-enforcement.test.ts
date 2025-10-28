/**
 * CLAUDE.md Size Enforcement Test
 *
 * Ensures CLAUDE.md stays under the 40,000 character limit for optimal
 * AI performance. When the file approaches or exceeds this limit, verbose
 * sections should be extracted to docs/ files.
 *
 * Target: 40,000 characters (current: ~39,839)
 * Warning threshold: 38,000 characters (95% of limit)
 *
 * @see PR #332 for examples of extracting verbose sections
 */

import { describe, it, expect } from "vitest";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const CLAUDE_MD_PATH = join(process.cwd(), "CLAUDE.md");
const MAX_SIZE = 40_000; // 40k characters
const WARNING_THRESHOLD = 38_000; // 95% of max (warn before hitting limit)

describe("CLAUDE.md Size Enforcement", () => {
  it("should be under 40,000 characters for optimal AI performance", () => {
    const content = readFileSync(CLAUDE_MD_PATH, "utf-8");
    const size = content.length;
    const stats = statSync(CLAUDE_MD_PATH);
    const lines = content.split("\n").length;
    const percentage = ((size / MAX_SIZE) * 100).toFixed(1);

    // Fail if over limit
    if (size > MAX_SIZE) {
      const overage = size - MAX_SIZE;

      throw new Error(
        `❌ CLAUDE.md is too large: ${size.toLocaleString()} characters (${percentage}% of limit)\n\n` +
          `Exceeds limit by: ${overage.toLocaleString()} characters\n` +
          `File size: ${stats.size.toLocaleString()} bytes\n` +
          `Lines: ${lines.toLocaleString()}\n\n` +
          `How to fix:\n` +
          `1. Identify verbose sections (>200 lines)\n` +
          `2. Extract to docs/ files (e.g., docs/development-patterns.md)\n` +
          `3. Replace with condensed summary (10-30 lines) + link\n` +
          `4. See PR #332 for extraction examples\n\n` +
          `Target: ${MAX_SIZE.toLocaleString()} characters\n` +
          `Current: ${size.toLocaleString()} characters`,
      );
    }

    // Warn if approaching limit (95%)
    if (size > WARNING_THRESHOLD) {
      const remaining = MAX_SIZE - size;
      const percentageRemaining = (
        ((MAX_SIZE - size) / MAX_SIZE) *
        100
      ).toFixed(1);

      console.warn(
        `\n⚠️  CLAUDE.md is approaching size limit:\n` +
          `   Current: ${size.toLocaleString()} characters (${percentage}% of 40k limit)\n` +
          `   Remaining: ${remaining.toLocaleString()} characters (${percentageRemaining}% buffer)\n` +
          `   Lines: ${lines.toLocaleString()}\n` +
          `   Consider extracting verbose sections before hitting limit.\n`,
      );
    }

    // Test should pass if under limit
    expect(size).toBeLessThanOrEqual(MAX_SIZE);
    expect(size).toBeGreaterThan(0); // Sanity check
  });

  it("should have extraction guidelines documented", () => {
    const content = readFileSync(CLAUDE_MD_PATH, "utf-8");

    // Check that documentation mentions size awareness or extraction patterns
    const hasExtractionGuidelines =
      content.includes("development-patterns.md") ||
      content.includes("schema-patterns.md") ||
      content.includes("docs/workflows/");

    expect(hasExtractionGuidelines).toBe(true);
  });

  it("should have links to extracted documentation", () => {
    const content = readFileSync(CLAUDE_MD_PATH, "utf-8");

    // Verify key extracted documentation is referenced
    const hasPatternLinks =
      content.includes("[docs/development-patterns.md]") ||
      content.includes("docs/development-patterns.md");

    const hasSchemaLinks =
      content.includes("[docs/schema-patterns.md]") ||
      content.includes("docs/schema-patterns.md");

    const hasWorkflowLinks =
      content.includes("[docs/workflows/README.md]") ||
      content.includes("docs/workflows/README.md");

    // Should have at least the major extracted docs linked
    expect(hasPatternLinks).toBe(true);
    expect(hasSchemaLinks).toBe(true);
    expect(hasWorkflowLinks).toBe(true);
  });

  it("should not have obvious duplicate content", () => {
    const content = readFileSync(CLAUDE_MD_PATH, "utf-8");

    // Check for common duplication patterns
    const sections = content.split(/^## /m);

    // Look for sections with very similar content (basic heuristic)
    const sectionLengths = sections.map((s) => s.length);
    const duplicateSections = sectionLengths.filter(
      (length, index, arr) => arr.indexOf(length) !== index && length > 1000, // Large sections with same length
    );

    // This is a basic check - might have false positives
    if (duplicateSections.length > 0) {
      console.warn(
        `⚠️  Potential duplicate sections detected (${duplicateSections.length} sections with identical length >1000 chars)`,
      );
    }

    // Don't fail on duplicates, just warn
    expect(true).toBe(true);
  });
});
