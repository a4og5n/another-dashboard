/**
 * UI Configuration Prompts
 *
 * Prompts user for UI configuration with smart defaults.
 * Auto-detects pagination from schema and generates breadcrumb config.
 */

import * as clack from "@clack/prompts";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SchemaConfig } from "./schema-prompts";
import type { RouteConfig } from "./route-prompts";

/**
 * UI configuration from user prompts
 */
export interface UiConfig {
  hasPagination: boolean;
  breadcrumbs: {
    parent?: string;
    label: string;
  };
}

/**
 * Detect pagination from schema file
 * Looks for count/offset or page/perPage fields
 */
function detectPagination(schemaPath: string): boolean {
  try {
    const absolutePath = resolve(process.cwd(), schemaPath);
    const content = readFileSync(absolutePath, "utf-8");

    // Look for common pagination field names
    const paginationPatterns = [
      /count\s*:/,
      /offset\s*:/,
      /page\s*:/,
      /perPage\s*:/,
      /per_page\s*:/,
      /limit\s*:/,
    ];

    return paginationPatterns.some((pattern) => pattern.test(content));
  } catch {
    return false;
  }
}

/**
 * Generate breadcrumb label from route path
 * @example "/mailchimp/reports/[id]/clicks" → "Clicks"
 */
function generateBreadcrumbLabel(path: string): string {
  const segments = path.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  // Remove brackets if dynamic segment
  const cleaned = lastSegment.replace(/\[|\]/g, "");

  // Convert to title case
  return cleaned
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Detect parent page from route hierarchy
 * @example "/mailchimp/reports/[id]/clicks" → suggests parent is reports detail page
 */
function detectParentPage(routePath: string, pageType: string): string | null {
  if (pageType !== "nested-detail") {
    return null;
  }

  const segments = routePath.split("/").filter(Boolean);

  // Find the dynamic segment index
  const dynamicIndex = segments.findIndex((s) => s.includes("["));

  if (dynamicIndex === -1 || dynamicIndex === segments.length - 1) {
    return null;
  }

  // Suggest parent is the detail page (segment before dynamic)
  const parentSegment = segments[dynamicIndex - 1];
  return `${parentSegment}-detail`;
}

/**
 * Prompt user for UI configuration
 */
export async function uiPrompts(
  schemaConfig: SchemaConfig,
  routeConfig: RouteConfig,
): Promise<UiConfig> {
  clack.log.info("Configure UI behavior and navigation.");

  // Auto-detect pagination from schema
  const detectedPagination = detectPagination(schemaConfig.apiParams);

  const hasPagination = await clack.confirm({
    message: detectedPagination
      ? "Pagination detected in schema. Enable pagination?"
      : "Enable pagination for this page?",
    initialValue: detectedPagination,
  });

  if (clack.isCancel(hasPagination)) {
    throw new Error("Operation cancelled");
  }

  // Breadcrumb configuration
  const suggestedLabel = generateBreadcrumbLabel(routeConfig.path);

  const breadcrumbLabel = await clack.text({
    message: "Breadcrumb label:",
    placeholder: suggestedLabel,
    initialValue: suggestedLabel,
    validate: (value) => {
      if (!value) return "Breadcrumb label is required";
      return undefined;
    },
  });

  if (clack.isCancel(breadcrumbLabel)) {
    throw new Error("Operation cancelled");
  }

  // Parent page (for nested pages)
  let parent: string | undefined;

  if (routeConfig.type === "nested-detail") {
    const suggestedParent = detectParentPage(
      routeConfig.path,
      routeConfig.type,
    );

    const hasParent = await clack.confirm({
      message: suggestedParent
        ? `Link to parent page? (suggested: ${suggestedParent})`
        : "Link to a parent page in breadcrumbs?",
      initialValue: !!suggestedParent,
    });

    if (clack.isCancel(hasParent)) {
      throw new Error("Operation cancelled");
    }

    if (hasParent) {
      const parentKey = await clack.text({
        message: "Parent page config key:",
        placeholder: suggestedParent || "report-detail",
        initialValue: suggestedParent || undefined,
        validate: (value) => {
          if (!value) return "Parent page key is required";
          if (!/^[a-z0-9-]+$/.test(value)) {
            return "Parent key must contain only lowercase letters, numbers, and hyphens";
          }
          return undefined;
        },
      });

      if (clack.isCancel(parentKey)) {
        throw new Error("Operation cancelled");
      }

      parent = parentKey;
    }
  }

  clack.log.success("✓ UI configuration complete");

  return {
    hasPagination,
    breadcrumbs: {
      parent,
      label: breadcrumbLabel,
    },
  };
}
