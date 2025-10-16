/**
 * Server Component Enforcement Tests
 *
 * Ensures critical layout and page components remain Server Components
 * to maintain proper 404 error handling with notFound().
 *
 * Background:
 * - Next.js App Router notFound() only works in Server Components
 * - Adding "use client" to layout/page components breaks 404 status codes
 * - This test prevents regression by enforcing Server Component architecture
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Critical files that MUST remain Server Components
 * These files handle routing, layouts, and error states
 */
const REQUIRED_SERVER_COMPONENTS = [
  // Root layout
  "src/app/layout.tsx",

  // Main shell and layout components that wrap pages
  "src/components/layout/dashboard-shell.tsx",

  // All page.tsx files should be server components by default
  // (unless they have specific client-side interactivity needs)
  "src/app/page.tsx",
  "src/app/mailchimp/page.tsx",
  "src/app/mailchimp/general-info/page.tsx",
  "src/app/mailchimp/lists/page.tsx",
  "src/app/mailchimp/lists/[id]/page.tsx",
  "src/app/mailchimp/reports/page.tsx",
  "src/app/mailchimp/reports/[id]/page.tsx",
  "src/app/mailchimp/reports/[id]/opens/page.tsx",

  // All not-found.tsx files MUST be server components
  "src/app/not-found.tsx",
  "src/app/mailchimp/not-found.tsx",
  "src/app/mailchimp/lists/[id]/not-found.tsx",
  "src/app/mailchimp/reports/[id]/not-found.tsx",
  "src/app/mailchimp/reports/[id]/opens/not-found.tsx",
];

/**
 * Check if a file contains "use client" directive
 */
function hasUseClientDirective(filePath: string): boolean {
  try {
    const content = readFileSync(filePath, "utf-8");
    // Check for "use client" at the start of the file (ignoring comments and whitespace)
    const lines = content.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      // Skip empty lines and comments
      if (
        trimmed === "" ||
        trimmed.startsWith("//") ||
        trimmed.startsWith("/*")
      ) {
        continue;
      }
      // Check if this is the "use client" directive
      if (trimmed === '"use client";' || trimmed === "'use client';") {
        return true;
      }
      // If we hit any other code, stop checking
      break;
    }
    return false;
  } catch (error) {
    // If file doesn't exist, it's not a violation
    return false;
  }
}

/**
 * Find all not-found.tsx files in the app directory
 */
function findAllNotFoundFiles(dir: string): string[] {
  const notFoundFiles: string[] = [];

  function walk(currentDir: string) {
    try {
      const files = readdirSync(currentDir);

      for (const file of files) {
        const filePath = join(currentDir, file);
        const stat = statSync(filePath);

        if (stat.isDirectory()) {
          // Skip node_modules and .next directories
          if (file !== "node_modules" && file !== ".next") {
            walk(filePath);
          }
        } else if (file === "not-found.tsx") {
          // Convert absolute path to relative path from project root
          const relativePath = filePath.replace(
            /^.*?\/another-dashboard\//,
            "",
          );
          notFoundFiles.push(relativePath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }

  walk(dir);
  return notFoundFiles;
}

describe("Server Component Enforcement", () => {
  describe("Critical Server Components", () => {
    it("should enforce that critical layout and page files remain Server Components", () => {
      const violations: string[] = [];

      for (const filePath of REQUIRED_SERVER_COMPONENTS) {
        if (hasUseClientDirective(filePath)) {
          violations.push(filePath);
        }
      }

      if (violations.length > 0) {
        const errorMessage = [
          "\n❌ Server Component violations detected!",
          "",
          "The following files MUST remain Server Components but contain 'use client':",
          ...violations.map((file) => `  - ${file}`),
          "",
          "Why this matters:",
          "  • Server Components can use Next.js notFound() for proper 404 status codes",
          "  • Adding 'use client' breaks notFound() and returns 200 status instead",
          "  • Layout and page components should be Server Components by default",
          "",
          "How to fix:",
          "  • Remove 'use client' directive from these files",
          "  • Extract client-side logic to separate client components",
          "  • Use Client Components only for interactive features (hooks, events)",
          "",
        ].join("\n");

        throw new Error(errorMessage);
      }
    });
  });

  describe("Not-Found Files", () => {
    it("should enforce that ALL not-found.tsx files are Server Components", () => {
      const appDir = join(process.cwd(), "src", "app");
      const allNotFoundFiles = findAllNotFoundFiles(appDir);
      const violations: string[] = [];

      for (const filePath of allNotFoundFiles) {
        if (hasUseClientDirective(filePath)) {
          violations.push(filePath);
        }
      }

      if (violations.length > 0) {
        const errorMessage = [
          "\n❌ not-found.tsx Server Component violations detected!",
          "",
          "The following not-found.tsx files contain 'use client' but MUST be Server Components:",
          ...violations.map((file) => `  - ${file}`),
          "",
          "Why this matters:",
          "  • not-found.tsx files MUST be Server Components to return proper 404 status codes",
          "  • Adding 'use client' causes these files to return 200 status instead of 404",
          "  • This breaks SEO, link checkers, and browser behavior",
          "",
          "How to fix:",
          "  • Remove 'use client' directive from all not-found.tsx files",
          "  • Extract any client-side interactivity to separate components",
          "  • Import and use those client components from the server component",
          "",
        ].join("\n");

        throw new Error(errorMessage);
      }

      // Also verify we found some not-found files (sanity check)
      expect(
        allNotFoundFiles.length,
        "Expected to find at least one not-found.tsx file",
      ).toBeGreaterThan(0);
    });
  });

  describe("Layout Hierarchy", () => {
    it("should enforce that root layout.tsx is a Server Component", () => {
      const rootLayout = "src/app/layout.tsx";

      if (hasUseClientDirective(rootLayout)) {
        const errorMessage = [
          "\n❌ Root layout.tsx MUST be a Server Component!",
          "",
          "The root layout at src/app/layout.tsx contains 'use client' but MUST be a Server Component.",
          "",
          "Why this matters:",
          "  • Root layout sets up the HTML structure and metadata",
          "  • It wraps ALL pages in the application",
          "  • Making it a Client Component prevents proper SSR and 404 handling",
          "",
          "How to fix:",
          "  • Remove 'use client' from src/app/layout.tsx",
          "  • Use SidebarProvider (which is already a client component) for state",
          "  • Extract any other client logic to separate components",
          "",
        ].join("\n");

        throw new Error(errorMessage);
      }
    });

    it("should enforce that dashboard-shell.tsx is a Server Component", () => {
      const dashboardShell = "src/components/layout/dashboard-shell.tsx";

      if (hasUseClientDirective(dashboardShell)) {
        const errorMessage = [
          "\n❌ dashboard-shell.tsx MUST be a Server Component!",
          "",
          "The dashboard shell contains 'use client' but MUST be a Server Component.",
          "",
          "Why this matters:",
          "  • dashboard-shell wraps all authenticated pages",
          "  • It needs to remain a Server Component for proper 404 handling",
          "  • Child pages call notFound() which only works in Server Components",
          "",
          "How to fix:",
          "  • Remove 'use client' from dashboard-shell.tsx",
          "  • Use CSS and data attributes for sidebar state management",
          "  • Keep SidebarProvider as a client component wrapper",
          "  • Extract any client logic to separate components",
          "",
          "Reference:",
          "  • See docs/execution-plan-404-status-fix.md for architecture details",
          "",
        ].join("\n");

        throw new Error(errorMessage);
      }
    });
  });
});
