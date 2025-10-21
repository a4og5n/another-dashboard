/**
 * High-level API for generating pages with smart defaults
 *
 * This is the recommended API for AI-assisted workflows.
 * It analyzes schemas and infers sensible defaults, requiring minimal input.
 */

import type { PageConfig } from "@/generation/page-configs";
import type { GeneratePageParams, GenerationResult } from "./types";
import { generatePageFromConfig } from "./generate-from-config";
import { analyzeSchema } from "../analyzers/schema-analyzer";

/**
 * Derive config key from route path
 *
 * @example "/mailchimp/reports/[id]/clicks" → "report-clicks"
 * @example "/mailchimp/lists" → "lists"
 */
function deriveConfigKey(routePath: string): string {
  const segments = routePath.split("/").filter(Boolean);

  // Remove "mailchimp" prefix
  const relevantSegments = segments.slice(1);

  // Remove dynamic segments like [id]
  const staticSegments = relevantSegments.filter((seg) => !seg.startsWith("["));

  // Join with hyphens and convert to singular if last segment
  const key = staticSegments.join("-");

  // Convert plural to singular for last segment if it makes sense
  // e.g., "reports" → "report", but "lists" stays as "lists" for top-level
  if (staticSegments.length > 1 && key.endsWith("s")) {
    return key.slice(0, -1);
  }

  return key;
}

/**
 * Detect page type from route structure
 *
 * @example "/mailchimp/lists" → "list"
 * @example "/mailchimp/reports/[id]" → "detail"
 * @example "/mailchimp/reports/[id]/opens" → "nested-detail"
 */
function detectPageType(
  routePath: string,
): "list" | "detail" | "nested-detail" {
  const segments = routePath.split("/").filter(Boolean);
  const hasDynamicSegments = segments.some((seg) => seg.startsWith("["));

  if (!hasDynamicSegments) {
    return "list";
  }

  // Depth 3 with one param = detail (e.g., /mailchimp/reports/[id])
  // Depth > 3 = nested-detail (e.g., /mailchimp/reports/[id]/opens)
  if (segments.length === 3) {
    return "detail";
  }

  return "nested-detail";
}

/**
 * Extract dynamic params from route path
 *
 * @example "/mailchimp/reports/[id]/clicks" → ["id"]
 * @example "/mailchimp/lists/[listId]/members/[memberId]" → ["listId", "memberId"]
 */
function extractRouteParams(routePath: string): string[] {
  const matches = routePath.match(/\[([^\]]+)\]/g);
  if (!matches) return [];
  return matches.map((match) => match.slice(1, -1));
}

/**
 * Derive breadcrumb label from route path
 *
 * @example "/mailchimp/reports/[id]/clicks" → "Clicks"
 * @example "/mailchimp/lists" → "Lists"
 */
function deriveBreadcrumbLabel(routePath: string): string {
  const segments = routePath.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  // Remove dynamic segment brackets
  const cleanSegment = lastSegment?.replace(/\[|\]/g, "") || "";

  // Convert to title case
  return cleanSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Detect parent breadcrumb for nested pages
 *
 * Attempts to intelligently determine the parent page config key.
 *
 * @example "/mailchimp/reports/[id]/opens" → "report-detail"
 * @example "/mailchimp/lists/[id]/members" → "list-detail"
 */
function detectBreadcrumbParent(routePath: string): string | undefined {
  const segments = routePath.split("/").filter(Boolean);

  // Only nested-detail pages need parents
  if (segments.length <= 3) return undefined;

  // Extract the detail page portion
  // e.g., /mailchimp/reports/[id]/opens → /mailchimp/reports/[id] → "report-detail"
  const parentSegments = segments.slice(1, 3); // Skip "mailchimp", take next 2

  // Convert to config key format
  const resource = parentSegments[0]?.slice(0, -1); // "reports" → "report"
  return `${resource}-detail`;
}

/**
 * Detect suggested features from schema analysis
 */
function detectFeatures(
  analysis: Awaited<ReturnType<typeof analyzeSchema>>,
  pageType: string,
): string[] {
  const features: string[] = [];

  if (pageType !== "list") {
    features.push("Dynamic routing");
  }

  if (analysis.hasPagination) {
    features.push("Pagination");
  }

  if (analysis.hasFilters) {
    features.push("Filtering");
  }

  if (analysis.hasSorting) {
    features.push("Sorting");
  }

  if (analysis.hasDateFilters) {
    features.push("Date filtering");
  }

  // Always add data display
  features.push("Data display");

  return features;
}

/**
 * Generate a complete page from minimal parameters
 *
 * This function analyzes the provided schemas to infer smart defaults,
 * builds a complete PageConfig, and generates all necessary files.
 *
 * **AI-First Workflow:**
 * This is the main entry point for AI-assisted page generation.
 *
 * @param params - Minimal generation parameters
 * @returns Generation result with files created
 * @throws Error if schemas are invalid or generation fails
 *
 * @example
 * ```typescript
 * const result = await generatePage({
 *   apiParamsPath: "src/schemas/mailchimp/report-click-details-params.schema.ts",
 *   apiResponsePath: "src/schemas/mailchimp/report-click-details-success.schema.ts",
 *   routePath: "/mailchimp/reports/[id]/clicks",
 *   pageTitle: "Click Details",
 *   pageDescription: "Members who clicked links in this campaign",
 *   apiEndpoint: "/reports/{campaign_id}/click-details"
 * });
 *
 * console.log(`Generated ${result.files.length} files`);
 * ```
 */
export async function generatePage(
  params: GeneratePageParams,
): Promise<GenerationResult> {
  // Analyze schemas for smart defaults
  const analysis = await analyzeSchema(params.apiParamsPath);

  // Detect route characteristics
  const pageType =
    params.overrides?.pageType || detectPageType(params.routePath);
  const routeParams = extractRouteParams(params.routePath);
  const breadcrumbLabel =
    params.overrides?.breadcrumbLabel ||
    deriveBreadcrumbLabel(params.routePath);
  const breadcrumbParent =
    params.overrides?.breadcrumbParent ||
    (pageType === "nested-detail"
      ? detectBreadcrumbParent(params.routePath)
      : undefined);

  // Determine HTTP method
  const httpMethod =
    params.overrides?.httpMethod || analysis.suggestedHttpMethod;

  // Determine pagination
  const enablePagination =
    params.overrides?.enablePagination ?? analysis.hasPagination;

  // Derive config key
  const configKey = params.configKey || deriveConfigKey(params.routePath);

  // Build features list
  const features =
    params.overrides?.features || detectFeatures(analysis, pageType);

  // Build complete PageConfig
  const config: PageConfig = {
    schemas: {
      apiParams: params.apiParamsPath,
      apiResponse: params.apiResponsePath,
      apiError: params.apiErrorPath,
    },
    route: {
      path: params.routePath,
      params: routeParams.length > 0 ? routeParams : undefined,
    },
    api: {
      endpoint: params.apiEndpoint,
      method: httpMethod,
    },
    page: {
      type: pageType,
      title: params.pageTitle,
      description: params.pageDescription,
      features,
    },
    ui: {
      hasPagination: enablePagination,
      breadcrumbs: {
        label: breadcrumbLabel,
        parent: breadcrumbParent,
      },
    },
  };

  // Generate using the config-based API
  return generatePageFromConfig(config, configKey);
}
