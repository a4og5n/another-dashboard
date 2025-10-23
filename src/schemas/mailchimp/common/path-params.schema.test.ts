/**
 * Tests for Common Path Parameters Schemas
 *
 * Validates that reusable path parameter schemas work correctly
 * for campaign IDs, list IDs, and custom resource IDs.
 */
import { describe, it, expect } from "vitest";
import {
  campaignIdPathParamsSchema,
  listIdPathParamsSchema,
  createIdPathParams,
} from "./path-params.schema";

describe("campaignIdPathParamsSchema", () => {
  describe("Valid Input", () => {
    it("should accept valid campaign_id", () => {
      const result = campaignIdPathParamsSchema.safeParse({
        campaign_id: "abc123def456",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ campaign_id: "abc123def456" });
      }
    });

    it("should accept alphanumeric IDs", () => {
      const result = campaignIdPathParamsSchema.safeParse({
        campaign_id: "campaign-2025-01",
      });
      expect(result.success).toBe(true);
    });

    it("should accept IDs with special characters", () => {
      const result = campaignIdPathParamsSchema.safeParse({
        campaign_id: "test_campaign_123",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Invalid Input", () => {
    it("should reject empty campaign_id", () => {
      const result = campaignIdPathParamsSchema.safeParse({
        campaign_id: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Campaign ID is required");
      }
    });

    it("should reject missing campaign_id", () => {
      const result = campaignIdPathParamsSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it("should reject non-string campaign_id", () => {
      const result = campaignIdPathParamsSchema.safeParse({
        campaign_id: 123,
      });
      expect(result.success).toBe(false);
    });

    it("should reject unknown properties (strict mode)", () => {
      const result = campaignIdPathParamsSchema.safeParse({
        campaign_id: "abc123",
        extra_field: "should fail",
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("listIdPathParamsSchema", () => {
  describe("Valid Input", () => {
    it("should accept valid list_id", () => {
      const result = listIdPathParamsSchema.safeParse({
        list_id: "list123",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ list_id: "list123" });
      }
    });

    it("should accept alphanumeric list IDs", () => {
      const result = listIdPathParamsSchema.safeParse({
        list_id: "audience-main-2025",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Invalid Input", () => {
    it("should reject empty list_id", () => {
      const result = listIdPathParamsSchema.safeParse({
        list_id: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("List ID is required");
      }
    });

    it("should reject missing list_id", () => {
      const result = listIdPathParamsSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it("should reject non-string list_id", () => {
      const result = listIdPathParamsSchema.safeParse({
        list_id: 456,
      });
      expect(result.success).toBe(false);
    });

    it("should reject unknown properties (strict mode)", () => {
      const result = listIdPathParamsSchema.safeParse({
        list_id: "list123",
        extra_field: "should fail",
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("createIdPathParams", () => {
  describe("Valid Input", () => {
    it("should create schema for custom ID field", () => {
      const memberIdSchema = createIdPathParams("member_id");
      const result = memberIdSchema.safeParse({
        member_id: "member123",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ member_id: "member123" });
      }
    });

    it("should use custom error message when provided", () => {
      const segmentIdSchema = createIdPathParams(
        "segment_id",
        "Valid segment ID required",
      );
      const result = segmentIdSchema.safeParse({
        segment_id: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Valid segment ID required",
        );
      }
    });

    it("should use default error message when not provided", () => {
      const automationIdSchema = createIdPathParams("automation_id");
      const result = automationIdSchema.safeParse({
        automation_id: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "automation_id is required",
        );
      }
    });

    it("should support multiple custom ID types", () => {
      const templateIdSchema = createIdPathParams("template_id");
      const workflowIdSchema = createIdPathParams("workflow_id");

      const templateResult = templateIdSchema.safeParse({
        template_id: "tpl123",
      });
      const workflowResult = workflowIdSchema.safeParse({
        workflow_id: "wf456",
      });

      expect(templateResult.success).toBe(true);
      expect(workflowResult.success).toBe(true);
    });
  });

  describe("Invalid Input", () => {
    it("should reject empty ID value", () => {
      const customSchema = createIdPathParams("custom_id");
      const result = customSchema.safeParse({
        custom_id: "",
      });
      expect(result.success).toBe(false);
    });

    it("should reject missing ID field", () => {
      const customSchema = createIdPathParams("custom_id");
      const result = customSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it("should reject unknown properties (strict mode)", () => {
      const customSchema = createIdPathParams("custom_id");
      const result = customSchema.safeParse({
        custom_id: "id123",
        extra_field: "should fail",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Schema Properties", () => {
    it("should create strict schema by default", () => {
      const schema = createIdPathParams("test_id");
      const result = schema.safeParse({
        test_id: "123",
        unknown: "field",
      });
      expect(result.success).toBe(false);
    });

    it("should be usable as a Zod schema", () => {
      const schema = createIdPathParams("test_id");
      // Verify it has safeParse method (duck typing for Zod schema)
      expect(typeof schema.safeParse).toBe("function");
      expect(typeof schema.parse).toBe("function");
    });
  });
});
