#!/usr/bin/env node

// This script scans the codebase for suspicious logging patterns that could leak secrets.
// It is intended for use in pre-commit hooks or CI pipelines.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const EXTS = [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"];
const IGNORE_DIRS = ["node_modules", ".next", "out", "build", "coverage"];
const PATTERNS = [
  /console\.(log|debug|info)\s*\(\s*process\.env/,
  /console\.(log|debug|info)\s*\(.*API_KEY.*/i,
  /console\.(log|debug|info)\s*\(.*SECRET.*/i,
  /console\.(log|debug|info)\s*\(.*DEBUG ENV.*/i,
];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  for (const pattern of PATTERNS) {
    if (pattern.test(content)) {
      return pattern;
    }
  }
  return null;
}

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (IGNORE_DIRS.includes(file)) continue;
      results = results.concat(walk(filePath));
    } else {
      if (EXTS.includes(path.extname(file))) {
        results.push(filePath);
      }
    }
  }
  return results;
}

function main() {
  const files = walk(ROOT);
  let found = false;
  for (const file of files) {
    const pattern = scanFile(file);
    if (pattern) {
      console.error(`\u274C Suspicious logging pattern found in: ${file}`);
      console.error(`Pattern: ${pattern}`);
      found = true;
    }
  }
  if (found) {
    console.error(
      "\nAborting commit/build: Remove all logging of secrets or environment variables.",
    );
    process.exit(1);
  } else {
    console.log("\u2705 No suspicious logging patterns found.");
  }
}

main();
