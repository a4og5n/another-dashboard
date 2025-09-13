/**
 * Campaign Opens Parameter Utilities Tests
 * Unit tests for campaign opens parameter processing functions
 *
 * Testing the extracted business logic separately from components
 */

import { describe, it, expect, vi } from "vitest";
import { processOpenListSearchParams } from "@/utils/mailchimp/campaign-opens-params";

// Mock the validation function
vi.mock("@/actions/mailchimp-reports-open", () => ({
  validateOpenListQueryParams: vi.fn((params) => {
    // Simple mock validation - just return the params if they're valid
    if (params.count && params.count > 1000) {
      throw new Error("Count too large");
    }
    return params;
  }),
}));

describe("processOpenListSearchParams", () => {
  it("should return defaults when no parameters provided", () => {
    const result = processOpenListSearchParams({});

    expect(result).toEqual({
      count: 10,
      offset: 0,
    });
  });

  it("should parse valid string parameters correctly", () => {
    const params = {
      count: "25",
      offset: "50",
      fields: "email_address,opens_count",
      sort_dir: "ASC",
    };

    const result = processOpenListSearchParams(params);

    expect(result.count).toBe(25);
    expect(result.offset).toBe(50);
    expect(result.fields).toBe("email_address,opens_count");
    expect(result.sort_dir).toBe("ASC");
  });

  it("should handle invalid numeric parameters gracefully", () => {
    const params = {
      count: "invalid",
      offset: "also-invalid",
    };

    const result = processOpenListSearchParams(params);

    expect(result.count).toBe(10); // fallback
    expect(result.offset).toBe(0); // fallback
  });

  it("should preserve optional string parameters", () => {
    const params = {
      fields: "email_address",
      exclude_fields: "opens_count",
      since: "2023-01-01T00:00:00.000Z",
      sort_field: "timestamp",
    };

    const result = processOpenListSearchParams(params);

    expect(result.fields).toBe("email_address");
    expect(result.exclude_fields).toBe("opens_count");
    expect(result.since).toBe("2023-01-01T00:00:00.000Z");
    expect(result.sort_field).toBe("timestamp");
  });

  it("should handle validation errors gracefully", () => {
    // This should trigger the mock validation error
    const params = {
      count: "2000", // > 1000, will trigger error in mock
    };

    const result = processOpenListSearchParams(params);

    // Should fall back to defaults when validation fails
    expect(result.count).toBe(10);
    expect(result.offset).toBe(0);
  });

  it("should handle array parameters correctly", () => {
    const params = {
      count: ["25", "30"], // Next.js can sometimes provide arrays
      offset: "0",
    };

    const result = processOpenListSearchParams(params);

    // Should take the first element of the array
    expect(result.count).toBe(25); // first element of the array
    expect(result.offset).toBe(0);
  });
});
