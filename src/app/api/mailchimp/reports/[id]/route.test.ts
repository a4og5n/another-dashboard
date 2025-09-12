/**
 * @vitest-environment node
 */
import { describe, it, expect, vi } from "vitest";
import { GET } from "./route";
import { NextRequest } from "next/server";

// Mock the service
const mockGetCampaignReport = vi.fn();
vi.mock("@/services", () => ({
  getMailchimpService: () => ({
    getCampaignReport: mockGetCampaignReport,
  }),
}));

describe("Campaign Report Detail API Route", () => {
  it("should return campaign report data successfully", async () => {
    const mockReport = {
      id: "test123",
      campaign_title: "Test Campaign",
      type: "regular" as const,
      list_id: "list123",
      list_is_active: true,
      list_name: "Test List",
      subject_line: "Test Subject",
      preview_text: "Test Preview",
      emails_sent: 100,
      abuse_reports: 0,
      unsubscribed: 1,
      send_time: "2025-09-05T12:00:00Z",
      bounces: { hard_bounces: 0, soft_bounces: 0, syntax_errors: 0 },
      forwards: { forwards_count: 0, forwards_opens: 0 },
      opens: {
        opens_total: 80,
        unique_opens: 75,
        open_rate: 0.8,
        last_open: "2025-09-05T13:00:00Z",
      },
      clicks: {
        clicks_total: 20,
        unique_clicks: 18,
        unique_subscriber_clicks: 15,
        click_rate: 0.2,
        last_click: "2025-09-05T14:00:00Z",
      },
      facebook_likes: {
        recipient_likes: 0,
        unique_likes: 0,
        facebook_likes: 0,
      },
      industry_stats: {
        type: "E-commerce",
        open_rate: 0.25,
        click_rate: 0.05,
        bounce_rate: 0.01,
        unopen_rate: 0.75,
        unsub_rate: 0.005,
        abuse_rate: 0.001,
      },
      list_stats: {
        sub_rate: 0.02,
        unsub_rate: 0.005,
        open_rate: 0.25,
        click_rate: 0.05,
      },
      share_report: {
        share_url: "https://example.com/share",
        share_password: "password123",
      },
      ecommerce: { total_orders: 0, total_spent: 0, total_revenue: 0 },
      delivery_status: {
        enabled: true,
        can_cancel: false,
        status: "delivered" as const,
        emails_sent: 100,
        emails_canceled: 0,
      },
    };

    mockGetCampaignReport.mockResolvedValue({
      success: true,
      data: mockReport,
    });

    const request = new NextRequest(
      "http://localhost:3000/api/mailchimp/reports/test123",
    );
    const params = Promise.resolve({ id: "test123" });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockReport);
    expect(mockGetCampaignReport).toHaveBeenCalledWith("test123", {});
  });

  it("should handle not found errors", async () => {
    mockGetCampaignReport.mockResolvedValue({
      success: false,
      statusCode: 404,
      error: "Campaign report not found",
    });

    const request = new NextRequest(
      "http://localhost:3000/api/mailchimp/reports/invalid",
    );
    const params = Promise.resolve({ id: "invalid" });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Campaign report not found");
  });

  it("should handle service errors", async () => {
    mockGetCampaignReport.mockResolvedValue({
      success: false,
      error: "Service unavailable",
    });

    const request = new NextRequest(
      "http://localhost:3000/api/mailchimp/reports/test123",
    );
    const params = Promise.resolve({ id: "test123" });

    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Service unavailable");
  });

  it("should pass query parameters to service", async () => {
    mockGetCampaignReport.mockResolvedValue({
      success: true,
      data: { id: "test123" },
    });

    const request = new NextRequest(
      "http://localhost:3000/api/mailchimp/reports/test123?fields=opens,clicks",
    );
    const params = Promise.resolve({ id: "test123" });

    await GET(request, { params });

    expect(mockGetCampaignReport).toHaveBeenCalledWith("test123", {
      fields: "opens,clicks",
    });
  });
});
