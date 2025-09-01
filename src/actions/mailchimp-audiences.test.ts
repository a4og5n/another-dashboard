import { describe, it, expect } from "vitest";
import {
  validateMailchimpAudiencesQuery,
  validateAudienceId,
  validateAudienceObject,
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

  describe("validateAudienceObject", () => {
    const validAudience = {
      id: "abc123",
      name: "Test Audience",
      contact: {
        company: "Test Company",
        address1: "123 Test St",
        city: "Test City",
        state: "Test State",
        zip: "12345",
        country: "US",
      },
      permission_reminder: "You signed up for our newsletter",
      use_archive_bar: true,
      campaign_defaults: {
        from_name: "Test Sender",
        from_email: "test@example.com",
        subject: "Test Subject",
        language: "en",
      },
      email_type_option: false,
      visibility: "pub" as const,
      stats: {
        member_count: 100,
        unsubscribe_count: 5,
        cleaned_count: 2,
      },
      list_rating: 4,
      date_created: "2023-01-01T00:00:00Z",
    };

    it("should validate valid audience object", () => {
      const result = validateAudienceObject(validAudience);
      expect(result).toMatchObject(validAudience);
    });

    it("should throw ValidationError for invalid audience object", () => {
      const { id: _id, ...invalidAudience } = validAudience;

      expect(() => validateAudienceObject(invalidAudience)).toThrow(
        ValidationError,
      );
    });

    it("should throw ValidationError for invalid list_rating", () => {
      const invalidAudience = {
        ...validAudience,
        list_rating: 6, // max is 5
      };

      expect(() => validateAudienceObject(invalidAudience)).toThrow(
        ValidationError,
      );
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
