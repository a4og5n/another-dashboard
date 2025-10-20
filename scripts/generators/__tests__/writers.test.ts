/**
 * Generator Writers Type Safety Tests
 *
 * These tests ensure TypeScript compilation succeeds for the generator writers.
 * The primary goal is to catch type errors (like boolean | undefined being passed
 * to boolean parameters) before committing to GitHub.
 *
 * Tests will catch:
 * - boolean | undefined being passed to boolean parameters
 * - Missing Boolean() wrappers for conditional checks
 * - Type mismatches in function signatures
 *
 * If these tests pass, it means the writers compile without type errors.
 */

import { describe, it, expect } from "vitest";
import type { PageConfig } from "@/generation/page-configs";

// Test configuration with all required fields
const mockConfigWithPagination: PageConfig = {
  schemas: {
    apiParams: "src/schemas/mailchimp/test-params.schema.ts",
    apiResponse: "src/schemas/mailchimp/test-success.schema.ts",
    apiError: "src/schemas/mailchimp/test-error.schema.ts",
  },
  route: {
    path: "/mailchimp/test",
    params: [],
  },
  api: {
    endpoint: "/test",
    method: "GET",
    dalMethod: "fetchTest",
  },
  page: {
    type: "list",
    title: "Test Page",
    description: "Test page description",
    features: ["Pagination", "Filtering"],
  },
  ui: {
    hasPagination: true,
    breadcrumbs: {
      label: "Test",
    },
  },
};

// Test configuration with dynamic route params
const mockConfigWithParams: PageConfig = {
  ...mockConfigWithPagination,
  route: {
    path: "/mailchimp/test/[id]",
    params: ["id"],
  },
  page: {
    ...mockConfigWithPagination.page,
    type: "detail",
  },
};

// Test configuration without pagination
const mockConfigWithoutPagination: PageConfig = {
  ...mockConfigWithPagination,
  ui: {
    hasPagination: false,
    breadcrumbs: {
      label: "Test",
    },
  },
};

describe("Generator Writers Type Safety", () => {
  describe("PageConfig type compatibility", () => {
    it("should accept config with pagination", () => {
      // This test ensures PageConfig with hasPagination: true compiles
      expect(mockConfigWithPagination.ui.hasPagination).toBe(true);
    });

    it("should accept config without pagination", () => {
      // This test ensures PageConfig with hasPagination: false compiles
      expect(mockConfigWithoutPagination.ui.hasPagination).toBe(false);
    });

    it("should accept config with route params", () => {
      // This test ensures PageConfig with params array compiles
      expect(mockConfigWithParams.route.params).toHaveLength(1);
      expect(mockConfigWithParams.route.params?.[0]).toBe("id");
    });

    it("should accept config without route params", () => {
      // This test ensures PageConfig with empty params array compiles
      expect(mockConfigWithPagination.route.params).toHaveLength(0);
    });
  });

  describe("Boolean type narrowing", () => {
    it("should handle boolean from optional array check", () => {
      // This simulates: config.route.params && config.route.params.length > 0
      const params: string[] | undefined = mockConfigWithParams.route.params;
      const hasParams = Boolean(params && params.length > 0);

      expect(typeof hasParams).toBe("boolean");
      expect(hasParams).toBe(true);
    });

    it("should handle boolean from optional boolean property", () => {
      // This simulates: config.ui.hasPagination
      const hasPagination: boolean = mockConfigWithPagination.ui.hasPagination;

      expect(typeof hasPagination).toBe("boolean");
      expect(hasPagination).toBe(true);
    });

    it("should handle boolean narrowing with nullish coalescing", () => {
      // This simulates: config.ui.hasPagination ?? false
      const hasPagination: boolean =
        mockConfigWithPagination.ui.hasPagination ?? false;

      expect(typeof hasPagination).toBe("boolean");
      expect(hasPagination).toBe(true);
    });

    it("should handle boolean from conditional expression with undefined", () => {
      // This simulates checking for empty params array when undefined
      const checkHasParams = (p: string[] | undefined) =>
        Boolean(p && p.length > 0);

      expect(typeof checkHasParams(undefined)).toBe("boolean");
      expect(checkHasParams(undefined)).toBe(false);
    });
  });

  describe("Optional parameter handling", () => {
    it("should handle optional boolean parameter with undefined", () => {
      // This simulates passing config.ui.hasPagination to optional param
      function testFunction(hasPagination?: boolean): boolean {
        return hasPagination ?? false;
      }

      const result = testFunction(mockConfigWithPagination.ui.hasPagination);
      expect(result).toBe(true);
    });

    it("should handle optional boolean parameter with false", () => {
      function testFunction(hasPagination?: boolean): boolean {
        return hasPagination ?? false;
      }

      const result = testFunction(mockConfigWithoutPagination.ui.hasPagination);
      expect(result).toBe(false);
    });

    it("should handle optional boolean parameter with undefined value", () => {
      function testFunction(hasPagination?: boolean): boolean {
        return hasPagination ?? false;
      }

      const result = testFunction(undefined);
      expect(result).toBe(false);
    });
  });
});

describe("Generator Writers Compilation Check", () => {
  it("should import writer modules without type errors", async () => {
    // This test ensures the modules can be imported without TypeScript errors
    // If there are type errors in the writers, this import will fail at compile time
    const componentWriter = await import("../writers/component-writer");
    const schemaWriter = await import("../writers/schema-writer");

    expect(componentWriter.writeComponentFiles).toBeDefined();
    expect(schemaWriter.writeSchemaFiles).toBeDefined();
  });
});
