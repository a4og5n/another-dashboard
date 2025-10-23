/**
 * Tests for Common Paginated Response Schema
 *
 * Validates the factory function for creating paginated response schemas
 * and ensures it matches patterns used across existing success endpoints.
 */
import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  createPaginatedResponse,
  paginationMetadataSchema,
} from "./paginated-response.schema";

// Sample item schema for testing
const testItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  count: z.number(),
});

describe("createPaginatedResponse", () => {
  describe("Without Parent ID", () => {
    it("should create schema for simple paginated response", () => {
      const schema = createPaginatedResponse(testItemSchema, "items");

      const result = schema.safeParse({
        items: [
          { id: "1", name: "Item 1", count: 10 },
          { id: "2", name: "Item 2", count: 20 },
        ],
        total_items: 2,
        _links: [{ rel: "self", href: "https://api.test.com", method: "GET" }],
      });

      expect(result.success).toBe(true);
    });

    it("should validate array items with item schema", () => {
      const schema = createPaginatedResponse(testItemSchema, "items");

      const result = schema.safeParse({
        items: [
          { id: "1", name: "Item 1", count: "invalid" }, // Invalid: count should be number
        ],
        total_items: 1,
        _links: [],
      });

      expect(result.success).toBe(false);
    });

    it("should accept empty array", () => {
      const schema = createPaginatedResponse(testItemSchema, "items");

      const result = schema.safeParse({
        items: [],
        total_items: 0,
        _links: [],
      });

      expect(result.success).toBe(true);
    });

    it("should require total_items field", () => {
      const schema = createPaginatedResponse(testItemSchema, "items");

      const result = schema.safeParse({
        items: [],
        _links: [],
        // Missing total_items
      });

      expect(result.success).toBe(false);
    });

    it("should require _links field", () => {
      const schema = createPaginatedResponse(testItemSchema, "items");

      const result = schema.safeParse({
        items: [],
        total_items: 0,
        // Missing _links
      });

      expect(result.success).toBe(false);
    });

    it("should validate _links array structure", () => {
      const schema = createPaginatedResponse(testItemSchema, "items");

      const result = schema.safeParse({
        items: [],
        total_items: 0,
        _links: [
          { rel: "self", href: "https://api.test.com", method: "GET" },
          { rel: "next", href: "https://api.test.com?page=2", method: "GET" },
        ],
      });

      expect(result.success).toBe(true);
    });
  });

  describe("With Parent Campaign ID", () => {
    it("should create schema with campaign_id field", () => {
      const schema = createPaginatedResponse(
        testItemSchema,
        "items",
        "campaign_id",
      );

      const result = schema.safeParse({
        items: [{ id: "1", name: "Item 1", count: 10 }],
        campaign_id: "campaign123",
        total_items: 1,
        _links: [],
      });

      expect(result.success).toBe(true);
    });

    it("should require campaign_id when specified", () => {
      const schema = createPaginatedResponse(
        testItemSchema,
        "items",
        "campaign_id",
      );

      const result = schema.safeParse({
        items: [],
        total_items: 0,
        _links: [],
        // Missing campaign_id
      });

      expect(result.success).toBe(false);
    });

    it("should reject empty campaign_id", () => {
      const schema = createPaginatedResponse(
        testItemSchema,
        "items",
        "campaign_id",
      );

      const result = schema.safeParse({
        items: [],
        campaign_id: "",
        total_items: 0,
        _links: [],
      });

      expect(result.success).toBe(false);
    });
  });

  describe("With Parent List ID", () => {
    it("should create schema with list_id field", () => {
      const schema = createPaginatedResponse(
        testItemSchema,
        "items",
        "list_id",
      );

      const result = schema.safeParse({
        items: [{ id: "1", name: "Item 1", count: 10 }],
        list_id: "list456",
        total_items: 1,
        _links: [],
      });

      expect(result.success).toBe(true);
    });

    it("should require list_id when specified", () => {
      const schema = createPaginatedResponse(
        testItemSchema,
        "items",
        "list_id",
      );

      const result = schema.safeParse({
        items: [],
        total_items: 0,
        _links: [],
        // Missing list_id
      });

      expect(result.success).toBe(false);
    });
  });

  describe("Different Resource Keys", () => {
    it("should work with abuse_reports resource key", () => {
      const abuseReportSchema = z.object({
        id: z.string(),
        email: z.email(),
      });
      const schema = createPaginatedResponse(
        abuseReportSchema,
        "abuse_reports",
        "campaign_id",
      );

      const result = schema.safeParse({
        abuse_reports: [{ id: "1", email: "test@example.com" }],
        campaign_id: "camp123",
        total_items: 1,
        _links: [],
      });

      expect(result.success).toBe(true);
    });

    it("should work with emails resource key", () => {
      const emailSchema = z.object({
        email_id: z.string(),
        email_address: z.email(),
      });
      const schema = createPaginatedResponse(
        emailSchema,
        "emails",
        "campaign_id",
      );

      const result = schema.safeParse({
        emails: [{ email_id: "hash123", email_address: "user@example.com" }],
        campaign_id: "camp123",
        total_items: 1,
        _links: [],
      });

      expect(result.success).toBe(true);
    });

    it("should work with activity resource key", () => {
      const activitySchema = z.object({
        day: z.string(),
        emails_sent: z.number(),
      });
      const schema = createPaginatedResponse(
        activitySchema,
        "activity",
        "list_id",
      );

      const result = schema.safeParse({
        activity: [{ day: "2025-01-01", emails_sent: 100 }],
        list_id: "list123",
        total_items: 1,
        _links: [],
      });

      expect(result.success).toBe(true);
    });
  });

  describe("Total Items Validation", () => {
    it("should accept zero total_items", () => {
      const schema = createPaginatedResponse(testItemSchema, "items");

      const result = schema.safeParse({
        items: [],
        total_items: 0,
        _links: [],
      });

      expect(result.success).toBe(true);
    });

    it("should reject negative total_items", () => {
      const schema = createPaginatedResponse(testItemSchema, "items");

      const result = schema.safeParse({
        items: [],
        total_items: -1,
        _links: [],
      });

      expect(result.success).toBe(false);
    });

    it("should accept large total_items values", () => {
      const schema = createPaginatedResponse(testItemSchema, "items");

      const result = schema.safeParse({
        items: [],
        total_items: 1000000,
        _links: [],
      });

      expect(result.success).toBe(true);
    });
  });
});

describe("paginationMetadataSchema", () => {
  describe("Valid Input", () => {
    it("should accept valid metadata", () => {
      const result = paginationMetadataSchema.safeParse({
        total_items: 100,
        _links: [{ rel: "self", href: "https://api.test.com", method: "GET" }],
      });

      expect(result.success).toBe(true);
    });

    it("should accept empty _links array", () => {
      const result = paginationMetadataSchema.safeParse({
        total_items: 0,
        _links: [],
      });

      expect(result.success).toBe(true);
    });

    it("should accept multiple links", () => {
      const result = paginationMetadataSchema.safeParse({
        total_items: 100,
        _links: [
          { rel: "self", href: "https://api.test.com", method: "GET" },
          { rel: "next", href: "https://api.test.com?page=2", method: "GET" },
          { rel: "prev", href: "https://api.test.com?page=1", method: "GET" },
        ],
      });

      expect(result.success).toBe(true);
    });
  });

  describe("Invalid Input", () => {
    it("should reject missing total_items", () => {
      const result = paginationMetadataSchema.safeParse({
        _links: [],
      });

      expect(result.success).toBe(false);
    });

    it("should reject missing _links", () => {
      const result = paginationMetadataSchema.safeParse({
        total_items: 0,
      });

      expect(result.success).toBe(false);
    });

    it("should reject negative total_items", () => {
      const result = paginationMetadataSchema.safeParse({
        total_items: -1,
        _links: [],
      });

      expect(result.success).toBe(false);
    });
  });

  describe("Usage with .shape", () => {
    it("should work when spread into another schema", () => {
      const customResponseSchema = z.object({
        data: z.array(testItemSchema),
        ...paginationMetadataSchema.shape,
      });

      const result = customResponseSchema.safeParse({
        data: [{ id: "1", name: "Item 1", count: 10 }],
        total_items: 1,
        _links: [],
      });

      expect(result.success).toBe(true);
    });
  });
});
