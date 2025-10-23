/**
 * Page Generation Configuration Registry
 *
 * This file defines the PageConfig interface and central registry for page generation.
 * Metadata stored here is used ONLY during code generation (not at runtime).
 *
 * Usage:
 * 1. Developer creates API schemas manually (pure Zod)
 * 2. Developer runs CLI: `pnpm generate:page`
 * 3. CLI prompts for config metadata
 * 4. Config is saved to this registry
 * 5. Generator creates complete working page + infrastructure
 *
 * @see docs/execution-plans/page-generator-execution-plan.md
 * @see src/generation/README.md
 */

/**
 * HTTP Methods supported by the generator
 */
export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

/**
 * Page types for route generation
 */
export type PageType = "list" | "detail" | "nested-detail";

/**
 * Page Generation Configuration Interface
 *
 * All fields support smart defaults and auto-detection from schemas.
 * The interactive CLI will suggest values based on schema analysis.
 */
export interface PageConfig {
  /**
   * Schema References
   *
   * Paths to existing schema files (must be created before generation)
   */
  schemas: {
    /**
     * API params schema path
     * @example "src/schemas/mailchimp/clicks-params.schema.ts"
     */
    apiParams: string;

    /**
     * API response schema path
     * @example "src/schemas/mailchimp/clicks-success.schema.ts"
     */
    apiResponse: string;

    /**
     * API error schema path (optional)
     * @default "src/schemas/mailchimp/common/error.schema.ts"
     */
    apiError?: string;
  };

  /**
   * Route Configuration
   *
   * Next.js route structure and dynamic parameters
   */
  route: {
    /**
     * Next.js route path with dynamic segments
     * @example "/mailchimp/reports/[id]/clicks"
     * @autoDetect Inferred from schema param names (campaign_id → [id])
     */
    path: string;

    /**
     * Dynamic route parameters
     * @example ["id"]
     * @autoDetect Extracted from route path
     */
    params?: string[];
  };

  /**
   * API Configuration
   *
   * Mailchimp API endpoint details
   */
  api: {
    /**
     * Mailchimp API endpoint path
     * @example "/reports/{campaign_id}/click-details"
     * @autoDetect Suggested from route path + API conventions
     */
    endpoint: string;

    /**
     * HTTP method
     * @autoDetect GET if schema has only params, POST if has body field
     */
    method: HttpMethod;

    /**
     * DAL method name (optional)
     * @example "fetchCampaignClickDetails"
     * @autoGenerate Converted from endpoint to camelCase
     */
    dalMethod?: string;
  };

  /**
   * Page Metadata
   *
   * Page display information and characteristics
   */
  page: {
    /**
     * Page type determines generation pattern
     * @autoDetect Based on route depth and structure
     * - list: Top-level list page with pagination
     * - detail: Detail page with [id] param
     * - nested-detail: Nested detail page (e.g., /reports/[id]/clicks)
     */
    type: PageType;

    /**
     * Page title (displayed in header)
     * @example "Click Details"
     * @autoGenerate From route path last segment
     */
    title: string;

    /**
     * Page description (displayed below title)
     * @example "Members who clicked links in this campaign"
     */
    description: string;

    /**
     * Feature tags for JSDoc @features
     * @example ["Pagination", "Dynamic routing", "Member details"]
     * @autoSuggest Based on detected capabilities
     */
    features: string[];
  };

  /**
   * UI Configuration
   *
   * User interface behavior and navigation
   */
  ui: {
    /**
     * Whether page supports pagination
     * @autoDetect Checks for count/offset or page/perPage in schema
     */
    hasPagination: boolean;

    /**
     * Breadcrumb configuration
     */
    breadcrumbs: {
      /**
       * Parent page config key (for nested pages)
       * @example "report-detail"
       * @autoDetect From route hierarchy
       */
      parent?: string;

      /**
       * Breadcrumb label
       * @example "Clicks"
       * @autoGenerate From route path last segment
       */
      label: string;
    };
  };
}

/**
 * Central Registry of Page Configurations
 *
 * Add new page configs here. Use `satisfies PageConfig` for type safety.
 * Run `pnpm generate:page <key>` to generate files from a config.
 *
 * Example workflow:
 * 1. Create schemas: clicks-params.schema.ts, clicks-success.schema.ts
 * 2. Run: pnpm generate:page
 * 3. CLI prompts guide you through config creation
 * 4. Config is added here automatically
 * 5. Generator creates complete working page
 */
export const pageConfigs = {
  /**
   * Example: Reports List Page (existing page for reference)
   */
  "reports-list": {
    schemas: {
      apiParams: "src/schemas/mailchimp/reports-params.schema.ts",
      apiResponse: "src/schemas/mailchimp/reports-success.schema.ts",
      apiError: "src/schemas/mailchimp/reports-error.schema.ts",
    },
    route: {
      path: "/mailchimp/reports",
      params: [],
    },
    api: {
      endpoint: "/reports",
      method: "GET",
      dalMethod: "fetchCampaignReports",
    },
    page: {
      type: "list",
      title: "Reports",
      description: "View and analyze your Mailchimp campaign reports",
      features: ["Pagination", "Filtering", "Real-time data"],
    },
    ui: {
      hasPagination: true,
      breadcrumbs: {
        label: "Reports",
      },
    },
  } satisfies PageConfig,

  /**
   * Example: Campaign Opens Page (existing page for reference)
   */
  "report-opens": {
    schemas: {
      apiParams: "src/schemas/mailchimp/report-open-details-params.schema.ts",
      apiResponse:
        "src/schemas/mailchimp/report-open-details-success.schema.ts",
      // apiError omitted - will default to common/error.schema.ts
    },
    route: {
      path: "/mailchimp/reports/[id]/opens",
      params: ["id"],
    },
    api: {
      endpoint: "/reports/{campaign_id}/open-details",
      method: "GET",
      dalMethod: "fetchCampaignOpenList",
    },
    page: {
      type: "nested-detail",
      title: "Campaign Opens",
      description: "Members who opened this campaign",
      features: ["Pagination", "Dynamic routing", "Member details"],
    },
    ui: {
      hasPagination: true,
      breadcrumbs: {
        parent: "report-detail",
        label: "Opens",
      },
    },
  } satisfies PageConfig,

  /**
   * Campaign Unsubscribes Page
   */
  "report-unsubscribes": {
    schemas: {
      apiParams: "src/schemas/mailchimp/unsubscribes-params.schema.ts",
      apiResponse: "src/schemas/mailchimp/unsubscribes-success.schema.ts",
      apiError: "src/schemas/mailchimp/unsubscribes-error.schema.ts",
    },
    route: {
      path: "/mailchimp/reports/[id]/unsubscribes",
      params: ["id"],
    },
    api: {
      endpoint: "/reports/{campaign_id}/unsubscribed",
      method: "GET",
      dalMethod: "fetchCampaignUnsubscribes",
    },
    page: {
      type: "nested-detail",
      title: "Campaign Unsubscribes",
      description: "Members who unsubscribed from this campaign",
      features: [
        "Pagination",
        "Dynamic routing",
        "Member details",
        "Unsubscribe reasons",
      ],
    },
    ui: {
      hasPagination: true,
      breadcrumbs: {
        parent: "report-detail",
        label: "Unsubscribes",
      },
    },
  } satisfies PageConfig,

  /**
   * Campaign Sent To Page
   */
  "report-sent-to": {
    schemas: {
      apiParams: "src/schemas/mailchimp/sent-to-params.schema.ts",
      apiResponse: "src/schemas/mailchimp/sent-to-success.schema.ts",
      apiError: "src/schemas/mailchimp/sent-to-error.schema.ts",
    },
    route: {
      path: "/mailchimp/reports/[id]/sent-to",
      params: ["id"],
    },
    api: {
      endpoint: "/reports/{campaign_id}/sent-to",
      method: "GET",
      dalMethod: "fetchCampaignSentTo",
    },
    page: {
      type: "nested-detail",
      title: "Campaign Recipients",
      description: "Members who received this campaign",
      features: [
        "Pagination",
        "Dynamic routing",
        "Member details",
        "Delivery status",
        "A/B split tracking",
      ],
    },
    ui: {
      hasPagination: true,
      breadcrumbs: {
        parent: "report-detail",
        label: "Recipients",
      },
    },
  } satisfies PageConfig,

  /**
   * Campaign Location Activity Page
   */
  "report-location-activity": {
    schemas: {
      apiParams: "src/schemas/mailchimp/location-activity-params.schema.ts",
      apiResponse: "src/schemas/mailchimp/location-activity-success.schema.ts",
      apiError: "src/schemas/mailchimp/location-activity-error.schema.ts",
    },
    route: {
      path: "/mailchimp/reports/[id]/locations",
      params: ["id"],
    },
    api: {
      endpoint: "/reports/{campaign_id}/locations",
      method: "GET",
      dalMethod: "fetchCampaignLocationActivity",
    },
    page: {
      type: "nested-detail",
      title: "Campaign Locations",
      description: "Geographic engagement by location",
      features: [
        "Pagination",
        "Dynamic routing",
        "Geographic data",
        "Engagement metrics by location",
      ],
    },
    ui: {
      hasPagination: true,
      breadcrumbs: {
        parent: "report-detail",
        label: "Locations",
      },
    },
  } satisfies PageConfig,
} as const;

/**
 * Type-safe config key lookup
 */
export type PageConfigKey = keyof typeof pageConfigs;

/**
 * Get a page config by key with type safety
 */
export function getPageConfig(key: PageConfigKey): PageConfig {
  return pageConfigs[key];
}

/**
 * Get all page config keys
 */
export function getPageConfigKeys(): PageConfigKey[] {
  return Object.keys(pageConfigs) as PageConfigKey[];
}

/**
 * Check if a config key exists
 */
export function hasPageConfig(key: string): key is PageConfigKey {
  return key in pageConfigs;
}
