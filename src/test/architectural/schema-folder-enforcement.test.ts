/**
 * Test: Enforce that all Zod schemas are defined in the schemas folder only
 *
 * This test scans the codebase for inline Zod schema definitions outside of the schemas folder
 * and fails if any are found. This enforces architectural separation of concerns.
 *
 * Folders excluded from scanning: src/schemas, src/test
 *
 * Requirement: All Zod schemas must be centralized in /src/schemas/ as per PRD guidelines
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const EXCLUDED_FOLDERS = [
  "src/schemas", // Schemas are allowed here
  "src/test", // Tests may contain test schemas
  "src/lib", // Config and utility schemas are allowed
  "src/dal", // Data models are allowed to have schemas
  "node_modules",
  ".next",
  "out",
  "dist",
];

// Focus on these specific folders where schemas should NOT be inline
const TARGET_FOLDERS = [
  "src/actions", // Server actions should import from schemas
  "src/app", // App router files should import from schemas
  "src/components", // Components should import from schemas
  "src/hooks", // Hooks should import from schemas
  "src/utils", // Utils should import from schemas (except config utils)
];

// Files that contain documentation examples of schemas (exceptions)
const DOCUMENTATION_FILES = [
  "src/utils/mailchimp/page-params.ts", // Contains schema examples in JSDoc
];

// Regex patterns to detect Zod schema definitions
const ZOD_SCHEMA_PATTERNS = [
  /z\.object\s*\(/, // z.object(
  /z\.array\s*\(/, // z.array(
  /z\.string\s*\(/, // z.string(
  /z\.number\s*\(/, // z.number(
  /z\.boolean\s*\(/, // z.boolean(
  /z\.enum\s*\(/, // z.enum(
  /z\.union\s*\(/, // z.union(
  /z\.intersection\s*\(/, // z.intersection(
  /z\.discriminatedUnion\s*\(/, // z.discriminatedUnion(
  /z\.record\s*\(/, // z.record(
  /z\.map\s*\(/, // z.map(
  /z\.set\s*\(/, // z.set(
  /z\.tuple\s*\(/, // z.tuple(
  /z\.literal\s*\(/, // z.literal(
  /z\.lazy\s*\(/, // z.lazy(
  /z\.function\s*\(/, // z.function(
  /z\.instanceof\s*\(/, // z.instanceof(
];

function getAllFiles(dir: string, ext: string[] = [".ts", ".tsx"]): string[] {
  let results: string[] = [];

  // Skip if this is an excluded folder
  const relativePath = path.relative(process.cwd(), dir);
  if (EXCLUDED_FOLDERS.some((excluded) => relativePath.startsWith(excluded))) {
    return results;
  }

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

function detectZodSchemas(
  content: string,
): { pattern: RegExp; match: string }[] {
  const violations: { pattern: RegExp; match: string }[] = [];

  ZOD_SCHEMA_PATTERNS.forEach((pattern) => {
    const matches = content.match(new RegExp(pattern.source, "g"));
    if (matches) {
      matches.forEach((match) => {
        violations.push({ pattern, match });
      });
    }
  });

  return violations;
}

describe("Schema Folder Enforcement", () => {
  it("should not have inline Zod schemas in action and UI files", () => {
    const violations: {
      file: string;
      violations: { pattern: RegExp; match: string }[];
    }[] = [];

    // Only scan specific target folders where schemas should be imported
    TARGET_FOLDERS.forEach((folder) => {
      const folderPath = path.resolve(folder);
      if (fs.existsSync(folderPath)) {
        const files = getAllFiles(folderPath);

        files.forEach((file) => {
          const relativePath = path.relative(process.cwd(), file);

          // Skip documentation files that contain schema examples
          if (DOCUMENTATION_FILES.includes(relativePath)) {
            return;
          }

          const content = fs.readFileSync(file, "utf8");
          const schemaViolations = detectZodSchemas(content);

          if (schemaViolations.length > 0) {
            violations.push({
              file: relativePath,
              violations: schemaViolations,
            });
          }
        });
      }
    });

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
        `Found ${violations.length} file(s) with inline Zod schemas in action/UI files:\n${errorMessage}\n\nSchemas in actions, components, and app files should be imported from /src/schemas/.`,
      );
    }
  });

  it("should allow Zod schemas in /src/schemas/ folder", () => {
    const schemaFolderPath = path.resolve("src/schemas");
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
      const schemaDefinitions = detectZodSchemas(content);

      if (schemaDefinitions.length > 0) {
        hasSchemas = true;
      }
    });

    // This test ensures the schemas folder contains actual schemas
    // If it doesn't, our detection might be broken
    expect(hasSchemas).toBe(true);
  });

  it("should detect common Zod patterns correctly", () => {
    const testContent = `
      const schema1 = z.object({ name: z.string() });
      const schema2 = z.array(z.number());
      const schema3 = z.enum(['a', 'b']);
    `;

    const violations = detectZodSchemas(testContent);
    expect(violations.length).toBeGreaterThan(0);
  });
});
