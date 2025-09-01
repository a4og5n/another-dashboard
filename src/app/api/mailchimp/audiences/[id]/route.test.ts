import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

// Mock the Mailchimp service
vi.mock("@/services", () => ({
  getMailchimpService: () => ({
    getList: vi.fn().mockResolvedValue({
      success: true,
      data: {
        id: "test123",
        name: "Test Audience",
        contact: {
          company: "Test Co",
          address1: "123 Main St",
          city: "Test City",
          state: "TS",
          zip: "12345",
          country: "US",
        },
        permission_reminder: "Test reminder",
        use_archive_bar: true,
        email_type_option: true,
        visibility: "pub",
        campaign_defaults: {
          from_name: "Test",
          from_email: "test@example.com",
          subject: "Test",
          language: "en",
        },
        date_created: "2024-01-01T00:00:00Z",
        list_rating: 3,
        stats: {
          member_count: 100,
          unsubscribe_count: 5,
          cleaned_count: 2,
        },
      },
      rateLimit: { limit: 1000, remaining: 999 },
    }),
  }),
}));

describe("Mailchimp Single Audience API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Audience ID Validation", () => {
    it("should validate and accept valid audience ID", async () => {
      const params = Promise.resolve({ id: "abc123def456" });
      const request = new NextRequest(
        "http://localhost/api/mailchimp/audiences/abc123def456",
      );

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.metadata.listId).toBe("abc123def456");
    });

    it("should reject empty audience ID", async () => {
      const params = Promise.resolve({ id: "" });
      const request = new NextRequest(
        "http://localhost/api/mailchimp/audiences/",
      );

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid audience ID");
      expect(data.validation_errors).toBeDefined();
    });

    it("should handle whitespace-only audience ID", async () => {
      const params = Promise.resolve({ id: "   " });
      const request = new NextRequest(
        "http://localhost/api/mailchimp/audiences/   ",
      );

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid audience ID");
    });

    it("should include validation error details", async () => {
      const params = Promise.resolve({ id: "" });
      const request = new NextRequest(
        "http://localhost/api/mailchimp/audiences/",
      );

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error");
      expect(data).toHaveProperty("details");
      expect(data).toHaveProperty("validation_errors");
    });
  });
});
