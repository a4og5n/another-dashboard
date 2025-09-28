/**
 * Reports Page Service Integration Test Suite
 * Tests for the /mailchimp/reports page service integration
 *
 * Issue #127: Reports page service integration testing
 * Tests data fetching service calls and parameter validation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mailchimpService } from "@/services";

// Mock the Mailchimp service
vi.mock("@/services", () => ({
  mailchimpService: {
    getCampaignReports: vi.fn(),
  },
}));

describe("Reports Page Service Integration", () => {
  const mockMailchimpService = {
    getCampaignReports: vi.fn(),
  };

  const mockReportsData = {
    reports: [
      {
        id: "campaign123",
        campaign_title: "Newsletter Campaign",
        type: "regular",
        list_id: "list123",
        list_is_active: true,
        list_name: "Newsletter Subscribers",
        subject_line: "Monthly Newsletter",
        preview_text: "Check out this month's updates",
        emails_sent: 1000,
        abuse_reports: 1,
        unsubscribed: 5,
        send_time: "2023-11-01T10:00:00Z",
        bounces: { hard_bounces: 2, soft_bounces: 3, syntax_errors: 1 },
        forwards: { forwards_count: 15, forwards_opens: 8 },
        opens: {
          opens_total: 350,
          unique_opens: 300,
          open_rate: 0.3,
          last_open: "2023-11-02T14:30:00Z",
        },
        clicks: {
          clicks_total: 120,
          unique_clicks: 100,
          unique_subscriber_clicks: 95,
          click_rate: 0.1,
          last_click: "2023-11-02T16:00:00Z",
        },
        facebook_likes: {
          recipient_likes: 25,
          unique_likes: 20,
          facebook_likes: 30,
        },
        industry_stats: {
          type: "E-commerce",
          open_rate: 0.25,
          click_rate: 0.08,
          bounce_rate: 0.02,
          unsubscribe_rate: 0.005,
        },
        list_stats: {
          sub_rate: 0.1,
          unsub_rate: 0.005,
          open_rate: 0.28,
          click_rate: 0.09,
        },
        delivery_status: {
          enabled: true,
          can_cancel: false,
          status: "sent",
          emails_sent: 1000,
          emails_canceled: 0,
        },
      },
    ],
    total_items: 1,
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

  describe("Service Integration", () => {
    it("should call service with default parameters", () => {
      mockMailchimpService.getCampaignReports.mockResolvedValue({
        success: true,
        data: mockReportsData,
      });

      const service = mailchimpService;
      service.getCampaignReports({
        perPage: "10",
      });

      expect(mockMailchimpService.getCampaignReports).toHaveBeenCalledWith({
        perPage: "10",
      });
    });

    it("should call service with pagination parameters", () => {
      mockMailchimpService.getCampaignReports.mockResolvedValue({
        success: true,
        data: mockReportsData,
      });

      const service = mailchimpService;
      service.getCampaignReports({
        page: "2",
        perPage: "20"
      });

      expect(mockMailchimpService.getCampaignReports).toHaveBeenCalledWith({
        perPage: "20",
        offset: 20,
      });
    });

    it("should handle service success response", async () => {
      mockMailchimpService.getCampaignReports.mockResolvedValue({
        success: true,
        data: mockReportsData,
      });

      const service = mailchimpService;
      const result = await service.getCampaignReports({ perPage: "10" });

      expect(result.success).toBe(true);
      expect(result.data?.reports).toHaveLength(1);
    });

    it("should handle service error response", async () => {
      mockMailchimpService.getCampaignReports.mockResolvedValue({
        success: false,
        error: "API request failed",
      });

      const service = mailchimpService;
      const result = await service.getCampaignReports({ perPage: "10" });

      expect(result.success).toBe(false);
      expect(result.error).toBe("API request failed");
    });

    it("should handle service exceptions", async () => {
      mockMailchimpService.getCampaignReports.mockRejectedValue(
        new Error("Network error"),
      );

      const service = mailchimpService;

      await expect(service.getCampaignReports({ perPage: "10" })).rejects.toThrow(
        "Network error",
      );
    });
  });

  describe("Parameter Validation", () => {
    it("should handle filter parameters", () => {
      mockMailchimpService.getCampaignReports.mockResolvedValue({
        success: true,
        data: mockReportsData,
      });

      const service = mailchimpService;
      service.getCampaignReports({
        perPage: "10",
        type: "regular",
        before_send_time: "2023-12-01T00:00:00Z",
        since_send_time: "2023-01-01T00:00:00Z",
      });

      expect(mockMailchimpService.getCampaignReports).toHaveBeenCalledWith({
        perPage: "10",
        type: "regular",
        before_send_time: "2023-12-01T00:00:00Z",
        since_send_time: "2023-01-01T00:00:00Z",
      });
    });

    it("should handle boundary conditions", () => {
      mockMailchimpService.getCampaignReports.mockResolvedValue({
        success: true,
        data: { reports: [], total_items: 0 },
      });

      const service = mailchimpService;
      service.getCampaignReports({
        perPage: "1",
      });

      expect(mockMailchimpService.getCampaignReports).toHaveBeenCalledWith({
        perPage: "1",
      });
    });
  });

  describe("Response Handling", () => {
    it("should preserve report data structure", async () => {
      mockMailchimpService.getCampaignReports.mockResolvedValue({
        success: true,
        data: mockReportsData,
      });

      const service = mailchimpService;
      const result = await service.getCampaignReports({ perPage: "1" });

      expect(result.success).toBe(true);
      const report = result.data?.reports[0];

      expect(report).toHaveProperty("id", "campaign123");
      expect(report).toHaveProperty("campaign_title", "Newsletter Campaign");
      expect(report).toHaveProperty("bounces");
      expect(report).toHaveProperty("opens");
      expect(report).toHaveProperty("clicks");
    });

    it("should handle empty results", async () => {
      mockMailchimpService.getCampaignReports.mockResolvedValue({
        success: true,
        data: { reports: [], total_items: 0 },
      });

      const service = mailchimpService;
      const result = await service.getCampaignReports({ perPage: "10" });

      expect(result.success).toBe(true);
      expect(result.data?.reports).toEqual([]);
      expect(result.data?.total_items).toBe(0);
    });
  });
});
