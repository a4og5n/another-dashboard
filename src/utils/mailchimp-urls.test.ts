/**
 * Tests for Mailchimp URL Utilities
 */

import { describe, it, expect } from "vitest";
import {
  buildMailchimpListUrl,
  buildMailchimpCampaignUrl,
  buildMailchimpReportUrl,
} from "@/utils/mailchimp-urls";

describe("mailchimp-urls", () => {
  describe("buildMailchimpListUrl", () => {
    it("should build a valid list URL with server prefix", () => {
      const url = buildMailchimpListUrl("us1", 123456);
      expect(url).toBe(
        "https://us1.admin.mailchimp.com/lists/members/?id=123456",
      );
    });

    it("should handle different server prefixes", () => {
      const url1 = buildMailchimpListUrl("us19", 123456);
      expect(url1).toBe(
        "https://us19.admin.mailchimp.com/lists/members/?id=123456",
      );

      const url2 = buildMailchimpListUrl("eu1", 789012);
      expect(url2).toBe(
        "https://eu1.admin.mailchimp.com/lists/members/?id=789012",
      );
    });

    it("should return null when serverPrefix is undefined", () => {
      const url = buildMailchimpListUrl(undefined, 123456);
      expect(url).toBeNull();
    });

    it("should handle large web_id numbers", () => {
      const url = buildMailchimpListUrl("us1", 999999999);
      expect(url).toBe(
        "https://us1.admin.mailchimp.com/lists/members/?id=999999999",
      );
    });
  });

  describe("buildMailchimpCampaignUrl", () => {
    it("should build a valid campaign URL with server prefix", () => {
      const url = buildMailchimpCampaignUrl("us1", 123456);
      expect(url).toBe(
        "https://us1.admin.mailchimp.com/campaigns/show/?id=123456",
      );
    });

    it("should handle different server prefixes", () => {
      const url1 = buildMailchimpCampaignUrl("us19", 123456);
      expect(url1).toBe(
        "https://us19.admin.mailchimp.com/campaigns/show/?id=123456",
      );

      const url2 = buildMailchimpCampaignUrl("eu1", 789012);
      expect(url2).toBe(
        "https://eu1.admin.mailchimp.com/campaigns/show/?id=789012",
      );
    });

    it("should return null when serverPrefix is undefined", () => {
      const url = buildMailchimpCampaignUrl(undefined, 123456);
      expect(url).toBeNull();
    });

    it("should handle large web_id numbers", () => {
      const url = buildMailchimpCampaignUrl("us1", 999999999);
      expect(url).toBe(
        "https://us1.admin.mailchimp.com/campaigns/show/?id=999999999",
      );
    });
  });

  describe("buildMailchimpReportUrl", () => {
    it("should build a valid report URL with server prefix", () => {
      const url = buildMailchimpReportUrl("us1", 123456);
      expect(url).toBe(
        "https://us1.admin.mailchimp.com/reports/summary?id=123456",
      );
    });

    it("should handle different server prefixes", () => {
      const url1 = buildMailchimpReportUrl("us19", 123456);
      expect(url1).toBe(
        "https://us19.admin.mailchimp.com/reports/summary?id=123456",
      );

      const url2 = buildMailchimpReportUrl("eu1", 789012);
      expect(url2).toBe(
        "https://eu1.admin.mailchimp.com/reports/summary?id=789012",
      );
    });

    it("should return null when serverPrefix is undefined", () => {
      const url = buildMailchimpReportUrl(undefined, 123456);
      expect(url).toBeNull();
    });

    it("should handle large web_id numbers", () => {
      const url = buildMailchimpReportUrl("us1", 999999999);
      expect(url).toBe(
        "https://us1.admin.mailchimp.com/reports/summary?id=999999999",
      );
    });
  });
});
