/**
 * Modern Mailchimp Fetch Client
 * Replaces @mailchimp/mailchimp_marketing with native fetch
 *
 * Features:
 * - Native fetch API (Edge Runtime compatible)
 * - OAuth 2.0 token injection
 * - Rate limit tracking
 * - Zod schema validation
 * - Comprehensive error handling
 */

import { errorSchema } from "@/schemas/mailchimp";
import type { ErrorResponse } from "@/types/mailchimp";
import {
  MailchimpFetchError,
  MailchimpRateLimitError,
  MailchimpAuthError,
  MailchimpNetworkError,
} from "@/lib/errors";

interface MailchimpClientConfig {
  accessToken: string;
  serverPrefix: string;
  timeout?: number;
}

interface RateLimitInfo {
  remaining: number;
  limit: number;
  resetTime: Date;
}

export class MailchimpFetchClient {
  private readonly baseUrl: string;
  private readonly accessToken: string;
  private readonly timeout: number;
  private rateLimitInfo?: RateLimitInfo;

  constructor(config: MailchimpClientConfig) {
    this.baseUrl = `https://${config.serverPrefix}.api.mailchimp.com/3.0`;
    this.accessToken = config.accessToken;
    this.timeout = config.timeout ?? 30000; // 30s default
  }

  /**
   * Get current rate limit information
   */
  public getRateLimitInfo(): RateLimitInfo | undefined {
    return this.rateLimitInfo;
  }

  /**
   * Core fetch method with error handling
   */
  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      // Extract rate limit headers
      this.extractRateLimitInfo(response.headers);

      // Handle non-2xx responses
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // Parse successful response
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle network errors
      if (error instanceof Error && error.name === "AbortError") {
        throw new MailchimpNetworkError(
          `Request timeout after ${this.timeout}ms`,
        );
      }

      // Re-throw Mailchimp-specific errors
      if (
        error instanceof MailchimpFetchError ||
        error instanceof MailchimpNetworkError
      ) {
        throw error;
      }

      // Unknown error
      throw new MailchimpNetworkError(
        "Network request failed",
        error instanceof Error ? error : undefined,
      );
    }
  }

  /**
   * Extract rate limit information from response headers
   */
  private extractRateLimitInfo(headers: Headers): void {
    const remaining = headers.get("X-RateLimit-Remaining");
    const limit = headers.get("X-RateLimit-Limit");
    const reset = headers.get("X-RateLimit-Reset");

    if (remaining && limit && reset) {
      this.rateLimitInfo = {
        remaining: parseInt(remaining, 10),
        limit: parseInt(limit, 10),
        resetTime: new Date(parseInt(reset, 10) * 1000),
      };
    }
  }

  /**
   * Handle error responses from Mailchimp API
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorBody: unknown;

    try {
      errorBody = await response.json();
    } catch {
      throw new MailchimpNetworkError(
        `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    // Validate error response structure
    const parseResult = errorSchema.safeParse(errorBody);

    if (!parseResult.success) {
      throw new MailchimpNetworkError(
        `Invalid error response from Mailchimp API: ${response.statusText}`,
      );
    }

    const errorResponse = parseResult.data as ErrorResponse;

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = parseInt(
        response.headers.get("Retry-After") || "60",
        10,
      );
      const limit = parseInt(
        response.headers.get("X-RateLimit-Limit") || "0",
        10,
      );

      throw new MailchimpRateLimitError(errorResponse, retryAfter, limit);
    }

    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      throw new MailchimpAuthError(errorResponse);
    }

    // Generic API error
    throw new MailchimpFetchError(errorResponse);
  }

  /**
   * GET request
   */
  public async get<T>(
    endpoint: string,
    params?: Record<string, unknown>,
  ): Promise<T> {
    const queryString = params
      ? `?${new URLSearchParams(
          Object.entries(params).reduce(
            (acc, [key, value]) => {
              if (value !== undefined && value !== null) {
                acc[key] = String(value);
              }
              return acc;
            },
            {} as Record<string, string>,
          ),
        ).toString()}`
      : "";

    return this.fetch<T>(`${endpoint}${queryString}`, {
      method: "GET",
    });
  }

  /**
   * POST request
   */
  public async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PATCH request
   */
  public async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  public async put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  public async delete<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: "DELETE",
    });
  }
}
