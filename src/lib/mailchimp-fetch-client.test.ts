import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MailchimpFetchClient } from "@/lib/mailchimp-fetch-client";
import {
  MailchimpFetchError,
  MailchimpRateLimitError,
  MailchimpAuthError,
  MailchimpNetworkError,
} from "@/lib/errors";
import type { ErrorResponse } from "@/types/mailchimp";

describe("MailchimpFetchClient", () => {
  let client: MailchimpFetchClient;
  const mockFetch = vi.fn();

  beforeEach(() => {
    global.fetch = mockFetch;
    client = new MailchimpFetchClient({
      accessToken: "test-token",
      serverPrefix: "us1",
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Constructor", () => {
    it("should create client with default timeout", () => {
      const newClient = new MailchimpFetchClient({
        accessToken: "test-token",
        serverPrefix: "us1",
      });

      expect(newClient).toBeInstanceOf(MailchimpFetchClient);
    });

    it("should create client with custom timeout", () => {
      const newClient = new MailchimpFetchClient({
        accessToken: "test-token",
        serverPrefix: "us1",
        timeout: 10000,
      });

      expect(newClient).toBeInstanceOf(MailchimpFetchClient);
    });
  });

  describe("GET requests", () => {
    it("should make GET request with auth header", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: "test" }),
        headers: new Headers(),
      });

      await client.get("/test");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://us1.api.mailchimp.com/3.0/test",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
            "Content-Type": "application/json",
          }),
        }),
      );
    });

    it("should make GET request with query parameters", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: "test" }),
        headers: new Headers(),
      });

      await client.get("/test", { count: 10, offset: 0 });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://us1.api.mailchimp.com/3.0/test?count=10&offset=0",
        expect.anything(),
      );
    });

    it("should filter out undefined and null params", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: "test" }),
        headers: new Headers(),
      });

      await client.get("/test", { count: 10, offset: undefined, limit: null });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://us1.api.mailchimp.com/3.0/test?count=10",
        expect.anything(),
      );
    });

    it("should return parsed JSON response", async () => {
      const mockResponse = { data: "test", id: "123" };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers(),
      });

      const result = await client.get("/test");

      expect(result).toEqual(mockResponse);
    });
  });

  describe("POST requests", () => {
    it("should make POST request with body", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: "created" }),
        headers: new Headers(),
      });

      const body = { name: "test" };
      await client.post("/test", body);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://us1.api.mailchimp.com/3.0/test",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(body),
        }),
      );
    });

    it("should make POST request without body", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: "created" }),
        headers: new Headers(),
      });

      await client.post("/test");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://us1.api.mailchimp.com/3.0/test",
        expect.objectContaining({
          method: "POST",
          body: undefined,
        }),
      );
    });
  });

  describe("PATCH requests", () => {
    it("should make PATCH request with body", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: "updated" }),
        headers: new Headers(),
      });

      const body = { name: "updated" };
      await client.patch("/test", body);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://us1.api.mailchimp.com/3.0/test",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify(body),
        }),
      );
    });
  });

  describe("PUT requests", () => {
    it("should make PUT request with body", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: "replaced" }),
        headers: new Headers(),
      });

      const body = { name: "replaced" };
      await client.put("/test", body);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://us1.api.mailchimp.com/3.0/test",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(body),
        }),
      );
    });
  });

  describe("DELETE requests", () => {
    it("should make DELETE request", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: "deleted" }),
        headers: new Headers(),
      });

      await client.delete("/test");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://us1.api.mailchimp.com/3.0/test",
        expect.objectContaining({
          method: "DELETE",
        }),
      );
    });
  });

  describe("Rate limit tracking", () => {
    it("should extract rate limit info from headers", async () => {
      const headers = new Headers();
      headers.set("X-RateLimit-Remaining", "999");
      headers.set("X-RateLimit-Limit", "1000");
      headers.set("X-RateLimit-Reset", "1609459200"); // 2021-01-01 00:00:00 UTC

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: "test" }),
        headers,
      });

      await client.get("/test");

      const rateLimitInfo = client.getRateLimitInfo();
      expect(rateLimitInfo).toBeDefined();
      expect(rateLimitInfo?.remaining).toBe(999);
      expect(rateLimitInfo?.limit).toBe(1000);
      expect(rateLimitInfo?.resetTime).toEqual(new Date(1609459200 * 1000));
    });

    it("should return undefined when rate limit headers are missing", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: "test" }),
        headers: new Headers(),
      });

      await client.get("/test");

      const rateLimitInfo = client.getRateLimitInfo();
      expect(rateLimitInfo).toBeUndefined();
    });
  });

  describe("Error handling", () => {
    it("should throw MailchimpAuthError for 401 responses", async () => {
      const errorResponse: ErrorResponse = {
        type: "about:blank",
        title: "Unauthorized",
        status: 401,
        detail: "Your API key may be invalid.",
        instance: "test",
      };

      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        json: async () => errorResponse,
        headers: new Headers(),
      });

      await expect(client.get("/test")).rejects.toThrow(MailchimpAuthError);
      await expect(client.get("/test")).rejects.toThrow(
        "Your API key may be invalid.",
      );
    });

    it("should throw MailchimpAuthError for 403 responses", async () => {
      const errorResponse: ErrorResponse = {
        type: "about:blank",
        title: "Forbidden",
        status: 403,
        detail: "You are not allowed to access this resource.",
        instance: "test",
      };

      mockFetch.mockResolvedValue({
        ok: false,
        status: 403,
        statusText: "Forbidden",
        json: async () => errorResponse,
        headers: new Headers(),
      });

      await expect(client.get("/test")).rejects.toThrow(MailchimpAuthError);
    });

    it("should throw MailchimpRateLimitError for 429 responses", async () => {
      const errorResponse: ErrorResponse = {
        type: "about:blank",
        title: "Too Many Requests",
        status: 429,
        detail: "You have exceeded the rate limit.",
        instance: "test",
      };

      const headers = new Headers();
      headers.set("Retry-After", "60");
      headers.set("X-RateLimit-Limit", "10");

      mockFetch.mockResolvedValue({
        ok: false,
        status: 429,
        statusText: "Too Many Requests",
        json: async () => errorResponse,
        headers,
      });

      await expect(client.get("/test")).rejects.toThrow(
        MailchimpRateLimitError,
      );

      try {
        await client.get("/test");
      } catch (error) {
        if (error instanceof MailchimpRateLimitError) {
          expect(error.retryAfter).toBe(60);
          expect(error.limit).toBe(10);
        }
      }
    });

    it("should throw MailchimpFetchError for other error responses", async () => {
      const errorResponse: ErrorResponse = {
        type: "about:blank",
        title: "Bad Request",
        status: 400,
        detail: "Invalid request parameters.",
        instance: "test",
      };

      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => errorResponse,
        headers: new Headers(),
      });

      await expect(client.get("/test")).rejects.toThrow(MailchimpFetchError);
      await expect(client.get("/test")).rejects.toThrow(
        "Invalid request parameters.",
      );
    });

    it("should throw MailchimpNetworkError for invalid error responses", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({ invalid: "response" }),
        headers: new Headers(),
      });

      await expect(client.get("/test")).rejects.toThrow(MailchimpNetworkError);
      await expect(client.get("/test")).rejects.toThrow(
        "Invalid error response from Mailchimp API",
      );
    });

    it("should throw MailchimpNetworkError when response JSON parsing fails", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => {
          throw new Error("Invalid JSON");
        },
        headers: new Headers(),
      });

      await expect(client.get("/test")).rejects.toThrow(MailchimpNetworkError);
      await expect(client.get("/test")).rejects.toThrow(
        "HTTP 500: Internal Server Error",
      );
    });

    it("should throw MailchimpNetworkError for network failures", async () => {
      mockFetch.mockRejectedValue(new Error("Network connection failed"));

      await expect(client.get("/test")).rejects.toThrow(MailchimpNetworkError);
      await expect(client.get("/test")).rejects.toThrow(
        "Network request failed",
      );
    });
  });

  describe("Timeout handling", () => {
    it("should timeout after configured duration", async () => {
      const shortTimeoutClient = new MailchimpFetchClient({
        accessToken: "test-token",
        serverPrefix: "us1",
        timeout: 100,
      });

      // Mock fetch to respect abort signal
      mockFetch.mockImplementation(
        (_url: string, options?: RequestInit) =>
          new Promise((resolve, reject) => {
            const timeout = setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ data: "test" }),
                  headers: new Headers(),
                }),
              200,
            );

            // Listen for abort signal
            if (options?.signal) {
              options.signal.addEventListener("abort", () => {
                clearTimeout(timeout);
                const abortError = new Error("The operation was aborted");
                abortError.name = "AbortError";
                reject(abortError);
              });
            }
          }),
      );

      await expect(shortTimeoutClient.get("/test")).rejects.toThrow(
        MailchimpNetworkError,
      );
      await expect(shortTimeoutClient.get("/test")).rejects.toThrow(
        "Request timeout after 100ms",
      );
    });

    it("should handle AbortError correctly", async () => {
      const abortError = new Error("The operation was aborted");
      abortError.name = "AbortError";

      mockFetch.mockRejectedValue(abortError);

      await expect(client.get("/test")).rejects.toThrow(MailchimpNetworkError);
      await expect(client.get("/test")).rejects.toThrow("Request timeout");
    });
  });
});
