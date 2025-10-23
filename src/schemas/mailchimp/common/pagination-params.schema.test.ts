/**
 * Tests for Common Pagination Parameters Schemas
 *
 * Validates that reusable pagination and field filtering schemas
 * work correctly and match patterns used across existing endpoints.
 */
import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  paginationQueryParamsSchema,
  fieldFilteringQueryParamsSchema,
  standardQueryParamsSchema,
} from "./pagination-params.schema";

describe("paginationQueryParamsSchema", () => {
  describe("Valid Input", () => {
    it("should accept valid count and offset", () => {
      const result = paginationQueryParamsSchema.safeParse({
        count: 50,
        offset: 100,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ count: 50, offset: 100 });
      }
    });

    it("should apply default values when fields are missing", () => {
      const result = paginationQueryParamsSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ count: 10, offset: 0 });
      }
    });

    it("should coerce string numbers to numbers", () => {
      const result = paginationQueryParamsSchema.safeParse({
        count: "25",
        offset: "50",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ count: 25, offset: 50 });
      }
    });

    it("should accept minimum valid values", () => {
      const result = paginationQueryParamsSchema.safeParse({
        count: 1,
        offset: 0,
      });
      expect(result.success).toBe(true);
    });

    it("should accept maximum count value", () => {
      const result = paginationQueryParamsSchema.safeParse({
        count: 1000,
        offset: 0,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Invalid Input", () => {
    it("should reject count below minimum", () => {
      const result = paginationQueryParamsSchema.safeParse({
        count: 0,
        offset: 0,
      });
      expect(result.success).toBe(false);
    });

    it("should reject count above maximum", () => {
      const result = paginationQueryParamsSchema.safeParse({
        count: 1001,
        offset: 0,
      });
      expect(result.success).toBe(false);
    });

    it("should reject negative offset", () => {
      const result = paginationQueryParamsSchema.safeParse({
        count: 10,
        offset: -1,
      });
      expect(result.success).toBe(false);
    });

    it("should reject non-numeric count", () => {
      const result = paginationQueryParamsSchema.safeParse({
        count: "invalid",
        offset: 0,
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("fieldFilteringQueryParamsSchema", () => {
  describe("Valid Input", () => {
    it("should accept fields only", () => {
      const result = fieldFilteringQueryParamsSchema.safeParse({
        fields: "name,email,status",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ fields: "name,email,status" });
      }
    });

    it("should accept exclude_fields only", () => {
      const result = fieldFilteringQueryParamsSchema.safeParse({
        exclude_fields: "internal_id,metadata",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ exclude_fields: "internal_id,metadata" });
      }
    });

    it("should accept both fields and exclude_fields", () => {
      const result = fieldFilteringQueryParamsSchema.safeParse({
        fields: "name,email",
        exclude_fields: "internal_id",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          fields: "name,email",
          exclude_fields: "internal_id",
        });
      }
    });

    it("should accept empty object (all fields optional)", () => {
      const result = fieldFilteringQueryParamsSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({});
      }
    });
  });

  describe("Invalid Input", () => {
    it("should reject non-string fields", () => {
      const result = fieldFilteringQueryParamsSchema.safeParse({
        fields: 123,
      });
      expect(result.success).toBe(false);
    });

    it("should reject non-string exclude_fields", () => {
      const result = fieldFilteringQueryParamsSchema.safeParse({
        exclude_fields: ["field1", "field2"],
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("standardQueryParamsSchema", () => {
  describe("Valid Input", () => {
    it("should accept all parameters", () => {
      const result = standardQueryParamsSchema.safeParse({
        fields: "name,email",
        exclude_fields: "internal_id",
        count: 25,
        offset: 50,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          fields: "name,email",
          exclude_fields: "internal_id",
          count: 25,
          offset: 50,
        });
      }
    });

    it("should accept only pagination parameters", () => {
      const result = standardQueryParamsSchema.safeParse({
        count: 100,
        offset: 200,
      });
      expect(result.success).toBe(true);
    });

    it("should accept only field filtering parameters", () => {
      const result = standardQueryParamsSchema.safeParse({
        fields: "name",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          fields: "name",
          count: 10, // Default
          offset: 0, // Default
        });
      }
    });

    it("should apply defaults for missing pagination params", () => {
      const result = standardQueryParamsSchema.safeParse({
        fields: "name,email",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.count).toBe(10);
        expect(result.data.offset).toBe(0);
      }
    });

    it("should accept empty object (use all defaults)", () => {
      const result = standardQueryParamsSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          count: 10,
          offset: 0,
        });
      }
    });
  });

  describe("Strict Mode Enforcement", () => {
    it("should reject unknown properties", () => {
      const result = standardQueryParamsSchema.safeParse({
        count: 10,
        offset: 0,
        unknown_field: "should fail",
      });
      expect(result.success).toBe(false);
    });

    it("should reject additional custom parameters", () => {
      const result = standardQueryParamsSchema.safeParse({
        count: 10,
        offset: 0,
        custom_filter: "value",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Extensions", () => {
    it("should support .extend() for additional parameters", () => {
      const extendedSchema = standardQueryParamsSchema.extend({
        since: z.string().optional(),
      });

      const result = extendedSchema.safeParse({
        count: 10,
        offset: 0,
        since: "2025-01-01T00:00:00Z",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Type Coercion", () => {
    it("should coerce string count to number", () => {
      const result = standardQueryParamsSchema.safeParse({
        count: "50",
        offset: "100",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data.count).toBe("number");
        expect(typeof result.data.offset).toBe("number");
      }
    });
  });
});
