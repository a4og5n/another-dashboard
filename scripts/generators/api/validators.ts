/**
 * Configuration validation utilities
 *
 * Extracted from the main CLI for reuse in programmatic API
 */

import type { PageConfig } from "@/generation/page-configs";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Validate PageConfig before generation
 *
 * Checks for:
 * - Schema files exist
 * - Route path format is correct
 * - Route params match dynamic segments
 * - Page type matches route structure
 * - API endpoint format is valid
 * - Breadcrumb parent exists for nested pages
 *
 * @param config - Page configuration to validate
 * @returns Array of error messages (empty if valid)
 */
export function validateConfig(config: PageConfig): string[] {
  const errors: string[] = [];

  // Validate schemas exist
  if (!existsSync(resolve(process.cwd(), config.schemas.apiParams))) {
    errors.push(`API params schema not found: ${config.schemas.apiParams}`);
  }
  if (!existsSync(resolve(process.cwd(), config.schemas.apiResponse))) {
    errors.push(`API response schema not found: ${config.schemas.apiResponse}`);
  }
  if (
    config.schemas.apiError &&
    !existsSync(resolve(process.cwd(), config.schemas.apiError))
  ) {
    errors.push(`API error schema not found: ${config.schemas.apiError}`);
  }

  // Validate route path format
  if (!config.route.path.startsWith("/mailchimp/")) {
    errors.push("Route path must start with /mailchimp/");
  }

  // Validate route params match dynamic segments
  const dynamicSegments =
    config.route.path.match(/\[([^\]]+)\]/g)?.map((s) => s.slice(1, -1)) || [];
  const configParams = config.route.params || [];

  if (dynamicSegments.length !== configParams.length) {
    errors.push(
      `Route has ${dynamicSegments.length} dynamic segments but ${configParams.length} params configured`,
    );
  }

  // Validate page type matches route structure
  const hasParams = configParams.length > 0;
  const pathSegments = config.route.path.split("/").filter(Boolean);

  if (config.page.type === "list" && hasParams) {
    errors.push("List page type should not have route params");
  }

  if (
    config.page.type === "detail" &&
    (!hasParams || pathSegments.length > 3)
  ) {
    errors.push(
      "Detail page type should have exactly one param at depth 3 (e.g., /mailchimp/reports/[id])",
    );
  }

  if (config.page.type === "nested-detail" && pathSegments.length <= 3) {
    errors.push(
      "Nested-detail page type should be deeper than depth 3 (e.g., /mailchimp/reports/[id]/opens)",
    );
  }

  // Validate API endpoint format
  if (!config.api.endpoint.startsWith("/")) {
    errors.push("API endpoint must start with /");
  }

  // Validate breadcrumb parent exists for nested pages
  if (config.page.type === "nested-detail" && !config.ui.breadcrumbs.parent) {
    errors.push("Nested-detail pages must specify a breadcrumb parent");
  }

  return errors;
}

/**
 * Check which files will be affected by generation
 *
 * Useful for safety checks and displaying warnings to the user
 *
 * @param config - Page configuration
 * @param configKey - Config key for file naming
 * @returns Object with files to create, modify, and warnings
 */
export function checkFilesWillBeGenerated(
  config: PageConfig,
  configKey: string,
): {
  willCreate: string[];
  willModify: string[];
  warnings: string[];
} {
  const willCreate: string[] = [];
  const willModify: string[] = [];
  const warnings: string[] = [];

  // Page files
  const pageDir = resolve(process.cwd(), `src/app${config.route.path}`);
  const pageFiles = [`${pageDir}/page.tsx`, `${pageDir}/loading.tsx`];

  if (config.page.type === "detail" || config.page.type === "nested-detail") {
    pageFiles.push(`${pageDir}/not-found.tsx`);
  }

  pageFiles.forEach((file) => {
    if (existsSync(file)) {
      willModify.push(file.replace(process.cwd(), "."));
      warnings.push(
        `Page file already exists: ${file.replace(process.cwd(), ".")}`,
      );
    } else {
      willCreate.push(file.replace(process.cwd(), "."));
    }
  });

  // Schema files
  const schemaFile = resolve(
    process.cwd(),
    `src/schemas/components/mailchimp/${configKey}-page-params.ts`,
  );
  if (existsSync(schemaFile)) {
    willModify.push(schemaFile.replace(process.cwd(), "."));
    warnings.push(
      `Schema file already exists: ${schemaFile.replace(process.cwd(), ".")}`,
    );
  } else {
    willCreate.push(schemaFile.replace(process.cwd(), "."));
  }

  // Component file
  const category = config.route.path.split("/")[2] || "common";
  const componentFile = resolve(
    process.cwd(),
    `src/components/mailchimp/${category}/${config.page.title.toLowerCase().replace(/\s+/g, "-")}-content.tsx`,
  );
  if (existsSync(componentFile)) {
    willModify.push(componentFile.replace(process.cwd(), "."));
    warnings.push(
      `Component file already exists: ${componentFile.replace(process.cwd(), ".")}`,
    );
  } else {
    willCreate.push(componentFile.replace(process.cwd(), "."));
  }

  // DAL will always modify existing file
  const dalFile = resolve(process.cwd(), "src/dal/mailchimp.dal.ts");
  willModify.push(dalFile.replace(process.cwd(), "."));

  // Breadcrumb will always modify existing file
  const breadcrumbFile = resolve(
    process.cwd(),
    "src/utils/breadcrumbs/breadcrumb-builder.ts",
  );
  willModify.push(breadcrumbFile.replace(process.cwd(), "."));

  // Metadata will always modify existing files
  const metadataFile = resolve(
    process.cwd(),
    "src/utils/mailchimp/metadata.ts",
  );
  willModify.push(metadataFile.replace(process.cwd(), "."));

  return { willCreate, willModify, warnings };
}
