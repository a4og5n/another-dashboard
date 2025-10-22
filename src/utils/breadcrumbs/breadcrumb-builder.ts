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
