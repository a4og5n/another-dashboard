/**
 * Mailchimp API Root Server Actions Tests
 * Comprehensive tests for mailchimp-root server actions
 *
 * Issue #123: API Root server actions testing
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { getApiRoot, checkApiRootHealth } from "./mailchimp-root";
import { MailchimpService } from "@/services/mailchimp.service";
import type {
  MailchimpRoot,
  MailchimpRootErrorResponse,
} from "@/types/mailchimp";

// Mock MailchimpService
vi.mock("@/services/mailchimp.service");

const mockMailchimpService = vi.mocked(MailchimpService);

describe("Mailchimp API Root Server Actions", () => {
  const mockApiRootData: MailchimpRoot = {
    account_id: "test-account-123",
    login_id: "user123",
    account_name: "Test Company",
    email: "test@example.com",
    first_name: "John",
    last_name: "Doe",
    username: "johndoe",
    avatar_url: "https://example.com/avatar.jpg",
    role: "owner",
    first_payment: "2020-01-15T10:00:00Z",
    account_timezone: "America/New_York",
    account_industry: "Technology",
    last_login: "2024-01-15T10:00:00Z",
    member_since: "2020-01-01T00:00:00Z",
    pricing_plan_type: "monthly",
    pro_enabled: true,
    total_subscribers: 15000,
    contact: {
      company: "Test Company Inc",
      addr1: "123 Main St",
      addr2: "Suite 100",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
    },
    industry_stats: {
      open_rate: 0.21,
      bounce_rate: 0.03,
      click_rate: 0.08,
    },
    _links: [
      {
        rel: "self",
        href: "https://us1.api.mailchimp.com/3.0/",
        targetSchema: "https://us1.api.mailchimp.com/schema/3.0/Root.json",
        schema: "https://us1.api.mailchimp.com/schema/3.0/Root.json",
        method: "GET",
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getApiRoot", () => {
    it("should successfully fetch API root data with default parameters", async () => {
      const mockService = {
        getApiRoot: vi.fn().mockResolvedValue({
          success: true,
          data: mockApiRootData,
        }),
      };
      mockMailchimpService.mockImplementation(
        () => mockService as unknown as MailchimpService,
      );

      const result = await getApiRoot();

      expect(mockService.getApiRoot).toHaveBeenCalledWith({});
      expect(result).toEqual(mockApiRootData);
    });

    it("should fetch API root data with field selection (array format)", async () => {
      const mockService = {
        getApiRoot: vi.fn().mockResolvedValue({
          success: true,
          data: mockApiRootData,
        }),
      };
      mockMailchimpService.mockImplementation(
        () => mockService as unknown as MailchimpService,
      );

      const result = await getApiRoot({
        fields: ["account_id", "account_name"],
        exclude_fields: ["contact", "industry_stats"],
      });

      expect(mockService.getApiRoot).toHaveBeenCalledWith({
        fields: "account_id,account_name",
        exclude_fields: "contact,industry_stats",
      });
      expect(result).toEqual(mockApiRootData);
    });

    it("should handle string field parameters (validation error)", async () => {
      const mockService = {
        getApiRoot: vi.fn(),
      };
      mockMailchimpService.mockImplementation(
        () => mockService as unknown as MailchimpService,
      );

      // The function expects arrays in MailchimpRootQueryInternal, strings cause validation error
      const result = await getApiRoot({
        fields: "account_id,account_name" as unknown as string[],
        exclude_fields: "contact,industry_stats" as unknown as string[],
      });

      // Should return validation error, not call service
      expect(mockService.getApiRoot).not.toHaveBeenCalled();
      expect(result).toMatchObject({
        type: "about:blank",
        title: "Validation Error",
        status: 400,
        instance: "/",
      });
    });

    it("should handle API service error response", async () => {
      const mockService = {
        getApiRoot: vi.fn().mockResolvedValue({
          success: false,
          error: "API connection failed",
          statusCode: 500,
        }),
      };
      mockMailchimpService.mockImplementation(
        () => mockService as unknown as MailchimpService,
      );

      const result = await getApiRoot();

      expect(mockService.getApiRoot).toHaveBeenCalledWith({});
      expect(result).toMatchObject({
        type: "about:blank",
        title: "API Root Error",
        detail: "API connection failed",
        status: 500,
        instance: "/",
      });
    });

    it("should handle validation errors in query parameters", async () => {
      // This test validates that invalid query parameters are rejected
      const invalidParams = { invalidField: "invalid" };
      const result = await getApiRoot(
        invalidParams as unknown as {
          fields?: string[];
          exclude_fields?: string[];
        },
      );

      expect(result).toMatchObject({
        type: "about:blank",
        title: "Validation Error",
        status: 400,
        instance: "/",
      });
      expect((result as MailchimpRootErrorResponse).detail).toContain(
        "Unrecognized key",
      );
    });

    it("should handle service instantiation errors", async () => {
      mockMailchimpService.mockImplementation(() => {
        throw new Error("Service initialization failed");
      });

      const result = await getApiRoot();

      expect(result).toMatchObject({
        type: "about:blank",
        title: "Validation Error",
        detail: "Service initialization failed",
        status: 400,
        instance: "/",
      });
    });

    it("should handle empty field arrays", async () => {
      const mockService = {
        getApiRoot: vi.fn().mockResolvedValue({
          success: true,
          data: mockApiRootData,
        }),
      };
      mockMailchimpService.mockImplementation(
        () => mockService as unknown as MailchimpService,
      );

      const result = await getApiRoot({
        fields: [],
        exclude_fields: [],
      });

      expect(mockService.getApiRoot).toHaveBeenCalledWith({
        fields: "",
        exclude_fields: "",
      });
      expect(result).toEqual(mockApiRootData);
    });
  });

  describe("checkApiRootHealth", () => {
    it("should return true for successful API root access", async () => {
      const mockService = {
        getApiRoot: vi.fn().mockResolvedValue({
          success: true,
          data: mockApiRootData,
        }),
      };
      mockMailchimpService.mockImplementation(
        () => mockService as unknown as MailchimpService,
      );

      const result = await checkApiRootHealth();

      expect(result).toBe(true);
    });

    it("should return false when getApiRoot throws error", async () => {
      mockMailchimpService.mockImplementation(() => {
        throw new Error("Service unavailable");
      });

      const result = await checkApiRootHealth();

      expect(result).toBe(false);
    });
  });
});
