/**
 * Test: Enforce TypeScript types folder structure and usage guidelines.
 *
 * This test checks:
 * - All type/interface definitions are stored in the 'types' folder (not inline in components/actions)
 * - Subfolders exist for features/integrations (e.g., mailchimp/)
 * - Each subfolder has an index.ts for re-exports
 * - No logic or Zod schemas are present in 'types' files
 * - Path aliases are used for imports/exports from 'types'
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const TYPES_DIR = path.resolve("src/types");
const COMPONENTS_DIR = path.resolve("src/components");
const ACTIONS_DIR = path.resolve("src/actions");
// Match inline type definitions, but NOT type re-exports from @/types
// Matches: export interface Foo, export type Foo =
// Excludes: export type { Foo } from "@/types/..."
const TYPE_DEF_REGEX = /export (interface\s+\w+|type\s+\w+\s*=)/;
const ZOD_SCHEMA_REGEX =
  /z\.(object|string|number|array|boolean|enum|union|literal|record|date|tuple|custom)/;
// Only match actual function or arrow function definitions, not comments
const LOGIC_REGEX =
  /(^|\n)\s*(export\s+)?(function\s+\w+|const\s+\w+\s*=\s*\(|\w+\s*=\s*\(.*\)\s*=>)/;
const RELATIVE_IMPORT_REGEX = /from ['"](\.\.\/)+/;

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

describe("Types Folder Structure & Usage Enforcement", () => {
  it("should not have inline type/interface definitions in components", () => {
    const files = getAllFiles(COMPONENTS_DIR);
    files.forEach((file) => {
      const content = fs.readFileSync(file, "utf8");
      expect(content).not.toMatch(TYPE_DEF_REGEX);
    });
  });
  it("should not have inline type/interface definitions in actions", () => {
    const files = getAllFiles(ACTIONS_DIR);
    files.forEach((file) => {
      const content = fs.readFileSync(file, "utf8");
      expect(content).not.toMatch(TYPE_DEF_REGEX);
    });
  });
  it("should have subfolders for features/integrations in types", () => {
    const subfolders = fs
      .readdirSync(TYPES_DIR)
      .filter((f) => fs.statSync(path.join(TYPES_DIR, f)).isDirectory());
    expect(subfolders.length).toBeGreaterThan(0);
  });
  it("should have index.ts in each types subfolder", () => {
    const subfolders = fs
      .readdirSync(TYPES_DIR)
      .filter((f) => fs.statSync(path.join(TYPES_DIR, f)).isDirectory());
    subfolders.forEach((folder) => {
      const indexPath = path.join(TYPES_DIR, folder, "index.ts");
      expect(fs.existsSync(indexPath)).toBe(true);
    });
  });
  it("should not contain Zod schemas or logic in types files", () => {
    const files = getAllFiles(TYPES_DIR);
    files.forEach((file) => {
      const content = fs.readFileSync(file, "utf8");
      expect(content).not.toMatch(ZOD_SCHEMA_REGEX);
      expect(content).not.toMatch(LOGIC_REGEX);
    });
  });
  it("should use path aliases for imports/exports from types", () => {
    const files = getAllFiles(TYPES_DIR);
    files.forEach((file) => {
      const content = fs.readFileSync(file, "utf8");
      expect(content).not.toMatch(RELATIVE_IMPORT_REGEX);
    });
  });
});
