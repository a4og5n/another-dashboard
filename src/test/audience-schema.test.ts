import { describe, it, expect } from "vitest";
import {
  MailchimpAudienceSchema,
  MailchimpAudienceQuerySchema,
  MailchimpAudienceQueryInternalSchema,
  transformQueryParams,
  MailchimpAudienceSuccessSchema,
  MailchimpAudienceSimplified,
  mailchimpAudienceErrorResponseSchema,
} from "@/schemas/mailchimp";

// Realistic audience object based on actual Mailchimp API responses
// Includes comprehensive stats and optional fields that real API returns
const realisticAudience = {
  // Core identifiers (always present)
  id: "f4b8c2a1e9",
  name: "Newsletter Subscribers - Marketing Campaign 2025",

  // Contact information (required)
  contact: {
    company: "Acme Digital Marketing Inc.",
    address1: "1234 Business Ave Suite 200",
    address2: "Floor 2",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    country: "US",
    phone: "+1-555-123-4567",
  },

  // List settings (documented fields)
  permission_reminder:
    "You are receiving this email because you subscribed to our newsletter at acmedigital.com on 2024-03-15.",
  use_archive_bar: true,
  email_type_option: true,
  visibility: "pub",

  // Campaign defaults (always present)
  campaign_defaults: {
    from_name: "Acme Digital Team",
    from_email: "newsletter@acmedigital.com",
    subject: "Weekly Marketing Insights",
    language: "en",
  },

  // Notifications (often empty strings, not emails)
  notify_on_subscribe: "",
  notify_on_unsubscribe: "",

  // Timestamps (ISO format)
  date_created: "2024-03-15T14:30:22+00:00",

  // Rating (0-5 scale)
  list_rating: 4,

  // Comprehensive stats object (realistic values)
  stats: {
    // Core stats (always present)
    member_count: 12847,
    total_contacts: 15234, // Includes unsubscribed
    unsubscribe_count: 1891,
    cleaned_count: 496,

    // Campaign-related stats (may be present)
    member_count_since_send: 12847,
    unsubscribe_count_since_send: 23,
    cleaned_count_since_send: 7,
    campaign_count: 47,
    campaign_last_sent: "2025-01-28T09:15:00+00:00",

    // Engagement metrics (optional but commonly present)
    merge_field_count: 8,
    avg_sub_rate: 0.0234,
    avg_unsub_rate: 0.0089,
    target_sub_rate: 0.025,
    open_rate: 0.2847,
    click_rate: 0.0456,

    // Activity timestamps (when available)
    last_sub_date: "2025-01-30T16:22:45+00:00",
    last_unsub_date: "2025-01-29T11:08:12+00:00",
  },

  // Optional arrays (may be present)
  modules: ["signup_forms", "campaigns", "automation"],

  // Marketing permissions (generic structure)
  marketing_permissions: true,

  // Questionable fields that may appear in real responses
  web_id: 1234567,
  subscribe_url_short: "https://eepurl.com/abc123",
  subscribe_url_long:
    "https://acmedigital.us12.list-manage.com/subscribe?u=abc123&id=def456",
  beamer_address: "def456.12847.list@acmedigital.com",
  double_optin: true,
  has_welcome: true,
};

// Minimal audience object for testing required fields only
const minimalAudience = {
  id: "min123",
  name: "Minimal Test List",
  contact: {
    company: "Test Co",
    address1: "123 Main St",
    city: "Testville",
    state: "TS",
    zip: "12345",
    country: "US",
  },
  permission_reminder: "You subscribed to our list.",
  use_archive_bar: false,
  email_type_option: false,
  visibility: "prv" as const,
  campaign_defaults: {
    from_name: "Test Sender",
    from_email: "test@example.com",
    subject: "Test Subject",
    language: "en",
  },
  date_created: "2024-01-01T00:00:00+00:00",
  list_rating: 0,
  stats: {
    member_count: 0,
    unsubscribe_count: 0,
    cleaned_count: 0,
  },
};

describe("MailchimpAudienceSchema", () => {
  it("validates a realistic audience object with all fields", () => {
    expect(() =>
      MailchimpAudienceSchema.parse(realisticAudience),
    ).not.toThrow();
  });

  it("validates a minimal audience object with only required fields", () => {
    expect(() => MailchimpAudienceSchema.parse(minimalAudience)).not.toThrow();
  });

  it("throws on missing required fields", () => {
    expect(() => MailchimpAudienceSchema.parse({})).toThrow();
  });

  it("throws on missing required contact fields", () => {
    const invalidAudience = {
      ...minimalAudience,
      contact: { company: "Test" }, // Missing required address fields
    };
    expect(() => MailchimpAudienceSchema.parse(invalidAudience)).toThrow();
  });

  it("throws on invalid email in campaign_defaults", () => {
    const invalidAudience = {
      ...minimalAudience,
      campaign_defaults: {
        ...minimalAudience.campaign_defaults,
        from_email: "invalid-email",
      },
    };
    expect(() => MailchimpAudienceSchema.parse(invalidAudience)).toThrow();
  });

  it("throws on invalid visibility enum", () => {
    const invalidAudience = {
      ...minimalAudience,
      visibility: "invalid",
    };
    expect(() => MailchimpAudienceSchema.parse(invalidAudience)).toThrow();
  });

  it("throws on invalid list_rating range", () => {
    const invalidAudience = {
      ...minimalAudience,
      list_rating: 10, // Max is 5
    };
    expect(() => MailchimpAudienceSchema.parse(invalidAudience)).toThrow();
  });

  it("accepts optional fields when present", () => {
    const audienceWithOptionals = {
      ...minimalAudience,
      web_id: 123456,
      subscribe_url_short: "https://eepurl.com/test",
      modules: ["signup_forms"],
      stats: {
        ...minimalAudience.stats,
        total_contacts: 50,
        avg_sub_rate: 0.02,
        open_rate: 0.25,
        campaign_last_sent: "2024-12-01T10:00:00+00:00",
      },
    };
    expect(() =>
      MailchimpAudienceSchema.parse(audienceWithOptionals),
    ).not.toThrow();
  });

  it("accepts optional contact fields", () => {
    const audienceWithOptionalContact = {
      ...minimalAudience,
      contact: {
        ...minimalAudience.contact,
        address2: "Suite 100",
        phone: "+1-555-123-4567",
      },
    };
    expect(() =>
      MailchimpAudienceSchema.parse(audienceWithOptionalContact),
    ).not.toThrow();
  });
});

describe("MailchimpAudienceQuerySchema", () => {
  it("applies default values correctly", () => {
    const result = MailchimpAudienceQuerySchema.parse({});
    expect(result).toMatchObject({
      count: 10,
      offset: 0,
    });
  });

  it("validates and coerces count parameter", () => {
    const result = MailchimpAudienceQuerySchema.parse({ count: "25" });
    expect(result.count).toBe(25);
  });

  it("only accepts supported parameters", () => {
    const validQuery = {
      fields: "id,name,stats.member_count",
      exclude_fields: "contact,campaign_defaults",
      count: 25,
      offset: 10,
    };
    expect(() => MailchimpAudienceQuerySchema.parse(validQuery)).not.toThrow();
  });

  it("rejects unsupported parameters", () => {
    const invalidQuery = {
      count: 10,
      offset: 0,
      email: "test@example.com", // Unsupported parameter
      sort_field: "date_created", // Unsupported parameter
      before_date_created: "2023-12-31T23:59:59Z", // Unsupported parameter
    };
    // This should fail because the schema doesn't accept these parameters
    expect(() => MailchimpAudienceQuerySchema.parse(invalidQuery)).toThrow();
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
    } as const;

    const result = transformQueryParams(input);
    expect(result.fields).toEqual(["id", "name", "stats.member_count"]);
    expect(result.exclude_fields).toEqual(["contact", "campaign_defaults"]);
  });

  it("handles undefined fields", () => {
    const input = {
      count: 10,
      offset: 0,
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
    } as const;

    const result = transformQueryParams(input);
    expect(result.fields).toEqual(["id", "name", "stats.member_count"]);
  });
});

describe("MailchimpAudienceSuccessSchema", () => {
  it("validates a simplified response with multiple audiences", () => {
    expect(() =>
      MailchimpAudienceSuccessSchema.parse({
        audiences: [
          {
            id: "f4b8c2a1e9",
            name: "Newsletter Subscribers",
            stats: { total_contacts: 12847 },
          },
          {
            id: "min123",
            name: "Minimal Test List",
            stats: { total_contacts: 0 },
          },
        ],
        total_items: 2,
      }),
    ).not.toThrow();
  });

  it("validates simplified audience object", () => {
    const simplifiedAudience = {
      id: "test123",
      name: "Test Audience",
      stats: { total_contacts: 100 },
    };
    expect(() =>
      MailchimpAudienceSimplified.parse(simplifiedAudience),
    ).not.toThrow();
  });

  it("validates empty response", () => {
    expect(() =>
      MailchimpAudienceSuccessSchema.parse({
        audiences: [],
        total_items: 0,
      }),
    ).not.toThrow();
  });

  it("fails validation with old 'lists' property", () => {
    expect(() =>
      MailchimpAudienceSuccessSchema.parse({
        lists: [{ id: "test", name: "Test", stats: { total_contacts: 100 } }], // Wrong property name
        total_items: 1,
      }),
    ).toThrow();
  });

  it("throws on missing required response fields", () => {
    expect(() =>
      MailchimpAudienceSuccessSchema.parse({
        audiences: [
          { id: "test", name: "Test", stats: { total_contacts: 100 } },
        ],
        // missing total_items
      }),
    ).toThrow();
  });

  it("throws on missing stats.total_contacts in audience", () => {
    expect(() =>
      MailchimpAudienceSuccessSchema.parse({
        audiences: [{ id: "test", name: "Test", stats: {} }], // missing total_contacts
        total_items: 1,
      }),
    ).toThrow();
  });
});

describe("mailchimpAudienceErrorResponseSchema", () => {
  it("validates a realistic error response", () => {
    expect(() =>
      mailchimpAudienceErrorResponseSchema.parse({
        type: "https://mailchimp.com/developer/marketing/docs/errors/",
        title: "Resource Not Found",
        status: 404,
        detail: "The requested resource could not be found.",
        instance: "/3.0/lists/f4b8c2a1e9",
      }),
    ).not.toThrow();
  });

  it("validates error response with different status codes", () => {
    const badRequestError = {
      type: "https://mailchimp.com/developer/marketing/docs/errors/",
      title: "Invalid Resource",
      status: 400,
      detail: "Your request parameters didn't validate.",
      instance: "/3.0/lists",
    };
    expect(() =>
      mailchimpAudienceErrorResponseSchema.parse(badRequestError),
    ).not.toThrow();

    const unauthorizedError = {
      type: "https://mailchimp.com/developer/marketing/docs/errors/",
      title: "API Key Invalid",
      status: 401,
      detail:
        "Your API key may be invalid, or you've attempted to access the wrong datacenter.",
      instance: "/3.0/lists/f4b8c2a1e9",
    };
    expect(() =>
      mailchimpAudienceErrorResponseSchema.parse(unauthorizedError),
    ).not.toThrow();
  });

  it("throws on missing required error fields", () => {
    expect(() =>
      mailchimpAudienceErrorResponseSchema.parse({
        type: "error",
        // missing title, status, detail
      }),
    ).toThrow();
  });
});
