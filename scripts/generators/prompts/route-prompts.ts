/**
 * Route Configuration Prompts
 *
 * Prompts user for route configuration with smart defaults from schema analysis.
 * Auto-detects route type, parameters, and page metadata.
 */

import * as clack from "@clack/prompts";
import type { PageType } from "@/generation/page-configs";

/**
 * Route configuration from user prompts
 */
export interface RouteConfig {
  path: string;
  params?: string[];
  type: PageType;
  title: string;
  description: string;
  features: string[];
}

/**
 * Extract route parameters from path
 * @example "/mailchimp/reports/[id]/clicks" → ["id"]
 */
function extractRouteParams(path: string): string[] {
  const matches = path.match(/\[([^\]]+)\]/g);
  if (!matches) return [];
  return matches.map((m) => m.slice(1, -1));
}

/**
 * Detect page type from route path
 */
function detectPageType(path: string): PageType {
  const segments = path.split("/").filter(Boolean);
  const hasDynamicSegment = path.includes("[");

  if (!hasDynamicSegment) {
    return "list";
  }

  // Count segments after the dynamic segment
  const dynamicIndex = segments.findIndex((s) => s.includes("["));
  const segmentsAfterDynamic = segments.length - dynamicIndex - 1;

  return segmentsAfterDynamic > 0 ? "nested-detail" : "detail";
}

/**
 * Generate page title from route path
 * @example "/mailchimp/reports/[id]/clicks" → "Clicks"
 */
function generatePageTitle(path: string): string {
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
 * Suggest features based on page type and route
 */
function suggestFeatures(type: PageType, hasDynamic: boolean): string[] {
  const features: string[] = [];

  if (type === "list") {
    features.push("Pagination", "Filtering", "Real-time data");
  }

  if (hasDynamic) {
    features.push("Dynamic routing");
  }

  if (type === "nested-detail") {
    features.push("Member details");
  }

  return features;
}

/**
 * Prompt user for route configuration
 */
export async function routePrompts(): Promise<RouteConfig> {
  clack.log.info("Configure the Next.js route for this page.");

  // Route path
  const path = await clack.text({
    message: "Next.js route path (with [id] for dynamic segments):",
    placeholder: "/mailchimp/reports/[id]/clicks",
    validate: (value) => {
      if (!value) return "Route path is required";
      if (!value.startsWith("/")) return "Route path must start with '/'";
      if (!value.startsWith("/mailchimp/")) {
        return "Route path must start with '/mailchimp/'";
      }
      return undefined;
    },
  });

  if (clack.isCancel(path)) {
    throw new Error("Operation cancelled");
  }

  // Auto-detect route parameters
  const params = extractRouteParams(path);
  if (params.length > 0) {
    clack.log.info(`✓ Detected route parameters: ${params.join(", ")}`);
  }

  // Auto-detect page type
  const detectedType = detectPageType(path);
  const type = (await clack.select({
    message: "Page type:",
    options: [
      {
        value: "list",
        label: "List - Top-level list page with pagination",
        hint: detectedType === "list" ? "auto-detected" : undefined,
      },
      {
        value: "detail",
        label: "Detail - Detail page with [id] param",
        hint: detectedType === "detail" ? "auto-detected" : undefined,
      },
      {
        value: "nested-detail",
        label: "Nested Detail - Nested under another detail page",
        hint: detectedType === "nested-detail" ? "auto-detected" : undefined,
      },
    ],
    initialValue: detectedType,
  })) as PageType;

  if (clack.isCancel(type)) {
    throw new Error("Operation cancelled");
  }

  // Generate suggested title
  const suggestedTitle = generatePageTitle(path);
  const title = await clack.text({
    message: "Page title (displayed in header):",
    placeholder: suggestedTitle,
    initialValue: suggestedTitle,
    validate: (value) => {
      if (!value) return "Page title is required";
      return undefined;
    },
  });

  if (clack.isCancel(title)) {
    throw new Error("Operation cancelled");
  }

  // Page description
  const description = await clack.text({
    message: "Page description (displayed below title):",
    placeholder: `Members who clicked links in this campaign`,
    validate: (value) => {
      if (!value) return "Page description is required";
      return undefined;
    },
  });

  if (clack.isCancel(description)) {
    throw new Error("Operation cancelled");
  }

  // Features
  const suggestedFeatures = suggestFeatures(type, params.length > 0);
  const featuresInput = await clack.text({
    message: "Page features (comma-separated for JSDoc @features):",
    placeholder: suggestedFeatures.join(", "),
    initialValue: suggestedFeatures.join(", "),
    validate: (value) => {
      if (!value) return "At least one feature is required";
      return undefined;
    },
  });

  if (clack.isCancel(featuresInput)) {
    throw new Error("Operation cancelled");
  }

  const features = featuresInput.split(",").map((f) => f.trim());

  clack.log.success("✓ Route configuration complete");

  return {
    path,
    params: params.length > 0 ? params : undefined,
    type,
    title,
    description,
    features,
  };
}
