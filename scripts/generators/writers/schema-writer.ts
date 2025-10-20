/**
 * Schema Writer
 *
 * Transforms API parameter schemas to UI schemas by:
 * - Reading API params schema
 * - Stripping API-only fields (fields, exclude_fields, sort_field, sort_dir)
 * - Keeping pagination fields transformed to UI format (count/offset → page/perPage)
 * - Writing to src/schemas/components/mailchimp/[name]-page-params.ts
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import type { PageConfig } from "@/generation/page-configs";

/**
 * Generate UI schema content from API schema
 */
function generateUiSchemaContent(
  config: PageConfig,
  configKey: string,
): string {
  const { schemas, route, page } = config;
  const hasParams = route.params && route.params.length > 0;

  // Read API schema file
  const apiSchemaPath = resolve(process.cwd(), schemas.apiParams);
  const apiSchemaContent = readFileSync(apiSchemaPath, "utf-8");

  // Extract schema name from API schema
  const apiSchemaName = extractSchemaName(schemas.apiParams);

  // Generate page params schema (route params)
  const pageParamsSchema = hasParams
    ? generatePageParamsSchema(config, apiSchemaName)
    : null;

  // Generate page search params schema (query params)
  const pageSearchParamsSchema = config.ui.hasPagination
    ? generatePageSearchParamsSchema(apiSchemaContent)
    : null;

  // Build file content
  const header = `/**
 * ${page.title} Page Params Schemas
 * Validation schemas for ${configKey} page params and search params
 */

import { z } from "zod";`;

  const schemaDefinitions = [pageParamsSchema, pageSearchParamsSchema]
    .filter(Boolean)
    .join("\n\n");

  const types = generateTypeExports(
    hasParams,
    config.ui.hasPagination,
    apiSchemaName,
  );

  return `${header}\n\n${schemaDefinitions}\n\n${types}\n`;
}

/**
 * Extract schema name from file path
 */
function extractSchemaName(schemaPath: string): string {
  const fileName = schemaPath.split("/").pop() || "";
  // Convert kebab-case to PascalCase
  return fileName
    .replace(".schema.ts", "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * Generate page params schema (route params)
 */
function generatePageParamsSchema(
  config: PageConfig,
  _apiSchemaName: string,
): string {
  const paramName = config.route.params![0];
  const schemaName = `${toCamelCase(config.page.title)}PageParamsSchema`;

  // Generate description based on param name
  const descriptions: Record<string, string> = {
    id: "Campaign ID is required",
    listId: "List ID is required",
    memberId: "Member ID is required",
  };

  const description =
    descriptions[paramName] || `${paramName} parameter is required`;

  return `/**
 * Schema for ${config.page.title.toLowerCase()} page route params
 * Validates the ${paramName} from the URL
 */
export const ${schemaName} = z.object({
  ${paramName}: z.string().min(1, "${description}"),
});`;
}

/**
 * Generate page search params schema (query params)
 */
function generatePageSearchParamsSchema(_apiSchemaContent: string): string {
  // For now, generate standard pagination schema
  // In the future, could parse API schema to detect additional filters
  return `/**
 * Schema for page search params
 * Validates pagination parameters only
 */
export const pageSearchParamsSchema = z.object({
  page: z.string().optional(),
  perPage: z.string().optional(),
});`;
}

/**
 * Generate TypeScript type exports
 */
function generateTypeExports(
  hasParams: boolean,
  hasPagination: boolean | undefined,
  apiSchemaName: string,
): string {
  const types: string[] = [
    "/**",
    " * Inferred TypeScript types from schemas",
    " */",
  ];

  if (hasParams) {
    const paramsTypeName = `${apiSchemaName}PageParams`;
    const schemaName = `${toCamelCase(apiSchemaName)}PageParamsSchema`;
    types.push(
      `export type ${paramsTypeName} = z.infer<typeof ${schemaName}>;`,
    );
  }

  if (hasPagination) {
    types.push(
      `export type PageSearchParams = z.infer<typeof pageSearchParamsSchema>;`,
    );
  }

  return types.join("\n");
}

/**
 * Convert string to camelCase
 */
function toCamelCase(str: string): string {
  return str
    .replace(/\s+/g, "")
    .split("")
    .map((char, index) => (index === 0 ? char.toLowerCase() : char))
    .join("");
}

/**
 * Get output path for UI schema
 */
function getOutputPath(configKey: string): string {
  const fileName = `${configKey}-page-params.ts`;
  return resolve(
    process.cwd(),
    `src/schemas/components/mailchimp/${fileName}`,
  );
}

/**
 * Write UI schema files to disk
 */
export function writeSchemaFiles(
  config: PageConfig,
  configKey: string,
): {
  files: string[];
  warnings: string[];
} {
  const files: string[] = [];
  const warnings: string[] = [];

  // Generate UI schema content
  const schemaContent = generateUiSchemaContent(config, configKey);

  // Get output path
  const outputPath = getOutputPath(configKey);

  // Create directory if it doesn't exist
  const dir = dirname(outputPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  // Check if file already exists
  if (existsSync(outputPath)) {
    warnings.push(`Schema file already exists: ${outputPath}`);
    warnings.push("Skipping schema generation to avoid overwriting");
    return { files, warnings };
  }

  // Write schema file
  writeFileSync(outputPath, schemaContent, "utf-8");
  files.push(outputPath);

  return { files, warnings };
}
