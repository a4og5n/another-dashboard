import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

// Mock the Mailchimp service
vi.mock("@/services", () => ({
  getMailchimpService: () => ({
    getLists: vi.fn().mockResolvedValue({
      success: true,
      data: {
        lists: [],
        total_items: 0,
        constraints: {
          may_create: true,
          max_instances: 100,
          current_total_instances: 0,
        },
      },
      rateLimit: { limit: 1000, remaining: 999 },
    }),
  }),
}));

describe("Mailchimp Audiences API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Query Parameter Validation", () => {
    it("should validate and apply default values for empty query", async () => {
      const request = new NextRequest(
        "http://localhost/api/mailchimp/audiences",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.metadata.query).toMatchObject({
        count: 10, // Schema default
        offset: 0,
        sort_field: "date_created",
        sort_dir: "DESC",
      });
    });

    it("should validate and coerce count parameter", async () => {
      const request = new NextRequest(
        "http://localhost/api/mailchimp/audiences?count=25",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.metadata.query.count).toBe(25);
    });

    it("should validate email parameter", async () => {
      const request = new NextRequest(
        "http://localhost/api/mailchimp/audiences?email=test@example.com",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.metadata.query.email).toBe("test@example.com");
    });

    it("should reject invalid email parameter", async () => {
      const request = new NextRequest(
        "http://localhost/api/mailchimp/audiences?email=invalid-email",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid query parameters");
      expect(data.validation_errors).toBeDefined();
    });

    it("should reject invalid count parameter", async () => {
      const request = new NextRequest(
        "http://localhost/api/mailchimp/audiences?count=abc",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid query parameters");
    });

    it("should reject count parameter exceeding maximum", async () => {
      const request = new NextRequest(
        "http://localhost/api/mailchimp/audiences?count=2000",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid query parameters");
    });

    it("should validate date parameters", async () => {
      const request = new NextRequest(
        "http://localhost/api/mailchimp/audiences?since_date_created=2024-01-01T00:00:00Z",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.metadata.query.since_date_created).toBe(
        "2024-01-01T00:00:00Z",
      );
    });

    it("should reject invalid date parameters", async () => {
      const request = new NextRequest(
        "http://localhost/api/mailchimp/audiences?since_date_created=invalid-date",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid query parameters");
    });

    it("should validate sort parameters", async () => {
      const request = new NextRequest(
        "http://localhost/api/mailchimp/audiences?sort_field=member_count&sort_dir=ASC",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.metadata.query.sort_field).toBe("member_count");
      expect(data.metadata.query.sort_dir).toBe("ASC");
    });

    it("should reject invalid sort field", async () => {
      const request = new NextRequest(
        "http://localhost/api/mailchimp/audiences?sort_field=invalid_field",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid query parameters");
    });

    it("should handle comma-separated fields parameter", async () => {
      const request = new NextRequest(
        "http://localhost/api/mailchimp/audiences?fields=id,name,stats.member_count",
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      // The fields should be transformed to array format for service layer
    });
  });
});
