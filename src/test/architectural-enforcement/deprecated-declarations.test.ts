/**
 * Deprecated Declarations Detection Test
 *
 * Scans the codebase for usage of deprecated APIs and methods
 * to prevent future issues and maintain code quality.
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, it } from "vitest";

// Simple file walker function
async function walkDir(dir: string, pattern: RegExp): Promise<string[]> {
  const { readdir, stat } = await import("node:fs/promises");
  const files: string[] = [];

  try {
    const entries = await readdir(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stats = await stat(fullPath);

      if (stats.isDirectory()) {
        // Skip test directories and node_modules
        if (
          !entry.startsWith(".") &&
          entry !== "node_modules" &&
          !entry.includes("test") &&
          !entry.includes("spec")
        ) {
          files.push(...(await walkDir(fullPath, pattern)));
        }
      } else if (stats.isFile() && pattern.test(entry)) {
        // Skip test files
        if (!entry.includes(".test.") && !entry.includes(".spec.")) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read, skip it
  }

  return files;
}

describe("Deprecated Declarations Detection", () => {
  it("should not use deprecated Zod datetime() method", async () => {
    const sourceFiles = await walkDir(
      join(process.cwd(), "src"),
      /\.(ts|tsx)$/,
    );

    const violations: { file: string; violations: string[] }[] = [];

    for (const filePath of sourceFiles) {
      const content = await readFile(filePath, "utf-8");
      const lines = content.split("\n");
      const fileViolations: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNumber = i + 1;

        // Check for deprecated z.string().datetime() usage
        if (line.includes(".datetime()")) {
          fileViolations.push(
            `Line ${lineNumber}: "${line.trim()}". The .datetime() method is deprecated. Use z.string() with manual validation or z.string().refine() instead.`,
          );
        }
      }

      if (fileViolations.length > 0) {
        violations.push({ file: filePath, violations: fileViolations });
      }
    }

    if (violations.length > 0) {
      const errorMessage = violations
        .map(
          ({ file, violations }) =>
            `\n${file}:\n${violations.map((v) => `  - ${v}`).join("\n")}`,
        )
        .join("\n");

      throw new Error(`Found deprecated Zod datetime() usage:${errorMessage}`);
    }
  });

  it("should not use other known deprecated APIs", async () => {
    const sourceFiles = await walkDir(
      join(process.cwd(), "src"),
      /\.(ts|tsx)$/,
    );

    const violations: { file: string; violations: string[] }[] = [];

    // Define patterns for other deprecated APIs
    const deprecatedPatterns = [
      {
        pattern: /React\.FC</g,
        message:
          "React.FC is generally discouraged. Use regular function components instead.",
        severity: "warning",
      },
      {
        pattern:
          /componentWillMount|componentWillReceiveProps|componentWillUpdate/g,
        message:
          "This React lifecycle method is deprecated. Use modern lifecycle methods or hooks instead.",
        severity: "error",
      },
      {
        pattern: /findDOMNode/g,
        message: "findDOMNode is deprecated. Use refs instead.",
        severity: "error",
      },
      {
        pattern: /String\.prototype\.substr/g,
        message:
          "String.substr() is deprecated. Use String.substring() or String.slice() instead.",
        severity: "error",
      },
    ];

    for (const filePath of sourceFiles) {
      const content = await readFile(filePath, "utf-8");
      const lines = content.split("\n");
      const fileViolations: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNumber = i + 1;

        for (const { pattern, message, severity } of deprecatedPatterns) {
          const matches = line.match(pattern);
          if (matches) {
            matches.forEach((_match) => {
              fileViolations.push(
                `Line ${lineNumber}: "${line.trim()}". ${message} (${severity.toUpperCase()})`,
              );
            });
          }
        }
      }

      if (fileViolations.length > 0) {
        violations.push({ file: filePath, violations: fileViolations });
      }
    }

    // Only throw error for actual errors, not warnings
    const errorViolations = violations
      .map(({ file, violations }) => ({
        file,
        violations: violations.filter((v) => v.includes("(ERROR)")),
      }))
      .filter(({ violations }) => violations.length > 0);

    if (errorViolations.length > 0) {
      const errorMessage = errorViolations
        .map(
          ({ file, violations }) =>
            `\n${file}:\n${violations.map((v) => `  - ${v}`).join("\n")}`,
        )
        .join("\n");

      throw new Error(`Found deprecated API usage:${errorMessage}`);
    }

    // Log warnings but don't fail the test
    const warningViolations = violations
      .map(({ file, violations }) => ({
        file,
        violations: violations.filter((v) => v.includes("(WARNING)")),
      }))
      .filter(({ violations }) => violations.length > 0);

    if (warningViolations.length > 0) {
      const warningMessage = warningViolations
        .map(
          ({ file, violations }) =>
            `\n${file}:\n${violations.map((v) => `  - ${v}`).join("\n")}`,
        )
        .join("\n");

      console.warn(`Deprecated API warnings found:${warningMessage}`);
    }
  });

  it("should not use deprecated Node.js APIs", async () => {
    const sourceFiles = await walkDir(
      join(process.cwd(), "src"),
      /\.(ts|tsx)$/,
    );

    const violations: { file: string; violations: string[] }[] = [];

    // Define patterns for deprecated Node.js APIs
    const deprecatedNodePatterns = [
      {
        pattern: /require\.extensions/g,
        message: "require.extensions is deprecated.",
      },
      {
        pattern: /process\.binding/g,
        message: "process.binding() is deprecated.",
      },
      {
        pattern: /Buffer\.allocUnsafe/g,
        message:
          "Buffer.allocUnsafe() should be used carefully. Consider Buffer.alloc() for safer memory allocation.",
      },
    ];

    for (const filePath of sourceFiles) {
      const content = await readFile(filePath, "utf-8");
      const lines = content.split("\n");
      const fileViolations: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNumber = i + 1;

        for (const { pattern, message } of deprecatedNodePatterns) {
          const matches = line.match(pattern);
          if (matches) {
            matches.forEach((_match) => {
              fileViolations.push(
                `Line ${lineNumber}: "${line.trim()}". ${message}`,
              );
            });
          }
        }
      }

      if (fileViolations.length > 0) {
        violations.push({ file: filePath, violations: fileViolations });
      }
    }

    if (violations.length > 0) {
      const errorMessage = violations
        .map(
          ({ file, violations }) =>
            `\n${file}:\n${violations.map((v) => `  - ${v}`).join("\n")}`,
        )
        .join("\n");

      throw new Error(`Found deprecated Node.js API usage:${errorMessage}`);
    }
  });
});
