/**
 * Retry Utility with Exponential Backoff
 *
 * Provides resilient retry logic for operations that may fail transiently,
 * such as network requests or external API calls.
 *
 * Features:
 * - Exponential backoff with configurable parameters
 * - Maximum retry attempts
 * - Jitter to prevent thundering herd
 * - TypeScript generics for type safety
 */

/**
 * Configuration options for retry behavior
 */
export interface RetryOptions {
  /**
   * Maximum number of retry attempts (excluding initial attempt)
   * @default 3
   */
  maxRetries?: number;

  /**
   * Initial delay in milliseconds before first retry
   * @default 1000
   */
  initialDelayMs?: number;

  /**
   * Maximum delay in milliseconds between retries
   * @default 10000
   */
  maxDelayMs?: number;

  /**
   * Backoff multiplier for exponential delay growth
   * @default 2
   */
  backoffMultiplier?: number;

  /**
   * Add random jitter to prevent thundering herd
   * Jitter range: 0 to (delay * jitterFactor)
   * @default 0.1 (10% jitter)
   */
  jitterFactor?: number;

  /**
   * Custom function to determine if error is retryable
   * Return true to retry, false to throw immediately
   * @default () => true (retry all errors)
   */
  shouldRetry?: (error: unknown, attempt: number) => boolean;

  /**
   * Callback invoked before each retry attempt
   * Useful for logging or telemetry
   */
  onRetry?: (error: unknown, attempt: number, delayMs: number) => void;
}

/**
 * Default retry configuration
 */
const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  jitterFactor: 0.1,
  shouldRetry: () => true,
  onRetry: () => {},
};

/**
 * Calculate delay with exponential backoff and jitter
 *
 * Formula: min(initialDelay * (multiplier ^ attempt), maxDelay) + jitter
 * Jitter: random value between 0 and (delay * jitterFactor)
 */
function calculateDelay(
  attempt: number,
  options: Required<RetryOptions>,
): number {
  const { initialDelayMs, maxDelayMs, backoffMultiplier, jitterFactor } =
    options;

  // Calculate exponential delay
  const exponentialDelay =
    initialDelayMs * Math.pow(backoffMultiplier, attempt - 1);

  // Cap at maximum delay
  const cappedDelay = Math.min(exponentialDelay, maxDelayMs);

  // Add random jitter (0 to jitterFactor% of delay)
  const jitter = Math.random() * cappedDelay * jitterFactor;

  return Math.floor(cappedDelay + jitter);
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry an async operation with exponential backoff
 *
 * @param fn - Async function to retry
 * @param options - Retry configuration options
 * @returns Promise resolving to function result
 * @throws Last error if all retries exhausted or error is non-retryable
 *
 * @example
 * ```typescript
 * // Basic usage with defaults
 * const data = await retryWithBackoff(async () => {
 *   const response = await fetch('/api/data');
 *   if (!response.ok) throw new Error('Failed to fetch');
 *   return response.json();
 * });
 *
 * // Custom retry logic
 * const result = await retryWithBackoff(
 *   async () => await mailchimpClient.getMetadata(),
 *   {
 *     maxRetries: 5,
 *     initialDelayMs: 500,
 *     shouldRetry: (error, attempt) => {
 *       // Don't retry on 4xx errors (client errors)
 *       if (error instanceof Response && error.status >= 400 && error.status < 500) {
 *         return false;
 *       }
 *       return attempt < 5;
 *     },
 *     onRetry: (error, attempt, delayMs) => {
 *       console.log(`Retry attempt ${attempt} after ${delayMs}ms`, error);
 *     },
 *   }
 * );
 * ```
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const config: Required<RetryOptions> = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  let lastError: unknown;
  const maxAttempts = config.maxRetries + 1; // Initial attempt + retries

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Attempt the operation
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if we should retry
      const shouldRetry =
        attempt < maxAttempts && config.shouldRetry(error, attempt);

      if (!shouldRetry) {
        // No more retries or non-retryable error
        throw error;
      }

      // Calculate delay and wait
      const delayMs = calculateDelay(attempt, config);
      config.onRetry(error, attempt, delayMs);
      await sleep(delayMs);
    }
  }

  // All retries exhausted (should never reach here due to throw in loop)
  throw lastError;
}

/**
 * Type guard to check if error has a status code
 */
export function hasStatusCode(
  error: unknown,
): error is { status: number; statusText?: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status: unknown }).status === "number"
  );
}

/**
 * Common retry predicate: Only retry on 5xx server errors and network errors
 * Don't retry on 4xx client errors (bad request, unauthorized, etc.)
 *
 * @example
 * ```typescript
 * await retryWithBackoff(fetchData, {
 *   shouldRetry: shouldRetryServerErrors,
 * });
 * ```
 */
export function shouldRetryServerErrors(error: unknown): boolean {
  // Network errors (no status code) - retry
  if (!hasStatusCode(error)) {
    return true;
  }

  // 5xx server errors - retry
  // 4xx client errors - don't retry
  return error.status >= 500;
}

/**
 * Retry predicate for Mailchimp OAuth operations
 * Retries on network errors and specific HTTP status codes
 *
 * @example
 * ```typescript
 * await retryWithBackoff(exchangeOAuthToken, {
 *   shouldRetry: shouldRetryMailchimpAuth,
 * });
 * ```
 */
export function shouldRetryMailchimpAuth(error: unknown): boolean {
  // Network errors - retry
  if (!hasStatusCode(error)) {
    return true;
  }

  // Retry on:
  // - 429 Too Many Requests
  // - 500 Internal Server Error
  // - 502 Bad Gateway
  // - 503 Service Unavailable
  // - 504 Gateway Timeout
  const retryableStatuses = [429, 500, 502, 503, 504];
  return retryableStatuses.includes(error.status);
}
