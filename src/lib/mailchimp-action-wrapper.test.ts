/**
 * Tests for mailchimp-action-wrapper
 * Validates error handling and ApiResponse transformation
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { mailchimpApiCall } from "@/lib/mailchimp-action-wrapper";
import { getUserMailchimpClient } from "@/lib/mailchimp-client-factory";
import {
  MailchimpFetchError,
  MailchimpAuthError,
  MailchimpRateLimitError,
  MailchimpNetworkError,
} from "@/lib/errors";
import type { MailchimpFetchClient } from "@/lib/mailchimp-fetch-client";
import { MAILCHIMP_ERROR_CODES } from "@/constants";

// Mock the client factory
vi.mock("@/lib/mailchimp-client-factory");

describe("mailchimpApiCall", () => {
  const mockClient = {
    getRateLimitInfo: vi.fn(),
  } as unknown as MailchimpFetchClient;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("successful API calls", () => {
    it("should return success response with data", async () => {
      const mockData = { id: "123", name: "Test Campaign" };

      vi.mocked(getUserMailchimpClient).mockResolvedValue(mockClient);
      vi.mocked(mockClient.getRateLimitInfo).mockReturnValue(undefined);

      const result = await mailchimpApiCall(async () => mockData);

      expect(result).toEqual({
        success: true,
        data: mockData,
        rateLimit: undefined,
      });
    });

    it("should include rate limit info when available", async () => {
      const mockData = { id: "123" };
      const mockRateLimit = {
        remaining: 500,
        limit: 1000,
        resetTime: new Date("2024-01-01T00:00:00Z"),
      };

      vi.mocked(getUserMailchimpClient).mockResolvedValue(mockClient);
      vi.mocked(mockClient.getRateLimitInfo).mockReturnValue(mockRateLimit);

      const result = await mailchimpApiCall(async () => mockData);

      expect(result).toEqual({
        success: true,
        data: mockData,
        rateLimit: {
          remaining: 500,
          limit: 1000,
          resetTime: mockRateLimit.resetTime,
        },
      });
    });
  });

  describe("connection errors", () => {
    it("should handle 'not connected' error with errorCode", async () => {
      const error = new Error(
        "Mailchimp account not connected. Please connect your account to continue.",
      );
      (error as Error & { errorCode: string }).errorCode =
        MAILCHIMP_ERROR_CODES.NOT_CONNECTED;

      vi.mocked(getUserMailchimpClient).mockRejectedValue(error);

      const result = await mailchimpApiCall(async () => ({ data: "test" }));

      expect(result).toEqual({
        success: false,
        error:
          "Mailchimp account not connected. Please connect your account to continue.",
        errorCode: MAILCHIMP_ERROR_CODES.NOT_CONNECTED,
        statusCode: 401,
      });
    });

    it("should handle inactive connection error with errorCode", async () => {
      const error = new Error(
        "Your Mailchimp connection is inactive. Please reconnect your account.",
      );
      (error as Error & { errorCode: string }).errorCode =
        MAILCHIMP_ERROR_CODES.CONNECTION_INACTIVE;

      vi.mocked(getUserMailchimpClient).mockRejectedValue(error);

      const result = await mailchimpApiCall(async () => ({ data: "test" }));

      expect(result).toEqual({
        success: false,
        error:
          "Your Mailchimp connection is inactive. Please reconnect your account.",
        errorCode: MAILCHIMP_ERROR_CODES.CONNECTION_INACTIVE,
        statusCode: 401,
      });
    });

    it("should handle not authenticated error with errorCode", async () => {
      const error = new Error("User not authenticated");
      (error as Error & { errorCode: string }).errorCode =
        MAILCHIMP_ERROR_CODES.NOT_AUTHENTICATED;

      vi.mocked(getUserMailchimpClient).mockRejectedValue(error);

      const result = await mailchimpApiCall(async () => ({ data: "test" }));

      expect(result).toEqual({
        success: false,
        error: "User not authenticated",
        errorCode: MAILCHIMP_ERROR_CODES.NOT_AUTHENTICATED,
        statusCode: 401,
      });
    });
  });

  describe("authentication errors", () => {
    it("should handle MailchimpAuthError with errorCode", async () => {
      const authError = new MailchimpAuthError({
        type: "https://mailchimp.com/developer/marketing/docs/errors/",
        title: "Forbidden",
        status: 403,
        detail: "You are not authorized to access this resource",
        instance: "/3.0/lists",
      });

      vi.mocked(getUserMailchimpClient).mockResolvedValue(mockClient);

      const result = await mailchimpApiCall(async () => {
        throw authError;
      });

      expect(result).toEqual({
        success: false,
        error: "You are not authorized to access this resource",
        errorCode: MAILCHIMP_ERROR_CODES.TOKEN_INVALID,
        statusCode: 403,
      });
    });
  });

  describe("rate limit errors", () => {
    it("should handle MailchimpRateLimitError with retry info and errorCode", async () => {
      const rateLimitError = new MailchimpRateLimitError(
        {
          type: "https://mailchimp.com/developer/marketing/docs/errors/",
          title: "Too Many Requests",
          status: 429,
          detail: "Rate limit exceeded",
          instance: "/3.0/campaigns",
        },
        60,
        1000,
      );

      vi.mocked(getUserMailchimpClient).mockResolvedValue(mockClient);

      const result = await mailchimpApiCall(async () => {
        throw rateLimitError;
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Rate limit exceeded. Try again in 60 seconds.",
      );
      expect(result.errorCode).toBe(MAILCHIMP_ERROR_CODES.RATE_LIMIT);
      expect(result.statusCode).toBe(429);
      expect(result.rateLimit).toEqual({
        remaining: 0,
        limit: 1000,
        resetTime: expect.any(Date),
      });
    });
  });

  describe("API errors", () => {
    it("should handle MailchimpFetchError with errorCode", async () => {
      const apiError = new MailchimpFetchError({
        type: "https://mailchimp.com/developer/marketing/docs/errors/",
        title: "Resource Not Found",
        status: 404,
        detail: "The requested resource could not be found",
        instance: "/3.0/campaigns/123",
      });

      vi.mocked(getUserMailchimpClient).mockResolvedValue(mockClient);

      const result = await mailchimpApiCall(async () => {
        throw apiError;
      });

      expect(result).toEqual({
        success: false,
        error: "The requested resource could not be found",
        errorCode: MAILCHIMP_ERROR_CODES.API_ERROR,
        statusCode: 404,
      });
    });
  });

  describe("network errors", () => {
    it("should handle MailchimpNetworkError with errorCode", async () => {
      const networkError = new MailchimpNetworkError(
        "Request timeout after 30000ms",
      );

      vi.mocked(getUserMailchimpClient).mockResolvedValue(mockClient);

      const result = await mailchimpApiCall(async () => {
        throw networkError;
      });

      expect(result).toEqual({
        success: false,
        error: "Request timeout after 30000ms",
        errorCode: MAILCHIMP_ERROR_CODES.API_ERROR,
        statusCode: 503,
      });
    });
  });

  describe("unknown errors", () => {
    it("should handle generic Error with errorCode", async () => {
      vi.mocked(getUserMailchimpClient).mockResolvedValue(mockClient);

      const result = await mailchimpApiCall(async () => {
        throw new Error("Something went wrong");
      });

      expect(result).toEqual({
        success: false,
        error: "Something went wrong",
        errorCode: MAILCHIMP_ERROR_CODES.UNKNOWN_ERROR,
        statusCode: 500,
      });
    });

    it("should handle non-Error thrown values with errorCode", async () => {
      vi.mocked(getUserMailchimpClient).mockResolvedValue(mockClient);

      const result = await mailchimpApiCall(async () => {
        throw "String error";
      });

      expect(result).toEqual({
        success: false,
        error: "Unknown error occurred",
        errorCode: MAILCHIMP_ERROR_CODES.UNKNOWN_ERROR,
        statusCode: 500,
      });
    });
  });
});
