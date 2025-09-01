/**
 * DAL Models Architectural Enforcement Tests
 *
 * Ensures that DAL model files follow proper architectural patterns:
 * - No type definitions (should be in /src/types)
 * - No Zod schema definitions (should be in /src/schemas)
 * - Only imports and re-exports from proper locations
 */

import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, it } from "vitest";

describe("DAL Models Architectural Enforcement", () => {
  it("should not contain type definitions in DAL model files", async () => {
    const dalModelsDir = join(process.cwd(), "src/dal/models");
    const files = await readdir(dalModelsDir);
    const dalModelFiles = files
      .filter((f) => f.endsWith(".ts"))
      .map((f) => join(dalModelsDir, f));
    const violations: { file: string; violations: string[] }[] = [];

    for (const filePath of dalModelFiles) {
      const content = await readFile(filePath, "utf-8");
      const fileViolations: string[] = [];

      // Check for type definitions that should be in /src/types
      const typePatterns = [
        /export\s+(interface|type)\s+\w+/g,
        /interface\s+\w+\s*{/g,
        /type\s+\w+\s*=/g,
      ];

      typePatterns.forEach((pattern, index) => {
        const matches = content.match(pattern);
        if (matches) {
          matches.forEach((match) => {
            // Allow re-export type statements
            if (!match.includes("from")) {
              const patternNames = [
                "export interface/type",
                "interface declaration",
                "type alias",
              ];
              fileViolations.push(
                `Found ${patternNames[index]}: "${match.trim()}". Types should be defined in /src/types, not in DAL models.`,
              );
            }
          });
        }
      });

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

      throw new Error(
        `DAL model files should not contain type definitions:${errorMessage}`,
      );
    }
  });

  it("should not contain Zod schema definitions in DAL model files", async () => {
    const dalModelsDir = join(process.cwd(), "src/dal/models");
    const files = await readdir(dalModelsDir);
    const dalModelFiles = files
      .filter((f) => f.endsWith(".ts"))
      .map((f) => join(dalModelsDir, f));
    const violations: { file: string; violations: string[] }[] = [];

    for (const filePath of dalModelFiles) {
      const content = await readFile(filePath, "utf-8");
      const fileViolations: string[] = [];

      // Check for Zod schema definitions that should be in /src/schemas
      const schemaPatterns = [
        /export\s+const\s+\w+Schema\s*=/g,
        /const\s+\w+Schema\s*=\s*z\./g,
        /z\.object\s*\(/g,
        /z\.string\s*\(/g,
        /z\.number\s*\(/g,
        /z\.boolean\s*\(/g,
        /z\.array\s*\(/g,
        /z\.enum\s*\(/g,
      ];

      schemaPatterns.forEach((pattern, index) => {
        const matches = content.match(pattern);
        if (matches) {
          matches.forEach((match) => {
            const patternNames = [
              "exported schema constant",
              "schema constant assignment",
              "z.object() call",
              "z.string() call",
              "z.number() call",
              "z.boolean() call",
              "z.array() call",
              "z.enum() call",
            ];
            fileViolations.push(
              `Found ${patternNames[index]}: "${match.trim()}". Zod schemas should be defined in /src/schemas, not in DAL models.`,
            );
          });
        }
      });

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

      throw new Error(
        `DAL model files should not contain Zod schema definitions:${errorMessage}`,
      );
    }
  });

  it("should only contain imports and re-exports in DAL model files", async () => {
    const dalModelsDir = join(process.cwd(), "src/dal/models");
    const files = await readdir(dalModelsDir);
    const dalModelFiles = files
      .filter((f) => f.endsWith(".ts"))
      .map((f) => join(dalModelsDir, f));
    const violations: { file: string; violations: string[] }[] = [];

    for (const filePath of dalModelFiles) {
      const content = await readFile(filePath, "utf-8");
      const fileViolations: string[] = [];

      // Remove comments and normalize whitespace for analysis
      const cleanContent = content
        .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
        .replace(/\/\/.*$/gm, "") // Remove line comments
        .replace(/\n\s*\n/g, "\n") // Remove empty lines
        .trim();

      // Split by lines and analyze meaningful content
      const meaningfulLines = cleanContent
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      for (const line of meaningfulLines) {
        // Allow imports, export statements, and re-exports
        const allowedPatterns = [
          /^import\s+/, // import statements
          /^export\s+(type\s+)?{.*}\s+from\s+/, // single line export {...} from
          /^export\s+(type\s+)?{.*$/, // start of multiline export
          /^export\s+\*\s+from\s+/, // export * from
          /^export\s+(type\s+)?.*from\s+/, // export ... from
          /^[a-zA-Z_$][a-zA-Z0-9_$]*,?\s*$/, // identifier on its own line (part of multiline export)
          /^}.*$/, // closing brace (end of multiline export)
        ];

        const isAllowed = allowedPatterns.some((pattern) => pattern.test(line));

        if (!isAllowed) {
          fileViolations.push(
            `Invalid content: "${line}". DAL model files should only contain imports and re-exports.`,
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

      throw new Error(
        `DAL model files should only contain imports and re-exports:${errorMessage}`,
      );
    }
  });

  it("should import types from @/types and schemas from @/schemas", async () => {
    const dalModelsDir = join(process.cwd(), "src/dal/models");
    const files = await readdir(dalModelsDir);
    const dalModelFiles = files
      .filter((f) => f.endsWith(".ts"))
      .map((f) => join(dalModelsDir, f));
    const violations: { file: string; violations: string[] }[] = [];

    for (const filePath of dalModelFiles) {
      const content = await readFile(filePath, "utf-8");
      const fileViolations: string[] = [];

      // Check that type imports come from @/types
      const typeImportPattern = /export\s+type\s+.*from\s+["']([^"']+)["']/g;
      let typeMatch;
      while ((typeMatch = typeImportPattern.exec(content)) !== null) {
        const importPath = typeMatch[1];
        if (!importPath.startsWith("@/types/")) {
          fileViolations.push(
            `Type re-export should import from @/types, but imports from: ${importPath}`,
          );
        }
      }

      // Check that schema imports come from @/schemas
      const schemaImportPattern =
        /export\s+{[^}]*Schema[^}]*}\s+from\s+["']([^"']+)["']/g;
      let schemaMatch;
      while ((schemaMatch = schemaImportPattern.exec(content)) !== null) {
        const importPath = schemaMatch[1];
        if (!importPath.startsWith("@/schemas/")) {
          fileViolations.push(
            `Schema re-export should import from @/schemas, but imports from: ${importPath}`,
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

      throw new Error(
        `DAL model files should follow proper import patterns:${errorMessage}`,
      );
    }
  });
});
