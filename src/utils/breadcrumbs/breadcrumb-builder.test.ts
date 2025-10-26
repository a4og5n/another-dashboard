/**
 * Breadcrumb Builder Utility Tests
 *
 * Comprehensive test suite for the breadcrumb builder utility.
 * Tests static routes, dynamic functions, helper functions, and integration scenarios.
 */

import { describe, it, expect } from "vitest";
import { bc } from "@/utils/breadcrumbs/breadcrumb-builder";
import type { BreadcrumbItem } from "@/types/components/layout";

describe("Breadcrumb Builder (bc)", () => {
  describe("Static Routes", () => {
    it("should return correct home breadcrumb", () => {
      expect(bc.home).toEqual({
        label: "Dashboard",
        href: "/",
      });
    });

    it("should return correct mailchimp breadcrumb", () => {
      expect(bc.mailchimp).toEqual({
        label: "Mailchimp",
        href: "/mailchimp",
      });
    });

    it("should return correct reports breadcrumb", () => {
      expect(bc.reports).toEqual({
        label: "Reports",
        href: "/mailchimp/reports",
      });
    });

    it("should return correct lists breadcrumb", () => {
      expect(bc.lists).toEqual({
        label: "Lists",
        href: "/mailchimp/lists",
      });
    });

    it("should return correct generalInfo breadcrumb", () => {
      expect(bc.generalInfo).toEqual({
        label: "General Info",
        href: "/mailchimp/general-info",
      });
    });

    it("should return correct settings breadcrumb", () => {
      expect(bc.settings).toEqual({
        label: "Settings",
        href: "/settings",
      });
    });

    it("should return correct integrations breadcrumb", () => {
      expect(bc.integrations).toEqual({
        label: "Integrations",
        href: "/settings/integrations",
      });
    });

    it("should have all static routes as BreadcrumbItem type", () => {
      // Type assertion test - will fail at compile time if types are wrong
      const items: BreadcrumbItem[] = [
        bc.home,
        bc.mailchimp,
        bc.reports,
        bc.lists,
        bc.generalInfo,
        bc.settings,
        bc.integrations,
      ];

      expect(items).toHaveLength(7);
    });
  });

  describe("Dynamic Route Functions", () => {
    describe("bc.report(id)", () => {
      it("should return breadcrumb with correct label and href", () => {
        const result = bc.report("abc123");

        expect(result).toEqual({
          label: "Report",
          href: "/mailchimp/reports/abc123",
        });
      });

      it("should handle different ID formats", () => {
        const result1 = bc.report("short");
        const result2 = bc.report("very-long-campaign-id-12345");
        const result3 = bc.report("id_with_underscores");

        expect(result1.href).toBe("/mailchimp/reports/short");
        expect(result2.href).toBe(
          "/mailchimp/reports/very-long-campaign-id-12345",
        );
        expect(result3.href).toBe("/mailchimp/reports/id_with_underscores");
      });

      it("should not have isCurrent flag", () => {
        const result = bc.report("abc123");
        expect(result.isCurrent).toBeUndefined();
      });
    });

    describe("bc.list(id)", () => {
      it("should return breadcrumb with correct label and href", () => {
        const result = bc.list("xyz789");

        expect(result).toEqual({
          label: "List",
          href: "/mailchimp/lists/xyz789",
        });
      });

      it("should handle different ID formats", () => {
        const result1 = bc.list("short");
        const result2 = bc.list("very-long-list-id-67890");

        expect(result1.href).toBe("/mailchimp/lists/short");
        expect(result2.href).toBe("/mailchimp/lists/very-long-list-id-67890");
      });

      it("should not have isCurrent flag", () => {
        const result = bc.list("xyz789");
        expect(result.isCurrent).toBeUndefined();
      });
    });

    describe("bc.reportOpens(id)", () => {
      it("should return breadcrumb with correct label and href", () => {
        const result = bc.reportOpens("abc123");

        expect(result).toEqual({
          label: "Opens",
          href: "/mailchimp/reports/abc123/opens",
        });
      });

      it("should handle different ID formats", () => {
        const result = bc.reportOpens("campaign-id-456");

        expect(result.href).toBe("/mailchimp/reports/campaign-id-456/opens");
      });

      it("should not have isCurrent flag", () => {
        const result = bc.reportOpens("abc123");
        expect(result.isCurrent).toBeUndefined();
      });
    });

    describe("bc.reportAbuseReports(id)", () => {
      it("should return breadcrumb with correct label and href", () => {
        const result = bc.reportAbuseReports("abc123");

        expect(result).toEqual({
          label: "Abuse Reports",
          href: "/mailchimp/reports/abc123/abuse-reports",
        });
      });

      it("should handle different ID formats", () => {
        const result = bc.reportAbuseReports("campaign-id-789");

        expect(result.href).toBe(
          "/mailchimp/reports/campaign-id-789/abuse-reports",
        );
      });

      it("should not have isCurrent flag", () => {
        const result = bc.reportAbuseReports("abc123");
        expect(result.isCurrent).toBeUndefined();
      });
    });
  });

  describe("Helper Functions", () => {
    describe("bc.current(label)", () => {
      it("should return breadcrumb marked as current with no href", () => {
        const result = bc.current("Opens");

        expect(result).toEqual({
          label: "Opens",
          isCurrent: true,
        });
      });

      it("should work with different labels", () => {
        const result1 = bc.current("Report Details");
        const result2 = bc.current("Custom Page");

        expect(result1).toEqual({
          label: "Report Details",
          isCurrent: true,
        });
        expect(result2).toEqual({
          label: "Custom Page",
          isCurrent: true,
        });
      });

      it("should not include href property", () => {
        const result = bc.current("Current Page");

        expect(result.href).toBeUndefined();
      });
    });

    describe("bc.custom(label, href)", () => {
      it("should return breadcrumb with custom label and href", () => {
        const result = bc.custom("Custom Page", "/custom/path");

        expect(result).toEqual({
          label: "Custom Page",
          href: "/custom/path",
        });
      });

      it("should work with absolute URLs", () => {
        const result = bc.custom("External Link", "https://example.com/page");

        expect(result).toEqual({
          label: "External Link",
          href: "https://example.com/page",
        });
      });

      it("should work with complex paths", () => {
        const result = bc.custom("Deep Page", "/foo/bar/baz/qux");

        expect(result.href).toBe("/foo/bar/baz/qux");
      });

      it("should not have isCurrent flag by default", () => {
        const result = bc.custom("Page", "/page");

        expect(result.isCurrent).toBeUndefined();
      });
    });
  });

  describe("Integration Tests", () => {
    it("should build a simple breadcrumb trail", () => {
      const breadcrumbs: BreadcrumbItem[] = [
        bc.home,
        bc.mailchimp,
        bc.current("Reports"),
      ];

      expect(breadcrumbs).toEqual([
        { label: "Dashboard", href: "/" },
        { label: "Mailchimp", href: "/mailchimp" },
        { label: "Reports", isCurrent: true },
      ]);
    });

    it("should build a breadcrumb trail with dynamic ID", () => {
      const reportId = "campaign-123";
      const breadcrumbs: BreadcrumbItem[] = [
        bc.home,
        bc.mailchimp,
        bc.reports,
        bc.report(reportId),
        bc.current("Opens"),
      ];

      expect(breadcrumbs).toEqual([
        { label: "Dashboard", href: "/" },
        { label: "Mailchimp", href: "/mailchimp" },
        { label: "Reports", href: "/mailchimp/reports" },
        { label: "Report", href: "/mailchimp/reports/campaign-123" },
        { label: "Opens", isCurrent: true },
      ]);
    });

    it("should build a list detail breadcrumb trail", () => {
      const breadcrumbs: BreadcrumbItem[] = [
        bc.home,
        bc.mailchimp,
        bc.lists,
        bc.current("List"),
      ];

      expect(breadcrumbs).toHaveLength(4);
      expect(breadcrumbs[breadcrumbs.length - 1].isCurrent).toBe(true);
    });

    it("should build a settings breadcrumb trail", () => {
      const breadcrumbs: BreadcrumbItem[] = [
        bc.home,
        bc.settings,
        bc.current("Integrations"),
      ];

      expect(breadcrumbs).toEqual([
        { label: "Dashboard", href: "/" },
        { label: "Settings", href: "/settings" },
        { label: "Integrations", isCurrent: true },
      ]);
    });

    it("should mix static, dynamic, and custom breadcrumbs", () => {
      const breadcrumbs: BreadcrumbItem[] = [
        bc.home,
        bc.mailchimp,
        bc.custom("Analytics", "/mailchimp/analytics"),
        bc.current("Performance"),
      ];

      expect(breadcrumbs).toEqual([
        { label: "Dashboard", href: "/" },
        { label: "Mailchimp", href: "/mailchimp" },
        { label: "Analytics", href: "/mailchimp/analytics" },
        { label: "Performance", isCurrent: true },
      ]);
    });

    it("should handle complex nested report page breadcrumbs", () => {
      const campaignId = "abc-123-xyz";
      const breadcrumbs: BreadcrumbItem[] = [
        bc.home,
        bc.mailchimp,
        bc.reports,
        bc.report(campaignId),
        bc.current("Abuse Reports"),
      ];

      expect(breadcrumbs).toHaveLength(5);
      expect(breadcrumbs[3].href).toBe("/mailchimp/reports/abc-123-xyz");
      expect(breadcrumbs[4]).toEqual({
        label: "Abuse Reports",
        isCurrent: true,
      });
    });
  });

  describe("Type Safety", () => {
    it("should ensure all breadcrumbs conform to BreadcrumbItem interface", () => {
      // This test primarily checks compile-time type safety
      // If this compiles, the types are correct
      const staticItem: BreadcrumbItem = bc.home;
      const dynamicItem: BreadcrumbItem = bc.report("id");
      const currentItem: BreadcrumbItem = bc.current("Current");
      const customItem: BreadcrumbItem = bc.custom("Custom", "/path");

      expect(staticItem).toBeDefined();
      expect(dynamicItem).toBeDefined();
      expect(currentItem).toBeDefined();
      expect(customItem).toBeDefined();
    });

    it("should allow breadcrumb arrays to be typed as BreadcrumbItem[]", () => {
      const items: BreadcrumbItem[] = [
        bc.home,
        bc.mailchimp,
        bc.reports,
        bc.report("123"),
        bc.current("Page"),
        bc.custom("Custom", "/path"),
      ];

      expect(items).toHaveLength(6);
      expect(items.every((item) => typeof item.label === "string")).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string IDs in dynamic functions", () => {
      const result1 = bc.report("");
      const result2 = bc.list("");

      expect(result1.href).toBe("/mailchimp/reports/");
      expect(result2.href).toBe("/mailchimp/lists/");
    });

    it("should handle special characters in IDs", () => {
      const result = bc.report("id-with-!@#$%");

      expect(result.href).toBe("/mailchimp/reports/id-with-!@#$%");
    });

    it("should handle empty label in current()", () => {
      const result = bc.current("");

      expect(result.label).toBe("");
      expect(result.isCurrent).toBe(true);
    });

    it("should handle empty values in custom()", () => {
      const result = bc.custom("", "");

      expect(result).toEqual({
        label: "",
        href: "",
      });
    });
  });

  describe("Dynamic Href Validation (Issue #247 Prevention)", () => {
    /**
     * CRITICAL: Ensure no breadcrumb functions return route placeholders in hrefs
     *
     * Background:
     * - Issue #247 (Member Tags): bc.memberProfile() used hardcoded [subscriber_hash] placeholder
     * - Next.js App Router throws runtime error: "Dynamic href `[param]` found in <Link>"
     * - This test prevents such errors by validating all dynamic hrefs use actual parameter values
     *
     * See: docs/implementation-review-member-tags.md - Issue #3
     */
    it("should not contain route placeholders in dynamic function hrefs", () => {
      // Test all dynamic breadcrumb functions with sample IDs
      const dynamicBreadcrumbs = [
        bc.report("test-id"),
        bc.list("test-id"),
        bc.reportOpens("test-id"),
        bc.reportAbuseReports("test-id"),
        bc.campaignAdvice("test-id"),
        bc.campaignLocations("test-id"),
        bc.campaignRecipients("test-id"),
        bc.campaignUnsubscribes("test-id"),
        bc.clickDetails("test-id"),
        bc.domainPerformance("test-id"),
        bc.emailActivity("test-id"),
        bc.listActivity("test-id"),
        bc.listGrowthHistory("test-id"),
        bc.listMembers("test-id"),
        bc.listSegments("test-id"),
        bc.memberProfile("list-id", "subscriber-hash"),
        bc.memberTags("list-id", "subscriber-hash"),
        bc.memberNotes("list-id", "subscriber-hash"),
      ];

      dynamicBreadcrumbs.forEach((breadcrumb) => {
        if (breadcrumb.href) {
          // Ensure href doesn't contain route placeholders like [id], [slug], [subscriber_hash]
          expect(breadcrumb.href).not.toMatch(/\[[\w_-]+\]/);

          // Additional check: ensure no literal "undefined" in href
          expect(breadcrumb.href).not.toContain("undefined");
        }
      });
    });

    it("should handle multi-parameter breadcrumb functions correctly", () => {
      // Functions that require multiple parameters (most common source of errors)
      const listId = "list123";
      const subscriberHash = "sub456";

      const memberProfile = bc.memberProfile(listId, subscriberHash);
      const memberTags = bc.memberTags(listId, subscriberHash);
      const memberNotes = bc.memberNotes(listId, subscriberHash);

      // Verify actual parameter values are in hrefs
      expect(memberProfile.href).toBe(
        `/mailchimp/lists/${listId}/members/${subscriberHash}`,
      );
      expect(memberTags.href).toBe(
        `/mailchimp/lists/${listId}/members/${subscriberHash}/tags`,
      );
      expect(memberNotes.href).toBe(
        `/mailchimp/lists/${listId}/members/${subscriberHash}/notes`,
      );

      // Ensure no placeholders
      [memberProfile, memberTags, memberNotes].forEach((bc) => {
        expect(bc.href).not.toMatch(/\[[\w_-]+\]/);
      });
    });

    it("should validate static breadcrumbs have no placeholders", () => {
      const staticBreadcrumbs = [
        bc.home,
        bc.mailchimp,
        bc.reports,
        bc.lists,
        bc.generalInfo,
        bc.settings,
        bc.integrations,
      ];

      staticBreadcrumbs.forEach((breadcrumb) => {
        if (breadcrumb.href) {
          expect(breadcrumb.href).not.toMatch(/\[[\w_-]+\]/);
        }
      });
    });
  });
});
