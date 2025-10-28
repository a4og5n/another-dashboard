/**
 * Test: Enforce that schema files contain only schema definitions
 *
 * This test scans the schemas folder for function definitions and fails if any are found.
 * This enforces architectural separation of concerns - schema files should contain only
 * Zod schema definitions, while utility functions should be placed in appropriate utils folders.
 *
 * Folders scanned: src/schemas (recursively)
 *
 * Requirement: All schema files must contain only schema definitions as per PRD guidelines
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const SCHEMAS_FOLDER = "src/schemas";

// Allowed exceptions: Schema factory functions in common/
// These functions CREATE schemas and must live in schema files
const ALLOWED_FUNCTIONS = [
  "createIdPathParams", // Factory for custom ID path parameters
  "createDateRangeFilterSchema", // Factory for date range filter schemas (Issue #252)
  "createEnumSortingSchema", // Factory for enum-based sorting schemas (Issue #252)
  "createDualSortingSchema", // Factory for dual sorting schemas (Issue #252)
];

// Regex patterns to detect function definitions
const FUNCTION_PATTERNS = [
  /export\s+function\s+\w+/, // export function name
  /function\s+\w+\s*\(/, // function name(
  /const\s+\w+\s*=\s*\([^)]*\)\s*=>/, // const name = (params) =>
  /const\s+\w+\s*=\s*async\s*\([^)]*\)\s*=>/, // const name = async (params) =>
  /export\s+const\s+\w+\s*=\s*\([^)]*\)\s*=>/, // export const name = (params) =>
  /export\s+const\s+\w+\s*=\s*async\s*\([^)]*\)\s*=>/, // export const name = async (params) =>
];

function getAllFiles(dir: string, ext: string[] = [".ts", ".tsx"]): string[] {
  let results: string[] = [];

  try {
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getAllFiles(filePath, ext));
      } else if (ext.includes(path.extname(file))) {
        results.push(filePath);
      }
    });
  } catch {
    // Skip directories that can't be read
    console.warn(`Warning: Could not read directory ${dir}`);
  }

  return results;
}

function detectFunctions(
  content: string,
): { pattern: RegExp; match: string }[] {
  const violations: { pattern: RegExp; match: string }[] = [];

  FUNCTION_PATTERNS.forEach((pattern) => {
    const matches = content.match(new RegExp(pattern.source, "g"));
    if (matches) {
      matches.forEach((match) => {
        violations.push({ pattern, match });
      });
    }
  });

  return violations;
}

describe("Schema Purity Enforcement", () => {
  it("should not have function definitions in schema files", () => {
    const violations: {
      file: string;
      violations: { pattern: RegExp; match: string }[];
    }[] = [];

    const schemaFolderPath = path.resolve(SCHEMAS_FOLDER);
    if (fs.existsSync(schemaFolderPath)) {
      const files = getAllFiles(schemaFolderPath);

      files.forEach((file) => {
        const content = fs.readFileSync(file, "utf8");
        const functionViolations = detectFunctions(content);

        // Filter out allowed functions
        const disallowedViolations = functionViolations.filter((v) => {
          return !ALLOWED_FUNCTIONS.some((allowedFn) =>
            v.match.includes(allowedFn),
          );
        });

        if (disallowedViolations.length > 0) {
          violations.push({
            file: path.relative(process.cwd(), file),
            violations: disallowedViolations,
          });
        }
      });
    }

    if (violations.length > 0) {
      const errorMessage = violations
        .map(
          (v) =>
            `\n- ${v.file}:\n${v.violations
              .map((violation) => `  • Found: ${violation.match}`)
              .join("\n")}`,
        )
        .join("\n");

      throw new Error(
        `Found ${violations.length} schema file(s) with function definitions:\n${errorMessage}\n\nSchema files should contain only Zod schema definitions. Move utility functions to /src/utils/.`,
      );
    }
  });

  it("should allow Zod schema definitions in schema files", () => {
    const schemaFolderPath = path.resolve(SCHEMAS_FOLDER);
    let hasSchemas = false;

    function getSchemaFiles(dir: string): string[] {
      let results: string[] = [];
      try {
        const list = fs.readdirSync(dir);
        list.forEach((file) => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          if (stat && stat.isDirectory()) {
            results = results.concat(getSchemaFiles(filePath));
          } else if ([".ts", ".tsx"].includes(path.extname(file))) {
            results.push(filePath);
          }
        });
      } catch {
        // Skip if directory doesn't exist
      }
      return results;
    }

    const schemaFiles = getSchemaFiles(schemaFolderPath);

    schemaFiles.forEach((file) => {
      const content = fs.readFileSync(file, "utf8");
      // Check for common Zod patterns
      const zodPatterns = [/z\.object/, /z\.string/, /z\.array/, /z\.enum/];
      const hasZodSchemas = zodPatterns.some((pattern) =>
        pattern.test(content),
      );

      if (hasZodSchemas) {
        hasSchemas = true;
      }
    });

    // This test ensures the schemas folder contains actual schemas
    // If it doesn't, our detection might be broken
    expect(hasSchemas).toBe(true);
  });

  it("should detect common function patterns correctly", () => {
    const testContent = `
      export function transformData(input) { return input; }
      const processItem = (item) => item;
      export const validateInput = async (data) => data;
    `;

    const violations = detectFunctions(testContent);
    expect(violations.length).toBeGreaterThan(0);
    expect(violations.some((v) => v.match.includes("transformData"))).toBe(
      true,
    );
    expect(violations.some((v) => v.match.includes("processItem"))).toBe(true);
    expect(violations.some((v) => v.match.includes("validateInput"))).toBe(
      true,
    );
  });
});
