import { describe, it, expect } from "vitest";
import {
  validateMailchimpAudiencesQuery,
  validateAudienceId,
  ValidationError,
} from "./mailchimp-audiences";

describe("Mailchimp Audiences Actions", () => {
  describe("validateMailchimpAudiencesQuery", () => {
    it("should validate valid query parameters", () => {
      const validQuery = {
        count: "10",
        offset: "0",
        fields: ["id", "name", "stats.member_count"],
        exclude_fields: ["contact"],
      };

      const result = validateMailchimpAudiencesQuery(validQuery);

      expect(result).toEqual({
        count: 10,
        offset: 0,
        fields: ["id", "name", "stats.member_count"],
        exclude_fields: ["contact"],
      });
    });

    it("should apply default values for missing parameters", () => {
      const result = validateMailchimpAudiencesQuery({});

      expect(result).toEqual({
        count: 10,
        offset: 0,
      });
    });

    it("should reject unsupported parameters", () => {
      const invalidQuery = {
        count: "10",
        email: "test@example.com", // Unsupported parameter
        sort_field: "member_count", // Unsupported parameter
      };

      expect(() => validateMailchimpAudiencesQuery(invalidQuery)).toThrow(
        ValidationError,
      );
    });

    it("should validate supported fields parameters", () => {
      const validQuery = {
        fields: ["id", "name", "stats.member_count"],
        exclude_fields: ["contact", "campaign_defaults"],
      };
      const result = validateMailchimpAudiencesQuery(validQuery);

      expect(result.fields).toEqual(["id", "name", "stats.member_count"]);
      expect(result.exclude_fields).toEqual(["contact", "campaign_defaults"]);
    });

    it("should throw ValidationError for invalid count", () => {
      const invalidQuery = { count: "0" }; // count must be >= 1

      expect(() => validateMailchimpAudiencesQuery(invalidQuery)).toThrow(
        ValidationError,
      );
    });
  });

  describe("validateAudienceId", () => {
    it("should validate valid audience ID", () => {
      const result = validateAudienceId("abc123");
      expect(result).toBe("abc123");
    });

    it("should throw ValidationError for empty string", () => {
      expect(() => validateAudienceId("")).toThrow(ValidationError);
    });

    it("should throw ValidationError for non-string values", () => {
      expect(() => validateAudienceId(123)).toThrow(ValidationError);
      expect(() => validateAudienceId(null)).toThrow(ValidationError);
      expect(() => validateAudienceId(undefined)).toThrow(ValidationError);
    });
  });

  describe("ValidationError", () => {
    it("should create error with message and details", () => {
      const details = { field: "test", error: "invalid" };
      const error = new ValidationError("Test error", details);

      expect(error.message).toBe("Test error");
      expect(error.name).toBe("ValidationError");
      expect(error.details).toEqual(details);
    });

    it("should create error without details", () => {
      const error = new ValidationError("Test error");

      expect(error.message).toBe("Test error");
      expect(error.name).toBe("ValidationError");
      expect(error.details).toBeUndefined();
    });
  });
});
