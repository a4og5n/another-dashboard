/**
 * Programmatic API for generating pages from PageConfig
 *
 * This module provides a non-interactive way to generate pages,
 * ideal for AI-assisted workflows and automation.
 */

import type { PageConfig } from "@/generation/page-configs";
import type { GenerationResult } from "./types";
import { writePageFiles } from "../writers/page-writer";
import { writeSchemaFiles } from "../writers/schema-writer";
import { writeComponentFiles } from "../writers/component-writer";
import { writeDalMethod } from "../writers/dal-writer";
import { writeBreadcrumb } from "../writers/breadcrumb-writer";
import { writeMetadataHelper } from "../writers/metadata-writer";
import { validateConfig } from "./validators";

/**
 * Generate a complete page from a PageConfig
 *
 * This is the core programmatic API that bypasses interactive prompts.
 * All writers are called in sequence to generate the full page infrastructure.
 *
 * @param config - Complete page configuration
 * @param configKey - Unique key for this page configuration
 * @returns Generation result with files created and warnings
 * @throws Error if configuration is invalid
 *
 * @example
 * ```typescript
 * const config: PageConfig = {
 *   schemas: {
 *     apiParams: "src/schemas/mailchimp/clicks-params.schema.ts",
 *     apiResponse: "src/schemas/mailchimp/clicks-success.schema.ts"
 *   },
 *   route: {
 *     path: "/mailchimp/reports/[id]/clicks",
 *     params: ["id"]
 *   },
 *   api: {
 *     endpoint: "/reports/{campaign_id}/click-details",
 *     method: "GET"
 *   },
 *   page: {
 *     type: "nested-detail",
 *     title: "Click Details",
 *     description: "Members who clicked links in this campaign",
 *     features: ["Pagination", "Dynamic routing"]
 *   },
 *   ui: {
 *     pagination: {
 *       enabled: true,
 *       type: "count-offset"
 *     },
 *     breadcrumbs: {
 *       label: "Clicks",
 *       parent: "report-detail"
 *     }
 *   }
 * };
 *
 * const result = await generatePageFromConfig(config, "report-clicks");
 * console.log(`Generated ${result.files.length} files`);
 * ```
 */
export async function generatePageFromConfig(
  config: PageConfig,
  configKey: string,
): Promise<GenerationResult> {
  // Validate configuration
  const errors = validateConfig(config);
  if (errors.length > 0) {
    throw new Error(
      `Configuration validation failed:\n${errors.map((e) => `  • ${e}`).join("\n")}`,
    );
  }

  // Collect all generated files and warnings
  const allFiles: string[] = [];
  const allWarnings: string[] = [];

  // Generate page files (page.tsx, loading.tsx, not-found.tsx)
  const pageResult = writePageFiles(config, configKey);
  allFiles.push(...pageResult.files);
  allWarnings.push(...pageResult.warnings);

  // Generate UI schema files
  const schemaResult = writeSchemaFiles(config, configKey);
  allFiles.push(...schemaResult.files);
  allWarnings.push(...schemaResult.warnings);

  // Generate placeholder component
  const componentResult = writeComponentFiles(config, configKey);
  allFiles.push(...componentResult.files);
  allWarnings.push(...componentResult.warnings);

  // Add DAL method
  const dalResult = writeDalMethod(config, configKey);
  allFiles.push(...dalResult.files);
  allWarnings.push(...dalResult.warnings);

  // Add breadcrumb function
  const breadcrumbResult = writeBreadcrumb(config, configKey);
  allFiles.push(...breadcrumbResult.files);
  allWarnings.push(...breadcrumbResult.warnings);

  // Add metadata helper
  const metadataResult = writeMetadataHelper(config, configKey);
  allFiles.push(...metadataResult.files);
  allWarnings.push(...metadataResult.warnings);

  return {
    files: allFiles,
    warnings: allWarnings,
    config,
    configKey,
  };
}
