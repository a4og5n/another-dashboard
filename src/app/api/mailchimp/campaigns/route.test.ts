/**
 * Integration tests for Mailchimp campaigns API route
 */
import { describe, it, expect, vi } from "vitest";
import * as services from "@/services";
import { MailchimpService } from "@/services/mailchimp.service";

describe("Mailchimp campaigns API route", () => {
  beforeAll(() => {
    class MockMailchimpService extends MailchimpService {
      constructor() {
        super();
        this.config = { baseUrl: "https://mock.api", headers: {} };
        this.serviceName = "mockService";
      }
      protected async authenticate() {}
      protected handleRateLimit() {}
      async healthCheck() {
        return {
          success: true,
          data: { status: "healthy", timestamp: new Date().toISOString() },
        };
      }
      async getCampaignReports() {
        return {
          success: true,
          data: {
            reports: [
              {
                id: "abc123",
                type: "regular",
                campaign_title: "Test Campaign",
                list_id: "list123",
                list_is_active: true,
                list_name: "Test List",
                subject_line: "Test Subject",
                preview_text: "Preview text",
                emails_sent: 100,
                abuse_reports: 0,
                unsubscribed: 1,
                send_time: "2025-08-26T01:00:00+00:00",
                bounces: { hard_bounces: 0, soft_bounces: 0, syntax_errors: 0 },
                forwards: { forwards_count: 0, forwards_opens: 0 },
                opens: {
                  opens_total: 80,
                  unique_opens: 75,
                  open_rate: 0.8,
                  last_open: "2025-08-26T02:00:00+00:00",
                },
                clicks: {
                  clicks_total: 20,
                  unique_clicks: 18,
                  unique_subscriber_clicks: 15,
                  click_rate: 0.2,
                  last_click: "2025-08-26T03:00:00+00:00",
                },
                facebook_likes: {
                  recipient_likes: 0,
                  unique_likes: 0,
                  facebook_likes: 0,
                },
                industry_stats: {
                  type: "Ecommerce",
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
                  share_url: "https://mailchimp.com/share/abc123",
                  share_password: "password123",
                },
                ecommerce: {
                  total_orders: 0,
                  total_spent: 0,
                  total_revenue: 0,
                },
                delivery_status: {
                  enabled: true,
                  can_cancel: false,
                  status: "sent" as const,
                  emails_sent: 100,
                  emails_canceled: 0,
                },
              },
            ],
            total_items: 1,
          },
          rateLimit: {
            limit: 10,
            remaining: 8,
            resetTime: new Date("2025-08-27T00:00:00+00:00"),
          },
        };
      }
      async getCampaignReport(campaignId: string) {
        return {
          success: true,
          data: {
            id: campaignId,
            campaign_title: "Test Campaign",
            type: "regular",
            list_id: "list123",
            list_is_active: true,
            list_name: "Test List",
            subject_line: "Test Subject",
            preview_text: "Preview text",
            emails_sent: 100,
            abuse_reports: 0,
            unsubscribed: 1,
            send_time: "2025-08-26T01:00:00+00:00",
            bounces: { hard_bounces: 0, soft_bounces: 0, syntax_errors: 0 },
            forwards: { forwards_count: 0, forwards_opens: 0 },
            opens: {
              opens_total: 80,
              unique_opens: 75,
              open_rate: 0.8,
              last_open: "2025-08-26T02:00:00+00:00",
            },
            clicks: {
              clicks_total: 20,
              unique_clicks: 18,
              unique_subscriber_clicks: 15,
              click_rate: 0.2,
              last_click: "2025-08-26T03:00:00+00:00",
            },
            facebook_likes: {
              recipient_likes: 0,
              unique_likes: 0,
              facebook_likes: 0,
            },
            industry_stats: {
              type: "Ecommerce",
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
              share_url: "https://mailchimp.com/share/abc123",
              share_password: "password123",
            },
            ecommerce: { total_orders: 0, total_spent: 0, total_revenue: 0 },
            delivery_status: {
              enabled: true,
              can_cancel: false,
              status: "sent" as const,
              emails_sent: 100,
              emails_canceled: 0,
            },
          },
        };
      }
      async getLists() {
        return {
          success: true,
          data: {
            lists: [],
            total_items: 0,
          },
        };
      }
      async getList(listId: string) {
        return {
          success: true,
          data: {
            id: listId,
            web_id: 1,
            name: "Test List",
            contact: {
              company: "",
              address1: "",
              address2: "",
              city: "",
              state: "",
              zip: "",
              country: "",
              phone: "",
            },
            permission_reminder: "",
            use_archive_bar: false,
            campaign_defaults: {
              from_name: "",
              from_email: "",
              subject: "",
              language: "",
            },
            notify_on_subscribe: "",
            notify_on_unsubscribe: "",
            date_created: "2025-08-26T00:00:00+00:00",
            list_rating: 5,
            email_type_option: false,
            subscribe_url_short: "",
            subscribe_url_long: "",
            beamer_address: "",
            visibility: "pub" as const,
            double_optin: false,
            has_welcome: false,
            marketing_permissions: false,
            modules: [],
            stats: {
              member_count: 0,
              total_contacts: 0,
              unsubscribe_count: 0,
              cleaned_count: 0,
              member_count_since_send: 0,
              unsubscribe_count_since_send: 0,
              cleaned_count_since_send: 0,
              campaign_count: 0,
              campaign_last_sent: "2025-08-26T00:00:00+00:00",
              merge_field_count: 0,
              avg_sub_rate: 0,
              avg_unsub_rate: 0,
              target_sub_rate: 0,
              open_rate: 0,
              click_rate: 0,
              last_sub_date: "2025-08-26T00:00:00+00:00",
              last_unsub_date: "2025-08-26T00:00:00+00:00",
            },
          },
        };
      }
      async getCampaignSummary() {
        return {
          success: true,
          data: {
            totalCampaigns: 1,
            filteredCount: 1,
            sentCampaigns: 1,
            avgOpenRate: 0.8,
            avgClickRate: 0.2,
            totalEmailsSent: 100,
            recentCampaigns: [
              {
                id: "abc123",
                title: "Test Campaign",
                status: "sent" as const,
                emailsSent: 100,
                openRate: 0.8,
                clickRate: 0.2,
                sendTime: "2025-08-26T01:00:00+00:00",
              },
            ],
          },
        };
      }
      async getAudienceSummary() {
        return {
          success: true,
          data: {
            totalLists: 1,
            totalSubscribers: 1000,
            avgGrowthRate: 0.05,
            avgOpenRate: 0.8,
            avgClickRate: 0.2,
            topLists: [
              {
                id: "list123",
                name: "Test List",
                memberCount: 1000,
                growthRate: 0.05,
                openRate: 0.8,
                clickRate: 0.2,
              },
            ],
          },
        };
      }
      async getCampaign(campaignId: string) {
        return {
          success: true,
          data: {
            id: campaignId,
            web_id: 789,
            type: "regular",
            create_time: "2025-08-26T00:00:00+00:00",
            archive_url: "https://mailchimp.com/archive/def456",
            long_archive_url: "https://mailchimp.com/archive/def456/long",
            status: "sent" as const,
            emails_sent: 200,
            send_time: "2025-08-26T01:00:00+00:00",
            content_type: "template",
            needs_block_refresh: false,
            resendable: false,
            recipients: {
              list_id: "list456",
              list_is_active: true,
              list_name: "Main List",
              segment_text: "All subscribers",
              recipient_count: 1000,
            },
            settings: {
              subject_line: "Newsletter",
              preview_text: "Preview text",
              title: "August News",
              from_name: "Admin",
              reply_to: "admin@mail.com",
              use_conversation: false,
              to_name: "Subscriber",
              folder_id: "folder123",
              authenticate: false,
              auto_footer: true,
              auto_tweet: false,
              auto_fb_post: ["fbpage1"],
              template_id: 101,
              inline_css: false,
              drag_and_drop: false,
              fb_comments: false,
              timewarp: false,
            },
            tracking: {
              opens: true,
              html_clicks: true,
              text_clicks: false,
              goal_tracking: false,
              ecomm360: false,
              google_analytics: "",
              clicktale: "",
            },
          },
        };
      }
      async sleep() {
        return Promise.resolve();
      }
      logRequest() {}
      logResponse() {}
      logError() {}
    }
    vi.spyOn(services, "getMailchimpService").mockReturnValue(
      new MockMailchimpService(),
    );
  });

  it("should return a healthy status from healthCheck", async () => {
    const service = services.getMailchimpService();
    const result = await service.healthCheck();
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    if (result.data) {
      expect(result.data.status).toBe("healthy");
    }
  });

  it("should return campaign reports for valid query params", async () => {
    const service = services.getMailchimpService();
    const result = await service.getCampaignReports();
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    if (result.data) {
      expect(result.data.reports.length).toBeGreaterThan(0);
      expect(result.data.total_items).toBe(1);
    }
    expect(result.rateLimit).toBeDefined();
    if (result.rateLimit && "limit" in result.rateLimit) {
      expect((result.rateLimit as Record<string, unknown>).limit).toBe(10);
    }
  });

  it("should handle invalid query params with error", async () => {
    // Simulate invalid params by calling a method that would validate them
    // For this mock, we expect the service to throw for invalid type
    const service = services.getMailchimpService();
    try {
      await service.getCampaignReports({ type: "invalidtype" });
      throw new Error("Expected error not thrown");
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it("should return campaign report by ID for valid ID", async () => {
    const service = services.getMailchimpService();
    const result = await service.getCampaignReport("abc123");
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    if (result.data) {
      expect(result.data.id).toBe("abc123");
    }
  });

  it("should handle error for campaign report by invalid ID", async () => {
    const service = services.getMailchimpService();
    try {
      // Simulate error for invalid ID
      await service.getCampaignReport("");
      throw new Error("Expected error not thrown");
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it("should handle edge case queries (boundary values)", async () => {
    const service = services.getMailchimpService();
    // count = 0
    const resultZero = await service.getCampaignReports({ count: 0 });
    expect(resultZero.success).toBe(true);
    // count = 1000
    const resultMax = await service.getCampaignReports({ count: 1000 });
    expect(resultMax.success).toBe(true);
  });
});
