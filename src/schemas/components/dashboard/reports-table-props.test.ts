import { describe, it, expect } from "vitest";
import { reportsTablePropsSchema } from "@/schemas/components/dashboard/reports";

describe("ReportsTablePropsSchema", () => {
  it("should apply default values for optional props", () => {
    const input = {
      reports: [],
    };

    const result = reportsTablePropsSchema.parse(input);

    expect(result).toEqual({
      reports: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      perPage: 10,
      perPageOptions: [10, 20, 50],
      onPageChange: undefined,
      onPerPageChange: undefined,
    });
  });

  it("should validate and constrain perPage values", () => {
    const input = {
      reports: [],
      perPage: 150, // Above max of 100
    };

    expect(() => reportsTablePropsSchema.parse(input)).toThrow();
  });

  it("should validate currentPage minimum value", () => {
    const input = {
      reports: [],
      currentPage: 0, // Below minimum of 1
    };

    expect(() => reportsTablePropsSchema.parse(input)).toThrow();
  });

  it("should allow overriding default values", () => {
    const input = {
      reports: [],
      loading: true,
      perPage: 20,
      currentPage: 2,
    };

    const result = reportsTablePropsSchema.parse(input);

    expect(result.loading).toBe(true);
    expect(result.perPage).toBe(20);
    expect(result.currentPage).toBe(2);
    // Defaults should still apply for non-provided values
    expect(result.error).toBe(null);
    expect(result.totalPages).toBe(1);
  });
});
