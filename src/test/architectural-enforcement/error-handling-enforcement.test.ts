/**
 * Error Handling Pattern Enforcement Tests
 *
 * Ensures consistent error handling patterns across Mailchimp pages:
 * 1. NO loading.tsx files (interferes with 404 flow)
 * 2. All dynamic pages have error.tsx (for unexpected crashes)
 * 3. All dynamic pages have not-found.tsx (for 404s)
 *
 * Background:
 * - Issue #240: Standardize error handling across Mailchimp pages
 * - loading.tsx can prevent proper 404 error flow
 * - error.tsx handles unexpected crashes (Client Component)
 * - not-found.tsx handles 404 errors (Server Component)
 * - API errors handled via handleApiError() + MailchimpConnectionGuard
 *
 * @see https://github.com/anthropics/claude-code/issues/240
 */

import { describe, it, expect } from "vitest";
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Recursively find all directories containing page.tsx in Mailchimp routes
 */
function findMailchimpPageDirectories(dir: string): string[] {
  const results: string[] = [];

  try {
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively search subdirectories
        results.push(...findMailchimpPageDirectories(fullPath));
      } else if (entry.name === "page.tsx") {
        // Found a page.tsx, add its directory
        results.push(dir);
      }
    }
  } catch {
    // Ignore errors (directory doesn't exist, permission issues, etc.)
  }

  return results;
}

/**
 * Check if a directory contains dynamic route segments
 * (e.g., [id], [slug], [subscriber_hash])
 */
function isDynamicRoute(dirPath: string): boolean {
  return /\[[\w_-]+\]/.test(dirPath);
}

/**
 * Find all loading.tsx files in Mailchimp routes
 */
function findLoadingFiles(dir: string): string[] {
  const results: string[] = [];

  try {
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        results.push(...findLoadingFiles(fullPath));
      } else if (entry.name === "loading.tsx") {
        results.push(fullPath);
      }
    }
  } catch {
    // Ignore errors
  }

  return results;
}

describe("Error Handling Pattern Enforcement", () => {
  const mailchimpAppDir = "src/app/mailchimp";

  it("should NOT have any loading.tsx files in Mailchimp routes", () => {
    const loadingFiles = findLoadingFiles(mailchimpAppDir);

    expect(
      loadingFiles,
      `Found loading.tsx files that interfere with 404 flow:\n${loadingFiles.join("\n")}\n\n` +
        `Issue #240: loading.tsx files prevent proper 404 error handling.\n` +
        `Use error.tsx for unexpected crashes instead.\n` +
        `Remove these files and create error.tsx if needed.`,
    ).toHaveLength(0);
  });

  it("should have error.tsx in all dynamic route directories", () => {
    const pageDirectories = findMailchimpPageDirectories(mailchimpAppDir);
    const dynamicRoutes = pageDirectories.filter(isDynamicRoute);
    const missingErrorFiles: string[] = [];

    for (const dir of dynamicRoutes) {
      const errorFilePath = join(dir, "error.tsx");
      if (!existsSync(errorFilePath)) {
        missingErrorFiles.push(dir);
      }
    }

    expect(
      missingErrorFiles,
      `Dynamic routes missing error.tsx files:\n${missingErrorFiles.join("\n")}\n\n` +
        `Issue #240: All dynamic routes should have error.tsx for unexpected crashes.\n` +
        `Create error.tsx files following the pattern from existing pages.`,
    ).toHaveLength(0);
  });

  it("should have not-found.tsx in all dynamic route directories", () => {
    const pageDirectories = findMailchimpPageDirectories(mailchimpAppDir);
    const dynamicRoutes = pageDirectories.filter(isDynamicRoute);
    const missingNotFoundFiles: string[] = [];

    for (const dir of dynamicRoutes) {
      const notFoundFilePath = join(dir, "not-found.tsx");
      if (!existsSync(notFoundFilePath)) {
        missingNotFoundFiles.push(dir);
      }
    }

    expect(
      missingNotFoundFiles,
      `Dynamic routes missing not-found.tsx files:\n${missingNotFoundFiles.join("\n")}\n\n` +
        `Issue #240: All dynamic routes should have not-found.tsx for 404 errors.\n` +
        `Create not-found.tsx files following the pattern from existing pages.`,
    ).toHaveLength(0);
  });
});
