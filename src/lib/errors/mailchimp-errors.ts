/**
 * Mailchimp-specific error classes
 * Extends base error types from @/types/api-errors
 */

import type { ErrorResponse } from "@/types/mailchimp";

/**
 * Base Mailchimp API Error
 * Follows RFC 7807 Problem Details for HTTP APIs
 */
export class MailchimpFetchError extends Error {
  public readonly statusCode: number;
  public readonly type: string;
  public readonly instance: string;
  public readonly digest?: string;

  constructor(errorResponse: ErrorResponse) {
    super(errorResponse.detail);
    this.name = "MailchimpFetchError";
    this.statusCode = errorResponse.status;
    this.type = errorResponse.type;
    this.instance = errorResponse.instance;
  }
}

/**
 * Rate limit exceeded error
 */
export class MailchimpRateLimitError extends MailchimpFetchError {
  public readonly retryAfter: number;
  public readonly limit: number;

  constructor(errorResponse: ErrorResponse, retryAfter: number, limit: number) {
    super(errorResponse);
    this.name = "MailchimpRateLimitError";
    this.retryAfter = retryAfter;
    this.limit = limit;
  }
}

/**
 * Authentication/authorization error
 */
export class MailchimpAuthError extends MailchimpFetchError {
  constructor(errorResponse: ErrorResponse) {
    super(errorResponse);
    this.name = "MailchimpAuthError";
  }
}

/**
 * Network/connection error
 */
export class MailchimpNetworkError extends Error {
  public readonly cause?: Error;

  constructor(message: string, cause?: Error) {
    super(message);
    this.name = "MailchimpNetworkError";
    this.cause = cause;
  }
}
