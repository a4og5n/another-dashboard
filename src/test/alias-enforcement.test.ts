/**
 * Test: Enforce usage of path aliases for imports and exports in shared, deeply nested, or frequently imported modules.
 *
 * This test scans the codebase for long relative import/export paths and fails if any are found in designated folders.
 *
 * Folders checked: schemas, types, utils, components
 *
 * Requirement: All imports/exports from these folders must use path aliases as defined in tsconfig.json
 */
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const ALIAS_FOLDERS = [
  "src/schemas",
  "src/types",
  "src/utils",
  "src/components",
];
const RELATIVE_PATH_REGEX = /from ['"](\.\.\/)+/;
const EXPORT_RELATIVE_PATH_REGEX = /export .*from ['"](\.\.\/)+/;

function getAllFiles(dir: string, ext: string[] = [".ts", ".tsx"]): string[] {
  let results: string[] = [];
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

describe("Path Alias Enforcement", () => {
  ALIAS_FOLDERS.forEach((folder) => {
    it(`should not use long relative import paths in ${folder}`, () => {
      const files = getAllFiles(path.resolve(folder));
      files.forEach((file) => {
        const content = fs.readFileSync(file, "utf8");
        expect(content).not.toMatch(RELATIVE_PATH_REGEX);
      });
    });
    it(`should not use long relative export paths in ${folder}`, () => {
      const files = getAllFiles(path.resolve(folder));
      files.forEach((file) => {
        const content = fs.readFileSync(file, "utf8");
        expect(content).not.toMatch(EXPORT_RELATIVE_PATH_REGEX);
      });
    });
  });
  describe("Path alias enforcement in index.ts files", () => {
    const filesToCheck = [
      "src/types/components/index.ts",
      "src/types/components/ui/index.ts",
      "src/types/mailchimp/index.ts",
    ];

    filesToCheck.forEach((file) => {
      it(`should not use relative path exports in ${file}`, () => {
        const content = fs.readFileSync(file, "utf8");
        const matches = content.match(
          /export\s+\*\s+from\s+['\"](\.[^'\"]+)['\"]/g,
        );
        expect(matches).toBeNull();
      });
    });
  });
});
