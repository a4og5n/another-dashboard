/**
 * Test: Enforce usage of path aliases in generator scripts
 *
 * This test ensures that all generator scripts (prompts, writers, analyzers)
 * use path aliases (@/*) instead of relative imports for cleaner, more maintainable code.
 *
 * Folders checked: scripts/generators/prompts, scripts/generators/writers, scripts/generators/analyzers
 *
 * Requirement: All imports from src/ must use @/ alias
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const GENERATOR_FOLDERS = [
  "scripts/generators/prompts",
  "scripts/generators/writers",
  "scripts/generators/analyzers",
];

// Match relative imports that go into src/ directory
// Examples: "../../../src/", "../../src/", "../src/"
const RELATIVE_SRC_IMPORT_REGEX = /from ['"]\.\.\/.*\/src\//;
const RELATIVE_SRC_EXPORT_REGEX = /export .*from ['"]\.\.\/.*\/src\//;

function getAllFiles(dir: string, ext: string[] = [".ts", ".tsx"]): string[] {
  let results: string[] = [];

  // Check if directory exists first
  if (!fs.existsSync(dir)) {
    return results;
  }

  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, ext));
    } else if (ext.includes(path.extname(file))) {
      // Skip test files
      if (!file.includes(".test.")) {
        results.push(filePath);
      }
    }
  });
  return results;
}

describe("Generator Path Alias Enforcement", () => {
  GENERATOR_FOLDERS.forEach((folder) => {
    it(`should use @/ alias for src imports in ${folder}`, () => {
      const files = getAllFiles(path.resolve(folder));

      const violations: Array<{ file: string; line: string }> = [];

      files.forEach((file) => {
        const content = fs.readFileSync(file, "utf8");
        const lines = content.split("\n");

        lines.forEach((line, index) => {
          if (RELATIVE_SRC_IMPORT_REGEX.test(line)) {
            violations.push({
              file: file.replace(process.cwd(), "."),
              line: `Line ${index + 1}: ${line.trim()}`,
            });
          }
        });
      });

      if (violations.length > 0) {
        const errorMessage = violations
          .map((v) => `${v.file}\n  ${v.line}`)
          .join("\n");
        expect.fail(
          `Found relative imports to src/ in generator scripts. Use @/ alias instead:\n\n${errorMessage}`,
        );
      }
    });

    it(`should use @/ alias for src exports in ${folder}`, () => {
      const files = getAllFiles(path.resolve(folder));

      const violations: Array<{ file: string; line: string }> = [];

      files.forEach((file) => {
        const content = fs.readFileSync(file, "utf8");
        const lines = content.split("\n");

        lines.forEach((line, index) => {
          if (RELATIVE_SRC_EXPORT_REGEX.test(line)) {
            violations.push({
              file: file.replace(process.cwd(), "."),
              line: `Line ${index + 1}: ${line.trim()}`,
            });
          }
        });
      });

      if (violations.length > 0) {
        const errorMessage = violations
          .map((v) => `${v.file}\n  ${v.line}`)
          .join("\n");
        expect.fail(
          `Found relative exports to src/ in generator scripts. Use @/ alias instead:\n\n${errorMessage}`,
        );
      }
    });
  });
});
