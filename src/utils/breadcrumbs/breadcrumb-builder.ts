/**
 * Breadcrumb Builder Utility
 *
 * Provides a centralized, type-safe way to generate breadcrumb navigation items
 * across the application. Eliminates code duplication and prevents typos in
 * breadcrumb labels and URLs.
 *
 * @example
 * ```tsx
 * import { bc } from "@/utils/breadcrumbs";
 *
 * // Simple static breadcrumbs
 * <BreadcrumbNavigation items={[bc.home, bc.mailchimp, bc.current("Reports")]} />
 *
 * // Breadcrumbs with dynamic IDs
 * <BreadcrumbNavigation
 *   items={[bc.home, bc.mailchimp, bc.reports, bc.report(id), bc.current("Opens")]}
 * />
 * ```
 */

import type { BreadcrumbItem } from "@/types/components/layout";

/**
 * Breadcrumb builder object with static routes, dynamic route functions,
 * and helper functions for creating breadcrumb items
 */
export const bc = {
  // ============================================================================
  // Static Routes
  // ============================================================================

  /**
   * Dashboard home page breadcrumb
   */
  home: {
    label: "Dashboard",
    href: "/",
  } as const satisfies BreadcrumbItem,

  /**
   * Mailchimp section breadcrumb
   */
  mailchimp: {
    label: "Mailchimp",
    href: "/mailchimp",
  } as const satisfies BreadcrumbItem,

  /**
   * Reports list page breadcrumb
   */
  reports: {
    label: "Reports",
    href: "/mailchimp/reports",
  } as const satisfies BreadcrumbItem,

  /**
   * Lists list page breadcrumb
   */
  lists: {
    label: "Lists",
    href: "/mailchimp/lists",
  } as const satisfies BreadcrumbItem,

  /**
   * Automations list page breadcrumb
   */
  automations: {
    label: "Automations",
    href: "/mailchimp/automations",
  } as const satisfies BreadcrumbItem,

  /**
   * General info page breadcrumb
   */
  generalInfo: {
    label: "General Info",
    href: "/mailchimp/general-info",
  } as const satisfies BreadcrumbItem,

  /**
   * Settings section breadcrumb
   */
  settings: {
    label: "Settings",
    href: "/settings",
  } as const satisfies BreadcrumbItem,

  /**
   * Integrations settings page breadcrumb
   */
  integrations: {
    label: "Integrations",
    href: "/settings/integrations",
  } as const satisfies BreadcrumbItem,

  // ============================================================================
  // Dynamic Route Functions
  // ============================================================================

  /**
   * Campaign Advice breadcrumb
   *
   * @param id - ID
   * @returns Breadcrumb item for campaign advice
   *
   * @example
   * ```tsx
   * bc.campaignAdvice("abc123")
   * // Returns: { label: "Advice", href: "/mailchimp/reports/${id}/advice" }
   * ```
   */
  campaignAdvice(id: string): BreadcrumbItem {
    return {
      label: "Advice",
      href: `/mailchimp/reports/${id}/advice`,
    };
  },

  /**
   * Landing Pages breadcrumb
   */
  landingPages: {
    label: "Landing Pages",
    href: "/mailchimp/landing-pages",
  } as const satisfies BreadcrumbItem,

  /**
   * Campaign Locations breadcrumb
   *
   * @param id - ID
   * @returns Breadcrumb item for campaign locations
   *
   * @example
   * ```tsx
   * bc.campaignLocations("abc123")
   * // Returns: { label: "Locations", href: "/mailchimp/reports/${id}/locations" }
   * ```
   */
  campaignLocations(id: string): BreadcrumbItem {
    return {
      label: "Locations",
      href: `/mailchimp/reports/${id}/locations`,
    };
  },

  /**
   * Campaign Recipients breadcrumb
   *
   * @param id - ID
   * @returns Breadcrumb item for campaign recipients
   *
   * @example
   * ```tsx
   * bc.campaignRecipients("abc123")
   * // Returns: { label: "Recipients", href: "/mailchimp/reports/${id}/sent-to" }
   * ```
   */
  campaignRecipients(id: string): BreadcrumbItem {
    return {
      label: "Recipients",
      href: `/mailchimp/reports/${id}/sent-to`,
    };
  },

  /**
   * Campaign Unsubscribes breadcrumb
   *
   * @param id - ID
   * @returns Breadcrumb item for campaign unsubscribes
   *
   * @example
   * ```tsx
   * bc.campaignUnsubscribes("abc123")
   * // Returns: { label: "Unsubscribes", href: "/mailchimp/reports/${id}/unsubscribes" }
   * ```
   */
  campaignUnsubscribes(id: string): BreadcrumbItem {
    return {
      label: "Unsubscribes",
      href: `/mailchimp/reports/${id}/unsubscribes`,
    };
  },

  /**
   * Click Details breadcrumb
   *
   * @param id - ID
   * @returns Breadcrumb item for click details
   *
   * @example
   * ```tsx
   * bc.clickDetails("abc123")
   * // Returns: { label: "Clicks", href: "/mailchimp/reports/${id}/clicks" }
   * ```
   */
  clickDetails(id: string): BreadcrumbItem {
    return {
      label: "Clicks",
      href: `/mailchimp/reports/${id}/clicks`,
    };
  },

  /**
   * Individual campaign report breadcrumb
   *
   * @param id - Campaign ID
   * @returns Breadcrumb item for a specific report
   *
   * @example
   * ```tsx
   * bc.report("abc123")
   * // Returns: { label: "Report", href: "/mailchimp/reports/abc123" }
   * ```
   */

  /**
   * Domain Performance breadcrumb
   *
   * @param id - ID
   * @returns Breadcrumb item for domain performance
   *
   * @example
   * ```tsx
   * bc.domainPerformance("abc123")
   * // Returns: { label: "Domain Performance", href: "/mailchimp/reports/${id}/domain-performance" }
   * ```
   */
  domainPerformance(id: string): BreadcrumbItem {
    return {
      label: "Domain Performance",
      href: `/mailchimp/reports/${id}/domain-performance`,
    };
  },
  report(id: string): BreadcrumbItem {
    return {
      label: "Report",
      href: `/mailchimp/reports/${id}`,
    };
  },

  /**
   * Individual list breadcrumb
   *
   * @param id - List ID
   * @returns Breadcrumb item for a specific list
   *
   * @example
   * ```tsx
   * bc.list("xyz789")
   * // Returns: { label: "List", href: "/mailchimp/lists/xyz789" }
   * ```
   */
  list(id: string): BreadcrumbItem {
    return {
      label: "List",
      href: `/mailchimp/lists/${id}`,
    };
  },

  /**
   * Report opens page breadcrumb
   *
   * @param id - Campaign ID
   * @returns Breadcrumb item for report opens page
   *
   * @example
   * ```tsx
   * bc.reportOpens("abc123")
   * // Returns: { label: "Opens", href: "/mailchimp/reports/abc123/opens" }
   * ```
   */
  reportOpens(id: string): BreadcrumbItem {
    return {
      label: "Opens",
      href: `/mailchimp/reports/${id}/opens`,
    };
  },

  /**
   * Report abuse reports page breadcrumb
   *
   * @param id - Campaign ID
   * @returns Breadcrumb item for abuse reports page
   *
   * @example
   * ```tsx
   * bc.reportAbuseReports("abc123")
   * // Returns: { label: "Abuse Reports", href: "/mailchimp/reports/abc123/abuse-reports" }
   * ```
   */
  reportAbuseReports(id: string): BreadcrumbItem {
    return {
      label: "Abuse Reports",
      href: `/mailchimp/reports/${id}/abuse-reports`,
    };
  },

  /**
   * Report email activity page breadcrumb
   *
   * @param id - Campaign ID
   * @returns Breadcrumb item for email activity page
   *
   * @example
   * ```tsx
   * bc.emailActivity("abc123")
   * // Returns: { label: "Email Activity", href: "/mailchimp/reports/abc123/email-activity" }
   * ```
   */
  emailActivity(id: string): BreadcrumbItem {
    return {
      label: "Email Activity",
      href: `/mailchimp/reports/${id}/email-activity`,
    };
  },

  // ============================================================================

  /**
   * List Activity breadcrumb
   *
   * @param id - ID
   * @returns Breadcrumb item for list activity
   *
   * @example
   * ```tsx
   * bc.listActivity("abc123")
   * // Returns: { label: "Activity", href: "/mailchimp/lists/${id}/activity" }
   * ```
   */

  /**
   * Interest Categories breadcrumb
   *
   * @param id - ID
   * @returns Breadcrumb item for interest categories
   *
   * @example
   * ```tsx
   * bc.interestCategories("abc123")
   * // Returns: { label: "Interest Categories", href: "/mailchimp/lists/${id}/interest-categories" }
   * ```
   */
  interestCategories(id: string): BreadcrumbItem {
    return {
      label: "Interest Categories",
      href: `/mailchimp/lists/${id}/interest-categories`,
    };
  },

  /**
   * List Interest Categories breadcrumb (alias for interestCategories)
   *
   * @param id - List ID
   * @returns Breadcrumb item for list interest categories
   *
   * @example
   * ```tsx
   * bc.listInterestCategories("abc123")
   * // Returns: { label: "Interest Categories", href: "/mailchimp/lists/abc123/interest-categories" }
   * ```
   */

  /**
   * Interest Category Info breadcrumb
   *
   * @param listId - List ID
   * @param categoryId - Interest Category ID
   * @returns Breadcrumb item for interest category detail
   *
   * @example
   * ```tsx
   * bc.interestCategoryInfo("abc123", "xyz789")
   * // Returns: { label: "Category Info", href: "/mailchimp/lists/abc123/interest-categories/xyz789" }
   * ```
   */
  interestCategoryInfo(listId: string, categoryId: string): BreadcrumbItem {
    return {
      label: "Category Info",
      href: `/mailchimp/lists/${listId}/interest-categories/${categoryId}`,
    };
  },
  listInterestCategories(id: string): BreadcrumbItem {
    return {
      label: "Interest Categories",
      href: `/mailchimp/lists/${id}/interest-categories`,
    };
  },

  /**
   * Interests in Category breadcrumb
   *
   * @param id - ID
   * @returns Breadcrumb item for interests in category
   *
   * @example
   * ```tsx
   * bc.interestsInCategory("abc123")
   * // Returns: { label: "Interests", href: "/mailchimp/lists/${id}/interest-categories/[interest_category_id]/interests" }
   * ```
   */
  interestsInCategory(id: string): BreadcrumbItem {
    return {
      label: "Interests",
      href: `/mailchimp/lists/${id}/interest-categories/[interest_category_id]/interests`,
    };
  },
  listActivity(id: string): BreadcrumbItem {
    return {
      label: "Activity",
      href: `/mailchimp/lists/${id}/activity`,
    };
  },

  /**
   * List Growth History breadcrumb
   *
   * @param id - ID
   * @returns Breadcrumb item for list growth history
   *
   * @example
   * ```tsx
   * bc.listGrowthHistory("abc123")
   * // Returns: { label: "Growth History", href: "/mailchimp/lists/${id}/growth-history" }
   * ```
   */
  listGrowthHistory(id: string): BreadcrumbItem {
    return {
      label: "Growth History",
      href: `/mailchimp/lists/${id}/growth-history`,
    };
  },

  /**
   * List Locations breadcrumb
   *
   * @param id - List ID
   * @returns Breadcrumb item for list locations
   *
   * @example
   * ```tsx
   * bc.listLocations("abc123")
   * // { label: "Locations", href: "/mailchimp/lists/abc123/locations" }
   * ```
   */
  listLocations(id: string): BreadcrumbItem {
    return {
      label: "Locations",
      href: `/mailchimp/lists/${id}/locations`,
    };
  },

  /**
   * List Members breadcrumb
   *
   * @param id - ID
   * @returns Breadcrumb item for list members
   *
   * @example
   * ```tsx
   * bc.listMembers("abc123")
   * // Returns: { label: "Members", href: "/mailchimp/lists/${id}/members" }
   * ```
   */
  listMembers(id: string): BreadcrumbItem {
    return {
      label: "Members",
      href: `/mailchimp/lists/${id}/members`,
    };
  },

  /**
   * Member Profile breadcrumb
   *
   * @param listId - List ID
   * @param subscriberHash - Subscriber hash (MD5 of lowercase email)
   * @returns Breadcrumb item for member profile
   *
   * @example
   * ```tsx
   * bc.memberProfile("abc123", "def456")
   * // Returns: { label: "Member Profile", href: "/mailchimp/lists/abc123/members/def456" }
   * ```
   */
  memberProfile(listId: string, subscriberHash: string): BreadcrumbItem {
    return {
      label: "Member Profile",
      href: `/mailchimp/lists/${listId}/members/${subscriberHash}`,
    };
  },

  /**
   * Member Tags breadcrumb
   *
   * @param listId - List ID
   * @param subscriberHash - Subscriber hash
   * @returns Breadcrumb item for member tags
   *
   * @example
   * ```tsx
   * bc.memberTags("abc123", "def456")
   * // Returns: { label: "Tags", href: "/mailchimp/lists/abc123/members/def456/tags" }
   * ```
   */
  memberTags(listId: string, subscriberHash: string): BreadcrumbItem {
    return {
      label: "Tags",
      href: `/mailchimp/lists/${listId}/members/${subscriberHash}/tags`,
    };
  },

  /**
   * Member Notes breadcrumb
   *
   * @param listId - List ID
   * @param subscriberHash - Subscriber hash
   * @returns Breadcrumb item for member notes
   *
   * @example
   * ```tsx
   * bc.memberNotes("abc123", "def456")
   * // Returns: { label: "Notes", href: "/mailchimp/lists/abc123/members/def456/notes" }
   * ```
   */
  memberNotes(listId: string, subscriberHash: string): BreadcrumbItem {
    return {
      label: "Notes",
      href: `/mailchimp/lists/${listId}/members/${subscriberHash}/notes`,
    };
  },

  /**
   * List Member breadcrumb (individual member page)
   *
   * @param listId - List ID
   * @param subscriberHash - Subscriber hash
   * @returns Breadcrumb item for individual member page
   *
   * @example
   * ```tsx
   * bc.listMember("abc123", "def456")
   * // Returns: { label: "Member", href: "/mailchimp/lists/abc123/members/def456" }
   * ```
   */
  listMember(listId: string, subscriberHash: string): BreadcrumbItem {
    return {
      label: "Member",
      href: `/mailchimp/lists/${listId}/members/${subscriberHash}`,
    };
  },

  /**
   * Member Activity breadcrumb
   *
   * @param listId - List ID
   * @param subscriberHash - Subscriber hash
   * @returns Breadcrumb item for member activity
   *
   * @example
   * ```tsx
   * bc.memberActivity("abc123", "def456")
   * // Returns: { label: "Activity", href: "/mailchimp/lists/abc123/members/def456/activity" }
   * ```
   */
  memberActivity(listId: string, subscriberHash: string): BreadcrumbItem {
    return {
      label: "Activity",
      href: `/mailchimp/lists/${listId}/members/${subscriberHash}/activity`,
    };
  },

  /**
   * List Segments breadcrumb
   *
   * @param id - List ID
   * @returns Breadcrumb item for list segments
   *
   * @example
   * ```tsx
   * bc.listSegments("abc123")
   * // Returns: { label: "Segments", href: "/mailchimp/lists/abc123/segments" }
   * ```
   */
  listSegments(id: string): BreadcrumbItem {
    return {
      label: "Segments",
      href: `/mailchimp/lists/${id}/segments`,
    };
  },

  // Helper Functions
  // ============================================================================

  /**
   * Mark a breadcrumb as the current page
   *
   * Creates a breadcrumb item that represents the current page in the navigation.
   * Current page breadcrumbs have no href and are marked with isCurrent: true.
   *
   * @param label - Label for the current page
   * @returns Breadcrumb item marked as current
   *
   * @example
   * ```tsx
   * bc.current("Opens")
   * // Returns: { label: "Opens", isCurrent: true }
   * ```
   */
  current(label: string): BreadcrumbItem {
    return {
      label,
      isCurrent: true,
    };
  },

  /**
   * Create a custom breadcrumb item
   *
   * Use this for pages that don't have a predefined route in the builder.
   * Consider adding commonly-used routes to the builder instead.
   *
   * @param label - Display label for the breadcrumb
   * @param href - URL path for the breadcrumb
   * @returns Custom breadcrumb item
   *
   * @example
   * ```tsx
   * bc.custom("Custom Page", "/custom/path")
   * // Returns: { label: "Custom Page", href: "/custom/path" }
   * ```
   */
  custom(label: string, href: string): BreadcrumbItem {
    return {
      label,
      href,
    };
  },
} as const;
