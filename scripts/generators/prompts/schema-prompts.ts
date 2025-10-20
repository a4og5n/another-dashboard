/**
 * Schema Selection Prompts
 *
 * Prompts user to select API schemas for page generation.
 * Validates that schema files exist before proceeding.
 */

import * as clack from "@clack/prompts";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Schema configuration from user prompts
 */
export interface SchemaConfig {
  apiParams: string;
  apiResponse: string;
  apiError?: string;
}

/**
 * Default error schema path
 */
const DEFAULT_ERROR_SCHEMA = "src/schemas/mailchimp/common/error.schema.ts";

/**
 * Validate that a schema file exists
 */
function validateSchemaPath(path: string): string | undefined {
  if (!path) {
    return "Schema path is required";
  }

  if (!path.startsWith("src/schemas/")) {
    return "Schema path must start with 'src/schemas/'";
  }

  if (!path.endsWith(".schema.ts")) {
    return "Schema path must end with '.schema.ts'";
  }

  const absolutePath = resolve(process.cwd(), path);
  if (!existsSync(absolutePath)) {
    return `Schema file not found: ${path}`;
  }

  return undefined;
}

/**
 * Prompt user for schema configuration
 */
export async function schemaPrompts(): Promise<SchemaConfig> {
  clack.log.info(
    "First, specify the API schemas you created for this page.\nSchemas must exist before generating pages.",
  );

  // API Params Schema
  const apiParams = await clack.text({
    message: "API params schema path:",
    placeholder: "src/schemas/mailchimp/clicks-params.schema.ts",
    validate: validateSchemaPath,
  });

  if (clack.isCancel(apiParams)) {
    throw new Error("Operation cancelled");
  }

  // API Response Schema
  const apiResponse = await clack.text({
    message: "API response schema path:",
    placeholder: "src/schemas/mailchimp/clicks-success.schema.ts",
    validate: validateSchemaPath,
  });

  if (clack.isCancel(apiResponse)) {
    throw new Error("Operation cancelled");
  }

  // API Error Schema (optional)
  const useCustomError = await clack.confirm({
    message: `Use custom error schema? (default: ${DEFAULT_ERROR_SCHEMA})`,
    initialValue: false,
  });

  if (clack.isCancel(useCustomError)) {
    throw new Error("Operation cancelled");
  }

  let apiError: string | undefined;

  if (useCustomError) {
    const customError = await clack.text({
      message: "API error schema path:",
      placeholder: "src/schemas/mailchimp/clicks-error.schema.ts",
      validate: validateSchemaPath,
    });

    if (clack.isCancel(customError)) {
      throw new Error("Operation cancelled");
    }

    apiError = customError;
  }

  clack.log.success("✓ Schema configuration validated");

  return {
    apiParams,
    apiResponse,
    apiError,
  };
}
