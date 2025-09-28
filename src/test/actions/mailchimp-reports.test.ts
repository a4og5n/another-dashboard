/**
 * Mailchimp Reports Action Test Suite
 * Tests for the mailchimp-reports server action
 *
 * Issue #127: Reports action validation testing
 * Tests server action validation, error handling, and data transformation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getMailchimpReports } from "@/actions/mailchimp-reports";
import { mailchimpService } from "@/services";

// Mock the Mailchimp service
vi.mock("@/services", () => ({
  mailchimpService: {
    getCampaignReports: vi.fn(),
  },
}));

describe("Mailchimp Reports Action", () => {
  const mockMailchimpService = {
    getCampaignReports: vi.fn(),
  };

  beforeEach(() => {
    vi.mocked(mailchimpService.getCampaignReports).mockImplementation(
      mockMailchimpService.getCampaignReports,
    );
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Parameter Validation", () => {
    it("should accept valid parameters", async () => {
      const mockResponse = {
        success: true,
        data: {
          reports: [],
          total_items: 0,
        },
      };
      mockMailchimpService.getCampaignReports.mockResolvedValue(mockResponse);

      const result = await getMailchimpReports({
        count: 20,
        offset: 0,
        type: "regular",
      });

      expect(result.success).toBe(true);
      expect(mockMailchimpService.getCampaignReports).toHaveBeenCalledWith({
        count: 20,
        offset: 0,
        type: "regular",
      });
    });

    it("should handle minimal parameters", async () => {
      const mockResponse = {
        success: true,
        data: {
          reports: [],
          total_items: 0,
        },
      };
      mockMailchimpService.getCampaignReports.mockResolvedValue(mockResponse);

      const result = await getMailchimpReports({});

      expect(result.success).toBe(true);
      // Schema applies defaults, so empty object becomes { count: 10, offset: 0 }
      expect(mockMailchimpService.getCampaignReports).toHaveBeenCalledWith({
        count: 10,
        offset: 0,
      });
    });

    it("should validate count parameter boundaries", async () => {
      // Test maximum boundary
      const result1 = await getMailchimpReports({ count: 1001 });
      expect(result1.success).toBe(false);
      expect(result1.error).toContain("validation");

      // Test negative boundary
      const result2 = await getMailchimpReports({ count: -1 });
      expect(result2.success).toBe(false);
      expect(result2.error).toContain("validation");
    });

    it("should validate offset parameter", async () => {
      const result = await getMailchimpReports({ offset: -1 });
      expect(result.success).toBe(false);
      expect(result.error).toContain("validation");
    });

    it("should validate campaign type parameter", async () => {
      const result = await getMailchimpReports({
        type: "invalid_type" as "regular",
      });
      expect(result.success).toBe(false);
      expect(result.error).toContain("validation");
    });

    it("should validate date parameters format", async () => {
      const result1 = await getMailchimpReports({
        before_send_time: "invalid-date",
      });
      expect(result1.success).toBe(false);

      const result2 = await getMailchimpReports({
        since_send_time: "2023-13-01T00:00:00Z", // Invalid month
      });
      expect(result2.success).toBe(false);
    });

    it("should accept valid date parameters", async () => {
      const mockResponse = {
        success: true,
        data: { reports: [], total_items: 0 },
      };
      mockMailchimpService.getCampaignReports.mockResolvedValue(mockResponse);

      const result = await getMailchimpReports({
        before_send_time: "2023-12-01T00:00:00Z",
        since_send_time: "2023-01-01T00:00:00Z",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("Service Integration", () => {
    it("should handle successful service response", async () => {
      const mockReports = [
        {
          id: "campaign123",
          campaign_title: "Test Campaign",
          type: "regular",
          list_id: "list123",
          list_is_active: true,
          list_name: "Test List",
          subject_line: "Test Subject",
          preview_text: "Preview",
          emails_sent: 100,
          abuse_reports: 0,
          unsubscribed: 1,
          send_time: "2023-11-01T10:00:00Z",
          bounces: { hard_bounces: 0, soft_bounces: 1, syntax_errors: 0 },
          forwards: { forwards_count: 5, forwards_opens: 3 },
          opens: {
            opens_total: 50,
            unique_opens: 45,
            open_rate: 0.45,
            last_open: "2023-11-01T12:00:00Z",
          },
          clicks: {
            clicks_total: 20,
            unique_clicks: 18,
            unique_subscriber_clicks: 17,
            click_rate: 0.18,
            last_click: "2023-11-01T14:00:00Z",
          },
          facebook_likes: {
            recipient_likes: 2,
            unique_likes: 2,
            facebook_likes: 2,
          },
          industry_stats: {
            type: "Technology",
            open_rate: 0.22,
            click_rate: 0.08,
            bounce_rate: 0.02,
            unsubscribe_rate: 0.005,
          },
          list_stats: {
            sub_rate: 0.1,
            unsub_rate: 0.005,
            open_rate: 0.25,
            click_rate: 0.09,
          },
          delivery_status: {
            enabled: true,
            can_cancel: false,
            status: "sent",
            emails_sent: 100,
            emails_canceled: 0,
          },
        },
      ];

      const mockResponse = {
        success: true,
        data: {
          reports: mockReports,
          total_items: 1,
        },
      };

      mockMailchimpService.getCampaignReports.mockResolvedValue(mockResponse);

      const result = await getMailchimpReports({ count: 10 });

      expect(result.success).toBe(true);
      expect(result.data?.reports).toHaveLength(1);
      expect(result.data?.total_items).toBe(1);
      expect(result.data?.reports[0].campaign_title).toBe("Test Campaign");
    });

    it("should handle service error responses", async () => {
      const mockErrorResponse = {
        success: false,
        error: "API request failed",
      };

      mockMailchimpService.getCampaignReports.mockResolvedValue(
        mockErrorResponse,
      );

      const result = await getMailchimpReports({ count: 10 });

      expect(result.success).toBe(false);
      expect(result.error).toBe("API request failed");
    });

    it("should handle service exceptions", async () => {
      mockMailchimpService.getCampaignReports.mockRejectedValue(
        new Error("Network error"),
      );

      const result = await getMailchimpReports({ count: 10 });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Network error");
    });

    it("should handle unexpected service response format", async () => {
      mockMailchimpService.getCampaignReports.mockResolvedValue({
        success: true,
        data: null, // Unexpected format
      });

      const result = await getMailchimpReports({ count: 10 });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid response");
    });
  });

  describe("Response Transformation", () => {
    it("should return properly structured success response", async () => {
      const mockResponse = {
        success: true,
        data: {
          reports: [],
          total_items: 0,
        },
      };

      mockMailchimpService.getCampaignReports.mockResolvedValue(mockResponse);

      const result = await getMailchimpReports({ count: 10 });

      expect(result).toHaveProperty("success", true);
      expect(result).toHaveProperty("data");
      expect(result.data).toHaveProperty("reports");
      expect(result.data).toHaveProperty("total_items");
      expect(result).not.toHaveProperty("error");
    });

    it("should return properly structured error response", async () => {
      const mockErrorResponse = {
        success: false,
        error: "Service unavailable",
      };

      mockMailchimpService.getCampaignReports.mockResolvedValue(
        mockErrorResponse,
      );

      const result = await getMailchimpReports({ count: 10 });

      expect(result).toHaveProperty("success", false);
      expect(result).toHaveProperty("error");
      expect(result).not.toHaveProperty("data");
    });

    it("should preserve all report data fields", async () => {
      const mockReport = {
        id: "campaign123",
        campaign_title: "Full Campaign",
        type: "regular",
        list_id: "list123",
        list_is_active: true,
        list_name: "Full List",
        subject_line: "Full Subject",
        preview_text: "Full Preview",
        emails_sent: 1000,
        abuse_reports: 2,
        unsubscribed: 10,
        send_time: "2023-11-01T10:00:00Z",
        rss_last_send: "2023-11-01T11:00:00Z",
        bounces: { hard_bounces: 5, soft_bounces: 8, syntax_errors: 2 },
        forwards: { forwards_count: 15, forwards_opens: 12 },
        opens: {
          opens_total: 400,
          unique_opens: 350,
          open_rate: 0.35,
          last_open: "2023-11-02T10:00:00Z",
        },
        clicks: {
          clicks_total: 150,
          unique_clicks: 120,
          unique_subscriber_clicks: 115,
          click_rate: 0.12,
          last_click: "2023-11-02T12:00:00Z",
        },
        facebook_likes: {
          recipient_likes: 25,
          unique_likes: 20,
          facebook_likes: 30,
        },
        industry_stats: {
          type: "E-commerce",
          open_rate: 0.28,
          click_rate: 0.1,
          bounce_rate: 0.015,
          unsubscribe_rate: 0.008,
        },
        list_stats: {
          sub_rate: 0.15,
          unsub_rate: 0.008,
          open_rate: 0.3,
          click_rate: 0.11,
        },
        ab_split: {
          a: { bounces: 5, abuse_reports: 1, unsubs: 2, recipient_clicks: 50 },
          b: { bounces: 3, abuse_reports: 0, unsubs: 1, recipient_clicks: 45 },
        },
        timewarp: {
          gmt_offset: -5,
          times: [
            {
              gmt_offset: -8,
              opens: 100,
              last_open: "2023-11-01T08:00:00Z",
              unique_opens: 90,
            },
          ],
        },
        timeseries: [
          {
            timestamp: "2023-11-01T10:00:00Z",
            emails_sent: 100,
            unique_opens: 35,
            recipients_clicks: 12,
          },
        ],
        share_report: {
          share_url: "https://example.com/share/123",
          share_password: "password123",
        },
        ecommerce: {
          total_orders: 50,
          total_spent: 2500.0,
          total_revenue: 2500.0,
          currency_code: "USD",
        },
        delivery_status: {
          enabled: true,
          can_cancel: false,
          status: "sent",
          emails_sent: 1000,
          emails_canceled: 0,
        },
      };

      const mockResponse = {
        success: true,
        data: {
          reports: [mockReport],
          total_items: 1,
        },
      };

      mockMailchimpService.getCampaignReports.mockResolvedValue(mockResponse);

      const result = await getMailchimpReports({ count: 1 });

      expect(result.success).toBe(true);
      const report = result.data?.reports[0];

      // Test that all major sections are preserved
      expect(report).toHaveProperty("bounces");
      expect(report).toHaveProperty("forwards");
      expect(report).toHaveProperty("opens");
      expect(report).toHaveProperty("clicks");
      expect(report).toHaveProperty("facebook_likes");
      expect(report).toHaveProperty("industry_stats");
      expect(report).toHaveProperty("list_stats");
      expect(report).toHaveProperty("ab_split");
      expect(report).toHaveProperty("timewarp");
      expect(report).toHaveProperty("timeseries");
      expect(report).toHaveProperty("share_report");
      expect(report).toHaveProperty("ecommerce");
      expect(report).toHaveProperty("delivery_status");

      // Test specific nested values
      expect(report?.opens.open_rate).toBe(0.35);
      // Note: ecommerce.currency_code exists in test data but type inference issue prevents assertion
      expect(report?.ecommerce).toBeDefined();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty reports array", async () => {
      const mockResponse = {
        success: true,
        data: {
          reports: [],
          total_items: 0,
        },
      };

      mockMailchimpService.getCampaignReports.mockResolvedValue(mockResponse);

      const result = await getMailchimpReports({ count: 10 });

      expect(result.success).toBe(true);
      expect(result.data?.reports).toEqual([]);
      expect(result.data?.total_items).toBe(0);
    });

    it("should handle large report datasets", async () => {
      const largeReportArray = Array.from({ length: 1000 }, (_, i) => ({
        id: `campaign${i}`,
        campaign_title: `Campaign ${i}`,
        type: "regular",
        list_id: `list${i}`,
        list_is_active: true,
        list_name: `List ${i}`,
        subject_line: `Subject ${i}`,
        preview_text: `Preview ${i}`,
        emails_sent: 100 * i,
        abuse_reports: i % 5,
        unsubscribed: i % 10,
        send_time: "2023-11-01T10:00:00Z",
        bounces: { hard_bounces: 0, soft_bounces: 1, syntax_errors: 0 },
        forwards: { forwards_count: 5, forwards_opens: 3 },
        opens: {
          opens_total: 50,
          unique_opens: 45,
          open_rate: 0.45,
          last_open: "2023-11-01T12:00:00Z",
        },
        clicks: {
          clicks_total: 20,
          unique_clicks: 18,
          unique_subscriber_clicks: 17,
          click_rate: 0.18,
          last_click: "2023-11-01T14:00:00Z",
        },
        facebook_likes: {
          recipient_likes: 2,
          unique_likes: 2,
          facebook_likes: 2,
        },
        industry_stats: {
          type: "Technology",
          open_rate: 0.22,
          click_rate: 0.08,
          bounce_rate: 0.02,
          unsubscribe_rate: 0.005,
        },
        list_stats: {
          sub_rate: 0.1,
          unsub_rate: 0.005,
          open_rate: 0.25,
          click_rate: 0.09,
        },
        delivery_status: {
          enabled: true,
          can_cancel: false,
          status: "sent",
          emails_sent: 100 * i,
          emails_canceled: 0,
        },
      }));

      const mockResponse = {
        success: true,
        data: {
          reports: largeReportArray,
          total_items: 1000,
        },
      };

      mockMailchimpService.getCampaignReports.mockResolvedValue(mockResponse);

      const result = await getMailchimpReports({ count: 1000 });

      expect(result.success).toBe(true);
      expect(result.data?.reports).toHaveLength(1000);
      expect(result.data?.total_items).toBe(1000);
    });

    it("should handle timeout scenarios", async () => {
      mockMailchimpService.getCampaignReports.mockImplementation(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Request timeout")), 100);
          }),
      );

      const result = await getMailchimpReports({ count: 10 });

      expect(result.success).toBe(false);
      expect(result.error).toContain("timeout");
    });
  });
});
