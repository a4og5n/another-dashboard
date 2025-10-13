import { describe, it, expect } from "vitest";
import {
  MailchimpFetchError,
  MailchimpRateLimitError,
  MailchimpAuthError,
  MailchimpNetworkError,
} from "@/lib/errors/mailchimp-errors";
import type { ErrorResponse } from "@/types/mailchimp";

describe("MailchimpFetchError", () => {
  it("should create error with correct properties", () => {
    const errorResponse: ErrorResponse = {
      type: "https://mailchimp.com/developer/marketing/docs/errors/",
      title: "Resource Not Found",
      status: 404,
      detail: "The requested resource could not be found.",
      instance: "12345678-90ab-cdef-1234-567890abcdef",
    };

    const error = new MailchimpFetchError(errorResponse);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(MailchimpFetchError);
    expect(error.name).toBe("MailchimpFetchError");
    expect(error.message).toBe(errorResponse.detail);
    expect(error.statusCode).toBe(404);
    expect(error.type).toBe(errorResponse.type);
    expect(error.instance).toBe(errorResponse.instance);
  });

  it("should have undefined digest by default", () => {
    const errorResponse: ErrorResponse = {
      type: "about:blank",
      title: "Error",
      status: 500,
      detail: "Internal error",
      instance: "test",
    };

    const error = new MailchimpFetchError(errorResponse);

    expect(error.digest).toBeUndefined();
  });
});

describe("MailchimpRateLimitError", () => {
  it("should create rate limit error with retry info", () => {
    const errorResponse: ErrorResponse = {
      type: "about:blank",
      title: "Too Many Requests",
      status: 429,
      detail: "You have exceeded the rate limit.",
      instance: "test",
    };

    const error = new MailchimpRateLimitError(errorResponse, 60, 10);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(MailchimpFetchError);
    expect(error).toBeInstanceOf(MailchimpRateLimitError);
    expect(error.name).toBe("MailchimpRateLimitError");
    expect(error.message).toBe(errorResponse.detail);
    expect(error.statusCode).toBe(429);
    expect(error.retryAfter).toBe(60);
    expect(error.limit).toBe(10);
  });

  it("should inherit base error properties", () => {
    const errorResponse: ErrorResponse = {
      type: "about:blank",
      title: "Too Many Requests",
      status: 429,
      detail: "Rate limit exceeded",
      instance: "test-instance",
    };

    const error = new MailchimpRateLimitError(errorResponse, 30, 100);

    expect(error.type).toBe(errorResponse.type);
    expect(error.instance).toBe(errorResponse.instance);
  });
});

describe("MailchimpAuthError", () => {
  it("should create authentication error", () => {
    const errorResponse: ErrorResponse = {
      type: "about:blank",
      title: "Unauthorized",
      status: 401,
      detail: "Your API key may be invalid.",
      instance: "test",
    };

    const error = new MailchimpAuthError(errorResponse);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(MailchimpFetchError);
    expect(error).toBeInstanceOf(MailchimpAuthError);
    expect(error.name).toBe("MailchimpAuthError");
    expect(error.message).toBe(errorResponse.detail);
    expect(error.statusCode).toBe(401);
  });

  it("should handle 403 forbidden errors", () => {
    const errorResponse: ErrorResponse = {
      type: "about:blank",
      title: "Forbidden",
      status: 403,
      detail: "You are not allowed to access this resource.",
      instance: "test",
    };

    const error = new MailchimpAuthError(errorResponse);

    expect(error.statusCode).toBe(403);
    expect(error.message).toBe(errorResponse.detail);
  });
});

describe("MailchimpNetworkError", () => {
  it("should create network error without cause", () => {
    const error = new MailchimpNetworkError("Network connection failed");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(MailchimpNetworkError);
    expect(error.name).toBe("MailchimpNetworkError");
    expect(error.message).toBe("Network connection failed");
    expect(error.cause).toBeUndefined();
  });

  it("should create network error with cause", () => {
    const cause = new Error("Connection timeout");
    const error = new MailchimpNetworkError("Network request failed", cause);

    expect(error.message).toBe("Network request failed");
    expect(error.cause).toBe(cause);
    expect(error.cause?.message).toBe("Connection timeout");
  });

  it("should handle timeout scenarios", () => {
    const timeoutError = new Error("AbortError");
    timeoutError.name = "AbortError";
    const error = new MailchimpNetworkError(
      "Request timeout after 30000ms",
      timeoutError,
    );

    expect(error.message).toBe("Request timeout after 30000ms");
    expect(error.cause?.name).toBe("AbortError");
  });

  it("should not inherit from MailchimpFetchError", () => {
    const error = new MailchimpNetworkError("Network error");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(MailchimpNetworkError);
    expect(error).not.toBeInstanceOf(MailchimpFetchError);
  });
});
