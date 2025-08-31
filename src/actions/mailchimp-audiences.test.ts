import { describe, it, expect } from "vitest";
import {
  validateMailchimpAudiencesQuery,
  validateCreateAudienceParams,
  validateUpdateAudienceParams,
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
        sort_field: "member_count",
        sort_dir: "DESC",
      };

      const result = validateMailchimpAudiencesQuery(validQuery);

      expect(result).toEqual({
        count: 10,
        offset: 0,
        sort_field: "member_count",
        sort_dir: "DESC",
      });
    });

    it("should apply default values for missing parameters", () => {
      const result = validateMailchimpAudiencesQuery({});

      expect(result).toEqual({
        count: 10,
        offset: 0,
        sort_field: "date_created",
        sort_dir: "DESC",
      });
    });

    it("should validate email parameter", () => {
      const validQuery = { email: "test@example.com" };
      const result = validateMailchimpAudiencesQuery(validQuery);

      expect(result.email).toBe("test@example.com");
    });

    it("should throw ValidationError for invalid email", () => {
      const invalidQuery = { email: "invalid-email" };

      expect(() => validateMailchimpAudiencesQuery(invalidQuery)).toThrow(
        ValidationError,
      );
    });

    it("should throw ValidationError for invalid count", () => {
      const invalidQuery = { count: "0" }; // count must be >= 1

      expect(() => validateMailchimpAudiencesQuery(invalidQuery)).toThrow(
        ValidationError,
      );
    });
  });

  describe("validateCreateAudienceParams", () => {
    const validCreateParams = {
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
      campaign_defaults: {
        from_name: "Test Sender",
        from_email: "test@example.com",
        subject: "Test Subject",
        language: "en",
      },
      email_type_option: true,
    };

    it("should validate valid create parameters", () => {
      const result = validateCreateAudienceParams(validCreateParams);

      expect(result).toMatchObject(validCreateParams);
      expect(result.use_archive_bar).toBe(true); // default value
      expect(result.visibility).toBe("pub"); // default value
    });

    it("should throw ValidationError for missing required fields", () => {
      const { name, ...invalidParams } = validCreateParams;

      expect(() => validateCreateAudienceParams(invalidParams)).toThrow(
        ValidationError,
      );
    });

    it("should throw ValidationError for invalid email in campaign_defaults", () => {
      const invalidParams = {
        ...validCreateParams,
        campaign_defaults: {
          ...validCreateParams.campaign_defaults,
          from_email: "invalid-email",
        },
      };

      expect(() => validateCreateAudienceParams(invalidParams)).toThrow(
        ValidationError,
      );
    });

    it("should validate optional fields", () => {
      const paramsWithOptionals = {
        ...validCreateParams,
        notify_on_subscribe: "admin@example.com",
        notify_on_unsubscribe: "admin@example.com",
        use_archive_bar: false,
        visibility: "prv" as const,
      };

      const result = validateCreateAudienceParams(paramsWithOptionals);

      expect(result.notify_on_subscribe).toBe("admin@example.com");
      expect(result.notify_on_unsubscribe).toBe("admin@example.com");
      expect(result.use_archive_bar).toBe(false);
      expect(result.visibility).toBe("prv");
    });
  });

  describe("validateUpdateAudienceParams", () => {
    it("should validate valid update parameters", () => {
      const validUpdateParams = {
        id: "abc123",
        name: "Updated Audience Name",
      };

      const result = validateUpdateAudienceParams(validUpdateParams);

      expect(result).toMatchObject(validUpdateParams);
      expect(result.id).toBe("abc123");
      expect(result.name).toBe("Updated Audience Name");
    });

    it("should throw ValidationError for missing id", () => {
      const invalidParams = { name: "Test" };

      expect(() => validateUpdateAudienceParams(invalidParams)).toThrow(
        ValidationError,
      );
    });

    it("should allow partial updates", () => {
      const partialUpdate = {
        id: "abc123",
        name: "New Name",
        email_type_option: false,
      };

      const result = validateUpdateAudienceParams(partialUpdate);

      expect(result).toMatchObject(partialUpdate);
      expect(result.id).toBe("abc123");
      expect(result.name).toBe("New Name");
      expect(result.email_type_option).toBe(false);
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
      const { id, ...invalidAudience } = validAudience;

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
