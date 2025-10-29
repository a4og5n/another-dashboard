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
   * API Root Page
   * Display Mailchimp API metadata, account information, and health status
   */
  "api-root": {
    schemas: {
      apiParams: "src/schemas/mailchimp/root/params.schema.ts",
      apiResponse: "src/schemas/mailchimp/root/success.schema.ts",
      apiError: "src/schemas/mailchimp/root/error.schema.ts",
    },
    route: {
      path: "/mailchimp/api-root",
      params: [],
    },
    api: {
      endpoint: "/",
      method: "GET",
      dalMethod: "fetchApiRoot",
    },
    page: {
      type: "list",
      title: "API Root",
      description: "View Mailchimp API metadata and account information",
      features: [
        "API version and health status",
        "Account information",
        "Total subscribers count",
        "Industry benchmark statistics",
      ],
    },
    ui: {
      hasPagination: false,
      breadcrumbs: {
        label: "API Info",
      },
    },
  } satisfies PageConfig,

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
   * Automations List Page
   * Display and manage marketing automation workflows
   */
  "automations-list": {
    schemas: {
      apiParams: "src/schemas/mailchimp/automations-params.schema.ts",
      apiResponse: "src/schemas/mailchimp/automations-success.schema.ts",
      apiError: "src/schemas/mailchimp/automations-error.schema.ts",
    },
    route: {
      path: "/mailchimp/automations",
      params: [],
    },
    api: {
      endpoint: "/automations",
      method: "GET",
      dalMethod: "fetchAutomations",
    },
    page: {
      type: "list",
      title: "Automations",
      description: "View and manage your automation workflows",
      features: ["Pagination", "Status filtering", "Workflow metrics"],
    },
    ui: {
      hasPagination: true,
      breadcrumbs: {
        label: "Automations",
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

  /**
   * Campaign Advice Page
   */
  "report-advice": {
    schemas: {
      apiParams: "src/schemas/mailchimp/campaign-advice-params.schema.ts",
      apiResponse: "src/schemas/mailchimp/campaign-advice-success.schema.ts",
      apiError: "src/schemas/mailchimp/campaign-advice-error.schema.ts",
    },
    route: {
      path: "/mailchimp/reports/[id]/advice",
      params: ["id"],
    },
    api: {
      endpoint: "/reports/{campaign_id}/advice",
      method: "GET",
      dalMethod: "fetchCampaignAdvice",
    },
    page: {
      type: "nested-detail",
      title: "Campaign Advice",
      description:
        "Feedback and recommendations to improve campaign performance",
      features: [
        "Dynamic routing",
        "Campaign feedback",
        "Performance recommendations",
      ],
    },
    ui: {
      hasPagination: false,
      breadcrumbs: {
        parent: "report-detail",
        label: "Advice",
      },
    },
  } satisfies PageConfig,

  /**
   * Domain Performance Page
   */
  "report-domain-performance": {
    schemas: {
      apiParams: "src/schemas/mailchimp/domain-performance-params.schema.ts",
      apiResponse: "src/schemas/mailchimp/domain-performance-success.schema.ts",
      apiError: "src/schemas/mailchimp/domain-performance-error.schema.ts",
    },
    route: {
      path: "/mailchimp/reports/[id]/domain-performance",
      params: ["id"],
    },
    api: {
      endpoint: "/reports/{campaign_id}/domain-performance",
      method: "GET",
      dalMethod: "fetchDomainPerformance",
    },
    page: {
      type: "nested-detail",
      title: "Domain Performance",
      description:
        "Email provider performance breakdown (Gmail, Outlook, Yahoo, etc.)",
      features: [
        "Dynamic routing",
        "Domain analytics",
        "Deliverability insights",
      ],
    },
    ui: {
      hasPagination: false,
      breadcrumbs: {
        parent: "report-detail",
        label: "Domain Performance",
      },
    },
  } satisfies PageConfig,

  /**
   * List Activity Page
   */
  "list-activity": {
    schemas: {
      apiParams: "src/schemas/mailchimp/list-activity-params.schema.ts",
      apiResponse: "src/schemas/mailchimp/list-activity-success.schema.ts",
      apiError: "src/schemas/mailchimp/list-activity-error.schema.ts",
    },
    route: {
      path: "/mailchimp/lists/[id]/activity",
      params: ["id"],
    },
    api: {
      endpoint: "/lists/{list_id}/activity",
      method: "GET",
      dalMethod: "fetchListActivity",
    },
    page: {
      type: "nested-detail",
      title: "List Activity",
      description: "Recent list activity timeline",
      features: [
        "Dynamic routing",
        "Activity timeline",
        "Subscription tracking",
        "Pagination",
      ],
    },
    ui: {
      hasPagination: true,
      breadcrumbs: {
        parent: "list-detail",
        label: "Activity",
      },
    },
  } satisfies PageConfig,

  /**
   * List Growth History Page
   */
  "list-growth-history": {
    schemas: {
      apiParams: "src/schemas/mailchimp/lists/growth-history/params.schema.ts",
      apiResponse:
        "src/schemas/mailchimp/lists/growth-history/success.schema.ts",
      apiError: "src/schemas/mailchimp/lists/growth-history/error.schema.ts",
    },
    route: {
      path: "/mailchimp/lists/[id]/growth-history",
      params: ["id"],
    },
    api: {
      endpoint: "/lists/{list_id}/growth-history",
      method: "GET",
      dalMethod: "fetchListGrowthHistory",
    },
    page: {
      type: "nested-detail",
      title: "List Growth History",
      description: "Historical growth data showing list size over time",
      features: [
        "Dynamic routing",
        "Monthly growth tracking",
        "Subscriber trends",
        "Pagination",
      ],
    },
    ui: {
      hasPagination: true,
      breadcrumbs: {
        parent: "list-detail",
        label: "Growth History",
      },
    },
  } satisfies PageConfig,

  /**
   * List Members Page
   */
  "list-members": {
    schemas: {
      apiParams: "src/schemas/mailchimp/lists/members/params.schema.ts",
      apiResponse: "src/schemas/mailchimp/lists/members/success.schema.ts",
      apiError: "src/schemas/mailchimp/lists/members/error.schema.ts",
    },
    route: {
      path: "/mailchimp/lists/[id]/members",
      params: ["id"],
    },
    api: {
      endpoint: "/lists/{list_id}/members",
      method: "GET",
      dalMethod: "fetchListMembers",
    },
    page: {
      type: "nested-detail",
      title: "List Members",
      description: "View and manage members in this list",
      features: [
        "Dynamic routing",
        "Pagination",
        "Member filtering",
        "Status tracking",
        "VIP management",
        "Engagement metrics",
      ],
    },
    ui: {
      hasPagination: true,
      breadcrumbs: {
        parent: "list-detail",
        label: "Members",
      },
    },
  } satisfies PageConfig,

  /**
   * Member Info Page
   */
  "member-info": {
    schemas: {
      apiParams: "src/schemas/mailchimp/lists/member-info/params.schema.ts",
      apiResponse: "src/schemas/mailchimp/lists/member-info/success.schema.ts",
      apiError: "src/schemas/mailchimp/lists/member-info/error.schema.ts",
    },
    route: {
      path: "/mailchimp/lists/[id]/members/[subscriber_hash]",
      params: ["id", "subscriber_hash"],
    },
    api: {
      endpoint: "/lists/{list_id}/members/{subscriber_hash}",
      method: "GET",
      dalMethod: "fetchMemberInfo",
    },
    page: {
      type: "nested-detail",
      title: "Member Profile",
      description:
        "Complete member profile with subscription details and engagement metrics",
      features: [
        "Dynamic routing",
        "Member profile",
        "Subscription status",
        "Engagement statistics",
        "Tags and interests",
        "Marketing permissions",
        "Location data",
      ],
    },
    ui: {
      hasPagination: false,
      breadcrumbs: {
        parent: "list-members",
        label: "Member Profile",
      },
    },
  } satisfies PageConfig,

  /**
   * Search Members Page
   * Global search across all lists for members by email, first name, or last name
   */
  "search-members": {
    schemas: {
      apiParams: "src/schemas/mailchimp/search-members-params.schema.ts",
      apiResponse: "src/schemas/mailchimp/search-members-success.schema.ts",
      apiError: "src/schemas/mailchimp/search-members-error.schema.ts",
    },
    route: {
      path: "/mailchimp/search/members",
      params: [],
    },
    api: {
      endpoint: "/search-members",
      method: "GET",
      dalMethod: "searchMembers",
    },
    page: {
      type: "list",
      title: "Search Members",
      description:
        "Search for members across all lists by email, first name, or last name",
      features: [
        "Global search",
        "Exact matches",
        "Full-text search",
        "Member details",
      ],
    },
    ui: {
      hasPagination: false,
      breadcrumbs: {
        label: "Search Members",
      },
    },
  } satisfies PageConfig,

  /**
   * List Interest Categories Page
   */
  "list-interest-categories": {
    schemas: {
      apiParams:
        "src/schemas/mailchimp/lists/interest-categories/params.schema.ts",
      apiResponse:
        "src/schemas/mailchimp/lists/interest-categories/success.schema.ts",
      apiError:
        "src/schemas/mailchimp/lists/interest-categories/error.schema.ts",
    },
    route: {
      path: "/mailchimp/lists/[id]/interest-categories",
      params: ["id"],
    },
    api: {
      endpoint: "/lists/{list_id}/interest-categories",
      method: "GET",
      dalMethod: "fetchListInterestCategories",
    },
    page: {
      type: "nested-detail",
      title: "Interest Categories",
      description: "Subscription preference groups for list members",
      features: [
        "Pagination",
        "Dynamic routing",
        "Category types",
        "Display order",
      ],
    },
    ui: {
      hasPagination: true,
      breadcrumbs: {
        parent: "list-detail",
        label: "Interest Categories",
      },
    },
  } satisfies PageConfig,

  "interest-category-info": {
    schemas: {
      apiParams:
        "src/schemas/mailchimp/lists/interest-categories/[interest_category_id]/params.schema.ts",
      apiResponse:
        "src/schemas/mailchimp/lists/interest-categories/[interest_category_id]/success.schema.ts",
      apiError:
        "src/schemas/mailchimp/lists/interest-categories/[interest_category_id]/error.schema.ts",
    },
    route: {
      path: "/mailchimp/lists/[id]/interest-categories/[interest_category_id]",
      params: ["id", "interest_category_id"],
    },
    api: {
      endpoint: "/lists/{list_id}/interest-categories/{interest_category_id}",
      method: "GET",
      dalMethod: "fetchInterestCategoryInfo",
    },
    page: {
      type: "nested-detail",
      title: "Interest Category Info",
      description: "Details for a specific interest category",
      features: ["Dynamic routing", "Category details", "Type display"],
    },
    ui: {
      hasPagination: false,
      breadcrumbs: {
        parent: "list-interest-categories",
        label: "Category Info",
      },
    },
  } satisfies PageConfig,

  "list-interests": {
    schemas: {
      apiParams: "src/schemas/mailchimp/lists/interests/params.schema.ts",
      apiResponse: "src/schemas/mailchimp/lists/interests/success.schema.ts",
      apiError: "src/schemas/mailchimp/lists/interests/error.schema.ts",
    },
    route: {
      path: "/mailchimp/lists/[id]/interest-categories/[interest_category_id]/interests",
      params: ["id", "interest_category_id"],
    },
    api: {
      endpoint:
        "/lists/{list_id}/interest-categories/{interest_category_id}/interests",
      method: "GET",
      dalMethod: "fetchListInterests",
    },
    page: {
      type: "nested-detail",
      title: "Interests in Category",
      description: "Individual interests within an interest category",
      features: [
        "Pagination",
        "Dynamic routing",
        "Subscriber counts",
        "Display order",
      ],
    },
    ui: {
      hasPagination: true,
      breadcrumbs: {
        parent: "list-interest-categories",
        label: "Interests",
      },
    },
  } satisfies PageConfig,

  /**
   * Landing Pages List Page
   * View and manage Mailchimp landing pages
   */
  "landing-pages-list": {
    schemas: {
      apiParams: "src/schemas/mailchimp/landing-pages-params.schema.ts",
      apiResponse: "src/schemas/mailchimp/landing-pages-success.schema.ts",
      apiError: "src/schemas/mailchimp/landing-pages-error.schema.ts",
    },
    route: {
      path: "/mailchimp/landing-pages",
      params: [],
    },
    api: {
      endpoint: "/landing-pages",
      method: "GET",
      dalMethod: "fetchLandingPages",
    },
    page: {
      type: "list",
      title: "Landing Pages",
      description: "View and track your Mailchimp landing pages",
      features: [
        "Pagination",
        "Status badges",
        "Performance metrics",
        "Sort by date",
      ],
    },
    ui: {
      hasPagination: true,
      breadcrumbs: {
        label: "Landing Pages",
      },
    },
  } satisfies PageConfig,

  landingPageInfo: {
    schemas: {
      apiParams:
        "src/schemas/mailchimp/landing-pages/[page_id]/params.schema.ts",
      apiResponse:
        "src/schemas/mailchimp/landing-pages/[page_id]/success.schema.ts",
      apiError: "src/schemas/mailchimp/landing-pages/[page_id]/error.schema.ts",
    },
    route: {
      path: "/mailchimp/landing-pages/[page_id]",
      params: ["page_id"],
    },
    api: {
      endpoint: "/landing-pages/{page_id}",
      method: "GET",
      dalMethod: "fetchLandingPageInfo",
    },
    page: {
      type: "detail",
      title: "Landing Page Details",
      description: "View detailed information about this landing page",
      features: [
        "Landing page status",
        "Publication details",
        "Performance metrics",
        "Tracking settings",
      ],
    },
    ui: {
      hasPagination: false,
      breadcrumbs: {
        label: "{name}",
        parent: "landingPages",
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
