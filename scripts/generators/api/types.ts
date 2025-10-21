/**
 * Type definitions for programmatic page generator API
 *
 * These types are used by both the interactive CLI and the programmatic API.
 * Provides a clean, type-safe interface for AI-first development workflows.
 */

import type { PageConfig } from "@/generation/page-configs";

/**
 * Result from page generation
 */
export interface GenerationResult {
  /**
   * Successfully generated files (absolute paths)
   */
  files: string[];

  /**
   * Warnings encountered during generation
   */
  warnings: string[];

  /**
   * The configuration used for generation
   */
  config: PageConfig;

  /**
   * The config key used
   */
  configKey: string;
}

/**
 * Minimal parameters needed to generate a page
 * Smart defaults will be inferred from schema analysis
 */
export interface GeneratePageParams {
  /**
   * Path to API params schema
   * @example "src/schemas/mailchimp/report-click-details-params.schema.ts"
   */
  apiParamsPath: string;

  /**
   * Path to API response schema
   * @example "src/schemas/mailchimp/report-click-details-success.schema.ts"
   */
  apiResponsePath: string;

  /**
   * Path to API error schema (optional)
   * @default "src/schemas/mailchimp/common/error.schema.ts"
   */
  apiErrorPath?: string;

  /**
   * Next.js route path
   * @example "/mailchimp/reports/[id]/clicks"
   */
  routePath: string;

  /**
   * Page title
   * @example "Click Details"
   */
  pageTitle: string;

  /**
   * Page description
   * @example "Members who clicked links in this campaign"
   */
  pageDescription: string;

  /**
   * Mailchimp API endpoint
   * @example "/reports/{campaign_id}/click-details"
   */
  apiEndpoint: string;

  /**
   * Config key for registry (auto-generated if not provided)
   * @example "report-clicks"
   */
  configKey?: string;

  /**
   * Override auto-detected settings (optional)
   */
  overrides?: {
    /**
     * HTTP method (auto-detected from schema if not provided)
     */
    httpMethod?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

    /**
     * Page type (auto-detected from route structure if not provided)
     */
    pageType?: "list" | "detail" | "nested-detail";

    /**
     * Enable pagination (auto-detected from schema if not provided)
     */
    enablePagination?: boolean;

    /**
     * Breadcrumb label (defaults to last route segment if not provided)
     */
    breadcrumbLabel?: string;

    /**
     * Parent breadcrumb config key (required for nested-detail pages)
     */
    breadcrumbParent?: string;

    /**
     * Feature tags for JSDoc
     */
    features?: string[];
  };
}

/**
 * Validation error details
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * File conflict information
 */
export interface FileConflict {
  path: string;
  type: "create" | "modify";
  exists: boolean;
}
