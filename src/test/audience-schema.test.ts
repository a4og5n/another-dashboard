import { describe, it, expect } from "vitest";
import {
  MailchimpAudienceSchema,
  MailchimpAudienceQuerySchema,
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
  it("defaults offset to 0", () => {
    expect(MailchimpAudienceQuerySchema.parse({})).toHaveProperty("offset", 0);
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
