/**
 * DAL Writer
 *
 * Adds new method to existing DAL file:
 * - Reads existing src/dal/mailchimp.dal.ts
 * - Generates new method based on API config
 * - Uses mailchimpApiCall wrapper
 * - Returns typed response
 * - Appends to class without overwriting existing methods
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { PageConfig } from "@/generation/page-configs";

/**
 * Generate DAL method name from config
 */
function generateDalMethodName(config: PageConfig): string {
  if (config.api.dalMethod) {
    return config.api.dalMethod;
  }

  // Generate from endpoint path
  // /reports/{campaign_id}/click-details → fetchCampaignClickDetails
  const endpoint = config.api.endpoint;
  const parts = endpoint
    .split("/")
    .filter((part) => part && !part.startsWith("{"));

  return (
    "fetch" +
    parts
      .map((part) => {
        // Convert kebab-case to PascalCase
        return part
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join("");
      })
      .join("")
  );
}

/**
 * Generate method signature
 */
function generateMethodSignature(
  config: PageConfig,
  methodName: string,
): string {
  const hasParams = config.route.params && config.route.params.length > 0;
  const hasPagination = config.ui.hasPagination;

  const params: string[] = [];

  // Add route param if exists
  if (hasParams) {
    const paramName = config.route.params![0];
    params.push(`${paramName}: string`);
  }

  // Add query params if pagination
  if (hasPagination) {
    params.push("params?: unknown"); // Will be typed properly with schema
  }

  const paramsStr = params.length > 0 ? params.join(", ") : "";
  const returnType = "ApiResponse<unknown>"; // Will be typed properly with schema

  return `async ${methodName}(${paramsStr}): Promise<${returnType}>`;
}

/**
 * Generate method body
 */
function generateMethodBody(config: PageConfig): string {
  const hasParams = config.route.params && config.route.params.length > 0;
  const hasPagination = config.ui.hasPagination;

  // Build endpoint path
  let endpointPath = config.api.endpoint;

  // Replace path params with template variables
  if (hasParams) {
    const paramName = config.route.params![0];
    endpointPath = endpointPath.replace(/\{[^}]+\}/g, `\${${paramName}}`);
  }

  // Build client call
  const method = config.api.method.toLowerCase();
  const hasQueryParams = hasPagination;

  let clientCall = "";
  if (hasQueryParams) {
    clientCall = `client.${method}<unknown>(\`${endpointPath}\`, params)`;
  } else {
    clientCall = `client.${method}<unknown>(\`${endpointPath}\`)`;
  }

  return `    return mailchimpApiCall((client) => ${clientCall});`;
}

/**
 * Generate complete DAL method
 */
function generateDalMethod(config: PageConfig): string {
  const methodName = generateDalMethodName(config);
  const signature = generateMethodSignature(config, methodName);
  const body = generateMethodBody(config);

  return `  /**
   * ${config.page.title}
   * ${config.api.method} ${config.api.endpoint}
   */
  ${signature} {
${body}
  }`;
}

/**
 * Insert method into DAL class
 */
function insertMethodIntoDAL(dalContent: string, newMethod: string): string {
  // Find the closing brace of the class (before singleton export)
  const classEndPattern = /}\n\n\/\*\*\n \* Singleton instance/;
  const match = dalContent.match(classEndPattern);

  if (!match || match.index === undefined) {
    throw new Error("Could not find class closing brace in DAL file");
  }

  // Insert new method before the closing brace
  const insertPosition = match.index;
  const before = dalContent.slice(0, insertPosition);
  const after = dalContent.slice(insertPosition);

  return `${before}\n${newMethod}\n${after}`;
}

/**
 * Check if method already exists in DAL
 */
function methodExists(dalContent: string, methodName: string): boolean {
  const methodPattern = new RegExp(`async ${methodName}\\(`);
  return methodPattern.test(dalContent);
}

/**
 * Write DAL method to file
 */
export function writeDalMethod(
  config: PageConfig,
  _configKey: string,
): {
  files: string[];
  warnings: string[];
} {
  const files: string[] = [];
  const warnings: string[] = [];

  const dalPath = resolve(process.cwd(), "src/dal/mailchimp.dal.ts");

  // Read existing DAL file
  const dalContent = readFileSync(dalPath, "utf-8");

  // Generate method name
  const methodName = generateDalMethodName(config);

  // Check if method already exists
  if (methodExists(dalContent, methodName)) {
    warnings.push(`DAL method '${methodName}' already exists`);
    warnings.push("Skipping DAL generation to avoid overwriting");
    return { files, warnings };
  }

  // Generate new method
  const newMethod = generateDalMethod(config);

  // Insert method into DAL
  const updatedContent = insertMethodIntoDAL(dalContent, newMethod);

  // Write back to file
  writeFileSync(dalPath, updatedContent, "utf-8");
  files.push(dalPath);

  warnings.push("DAL method uses 'unknown' type - update with proper schemas");
  warnings.push(`Method added: ${methodName}`);

  return { files, warnings };
}
