/**
 * Schema Analyzer
 *
 * Analyzes Zod schema files to extract information for smart defaults:
 * - Detects pagination fields (count/offset or page/perPage)
 * - Detects path parameters (campaign_id, list_id, etc.)
 * - Suggests HTTP method based on schema structure
 * - Detects filter/sort capabilities
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Result of schema analysis
 */
export interface SchemaAnalysis {
  hasPagination: boolean;
  paginationType: "count-offset" | "page-perPage" | null;
  pathParams: string[];
  hasFilters: boolean;
  hasSorting: boolean;
  hasDateFilters: boolean;
  suggestedHttpMethod: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
}

/**
 * Analyze a schema file and extract metadata
 */
export function analyzeSchema(schemaPath: string): SchemaAnalysis {
  try {
    const absolutePath = resolve(process.cwd(), schemaPath);
    const content = readFileSync(absolutePath, "utf-8");

    return {
      hasPagination: detectPagination(content),
      paginationType: detectPaginationType(content),
      pathParams: detectPathParams(content),
      hasFilters: detectFilters(content),
      hasSorting: detectSorting(content),
      hasDateFilters: detectDateFilters(content),
      suggestedHttpMethod: suggestHttpMethod(content),
    };
  } catch (_error) {
    // Return empty analysis if file can't be read
    return {
      hasPagination: false,
      paginationType: null,
      pathParams: [],
      hasFilters: false,
      hasSorting: false,
      hasDateFilters: false,
      suggestedHttpMethod: "GET",
    };
  }
}

/**
 * Detect if schema has pagination fields
 */
function detectPagination(content: string): boolean {
  const paginationPatterns = [
    /count\s*:/,
    /offset\s*:/,
    /page\s*:/,
    /perPage\s*:/,
    /per_page\s*:/,
    /limit\s*:/,
  ];

  return paginationPatterns.some((pattern) => pattern.test(content));
}

/**
 * Detect pagination type
 */
function detectPaginationType(
  content: string,
): "count-offset" | "page-perPage" | null {
  const hasCount = /count\s*:/.test(content);
  const hasOffset = /offset\s*:/.test(content);
  const hasPage = /page\s*:/.test(content);
  const hasPerPage = /(perPage|per_page)\s*:/.test(content);

  if (hasCount && hasOffset) {
    return "count-offset";
  }

  if (hasPage && hasPerPage) {
    return "page-perPage";
  }

  return null;
}

/**
 * Detect path parameters from schema
 * Looks for patterns like campaign_id, list_id, etc.
 */
function detectPathParams(content: string): string[] {
  const params: string[] = [];

  // Match parameter names ending in _id
  const idParamPattern = /(\w+_id)\s*:/g;
  let match;

  while ((match = idParamPattern.exec(content)) !== null) {
    const param = match[1];
    if (!params.includes(param)) {
      params.push(param);
    }
  }

  return params;
}

/**
 * Detect if schema has filter capabilities
 */
function detectFilters(content: string): boolean {
  const filterPatterns = [
    /fields\s*:/,
    /exclude_fields\s*:/,
    /type\s*:/,
    /status\s*:/,
    /folder_id\s*:/,
  ];

  return filterPatterns.some((pattern) => pattern.test(content));
}

/**
 * Detect if schema has sorting capabilities
 */
function detectSorting(content: string): boolean {
  const sortPatterns = [/sort_field\s*:/, /sort_dir\s*:/, /order\s*:/];

  return sortPatterns.some((pattern) => pattern.test(content));
}

/**
 * Detect if schema has date filtering
 */
function detectDateFilters(content: string): boolean {
  const datePatterns = [
    /before_send_time\s*:/,
    /since_send_time\s*:/,
    /since\s*:/,
    /before\s*:/,
    /start_date\s*:/,
    /end_date\s*:/,
  ];

  return datePatterns.some((pattern) => pattern.test(content));
}

/**
 * Suggest HTTP method based on schema structure
 */
function suggestHttpMethod(
  content: string,
): "GET" | "POST" | "PATCH" | "PUT" | "DELETE" {
  // Look for body/data fields (suggests POST/PATCH/PUT)
  const hasBody = /body\s*:/.test(content);
  const hasData = /data\s*:/.test(content);

  // Look for update-related fields (suggests PATCH)
  const hasUpdateFields = /status\s*:/.test(content) && hasBody;

  // Look for create-related fields (suggests POST)
  const hasCreateFields = /name\s*:/.test(content) && hasBody;

  if (hasUpdateFields) {
    return "PATCH";
  }

  if (hasCreateFields) {
    return "POST";
  }

  if (hasBody || hasData) {
    return "POST";
  }

  // Default to GET for schemas with only query/path params
  return "GET";
}

/**
 * Get human-readable description of schema capabilities
 */
export function getSchemaDescription(analysis: SchemaAnalysis): string {
  const features: string[] = [];

  if (analysis.hasPagination) {
    features.push(`Pagination (${analysis.paginationType || "detected"})`);
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

  if (analysis.pathParams.length > 0) {
    features.push(`Path params: ${analysis.pathParams.join(", ")}`);
  }

  return features.length > 0
    ? features.join(", ")
    : "No special capabilities detected";
}
