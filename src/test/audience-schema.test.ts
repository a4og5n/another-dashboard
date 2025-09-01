import { describe, it, expect } from "vitest";
import {
  MailchimpAudienceSchema,
  MailchimpAudienceQuerySchema,
  MailchimpAudienceQueryInternalSchema,
  transformQueryParams,
  MailchimpAudienceResponseSchema,
  mailchimpAudienceErrorResponseSchema,
} from "@/schemas/mailchimp";

// Example valid audience object
const validAudience = {
  id: "abc123",
  name: "Test Audience",
  contact: {
    company: "Test Co",
    address1: "123 Main St",
    city: "Testville",
    state: "TS",
    zip: "12345",
    country: "US",
  },
  permission_reminder: "You are receiving this email because you signed up.",
  use_archive_bar: true,
  campaign_defaults: {
    from_name: "Sender",
    from_email: "sender@example.com",
    subject: "Welcome",
    language: "en",
  },
  email_type_option: true,
  visibility: "pub",
  stats: {
    member_count: 100,
    unsubscribe_count: 5,
    cleaned_count: 2,
  },
  list_rating: 3,
  date_created: "2025-08-30T00:00:00Z",
};

describe("MailchimpAudienceSchema", () => {
  it("validates a correct audience object", () => {
    expect(() => MailchimpAudienceSchema.parse(validAudience)).not.toThrow();
  });

  it("throws on missing required fields", () => {
    expect(() => MailchimpAudienceSchema.parse({})).toThrow();
  });
});

describe("MailchimpAudienceQuerySchema", () => {
  it("applies default values correctly", () => {
    const result = MailchimpAudienceQuerySchema.parse({});
    expect(result).toMatchObject({
      count: 10,
      offset: 0,
      sort_field: "date_created",
      sort_dir: "DESC",
    });
  });

  it("validates and coerces count parameter", () => {
    const result = MailchimpAudienceQuerySchema.parse({ count: "25" });
    expect(result.count).toBe(25);
  });

  it("validates email parameter", () => {
    const validQuery = { email: "test@example.com" };
    expect(() => MailchimpAudienceQuerySchema.parse(validQuery)).not.toThrow();
  });

  it("rejects invalid email", () => {
    const invalidQuery = { email: "invalid-email" };
    expect(() => MailchimpAudienceQuerySchema.parse(invalidQuery)).toThrow();
  });

  it("validates date parameters", () => {
    const validQuery = {
      before_date_created: "2023-12-31T23:59:59Z",
      since_date_created: "2023-01-01T00:00:00Z",
    };
    expect(() => MailchimpAudienceQuerySchema.parse(validQuery)).not.toThrow();
  });

  it("validates sort parameters", () => {
    const validQuery = {
      sort_field: "member_count",
      sort_dir: "ASC",
    };
    const result = MailchimpAudienceQuerySchema.parse(validQuery);
    expect(result.sort_field).toBe("member_count");
    expect(result.sort_dir).toBe("ASC");
  });

  it("handles comma-separated fields", () => {
    const query = {
      fields: "id,name,stats.member_count",
      exclude_fields: "contact,campaign_defaults",
    };
    expect(() => MailchimpAudienceQuerySchema.parse(query)).not.toThrow();
  });
});

describe("MailchimpAudienceQueryInternalSchema", () => {
  it("accepts array fields for internal use", () => {
    const query = {
      fields: ["id", "name", "stats.member_count"],
      exclude_fields: ["contact", "campaign_defaults"],
    };
    expect(() =>
      MailchimpAudienceQueryInternalSchema.parse(query),
    ).not.toThrow();
  });
});

describe("transformQueryParams", () => {
  it("transforms comma-separated fields to arrays", () => {
    const input = {
      fields: "id,name,stats.member_count",
      exclude_fields: "contact,campaign_defaults",
      count: 20,
      offset: 0,
      sort_field: "date_created",
      sort_dir: "DESC",
    } as const;

    const result = transformQueryParams(input);
    expect(result.fields).toEqual(["id", "name", "stats.member_count"]);
    expect(result.exclude_fields).toEqual(["contact", "campaign_defaults"]);
  });

  it("handles undefined fields", () => {
    const input = {
      count: 10,
      offset: 0,
      sort_field: "date_created",
      sort_dir: "DESC",
    } as const;
    const result = transformQueryParams(input);
    expect(result.fields).toBeUndefined();
    expect(result.exclude_fields).toBeUndefined();
  });

  it("trims whitespace from field names", () => {
    const input = {
      fields: " id , name , stats.member_count ",
      count: 10,
      offset: 0,
      sort_field: "date_created",
      sort_dir: "DESC",
    } as const;

    const result = transformQueryParams(input);
    expect(result.fields).toEqual(["id", "name", "stats.member_count"]);
  });
});

describe("MailchimpAudienceResponseSchema", () => {
  it("validates a correct response", () => {
    expect(() =>
      MailchimpAudienceResponseSchema.parse({
        lists: [validAudience],
        total_items: 1,
        constraints: {
          may_create: true,
          max_instances: 100,
          current_total_instances: 5,
        },
      }),
    ).not.toThrow();
  });

  it("validates response with optional _links", () => {
    expect(() =>
      MailchimpAudienceResponseSchema.parse({
        lists: [validAudience],
        total_items: 1,
        constraints: {
          may_create: false,
          max_instances: 50,
          current_total_instances: 50,
        },
        _links: [
          {
            rel: "self",
            href: "https://us1.api.mailchimp.com/3.0/lists",
            method: "GET",
          },
        ],
      }),
    ).not.toThrow();
  });

  it("fails validation with old 'audiences' property", () => {
    expect(() =>
      MailchimpAudienceResponseSchema.parse({
        audiences: [validAudience], // Wrong property name
        total_items: 1,
        constraints: {
          may_create: true,
          max_instances: 100,
          current_total_instances: 5,
        },
      }),
    ).toThrow();
  });
});

describe("mailchimpAudienceErrorResponseSchema", () => {
  it("validates a correct error response", () => {
    expect(() =>
      mailchimpAudienceErrorResponseSchema.parse({
        type: "error",
        title: "Invalid Audience",
        status: 400,
        detail: "Audience not found.",
        audience_id: "abc123",
      }),
    ).not.toThrow();
  });
});
