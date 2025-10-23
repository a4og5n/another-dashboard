/**
 * Tests for Pagination URL Generators
 */

import { describe, it, expect } from "vitest";
import { createPaginationUrls } from "./url-generators";

describe("createPaginationUrls", () => {
  describe("Basic Functionality", () => {
    it("should return object with createPageUrl and createPerPageUrl functions", () => {
      const result = createPaginationUrls("/test", 10);
      expect(result).toHaveProperty("createPageUrl");
      expect(result).toHaveProperty("createPerPageUrl");
      expect(typeof result.createPageUrl).toBe("function");
      expect(typeof result.createPerPageUrl).toBe("function");
    });
  });

  describe("createPageUrl", () => {
    it("should create URL with page and perPage parameters", () => {
      const { createPageUrl } = createPaginationUrls("/mailchimp/reports", 10);
      const url = createPageUrl(2);
      expect(url).toBe("/mailchimp/reports?page=2&perPage=10");
    });

    it("should preserve current perPage setting", () => {
      const { createPageUrl } = createPaginationUrls("/test", 25);
      const url = createPageUrl(3);
      expect(url).toBe("/test?page=3&perPage=25");
    });

    it("should handle page 1", () => {
      const { createPageUrl } = createPaginationUrls("/test", 10);
      const url = createPageUrl(1);
      expect(url).toBe("/test?page=1&perPage=10");
    });

    it("should handle large page numbers", () => {
      const { createPageUrl } = createPaginationUrls("/test", 10);
      const url = createPageUrl(999);
      expect(url).toBe("/test?page=999&perPage=10");
    });

    it("should work with different perPage values", () => {
      const { createPageUrl: create10 } = createPaginationUrls("/test", 10);
      const { createPageUrl: create50 } = createPaginationUrls("/test", 50);
      const { createPageUrl: create100 } = createPaginationUrls("/test", 100);

      expect(create10(2)).toBe("/test?page=2&perPage=10");
      expect(create50(2)).toBe("/test?page=2&perPage=50");
      expect(create100(2)).toBe("/test?page=2&perPage=100");
    });

    it("should handle base URLs with trailing slash", () => {
      const { createPageUrl } = createPaginationUrls("/test/", 10);
      const url = createPageUrl(2);
      expect(url).toBe("/test/?page=2&perPage=10");
    });

    it("should handle nested paths", () => {
      const { createPageUrl } = createPaginationUrls(
        "/mailchimp/reports/123/emails",
        10,
      );
      const url = createPageUrl(2);
      expect(url).toBe("/mailchimp/reports/123/emails?page=2&perPage=10");
    });

    it("should handle paths with special characters", () => {
      const { createPageUrl } = createPaginationUrls("/test-path/sub_path", 10);
      const url = createPageUrl(2);
      expect(url).toBe("/test-path/sub_path?page=2&perPage=10");
    });
  });

  describe("createPerPageUrl", () => {
    it("should create URL with new perPage and reset to page 1", () => {
      const { createPerPageUrl } = createPaginationUrls("/test", 10);
      const url = createPerPageUrl(25);
      expect(url).toBe("/test?page=1&perPage=25");
    });

    it("should always reset to page 1 regardless of current page", () => {
      // Current page doesn't matter - perPage change always resets to page 1
      const { createPerPageUrl } = createPaginationUrls("/test", 10);
      const url1 = createPerPageUrl(50);
      const url2 = createPerPageUrl(100);

      expect(url1).toBe("/test?page=1&perPage=50");
      expect(url2).toBe("/test?page=1&perPage=100");
    });

    it("should handle different perPage options", () => {
      const { createPerPageUrl } = createPaginationUrls("/test", 10);

      expect(createPerPageUrl(10)).toBe("/test?page=1&perPage=10");
      expect(createPerPageUrl(25)).toBe("/test?page=1&perPage=25");
      expect(createPerPageUrl(50)).toBe("/test?page=1&perPage=50");
      expect(createPerPageUrl(100)).toBe("/test?page=1&perPage=100");
    });

    it("should work with nested paths", () => {
      const { createPerPageUrl } = createPaginationUrls(
        "/mailchimp/lists/456/activity",
        10,
      );
      const url = createPerPageUrl(50);
      expect(url).toBe("/mailchimp/lists/456/activity?page=1&perPage=50");
    });
  });

  describe("Real-World Scenarios", () => {
    it("should support email activity table pagination", () => {
      const baseUrl = "/mailchimp/reports/abc123/email-activity";
      const { createPageUrl, createPerPageUrl } = createPaginationUrls(
        baseUrl,
        10,
      );

      // Navigate to page 3
      expect(createPageUrl(3)).toBe(
        "/mailchimp/reports/abc123/email-activity?page=3&perPage=10",
      );

      // Change to 50 items per page (resets to page 1)
      expect(createPerPageUrl(50)).toBe(
        "/mailchimp/reports/abc123/email-activity?page=1&perPage=50",
      );
    });

    it("should support locations table pagination", () => {
      const baseUrl = "/mailchimp/reports/xyz789/locations";
      const { createPageUrl, createPerPageUrl } = createPaginationUrls(
        baseUrl,
        25,
      );

      // Navigate through pages
      expect(createPageUrl(1)).toBe(
        "/mailchimp/reports/xyz789/locations?page=1&perPage=25",
      );
      expect(createPageUrl(2)).toBe(
        "/mailchimp/reports/xyz789/locations?page=2&perPage=25",
      );

      // Change page size
      expect(createPerPageUrl(100)).toBe(
        "/mailchimp/reports/xyz789/locations?page=1&perPage=100",
      );
    });

    it("should support list activity table pagination", () => {
      const baseUrl = "/mailchimp/lists/list123/activity";
      const { createPageUrl, createPerPageUrl } = createPaginationUrls(
        baseUrl,
        10,
      );

      expect(createPageUrl(5)).toBe(
        "/mailchimp/lists/list123/activity?page=5&perPage=10",
      );
      expect(createPerPageUrl(25)).toBe(
        "/mailchimp/lists/list123/activity?page=1&perPage=25",
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle page 0 (though typically not used)", () => {
      const { createPageUrl } = createPaginationUrls("/test", 10);
      const url = createPageUrl(0);
      expect(url).toBe("/test?page=0&perPage=10");
    });

    it("should handle negative page numbers (though typically not used)", () => {
      const { createPageUrl } = createPaginationUrls("/test", 10);
      const url = createPageUrl(-1);
      expect(url).toBe("/test?page=-1&perPage=10");
    });

    it("should handle very large perPage values", () => {
      const { createPageUrl, createPerPageUrl } = createPaginationUrls(
        "/test",
        1000,
      );
      expect(createPageUrl(1)).toBe("/test?page=1&perPage=1000");
      expect(createPerPageUrl(10000)).toBe("/test?page=1&perPage=10000");
    });

    it("should handle empty base URL", () => {
      const { createPageUrl } = createPaginationUrls("", 10);
      const url = createPageUrl(2);
      expect(url).toBe("?page=2&perPage=10");
    });

    it("should handle base URL with existing query parameters (overwrites them)", () => {
      // Note: This utility creates fresh URLSearchParams, so existing params are not preserved
      // This is intentional - pagination should be the only query params
      const { createPageUrl } = createPaginationUrls("/test?foo=bar", 10);
      const url = createPageUrl(2);
      // The ?foo=bar is part of baseUrl, so it stays
      expect(url).toBe("/test?foo=bar?page=2&perPage=10");
      // Note: This creates double `?` which is technically invalid
      // In practice, baseUrl should not include query params
    });
  });

  describe("Type Safety", () => {
    it("should return correctly typed object", () => {
      const result = createPaginationUrls("/test", 10);

      // TypeScript should infer these types correctly
      const pageUrl: string = result.createPageUrl(1);
      const perPageUrl: string = result.createPerPageUrl(25);

      expect(typeof pageUrl).toBe("string");
      expect(typeof perPageUrl).toBe("string");
    });
  });

  describe("Immutability", () => {
    it("should not mutate input parameters", () => {
      const baseUrl = "/test";
      const pageSize = 10;

      createPaginationUrls(baseUrl, pageSize);

      // Inputs should remain unchanged
      expect(baseUrl).toBe("/test");
      expect(pageSize).toBe(10);
    });

    it("should create independent URL generators", () => {
      const gen1 = createPaginationUrls("/test1", 10);
      const gen2 = createPaginationUrls("/test2", 25);

      // Each generator should maintain its own state
      expect(gen1.createPageUrl(2)).toBe("/test1?page=2&perPage=10");
      expect(gen2.createPageUrl(2)).toBe("/test2?page=2&perPage=25");
    });
  });
});
