/**
 * Reports Schema Test Suite
 * Comprehensive testing for Mailchimp reports schemas
 * 
 * Issue #127: Reports schema validation testing
 * Tests all report-related schemas for proper validation and type inference
 */

import { describe, it, expect } from "vitest";
import {
  ReportListQuerySchema,
  ReportListQueryInternalSchema,
  ReportListSuccessSchema,
  reportListErrorResponseSchema,
  CampaignReportSchema,
  ReportBouncesSchema,
  ReportForwardsSchema,
  ReportOpensSchema,
  ReportClicksSchema,
  ReportFacebookLikesSchema,
  ReportIndustryStatsSchema,
  ReportListStatsSchema,
  ReportAbSplitSchema,
  ReportTimewarpSchema,
  ReportTimeseriesSchema,
  ReportShareReportSchema,
  ReportEcommerceSchema,
  ReportDeliveryStatusSchema,
} from "@/schemas/mailchimp";

describe("Reports Schema Tests", () => {
  describe("ReportListQuerySchema", () => {
    it("should validate valid query parameters", () => {
      const validQuery = {
        fields: "campaign_title,type,emails_sent",
        exclude_fields: "_links",
        count: 20,
        offset: 0,
        type: "regular" as const,
        before_send_time: "2023-12-01T00:00:00Z",
        since_send_time: "2023-01-01T00:00:00Z",
      };

      const result = ReportListQuerySchema.safeParse(validQuery);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.count).toBe(20);
        expect(result.data.type).toBe("regular");
      }
    });

    it("should handle minimal query parameters", () => {
      const minimalQuery = {};

      const result = ReportListQuerySchema.safeParse(minimalQuery);
      expect(result.success).toBe(true);
    });

    it("should validate campaign types", () => {
      const validTypes = ["regular", "plaintext", "absplit", "rss", "variate"];

      validTypes.forEach(type => {
        const query = { type };
        const result = ReportListQuerySchema.safeParse(query);
        expect(result.success).toBe(true);
      });
    });

    it("should reject invalid campaign types", () => {
      const invalidQuery = { type: "invalid_type" };

      const result = ReportListQuerySchema.safeParse(invalidQuery);
      expect(result.success).toBe(false);
    });

    it("should validate count boundaries", () => {
      // Valid count
      expect(ReportListQuerySchema.safeParse({ count: 50 }).success).toBe(true);
      
      // Invalid count (too high)
      expect(ReportListQuerySchema.safeParse({ count: 1001 }).success).toBe(false);
      
      // Invalid count (negative)
      expect(ReportListQuerySchema.safeParse({ count: -1 }).success).toBe(false);
    });
  });

  describe("ReportListQueryInternalSchema", () => {
    it("should include additional internal fields", () => {
      const internalQuery = {
        fields: ["campaign_title", "type"],
        exclude_fields: ["_links"],
        count: 25,
        offset: 50,
        type: "regular" as const,
      };

      const result = ReportListQueryInternalSchema.safeParse(internalQuery);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.count).toBe(25);
        expect(result.data.fields).toEqual(["campaign_title", "type"]);
      }
    });
  });

  describe("ReportListSuccessSchema", () => {
    it("should validate complete success response", () => {
      const successResponse = {
        reports: [{
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
          rss_last_send: "2023-11-01T10:00:00Z",
          bounces: {
            hard_bounces: 2,
            soft_bounces: 3,
            syntax_errors: 1,
          },
          forwards: {
            forwards_count: 15,
            forwards_opens: 8,
          },
          opens: {
            opens_total: 350,
            proxy_excluded_opens: 5,
            unique_opens: 300,
            proxy_excluded_unique_opens: 295,
            open_rate: 0.30,
            proxy_excluded_open_rate: 0.295,
            last_open: "2023-11-02T14:30:00Z",
          },
          clicks: {
            clicks_total: 120,
            unique_clicks: 100,
            unique_subscriber_clicks: 95,
            click_rate: 0.10,
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
            unopen_rate: 0.70,
            unsub_rate: 0.005,
            abuse_rate: 0.001,
          },
          list_stats: {
            sub_rate: 0.1,
            unsub_rate: 0.005,
            open_rate: 28,
            proxy_excluded_open_rate: 27.5,
            click_rate: 9,
          },
          ab_split: {
            a: {
              bounces: 5,
              abuse_reports: 1,
              unsubs: 2,
              recipient_clicks: 50,
              forwards: 10,
              forwards_opens: 8,
              opens: 200,
              last_open: "2023-11-01T12:00:00Z",
              unique_opens: 180,
            },
            b: {
              bounces: 3,
              abuse_reports: 0,
              unsubs: 1,
              recipient_clicks: 45,
              forwards: 8,
              forwards_opens: 6,
              opens: 180,
              last_open: "2023-11-01T13:00:00Z",
              unique_opens: 160,
            },
          },
          timewarp: [{
            gmt_offset: -5,
            opens: 100,
            last_open: "2023-11-01T10:00:00Z",
            unique_opens: 90,
            clicks: 30,
            last_click: "2023-11-01T11:00:00Z",
            unique_clicks: 25,
            bounces: 2,
          }],
          timeseries: [{
            timestamp: "2023-11-01T10:00:00Z",
            emails_sent: 100,
            unique_opens: 35,
            proxy_excluded_unique_opens: 34,
            recipients_clicks: 12,
          }],
          share_report: {
            share_url: "https://example.com/share/123",
            share_password: "password123",
          },
          ecommerce: {
            total_orders: 50,
            total_spent: 2500.00,
            total_revenue: 2500.00,
            currency_code: "USD",
          },
          delivery_status: {
            enabled: true,
            can_cancel: false,
            status: "delivered",
            emails_sent: 1000,
            emails_canceled: 0,
          },
          _links: [{
            rel: "self",
            href: "https://server.api.mailchimp.com/3.0/reports/campaign123",
            method: "GET",
          }],
        }],
        total_items: 1,
        _links: [{
          rel: "self",
          href: "https://server.api.mailchimp.com/3.0/reports",
          method: "GET",
        }],
      };

      const result = ReportListSuccessSchema.safeParse(successResponse);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.reports).toHaveLength(1);
        expect(result.data.total_items).toBe(1);
        expect(result.data.reports[0].campaign_title).toBe("Newsletter Campaign");
      }
    });

    it("should validate empty reports array", () => {
      const emptyResponse = {
        reports: [],
        total_items: 0,
        _links: [{
          rel: "self",
          href: "https://server.api.mailchimp.com/3.0/reports",
          method: "GET",
        }],
      };

      const result = ReportListSuccessSchema.safeParse(emptyResponse);
      expect(result.success).toBe(true);
    });
  });

  describe("CampaignReportSchema", () => {
    it("should validate complete campaign report", () => {
      const campaignReport = {
        id: "campaign123",
        campaign_title: "Test Campaign",
        type: "regular",
        list_id: "list123",
        list_is_active: true,
        list_name: "Test List",
        subject_line: "Test Subject",
        preview_text: "Preview text",
        emails_sent: 500,
        abuse_reports: 0,
        unsubscribed: 2,
        send_time: "2023-11-01T10:00:00Z",
        rss_last_send: "2023-11-01T10:00:00Z",
        bounces: {
          hard_bounces: 1,
          soft_bounces: 2,
          syntax_errors: 0,
        },
        forwards: {
          forwards_count: 10,
          forwards_opens: 5,
        },
        opens: {
          opens_total: 200,
          proxy_excluded_opens: 2,
          unique_opens: 180,
          proxy_excluded_unique_opens: 178,
          open_rate: 0.36,
          proxy_excluded_open_rate: 0.356,
          last_open: "2023-11-02T14:30:00Z",
        },
        clicks: {
          clicks_total: 60,
          unique_clicks: 50,
          unique_subscriber_clicks: 45,
          click_rate: 0.10,
          last_click: "2023-11-02T16:00:00Z",
        },
        facebook_likes: {
          recipient_likes: 5,
          unique_likes: 4,
          facebook_likes: 6,
        },
        industry_stats: {
          type: "Technology",
          open_rate: 0.22,
          click_rate: 0.06,
          bounce_rate: 0.015,
          unopen_rate: 0.78,
          unsub_rate: 0.003,
          abuse_rate: 0.001,
        },
        list_stats: {
          sub_rate: 0.05,
          unsub_rate: 0.003,
          open_rate: 25,
          proxy_excluded_open_rate: 24.5,
          click_rate: 8,
        },
        ab_split: {
          a: {
            bounces: 1,
            abuse_reports: 0,
            unsubs: 1,
            recipient_clicks: 25,
            forwards: 5,
            forwards_opens: 3,
            opens: 100,
            last_open: "2023-11-01T12:00:00Z",
            unique_opens: 90,
          },
          b: {
            bounces: 2,
            abuse_reports: 0,
            unsubs: 1,
            recipient_clicks: 25,
            forwards: 5,
            forwards_opens: 2,
            opens: 100,
            last_open: "2023-11-01T13:00:00Z",
            unique_opens: 90,
          },
        },
        timewarp: [{
          gmt_offset: -8,
          opens: 50,
          last_open: "2023-11-01T08:00:00Z",
          unique_opens: 45,
          clicks: 15,
          last_click: "2023-11-01T09:00:00Z",
          unique_clicks: 12,
          bounces: 1,
        }],
        timeseries: [{
          timestamp: "2023-11-01T10:00:00Z",
          emails_sent: 100,
          unique_opens: 36,
          proxy_excluded_unique_opens: 35,
          recipients_clicks: 10,
        }],
        share_report: {
          share_url: "https://example.com/share/456",
          share_password: "test123",
        },
        ecommerce: {
          total_orders: 25,
          total_spent: 1250.50,
          total_revenue: 1250.50,
          currency_code: "USD",
        },
        delivery_status: {
          enabled: true,
          can_cancel: false,
          status: "delivered",
          emails_sent: 500,
          emails_canceled: 0,
        },
        _links: [{
          rel: "self",
          href: "https://server.api.mailchimp.com/3.0/reports/campaign123",
          method: "GET",
        }],
      };

      const result = CampaignReportSchema.safeParse(campaignReport);
      expect(result.success).toBe(true);
    });

    it("should require essential fields", () => {
      const incompleteReport = {
        id: "campaign123",
        // Missing required fields
      };

      const result = CampaignReportSchema.safeParse(incompleteReport);
      expect(result.success).toBe(false);
    });
  });

  describe("Nested Report Schemas", () => {
    describe("ReportBouncesSchema", () => {
      it("should validate bounce data", () => {
        const bounces = {
          hard_bounces: 5,
          soft_bounces: 3,
          syntax_errors: 1,
        };

        const result = ReportBouncesSchema.safeParse(bounces);
        expect(result.success).toBe(true);
      });

      it("should require non-negative numbers", () => {
        const invalidBounces = {
          hard_bounces: -1,
          soft_bounces: 3,
          syntax_errors: 1,
        };

        const result = ReportBouncesSchema.safeParse(invalidBounces);
        expect(result.success).toBe(false);
      });
    });

    describe("ReportOpensSchema", () => {
      it("should validate opens data with rates", () => {
        const opens = {
          opens_total: 100,
          proxy_excluded_opens: 2,
          unique_opens: 80,
          proxy_excluded_unique_opens: 78,
          open_rate: 0.25,
          proxy_excluded_open_rate: 0.244,
          last_open: "2023-11-01T10:00:00Z",
        };

        const result = ReportOpensSchema.safeParse(opens);
        expect(result.success).toBe(true);
      });

      it("should validate rate boundaries (0-1)", () => {
        const invalidRate = {
          opens_total: 100,
          unique_opens: 80,
          open_rate: 1.5, // Invalid rate > 1
          last_open: "2023-11-01T10:00:00Z",
        };

        const result = ReportOpensSchema.safeParse(invalidRate);
        expect(result.success).toBe(false);
      });
    });

    describe("ReportClicksSchema", () => {
      it("should validate clicks data", () => {
        const clicks = {
          clicks_total: 50,
          unique_clicks: 40,
          unique_subscriber_clicks: 35,
          click_rate: 0.10,
          last_click: "2023-11-01T12:00:00Z",
        };

        const result = ReportClicksSchema.safeParse(clicks);
        expect(result.success).toBe(true);
      });
    });

    describe("ReportIndustryStatsSchema", () => {
      it("should validate industry statistics", () => {
        const industryStats = {
          type: "E-commerce",
          open_rate: 0.22,
          click_rate: 0.08,
          bounce_rate: 0.02,
          unopen_rate: 0.78,
          unsub_rate: 0.005,
          abuse_rate: 0.001,
        };

        const result = ReportIndustryStatsSchema.safeParse(industryStats);
        expect(result.success).toBe(true);
      });

      it("should validate all rates are between 0 and 1", () => {
        const invalidStats = {
          type: "Technology",
          open_rate: 0.22,
          click_rate: 1.2, // Invalid > 1
          bounce_rate: 0.02,
          unsubscribe_rate: 0.005,
        };

        const result = ReportIndustryStatsSchema.safeParse(invalidStats);
        expect(result.success).toBe(false);
      });
    });
  });

  describe("ReportDeliveryStatusSchema", () => {
    it("should validate all delivery statuses", () => {
      const validStatuses = ["delivering", "delivered", "canceling", "canceled"];

      validStatuses.forEach(status => {
        const deliveryStatus = {
          enabled: true,
          can_cancel: false,
          status,
          emails_sent: 100,
          emails_canceled: 0,
        };

        const result = ReportDeliveryStatusSchema.safeParse(deliveryStatus);
        expect(result.success).toBe(true);
      });
    });

    it("should reject invalid delivery status", () => {
      const invalidStatus = {
        enabled: true,
        can_cancel: false,
        status: "invalid_status",
        emails_sent: 100,
        emails_canceled: 0,
      };

      const result = ReportDeliveryStatusSchema.safeParse(invalidStatus);
      expect(result.success).toBe(false);
    });
  });

  describe("Error Response Schema", () => {
    it("should validate error responses", () => {
      const errorResponse = {
        type: "https://mailchimp.com/developer/marketing/docs/errors/",
        title: "Invalid Resource",
        status: 400,
        detail: "The requested resource could not be found.",
        instance: "12345678-1234-1234-1234-123456789012",
      };

      const result = reportListErrorResponseSchema.safeParse(errorResponse);
      expect(result.success).toBe(true);
    });

    it("should require essential error fields", () => {
      const incompleteError = {
        title: "Error",
        // Missing status, detail, etc.
      };

      const result = reportListErrorResponseSchema.safeParse(incompleteError);
      expect(result.success).toBe(false);
    });
  });

  describe("Optional Schemas", () => {
    describe("ReportTimewarpSchema", () => {
      it("should validate timewarp data when present", () => {
        const timewarp = [{
          gmt_offset: -8,
          opens: 10,
          last_open: "2023-11-01T10:00:00Z",
          unique_opens: 8,
          clicks: 3,
          last_click: "2023-11-01T11:00:00Z",
          unique_clicks: 2,
          bounces: 0,
        }];

        const result = ReportTimewarpSchema.safeParse(timewarp);
        expect(result.success).toBe(true);
      });
    });

    describe("ReportEcommerceSchema", () => {
      it("should validate ecommerce data", () => {
        const ecommerce = {
          total_orders: 25,
          total_spent: 1250.50,
          total_revenue: 1250.50,
          currency_code: "USD",
        };

        const result = ReportEcommerceSchema.safeParse(ecommerce);
        expect(result.success).toBe(true);
      });

      it("should validate currency codes", () => {
        const validCurrency = {
          total_orders: 25,
          total_spent: 1250.50,
          total_revenue: 1250.50,
          currency_code: "EUR",
        };

        const result = ReportEcommerceSchema.safeParse(validCurrency);
        expect(result.success).toBe(true);
      });
    });
  });
});