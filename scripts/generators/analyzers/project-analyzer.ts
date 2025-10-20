/**
 * Project Analyzer
 *
 * Analyzes the project structure to help with smart defaults:
 * - Scans existing pages to find potential parent pages
 * - Detects existing route patterns
 * - Finds existing config keys for parent references
 */

import { existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { getPageConfigKeys } from "@/generation/page-configs";

/**
 * Information about an existing page
 */
export interface ExistingPage {
  route: string;
  type: "list" | "detail" | "nested-detail";
  hasId: boolean;
  depth: number;
  configKey?: string;
}

/**
 * Result of project analysis
 */
export interface ProjectAnalysis {
  existingPages: ExistingPage[];
  existingRoutes: string[];
  potentialParents: ExistingPage[];
  configKeys: string[];
}

/**
 * Analyze the project structure
 */
export function analyzeProject(): ProjectAnalysis {
  const existingPages = scanPages();
  const existingRoutes = existingPages.map((p) => p.route);
  const configKeys = getPageConfigKeys();

  return {
    existingPages,
    existingRoutes,
    potentialParents: existingPages.filter((p) => p.type === "detail"),
    configKeys,
  };
}

/**
 * Scan app directory for existing pages
 */
function scanPages(): ExistingPage[] {
  const pages: ExistingPage[] = [];
  const appDir = resolve(process.cwd(), "src/app/mailchimp");

  if (!existsSync(appDir)) {
    return pages;
  }

  function scanDirectory(dir: string, routePath: string, depth: number) {
    try {
      const entries = readdirSync(dir);

      for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          // Check if this is a route segment
          const isDynamic = entry.startsWith("[") && entry.endsWith("]");
          const newRoutePath = `${routePath}/${entry}`;

          // Check if this directory has a page.tsx
          const pagePath = join(fullPath, "page.tsx");
          if (existsSync(pagePath)) {
            const hasId = isDynamic;
            const type = determinePageType(newRoutePath, depth, hasId);
            const configKey = findConfigKey(newRoutePath);

            pages.push({
              route: newRoutePath,
              type,
              hasId,
              depth: depth + 1,
              configKey,
            });
          }

          // Recursively scan subdirectories
          scanDirectory(fullPath, newRoutePath, depth + 1);
        }
      }
    } catch (_error) {
      // Ignore errors when scanning directories
    }
  }

  // Start scanning from /mailchimp
  scanDirectory(appDir, "/mailchimp", 0);

  return pages;
}

/**
 * Determine page type based on route structure
 */
function determinePageType(
  route: string,
  _depth: number,
  hasId: boolean,
): "list" | "detail" | "nested-detail" {
  const segments = route.split("/").filter(Boolean);

  if (!hasId) {
    return "list";
  }

  // Count segments after the dynamic segment
  const idIndex = segments.findIndex((s) => s.startsWith("["));
  const segmentsAfterDynamic = segments.length - idIndex - 1;

  return segmentsAfterDynamic > 0 ? "nested-detail" : "detail";
}

/**
 * Find matching config key for a route
 */
function findConfigKey(route: string): string | undefined {
  const configKeys = getPageConfigKeys();

  // Try to match route to config key
  // This is a heuristic - might need refinement
  const routeSegments = route
    .split("/")
    .filter(Boolean)
    .filter((s) => !s.startsWith("["));

  for (const key of configKeys) {
    const keyParts = key.split("-");
    const matchCount = keyParts.filter((part) =>
      routeSegments.some((seg) => seg.includes(part)),
    ).length;

    if (matchCount === keyParts.length) {
      return key;
    }
  }

  return undefined;
}

/**
 * Find potential parent page for a given route
 */
export function findParentPage(
  route: string,
  analysis: ProjectAnalysis,
): ExistingPage | undefined {
  const segments = route.split("/").filter(Boolean);

  // Remove last segment to get parent path
  const parentSegments = segments.slice(0, -1);
  const parentRoute = "/" + parentSegments.join("/");

  return analysis.existingPages.find((p) => p.route === parentRoute);
}

/**
 * Suggest parent config key for a nested page
 */
export function suggestParentConfigKey(
  route: string,
  analysis: ProjectAnalysis,
): string | undefined {
  const parentPage = findParentPage(route, analysis);

  if (parentPage?.configKey) {
    return parentPage.configKey;
  }

  // Try to infer from route structure
  const segments = route.split("/").filter(Boolean);

  // For /mailchimp/reports/[id]/opens, parent is likely "report-detail"
  if (segments.length >= 3 && segments[segments.length - 2].startsWith("[")) {
    const entityName = segments[segments.length - 3];
    const singularName = entityName.endsWith("s")
      ? entityName.slice(0, -1)
      : entityName;
    return `${singularName}-detail`;
  }

  return undefined;
}

/**
 * Check if route already exists
 */
export function isRouteExisting(
  route: string,
  analysis: ProjectAnalysis,
): boolean {
  return analysis.existingRoutes.includes(route);
}

/**
 * Get all routes at a specific depth
 */
export function getRoutesByDepth(
  depth: number,
  analysis: ProjectAnalysis,
): ExistingPage[] {
  return analysis.existingPages.filter((p) => p.depth === depth);
}
