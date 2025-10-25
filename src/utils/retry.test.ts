/**
 * Tests for Retry Utility with Exponential Backoff
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  retryWithBackoff,
  hasStatusCode,
  shouldRetryServerErrors,
  shouldRetryMailchimpAuth,
} from "./retry";

describe("retryWithBackoff", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should return result on first successful attempt", async () => {
    const fn = vi.fn().mockResolvedValue("success");

    const promise = retryWithBackoff(fn);
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should retry on failure and eventually succeed", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("Failure 1"))
      .mockRejectedValueOnce(new Error("Failure 2"))
      .mockResolvedValue("success");

    const promise = retryWithBackoff(fn, { maxRetries: 3 });
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toBe("success");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("should throw error after max retries exhausted", async () => {
    const error = new Error("Permanent failure");
    const fn = vi.fn().mockRejectedValue(error);

    const promise = retryWithBackoff(fn, { maxRetries: 2 });
    const timerPromise = vi.runAllTimersAsync();

    // Wait for both promises to settle
    await expect(promise).rejects.toThrow("Permanent failure");
    await timerPromise;

    expect(fn).toHaveBeenCalledTimes(3); // Initial + 2 retries
  });

  it("should use exponential backoff delays", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("Fail 1"))
      .mockRejectedValueOnce(new Error("Fail 2"))
      .mockResolvedValue("success");

    const onRetry = vi.fn();
    const promise = retryWithBackoff(fn, {
      maxRetries: 2,
      initialDelayMs: 1000,
      backoffMultiplier: 2,
      jitterFactor: 0, // Disable jitter for predictable testing
      onRetry,
    });

    await vi.runAllTimersAsync();
    await promise;

    // Check delays: 1000ms, 2000ms
    expect(onRetry).toHaveBeenCalledTimes(2);
    expect(onRetry).toHaveBeenNthCalledWith(
      1,
      expect.any(Error),
      1,
      1000, // First retry: initialDelay * (2^0)
    );
    expect(onRetry).toHaveBeenNthCalledWith(
      2,
      expect.any(Error),
      2,
      2000, // Second retry: initialDelay * (2^1)
    );
  });

  it("should cap delay at maxDelayMs", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("Fail 1"))
      .mockRejectedValueOnce(new Error("Fail 2"))
      .mockRejectedValueOnce(new Error("Fail 3"))
      .mockResolvedValue("success");

    const onRetry = vi.fn();
    const promise = retryWithBackoff(fn, {
      maxRetries: 3,
      initialDelayMs: 5000,
      maxDelayMs: 8000,
      backoffMultiplier: 2,
      jitterFactor: 0, // Disable jitter
      onRetry,
    });

    await vi.runAllTimersAsync();
    await promise;

    // Delays: 5000, 8000 (capped), 8000 (capped)
    // Without cap: 5000, 10000, 20000
    expect(onRetry).toHaveBeenNthCalledWith(1, expect.any(Error), 1, 5000);
    expect(onRetry).toHaveBeenNthCalledWith(2, expect.any(Error), 2, 8000);
    expect(onRetry).toHaveBeenNthCalledWith(3, expect.any(Error), 3, 8000);
  });

  it("should respect shouldRetry predicate", async () => {
    const error = { status: 400, message: "Bad Request" };
    const fn = vi.fn().mockRejectedValue(error);

    const shouldRetry = vi.fn().mockReturnValue(false); // Don't retry

    const promise = retryWithBackoff(fn, { shouldRetry });
    const timerPromise = vi.runAllTimersAsync();

    await expect(promise).rejects.toEqual(error);
    await timerPromise;

    expect(fn).toHaveBeenCalledTimes(1); // No retries
    expect(shouldRetry).toHaveBeenCalledWith(error, 1);
  });

  it("should call onRetry callback before each retry", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("Fail 1"))
      .mockResolvedValue("success");

    const onRetry = vi.fn();
    const promise = retryWithBackoff(fn, {
      maxRetries: 2,
      onRetry,
      jitterFactor: 0,
    });

    await vi.runAllTimersAsync();
    await promise;

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onRetry).toHaveBeenCalledWith(
      expect.any(Error),
      1, // Attempt number
      1000, // Delay in ms
    );
  });

  it("should add jitter to delays when jitterFactor > 0", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("Fail 1"))
      .mockResolvedValue("success");

    const onRetry = vi.fn();
    const promise = retryWithBackoff(fn, {
      maxRetries: 1,
      initialDelayMs: 1000,
      jitterFactor: 0.1, // 10% jitter
      onRetry,
    });

    await vi.runAllTimersAsync();
    await promise;

    // Delay should be between 1000 and 1100 (1000 + 10%)
    const actualDelay = onRetry.mock.calls[0]?.[2];
    expect(actualDelay).toBeGreaterThanOrEqual(1000);
    expect(actualDelay).toBeLessThanOrEqual(1100);
  });

  it("should pass attempt number to shouldRetry", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("Fail"));

    const shouldRetry = vi.fn((_, attempt) => attempt < 3); // Retry first 2 attempts

    const promise = retryWithBackoff(fn, { maxRetries: 5, shouldRetry });
    const timerPromise = vi.runAllTimersAsync();

    await expect(promise).rejects.toThrow("Fail");
    await timerPromise;

    // Should have called shouldRetry for attempts 1 and 2, then stopped
    expect(shouldRetry).toHaveBeenCalledWith(expect.any(Error), 1);
    expect(shouldRetry).toHaveBeenCalledWith(expect.any(Error), 2);
    expect(fn).toHaveBeenCalledTimes(3); // Initial + 2 retries
  });

  it("should work with async function returning complex types", async () => {
    interface ApiResponse {
      data: { id: string; name: string };
      status: number;
    }

    const mockResponse: ApiResponse = {
      data: { id: "123", name: "Test" },
      status: 200,
    };

    const fn = vi.fn().mockResolvedValue(mockResponse);

    const promise = retryWithBackoff<ApiResponse>(fn);
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toEqual(mockResponse);
    expect(result.data.id).toBe("123");
  });

  it("should use default options when none provided", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("Fail"))
      .mockResolvedValue("success");

    const onRetry = vi.fn();
    const promise = retryWithBackoff(fn, { onRetry, jitterFactor: 0 });

    await vi.runAllTimersAsync();
    await promise;

    // Default: maxRetries=3, initialDelayMs=1000
    expect(onRetry).toHaveBeenCalledWith(expect.any(Error), 1, 1000);
  });
});

describe("hasStatusCode", () => {
  it("should return true for objects with numeric status property", () => {
    expect(hasStatusCode({ status: 404 })).toBe(true);
    expect(hasStatusCode({ status: 500, statusText: "Error" })).toBe(true);
  });

  it("should return false for objects without status property", () => {
    expect(hasStatusCode({ message: "Error" })).toBe(false);
    expect(hasStatusCode({})).toBe(false);
  });

  it("should return false for non-numeric status", () => {
    expect(hasStatusCode({ status: "404" })).toBe(false);
    expect(hasStatusCode({ status: null })).toBe(false);
  });

  it("should return false for primitives", () => {
    expect(hasStatusCode(null)).toBe(false);
    expect(hasStatusCode(undefined)).toBe(false);
    expect(hasStatusCode("error")).toBe(false);
    expect(hasStatusCode(404)).toBe(false);
  });
});

describe("shouldRetryServerErrors", () => {
  it("should retry on 5xx server errors", () => {
    expect(shouldRetryServerErrors({ status: 500 })).toBe(true);
    expect(shouldRetryServerErrors({ status: 502 })).toBe(true);
    expect(shouldRetryServerErrors({ status: 503 })).toBe(true);
    expect(shouldRetryServerErrors({ status: 504 })).toBe(true);
  });

  it("should not retry on 4xx client errors", () => {
    expect(shouldRetryServerErrors({ status: 400 })).toBe(false);
    expect(shouldRetryServerErrors({ status: 401 })).toBe(false);
    expect(shouldRetryServerErrors({ status: 403 })).toBe(false);
    expect(shouldRetryServerErrors({ status: 404 })).toBe(false);
  });

  it("should retry on network errors (no status code)", () => {
    expect(shouldRetryServerErrors(new Error("Network error"))).toBe(true);
    expect(shouldRetryServerErrors({ message: "Failed to fetch" })).toBe(true);
  });

  it("should not retry on 2xx success codes", () => {
    expect(shouldRetryServerErrors({ status: 200 })).toBe(false);
    expect(shouldRetryServerErrors({ status: 201 })).toBe(false);
  });

  it("should not retry on 3xx redirect codes", () => {
    expect(shouldRetryServerErrors({ status: 301 })).toBe(false);
    expect(shouldRetryServerErrors({ status: 302 })).toBe(false);
  });
});

describe("shouldRetryMailchimpAuth", () => {
  it("should retry on rate limit (429)", () => {
    expect(shouldRetryMailchimpAuth({ status: 429 })).toBe(true);
  });

  it("should retry on 5xx server errors", () => {
    expect(shouldRetryMailchimpAuth({ status: 500 })).toBe(true);
    expect(shouldRetryMailchimpAuth({ status: 502 })).toBe(true);
    expect(shouldRetryMailchimpAuth({ status: 503 })).toBe(true);
    expect(shouldRetryMailchimpAuth({ status: 504 })).toBe(true);
  });

  it("should not retry on 4xx client errors (except 429)", () => {
    expect(shouldRetryMailchimpAuth({ status: 400 })).toBe(false);
    expect(shouldRetryMailchimpAuth({ status: 401 })).toBe(false);
    expect(shouldRetryMailchimpAuth({ status: 403 })).toBe(false);
    expect(shouldRetryMailchimpAuth({ status: 404 })).toBe(false);
  });

  it("should retry on network errors (no status code)", () => {
    expect(shouldRetryMailchimpAuth(new Error("Network error"))).toBe(true);
    expect(shouldRetryMailchimpAuth({ message: "Failed to fetch" })).toBe(true);
  });

  it("should not retry on 2xx success codes", () => {
    expect(shouldRetryMailchimpAuth({ status: 200 })).toBe(false);
    expect(shouldRetryMailchimpAuth({ status: 201 })).toBe(false);
  });
});

describe("retryWithBackoff integration scenarios", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should handle fetch-like API with status codes", async () => {
    const mockFetch = vi
      .fn()
      .mockRejectedValueOnce({ status: 503, statusText: "Service Unavailable" })
      .mockResolvedValue({ status: 200, data: "success" });

    const promise = retryWithBackoff(mockFetch, {
      shouldRetry: shouldRetryServerErrors,
    });

    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toEqual({ status: 200, data: "success" });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("should handle Mailchimp OAuth scenario", async () => {
    const exchangeToken = vi
      .fn()
      .mockRejectedValueOnce({ status: 429, message: "Rate limit" })
      .mockRejectedValueOnce({ status: 502, message: "Bad Gateway" })
      .mockResolvedValue({ access_token: "token123", dc: "us1" });

    const promise = retryWithBackoff(exchangeToken, {
      maxRetries: 3,
      shouldRetry: shouldRetryMailchimpAuth,
    });

    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result).toEqual({ access_token: "token123", dc: "us1" });
    expect(exchangeToken).toHaveBeenCalledTimes(3);
  });

  it("should not retry on client errors in OAuth flow", async () => {
    const error = { status: 401, message: "Invalid credentials" };
    const exchangeToken = vi.fn().mockRejectedValue(error);

    const promise = retryWithBackoff(exchangeToken, {
      shouldRetry: shouldRetryMailchimpAuth,
    });
    const timerPromise = vi.runAllTimersAsync();

    await expect(promise).rejects.toEqual(error);
    await timerPromise;

    expect(exchangeToken).toHaveBeenCalledTimes(1); // No retries
  });
});
