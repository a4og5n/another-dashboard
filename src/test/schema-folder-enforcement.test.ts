/**
 * Test: Enforce Zod schema folder structure and usage guidelines.
 *
 * This test checks:
 * - All Zod schema definitions are stored in the 'schemas' folder (not inline in components/actions)
 * - No inline schema definitions exist outside of the schemas folder
 * - Helps maintain architectural consistency per project guidelines
 *
 * Based on PRD requirements: "Schema enforcement: Zod schemas must be defined in /src/schemas for all validation, never inline"
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const SCHEMAS_DIR = path.resolve("src/schemas");
const COMPONENTS_DIR = path.resolve("src/components");
const ACTIONS_DIR = path.resolve("src/actions");
const APP_DIR = path.resolve("src/app");
const LIB_DIR = path.resolve("src/lib");
const UTILS_DIR = path.resolve("src/utils");
const DAL_DIR = path.resolve("src/dal");

// Patterns to detect Zod schema definitions
const ZOD_SCHEMA_PATTERNS = [
  /z\.object\s*\(/,
  /z\.string\s*\(/,
  /z\.number\s*\(/,
  /z\.boolean\s*\(/,
  /z\.array\s*\(/,
  /z\.enum\s*\(/,
  /z\.union\s*\(/,
  /z\.literal\s*\(/,
  /z\.record\s*\(/,
  /z\.date\s*\(/,
  /z\.tuple\s*\(/,
  /z\.custom\s*\(/,
  /z\.nativeEnum\s*\(/,
  /z\.optional\s*\(/,
  /z\.nullable\s*\(/,
  /z\.nullish\s*\(/,
  /z\.default\s*\(/,
  /z\.catch\s*\(/,
  /z\.refine\s*\(/,
  /z\.transform\s*\(/,
  /z\.pipe\s*\(/,
  /z\.brand\s*\(/,
  /z\.readonly\s*\(/,
  /z\.passthrough\s*\(/,
  /z\.strict\s*\(/,
  /z\.strip\s*\(/,
  /z\.catchall\s*\(/,
  /z\.partial\s*\(/,
  /z\.deepPartial\s*\(/,
  /z\.required\s*\(/,
  /z\.pick\s*\(/,
  /z\.omit\s*\(/,
  /z\.extend\s*\(/,
  /z\.merge\s*\(/,
  /z\.intersection\s*\(/,
  /z\.discriminatedUnion\s*\(/,
  /z\.lazy\s*\(/,
  /z\.any\s*\(/,
  /z\.unknown\s*\(/,
  /z\.never\s*\(/,
  /z\.void\s*\(/,
  /z\.nan\s*\(/,
  /z\.function\s*\(/,
  /z\.instanceof\s*\(/,
];

// Exceptions: Allow these files to have Zod schemas (config files, etc.)
const ALLOWED_SCHEMA_FILES = [
  path.resolve("src/lib/config.ts"), // Environment validation
];

function getAllFiles(dir: string, ext: string[] = [".ts", ".tsx"]): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
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
  return results;
}

function checkFileForSchemaViolations(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf8");
  const violations: string[] = [];
  
  // Skip allowed files
  if (ALLOWED_SCHEMA_FILES.includes(filePath)) {
    return violations;
  }
  
  // Check for each Zod pattern
  ZOD_SCHEMA_PATTERNS.forEach((pattern) => {
    const matches = content.match(pattern);
    if (matches) {
      violations.push(`Found Zod schema pattern: ${pattern.source}`);
    }
  });
  
  return violations;
}

describe("Schema Folder Structure & Usage Enforcement", () => {
  const foldersToCheck = [
    { name: "components", dir: COMPONENTS_DIR },
    { name: "actions", dir: ACTIONS_DIR },
    { name: "app", dir: APP_DIR },
    { name: "lib", dir: LIB_DIR },
    { name: "utils", dir: UTILS_DIR },
    { name: "dal", dir: DAL_DIR },
  ];

  foldersToCheck.forEach(({ name, dir }) => {
    it(`should not have inline Zod schema definitions in ${name}`, () => {
      const files = getAllFiles(dir);
      const violations: { file: string; patterns: string[] }[] = [];
      
      files.forEach((file) => {
        const fileViolations = checkFileForSchemaViolations(file);
        if (fileViolations.length > 0) {
          violations.push({ file, patterns: fileViolations });
        }
      });
      
      if (violations.length > 0) {
        const errorMessage = violations
          .map(({ file, patterns }) => 
            `File: ${file}\n  Violations:\n${patterns.map(p => `    - ${p}`).join('\n')}`
          )
          .join('\n\n');
        
        expect.fail(
          `Found inline Zod schema definitions in ${name} folder. ` +
          `All schemas should be defined in /src/schemas/.\n\n${errorMessage}`
        );
      }
      
      expect(violations).toHaveLength(0);
    });
  });

  it("should have schemas directory", () => {
    expect(fs.existsSync(SCHEMAS_DIR)).toBe(true);
  });

  it("should have mailchimp schemas subfolder", () => {
    const mailchimpSchemasDir = path.join(SCHEMAS_DIR, "mailchimp");
    expect(fs.existsSync(mailchimpSchemasDir)).toBe(true);
  });

  it("should export schemas from index files using path aliases", () => {
    const indexFiles = getAllFiles(SCHEMAS_DIR, [".ts"]).filter(f => 
      path.basename(f) === "index.ts"
    );
    
    expect(indexFiles.length).toBeGreaterThan(0);
    
    indexFiles.forEach((file) => {
      const content = fs.readFileSync(file, "utf8");
      // Should use path aliases (@/) for exports, not relative paths
      const relativeExportPattern = /export.*from ['"](\.\.?\/)/;
      expect(content).not.toMatch(relativeExportPattern);
    });
  });
});