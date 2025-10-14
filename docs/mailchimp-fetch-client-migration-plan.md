# Mailchimp Fetch Client Migration Plan

> **Quick Navigation**: [Phase 0](#phase-0-setup--feature-branch) | [Phase 1](#phase-1-foundation-core-client-infrastructure) | [Phase 2](#phase-2-service-layer-integration) | [Phase 3](#phase-3-testing--validation) | [Phase 4](#phase-4-cleanup--documentation) | [Phase 5](#phase-5-pull-request--deployment)

## Executive Summary

Migrate from the outdated `@mailchimp/mailchimp_marketing` SDK (last updated November 2022) to a modern, fetch-based Mailchimp client that aligns with Next.js 15 best practices and our OAuth 2.0 architecture.

## Goals

1. **Remove Legacy Dependency**: Eliminate `@mailchimp/mailchimp_marketing` (v3.0.80)
2. **Modern Architecture**: Implement native `fetch` API with full TypeScript support
3. **Edge Runtime Compatible**: Enable deployment to Vercel Edge Functions
4. **Type Safety**: Leverage existing Zod schemas for runtime validation
5. **Error Handling**: Follow Next.js App Router error handling best practices
6. **Zero Breaking Changes**: Maintain backward compatibility with existing API

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│ Server Actions (src/actions/mailchimp-*.ts)                 │
│ - Return values for expected errors (Next.js best practice) │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ Data Access Layer (DAL) (src/dal/mailchimp.dal.ts)           │
│ - Business logic and orchestration                          │
│ - Returns ApiResponse<T> wrapper                            │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ Fetch Client (src/lib/mailchimp-fetch-client.ts) [NEW]     │
│ - Native fetch API                                          │
│ - OAuth token injection                                     │
│ - Rate limit tracking                                       │
│ - Error transformation                                      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ Mailchimp REST API (https://{dc}.api.mailchimp.com/3.0)    │
└─────────────────────────────────────────────────────────────┘
```

## Git Workflow Strategy

This migration uses a structured Git workflow with commits at each phase to maintain clear history and enable easy rollback if needed.

### Initial Setup

```bash
# Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/mailchimp-fetch-client-migration
```

### Phase Commits

Each phase will end with a Git commit:

- **Phase 1**: `feat: add Mailchimp fetch client foundation`
- **Phase 2**: `feat: integrate fetch client with service layer`
- **Phase 3**: `test: add comprehensive test coverage for fetch client`
- **Phase 4**: `chore: remove old Mailchimp SDK and update docs`
- **Phase 5**: `ci: create PR and deploy to production`

### Conversation Management Between Phases

To reduce token usage and costs, **clear the conversation** between phases:

1. **Complete phase checklist** ✅
2. **Run validation commands** (tests, type-check, lint)
3. **Create Git commit** for the phase
4. **Clear conversation** in Claude Code
5. **Start new conversation** for next phase
6. **Reference this plan**: "Continue with Phase N of [docs/mailchimp-fetch-client-migration-plan.md](docs/mailchimp-fetch-client-migration-plan.md)"

**Benefits**:

- 🎯 Reduced token costs (~80% savings per phase)
- 🧹 Clean context for each phase
- 📝 Clear commit history
- 🔄 Easy to resume after breaks
- 🐛 Isolated debugging per phase

---

## Implementation Phases

### Phase 0: Setup & Feature Branch

**Objective**: Create feature branch and prepare for implementation.

#### Commands

```bash
# Ensure main is up to date
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/mailchimp-fetch-client-migration

# Verify branch
git branch --show-current
```

**Checklist**:

- [ ] Main branch up to date
- [ ] Feature branch created
- [ ] Branch name verified: `feature/mailchimp-fetch-client-migration`

**Git Commit**: N/A (no changes yet)

**🔴 STOP**: Clear conversation after completing Phase 0. In next conversation, say: "Continue with Phase 1 of [docs/mailchimp-fetch-client-migration-plan.md](docs/mailchimp-fetch-client-migration-plan.md)"

---

### Phase 1: Foundation (Core Client Infrastructure)

**Objective**: Create error classes, fetch client, and client factory with tests.

#### 1.1 Create Error Classes

**File**: `src/lib/errors/mailchimp-errors.ts`

```typescript
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
```

**Checklist**:

- [ ] Create `src/lib/errors/` directory
- [ ] Implement error classes with proper inheritance
- [ ] Add JSDoc documentation for each class
- [ ] Export from `src/lib/errors/index.ts` using path aliases
- [ ] Add unit tests in `src/lib/errors/mailchimp-errors.test.ts`

---

#### 1.2 Create Fetch Client Core

**File**: `src/lib/mailchimp-fetch-client.ts`

```typescript
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
import type { ApiResponse } from "@/types/api-errors";
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
```

**Checklist**:

- [ ] Implement `MailchimpFetchClient` class
- [ ] Add timeout support with AbortController
- [ ] Implement rate limit extraction from headers
- [ ] Add comprehensive error handling
- [ ] Add JSDoc documentation
- [ ] Create unit tests with mocked fetch
- [ ] Test rate limit tracking
- [ ] Test timeout behavior
- [ ] Test all HTTP methods (GET, POST, PATCH, PUT, DELETE)

---

#### 1.3 Create User-Scoped Client Factory

**File**: `src/lib/mailchimp-client-factory.ts`

```typescript
/**
 * User-Scoped Mailchimp Client Factory
 * Creates authenticated client instances per user
 */

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { mailchimpConnectionRepo } from "@/db/repositories";
import { MailchimpFetchClient } from "@/lib/mailchimp-fetch-client";
import { UnauthorizedError } from "@/types/api-errors";

/**
 * Get user-specific Mailchimp client instance
 * Retrieves OAuth token from database and creates authenticated client
 *
 * @throws {UnauthorizedError} If user not authenticated
 * @throws {Error} If Mailchimp not connected or inactive
 */
export async function getUserMailchimpClient(): Promise<MailchimpFetchClient> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    throw new UnauthorizedError("User not authenticated");
  }

  // Get decrypted token from database
  const connection = await mailchimpConnectionRepo.getDecryptedToken(user.id);

  if (!connection) {
    throw new Error("Mailchimp not connected. Please connect your account.");
  }

  if (!connection.isActive) {
    throw new Error("Mailchimp connection is inactive. Please reconnect.");
  }

  // Create and return authenticated client
  return new MailchimpFetchClient({
    accessToken: connection.accessToken,
    serverPrefix: connection.serverPrefix,
  });
}
```

**Checklist**:

- [ ] Implement client factory function
- [ ] Add authentication checks
- [ ] Add connection validation
- [ ] Add JSDoc documentation
- [ ] Create unit tests with mocked database
- [ ] Test unauthenticated user scenario
- [ ] Test disconnected Mailchimp scenario
- [ ] Test inactive connection scenario

---

#### Phase 1 Validation & Commit

**Validation Commands**:

```bash
# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Run tests (error classes, fetch client, factory tests)
pnpm test src/lib/errors
pnpm test src/lib/mailchimp-fetch-client
pnpm test src/lib/mailchimp-client-factory

# Check test coverage
pnpm test:coverage src/lib/
```

**Git Commit**:

```bash
# Stage all new files
git add src/lib/errors/
git add src/lib/mailchimp-fetch-client.ts
git add src/lib/mailchimp-fetch-client.test.ts
git add src/lib/mailchimp-client-factory.ts
git add src/lib/mailchimp-client-factory.test.ts

# Create commit
git commit -m "feat: add Mailchimp fetch client foundation

- Add custom error classes (MailchimpFetchError, MailchimpAuthError, MailchimpRateLimitError, MailchimpNetworkError)
- Implement MailchimpFetchClient with native fetch API
- Add rate limit tracking from response headers
- Add timeout support with AbortController
- Implement user-scoped client factory with OAuth token retrieval
- Add comprehensive unit tests with >90% coverage
- Add JSDoc documentation for all public APIs

Part of Phase 1: Foundation (Core Client Infrastructure)
Ref: docs/mailchimp-fetch-client-migration-plan.md"

# Verify commit
git show --stat
```

**Phase 1 Completion Checklist**:

- [ ] All Phase 1 files created
- [ ] All tests passing
- [ ] Type checking passing
- [ ] Linting passing
- [ ] Code coverage >90%
- [ ] Git commit created
- [ ] Commit verified with `git show --stat`

**🔴 STOP**: Clear conversation after completing Phase 1. In next conversation, say: "Continue with Phase 2 of [docs/mailchimp-fetch-client-migration-plan.md](docs/mailchimp-fetch-client-migration-plan.md)"

---

### Phase 2: Data Access Layer (DAL) Integration

**Objective**: Create action wrapper and refactor service layer to use fetch client.

#### 2.1 Create Wrapper Function (Next.js Pattern)

**File**: `src/lib/mailchimp-action-wrapper.ts`

```typescript
/**
 * Server Action Wrapper for Mailchimp API Calls
 * Follows Next.js App Router best practices for error handling
 *
 * Pattern: Return values for expected errors (not try/catch)
 * Reference: https://nextjs.org/docs/app/getting-started/error-handling
 */

import { getUserMailchimpClient } from "@/lib/mailchimp-client-factory";
import type { ApiResponse } from "@/types/api-errors";
import type { MailchimpFetchClient } from "@/lib/mailchimp-fetch-client";
import {
  MailchimpFetchError,
  MailchimpAuthError,
  MailchimpRateLimitError,
  MailchimpNetworkError,
} from "@/lib/errors";

/**
 * Wrapper for Mailchimp API calls with user-scoped client
 * Returns ApiResponse<T> for consistent error handling
 *
 * @param apiCall - Function that takes client and returns data
 * @returns ApiResponse with success/error state
 */
export async function mailchimpApiCall<T>(
  apiCall: (client: MailchimpFetchClient) => Promise<T>,
): Promise<ApiResponse<T>> {
  try {
    const client = await getUserMailchimpClient();
    const data = await apiCall(client);

    // Include rate limit info if available
    const rateLimitInfo = client.getRateLimitInfo();

    return {
      success: true,
      data,
      rateLimit: rateLimitInfo
        ? {
            remaining: rateLimitInfo.remaining,
            limit: rateLimitInfo.limit,
            resetTime: rateLimitInfo.resetTime,
          }
        : undefined,
    };
  } catch (error) {
    // Handle connection errors (not connected, inactive)
    if (
      error instanceof Error &&
      (error.message.includes("not connected") ||
        error.message.includes("inactive"))
    ) {
      return {
        success: false,
        error: error.message,
        statusCode: 401,
      };
    }

    // Handle authentication errors
    if (error instanceof MailchimpAuthError) {
      return {
        success: false,
        error: error.message,
        statusCode: error.statusCode,
      };
    }

    // Handle rate limit errors
    if (error instanceof MailchimpRateLimitError) {
      return {
        success: false,
        error: `Rate limit exceeded. Try again in ${error.retryAfter} seconds.`,
        statusCode: 429,
        rateLimit: {
          remaining: 0,
          limit: error.limit,
          resetTime: new Date(Date.now() + error.retryAfter * 1000),
        },
      };
    }

    // Handle API errors
    if (error instanceof MailchimpFetchError) {
      return {
        success: false,
        error: error.message,
        statusCode: error.statusCode,
      };
    }

    // Handle network errors
    if (error instanceof MailchimpNetworkError) {
      return {
        success: false,
        error: error.message,
        statusCode: 503,
      };
    }

    // Unknown error
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      statusCode: 500,
    };
  }
}
```

**Checklist**:

- [ ] Implement wrapper function
- [ ] Add rate limit info to responses
- [ ] Handle all error types
- [ ] Add JSDoc documentation
- [ ] Create unit tests
- [ ] Test successful API calls
- [ ] Test all error scenarios
- [ ] Test rate limit info extraction

---

#### 2.2 Update Data Access Layer (DAL)

**File**: `src/dal/mailchimp.dal.ts` (REFACTORED)

```typescript
/**
 * Mailchimp Data Access Layer (DAL) (Fetch-based)
 * All methods now use modern fetch client with OAuth tokens
 */

import { mailchimpApiCall } from "@/lib/mailchimp-action-wrapper";
import type { ApiResponse } from "@/types/api-errors";
import type {
  Report,
  ReportListSuccess,
  ReportSuccess,
  RootSuccess,
  ListsSuccess,
  ListsParams,
  ReportListParams,
  OpenListQueryParams,
} from "@/types/mailchimp";

// Re-export the report type for external use
export type { Report as CampaignReport };

export class MailchimpDAL {
  /**
   * List Operations
   */
  async getLists(params: ListsParams): Promise<ApiResponse<ListsSuccess>> {
    return mailchimpApiCall((client) =>
      client.get<ListsSuccess>("/lists", params),
    );
  }

  async getList(listId: string): Promise<ApiResponse<unknown>> {
    return mailchimpApiCall((client) =>
      client.get<unknown>(`/lists/${listId}`),
    );
  }

  /**
   * Campaign Operations
   */
  async getCampaigns(params: unknown): Promise<ApiResponse<unknown>> {
    return mailchimpApiCall((client) =>
      client.get<unknown>("/campaigns", params as Record<string, unknown>),
    );
  }

  async getCampaign(campaignId: string): Promise<ApiResponse<unknown>> {
    return mailchimpApiCall((client) =>
      client.get<unknown>(`/campaigns/${campaignId}`),
    );
  }

  /**
   * Campaign Report Operations
   */
  async getCampaignReports(
    params: ReportListParams,
  ): Promise<ApiResponse<ReportListSuccess>> {
    return mailchimpApiCall((client) =>
      client.get<ReportListSuccess>("/reports", params),
    );
  }

  async getCampaignReport(
    campaignId: string,
  ): Promise<ApiResponse<ReportSuccess>> {
    return mailchimpApiCall((client) =>
      client.get<ReportSuccess>(`/reports/${campaignId}`),
    );
  }

  async getCampaignOpenList(
    campaignId: string,
    params?: OpenListQueryParams,
  ): Promise<ApiResponse<unknown>> {
    return mailchimpApiCall((client) =>
      client.get<unknown>(`/reports/${campaignId}/open-details`, params),
    );
  }

  /**
   * System Operations
   */
  async getApiRoot(
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<RootSuccess>> {
    return mailchimpApiCall((client) => client.get<RootSuccess>("/", params));
  }

  async healthCheck(): Promise<ApiResponse<unknown>> {
    return mailchimpApiCall((client) => client.get<unknown>("/ping"));
  }
}

/**
 * Singleton instance for use throughout the application
 */
export const mailchimpDAL = new MailchimpDAL();
```

**Checklist**:

- [ ] Refactor all service methods to use fetch client
- [ ] Update all method signatures (no changes needed)
- [ ] Maintain backward compatibility
- [ ] Update JSDoc if needed
- [ ] Run existing service tests (should pass without changes)
- [ ] Add integration tests with real fetch

---

#### Phase 2 Validation & Commit

**Validation Commands**:

```bash
# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Run new tests
pnpm test src/lib/mailchimp-action-wrapper

# Run existing tests (verify backward compatibility)
pnpm test src/actions/mailchimp
pnpm test src/services/mailchimp

# Quick validation
pnpm quick-check
```

**Git Commit**:

```bash
# Stage new and modified files
git add src/lib/mailchimp-action-wrapper.ts
git add src/lib/mailchimp-action-wrapper.test.ts
git add src/dal/mailchimp.dal.ts

# Create commit
git commit -m "feat: integrate fetch client with service layer

- Add mailchimpApiCall wrapper following Next.js error handling patterns
- Return error values instead of throwing for expected errors
- Include rate limit info in ApiResponse
- Refactor MailchimpDAL to use MailchimpFetchClient
- Maintain 100% backward compatibility with existing API
- All existing tests pass without modification
- Add comprehensive error handling for all error types

Part of Phase 2: Data Access Layer (DAL) Integration
Ref: docs/mailchimp-fetch-client-migration-plan.md"

# Verify commit
git show --stat
```

**Phase 2 Completion Checklist**:

- [ ] Action wrapper created and tested
- [ ] Service layer refactored
- [ ] All new tests passing
- [ ] All existing tests passing (backward compatible)
- [ ] Type checking passing
- [ ] Linting passing
- [ ] Git commit created
- [ ] Commit verified with `git show --stat`

**🔴 STOP**: Clear conversation after completing Phase 2. In next conversation, say: "Continue with Phase 3 of [docs/mailchimp-fetch-client-migration-plan.md](docs/mailchimp-fetch-client-migration-plan.md)"

---

### Phase 3: Testing & Validation

**Objective**: Add comprehensive unit and integration tests, validate existing tests pass.

#### 3.1 Unit Tests

**Files to Create/Update**:

1. **`src/lib/errors/mailchimp-errors.test.ts`**
   - Test error class instantiation
   - Test error properties
   - Test error inheritance

2. **`src/lib/mailchimp-fetch-client.test.ts`**
   - Mock global `fetch`
   - Test successful requests
   - Test error responses
   - Test rate limit tracking
   - Test timeout behavior
   - Test all HTTP methods

3. **`src/lib/mailchimp-client-factory.test.ts`**
   - Mock Kinde session
   - Mock database repository
   - Test authenticated user
   - Test unauthenticated user
   - Test disconnected Mailchimp
   - Test inactive connection

4. **`src/lib/mailchimp-action-wrapper.test.ts`**
   - Mock client factory
   - Test successful API calls
   - Test all error scenarios
   - Test rate limit info in responses

**Checklist**:

- [ ] Create all unit test files
- [ ] Achieve >90% code coverage
- [ ] Mock all external dependencies
- [ ] Test edge cases
- [ ] Run `pnpm test` successfully

---

#### 3.2 Integration Tests

**File**: `src/services/mailchimp.service.integration.test.ts`

Test real API calls with:

- Mock Mailchimp server (using MSW - Mock Service Worker)
- Test all service methods
- Test error scenarios
- Test rate limit handling

**Checklist**:

- [ ] Set up MSW for API mocking
- [ ] Create integration test suite
- [ ] Test all service methods
- [ ] Test error scenarios
- [ ] Run integration tests in CI

---

#### 3.3 Existing Test Validation

Run all existing tests to ensure no regressions:

```bash
pnpm test                    # All tests
pnpm test:coverage           # With coverage
pnpm test src/actions/       # Server actions tests
```

**Checklist**:

- [ ] All existing tests pass
- [ ] No test modifications needed (backward compatible)
- [ ] Coverage maintained or improved

---

#### Phase 3 Validation & Commit

**Validation Commands**:

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Verify coverage for new code
pnpm test:coverage src/lib/

# Run integration tests specifically
pnpm test src/services/mailchimp.service.integration.test.ts

# Full validation
pnpm quick-check
```

**Git Commit**:

```bash
# Stage all test files
git add src/lib/errors/mailchimp-errors.test.ts
git add src/lib/mailchimp-fetch-client.test.ts
git add src/lib/mailchimp-client-factory.test.ts
git add src/lib/mailchimp-action-wrapper.test.ts
git add src/services/mailchimp.service.integration.test.ts

# Create commit
git commit -m "test: add comprehensive test coverage for fetch client

- Add unit tests for error classes with 100% coverage
- Add unit tests for MailchimpFetchClient (fetch mocking, timeouts, rate limits)
- Add unit tests for client factory (auth, connection validation)
- Add unit tests for action wrapper (all error scenarios)
- Add integration tests with MSW for service layer
- Verify all existing tests pass (backward compatibility confirmed)
- Achieve >90% code coverage for all new code

Part of Phase 3: Testing & Validation
Ref: docs/mailchimp-fetch-client-migration-plan.md"

# Verify commit
git show --stat
```

**Phase 3 Completion Checklist**:

- [ ] All unit tests created
- [ ] Integration tests created with MSW
- [ ] All tests passing (new and existing)
- [ ] Code coverage >90% for new code
- [ ] Type checking passing
- [ ] Linting passing
- [ ] Git commit created
- [ ] Commit verified with `git show --stat`

**🔴 STOP**: Clear conversation after completing Phase 3. In next conversation, say: "Continue with Phase 4 of [docs/mailchimp-fetch-client-migration-plan.md](docs/mailchimp-fetch-client-migration-plan.md)"

---

### Phase 4: Cleanup & Documentation

**Objective**: Remove old SDK, update documentation, create/update error boundaries.

#### 4.1 Remove Old SDK

**File**: `package.json`

Remove dependency:

```json
{
  "dependencies": {
    "@mailchimp/mailchimp_marketing": "^3.0.80" // REMOVE THIS LINE
  }
}
```

Delete old file:

```bash
rm src/lib/mailchimp.ts
```

**Checklist**:

- [ ] Remove `@mailchimp/mailchimp_marketing` from package.json
- [ ] Run `pnpm install` to update lock file
- [ ] Delete `src/lib/mailchimp.ts`
- [ ] Search codebase for any remaining imports
- [ ] Update imports if necessary

---

#### 4.2 Update Documentation

**Files to Update**:

1. **`CLAUDE.md`**
   - Update Mailchimp integration section
   - Document new fetch client architecture
   - Add migration notes

2. **`docs/PRD.md`**
   - Update technical implementation section
   - Document modernization milestone

3. **`docs/project-management/development-roadmap.md`**
   - Add completion status
   - Update performance metrics

**Checklist**:

- [ ] Update CLAUDE.md
- [ ] Update PRD.md
- [ ] Update development roadmap
- [ ] Add migration guide (if needed)

---

#### 4.3 Create Error Boundaries (If Missing)

Ensure proper error boundaries exist for Mailchimp routes:

**Files to Create/Update**:

- `src/app/mailchimp/error.tsx` (route-level error boundary)
- `src/app/api/mailchimp/*/error.tsx` (API route error boundaries)

**Example** (`src/app/mailchimp/error.tsx`):

```typescript
"use client";

import { useEffect } from "react";
import { DashboardLayout } from "@/components/layout";

export default function MailchimpError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Mailchimp page error:", error);
  }, [error]);

  return (
    <DashboardLayout>
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-destructive">
            Mailchimp Connection Error
          </h2>
          <p className="text-muted-foreground max-w-md">
            {error.message.includes("not connected")
              ? "Please connect your Mailchimp account to continue."
              : "An unexpected error occurred while communicating with Mailchimp."}
          </p>
          <button
            onClick={reset}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try again
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
```

**Checklist**:

- [ ] Audit existing error boundaries
- [ ] Create missing error boundaries
- [ ] Test error boundary rendering
- [ ] Add user-friendly error messages

---

#### Phase 4 Validation & Commit

**Validation Commands**:

```bash
# Verify old SDK removed
grep -r "@mailchimp/mailchimp_marketing" package.json

# Verify old file deleted
ls src/lib/mailchimp.ts 2>/dev/null && echo "ERROR: File still exists" || echo "OK: File deleted"

# Run all tests (should still pass)
pnpm test

# Type check
pnpm type-check

# Lint
pnpm lint

# Build for production
pnpm build
```

**Git Commit**:

```bash
# Stage all modified files
git add package.json
git add pnpm-lock.yaml
git add CLAUDE.md
git add docs/PRD.md
git add docs/project-management/development-roadmap.md
git add src/app/mailchimp/error.tsx
git rm src/lib/mailchimp.ts  # If not already deleted

# Create commit
git commit -m "chore: remove old Mailchimp SDK and update docs

- Remove @mailchimp/mailchimp_marketing dependency (~145KB savings)
- Delete deprecated src/lib/mailchimp.ts
- Update CLAUDE.md with new fetch client architecture
- Update PRD.md with modernization milestone
- Update development roadmap with completion status
- Add/update error boundaries for Mailchimp routes
- All tests passing, production build successful

Part of Phase 4: Cleanup & Documentation
Ref: docs/mailchimp-fetch-client-migration-plan.md"

# Verify commit
git show --stat
```

**Phase 4 Completion Checklist**:

- [ ] Old SDK dependency removed
- [ ] Old file deleted
- [ ] Documentation updated
- [ ] Error boundaries created/updated
- [ ] All tests passing
- [ ] Production build successful
- [ ] Git commit created
- [ ] Commit verified with `git show --stat`

**🔴 STOP**: Clear conversation after completing Phase 4. In next conversation, say: "Continue with Phase 5 of [docs/mailchimp-fetch-client-migration-plan.md](docs/mailchimp-fetch-client-migration-plan.md)"

---

### Phase 5: Pull Request & Deployment

**Objective**: Create PR, run CI/CD pipeline, deploy to production, monitor results.

#### 5.1 Pre-PR Validation

**Validation Commands**:

```bash
# Full validation suite (includes format, lint, type-check, test, a11y)
pnpm validate

# Should see all checks passing:
# ✓ Format check
# ✓ No secrets logged
# ✓ Lint
# ✓ Type check
# ✓ Tests
# ✓ Accessibility tests
# ✓ Production build
```

**Checklist**:

- [ ] All tests passing
- [ ] Type checking passing
- [ ] Linting passing
- [ ] Format checking passing
- [ ] Production build successful
- [ ] No console errors or warnings

---

#### 5.2 Push Feature Branch

```bash
# Verify all commits are present
git log --oneline origin/main..HEAD

# Should see 4 commits:
# - feat: add Mailchimp fetch client foundation
# - feat: integrate fetch client with service layer
# - test: add comprehensive test coverage for fetch client
# - chore: remove old Mailchimp SDK and update docs

# Push to remote
git push -u origin feature/mailchimp-fetch-client-migration
```

**Checklist**:

- [ ] Verified all 4 commits present
- [ ] Pushed to remote successfully
- [ ] Branch visible on GitHub

---

#### 5.3 Create Pull Request

**PR Title**:

```
feat: migrate to modern fetch-based Mailchimp client
```

**PR Description Template**:

```markdown
## Summary

Migrates from the outdated `@mailchimp/mailchimp_marketing` SDK (last updated Nov 2022) to a modern, native fetch-based client that aligns with Next.js 15 best practices and our OAuth 2.0 architecture.

## Changes

### Phase 1: Foundation

- ✅ Custom error classes (MailchimpFetchError, MailchimpAuthError, MailchimpRateLimitError, MailchimpNetworkError)
- ✅ MailchimpFetchClient with native fetch API
- ✅ Rate limit tracking from response headers
- ✅ Timeout support with AbortController
- ✅ User-scoped client factory with OAuth token retrieval

### Phase 2: Data Access Layer (DAL) Integration

- ✅ mailchimpApiCall wrapper following Next.js error handling patterns
- ✅ Refactored MailchimpDAL to use MailchimpFetchClient
- ✅ 100% backward compatibility maintained

### Phase 3: Testing & Validation

- ✅ Comprehensive unit tests (>90% coverage)
- ✅ Integration tests with MSW
- ✅ All existing tests pass without modification

### Phase 4: Cleanup & Documentation

- ✅ Removed @mailchimp/mailchimp_marketing dependency (~145KB savings)
- ✅ Updated CLAUDE.md, PRD.md, and development roadmap
- ✅ Added/updated error boundaries

## Benefits

- 🎯 **97% bundle size reduction** (~150KB → ~5KB)
- 🚀 **Edge Runtime compatible** for faster API routes
- 🔒 **Better error handling** with typed error classes
- ⚡ **Rate limit tracking** built-in
- 🧪 **100% backward compatible** - no changes to existing code
- 📊 **Comprehensive test coverage** (>90%)

## Testing

- ✅ All tests passing (93 total)
- ✅ Type checking passing
- ✅ Linting passing
- ✅ Production build successful
- ✅ Code coverage >90% for new code

## Breaking Changes

None - fully backward compatible with existing API.

## Migration Plan

Full implementation plan: [docs/mailchimp-fetch-client-migration-plan.md](docs/mailchimp-fetch-client-migration-plan.md)

## Checklist

- [x] All tests passing
- [x] Type checking passing
- [x] Linting passing
- [x] Documentation updated
- [x] No breaking changes (backward compatible)
- [x] Production build successful
- [ ] Code review completed
- [ ] CI/CD pipeline passing
```

**Create PR Command**:

```bash
# Using GitHub CLI (recommended)
gh pr create \
  --title "feat: migrate to modern fetch-based Mailchimp client" \
  --body-file .github/pr-template.md \
  --base main \
  --head feature/mailchimp-fetch-client-migration

# Or manually create PR on GitHub web interface
```

**Checklist**:

- [ ] PR created with comprehensive description
- [ ] PR title follows conventional commits format
- [ ] All commits included in PR
- [ ] Base branch is `main`
- [ ] Labels added (enhancement, mailchimp, refactor)
- [ ] Reviewers assigned (if applicable)

---

#### 5.4 CI/CD Pipeline

After creating the PR, the CI/CD pipeline will automatically run:

**Expected CI Checks**:

1. ✅ **Vercel Preview Deployment** - Automatic preview deployment
2. ✅ **Build** - Production build verification
3. ✅ **Tests** - Full test suite
4. ✅ **Type Check** - TypeScript compilation
5. ✅ **Lint** - ESLint checks

**Monitor CI Progress**:

```bash
# View CI status
gh pr view --web

# Or check GitHub Actions tab
```

**If CI Fails**:

1. Click on failed check details
2. Review error logs
3. Fix issues locally
4. Commit fix: `git commit -m "fix: resolve CI issue with [description]"`
5. Push: `git push`
6. CI will re-run automatically

**Checklist**:

- [ ] CI pipeline started
- [ ] All CI checks passing
- [ ] Vercel preview deployment successful
- [ ] Preview URL accessible
- [ ] Manual testing on preview deployment

---

#### 5.5 Code Review & Merge

**Code Review Process**:

1. Wait for reviewer approval (if applicable)
2. Address any feedback with additional commits
3. Get approval from reviewers
4. Merge PR to main branch

**Merge Command** (after approval):

```bash
# Using GitHub CLI
gh pr merge --squash --delete-branch

# Or use GitHub web interface merge button
```

**Merge Strategy**: Squash and merge (combines all commits into one)

**Checklist**:

- [ ] Code review completed
- [ ] All feedback addressed
- [ ] PR approved
- [ ] Merged to main branch
- [ ] Feature branch deleted

---

#### 5.6 Production Deployment

After merge, Vercel will automatically deploy to production:

**Monitor Deployment**:

```bash
# View recent deployments
vercel list

# View deployment logs
vercel logs [deployment-url]
```

**Checklist**:

- [ ] Production deployment started
- [ ] Deployment successful
- [ ] Production URL accessible
- [ ] No deployment errors

---

#### 5.7 Post-Deployment Monitoring

Monitor these metrics after deployment:

1. **Error Rates**
   - Check error logs for Mailchimp-related errors
   - Monitor error boundary activations

2. **Performance**
   - API response times
   - Rate limit hit frequency

3. **User Experience**
   - Successful OAuth connections
   - API call success rates

**Monitoring Commands**:

```bash
# View production logs
vercel logs --production

# View specific deployment logs
vercel logs [deployment-url]

# Check for errors
vercel logs --production | grep -i error
```

**Checklist**:

- [ ] Monitor Vercel logs for first 30 minutes
- [ ] Check error rates (should be 0 or similar to pre-deployment)
- [ ] Test Mailchimp OAuth connection works
- [ ] Test API calls return data correctly
- [ ] Verify rate limit tracking works
- [ ] No increase in error boundary activations
- [ ] API response times similar or better than before

---

#### Phase 5 Completion Checklist

- [ ] Pre-PR validation passing
- [ ] Feature branch pushed to remote
- [ ] Pull request created with comprehensive description
- [ ] CI/CD pipeline passing
- [ ] Vercel preview deployment successful
- [ ] Code review completed (if applicable)
- [ ] PR merged to main branch
- [ ] Production deployment successful
- [ ] Post-deployment monitoring shows no issues

**🎉 MIGRATION COMPLETE**: The Mailchimp fetch client migration is now complete and deployed to production!

---

## File Structure Summary

### New Files

```
src/
├── lib/
│   ├── errors/
│   │   ├── mailchimp-errors.ts                 [NEW]
│   │   ├── mailchimp-errors.test.ts            [NEW]
│   │   └── index.ts                            [NEW]
│   ├── mailchimp-fetch-client.ts               [NEW]
│   ├── mailchimp-fetch-client.test.ts          [NEW]
│   ├── mailchimp-client-factory.ts             [NEW]
│   ├── mailchimp-client-factory.test.ts        [NEW]
│   ├── mailchimp-action-wrapper.ts             [NEW]
│   └── mailchimp-action-wrapper.test.ts        [NEW]
├── services/
│   └── mailchimp.service.integration.test.ts   [NEW]
└── app/
    └── mailchimp/
        └── error.tsx                            [NEW or UPDATE]

docs/
└── mailchimp-fetch-client-migration-plan.md    [THIS FILE]
```

### Modified Files

```
src/
├── lib/
│   └── mailchimp.ts                            [DELETE]
├── services/
│   └── mailchimp.service.ts                    [REFACTOR]
└── app/
    └── mailchimp/
        └── error.tsx                            [UPDATE]

package.json                                     [UPDATE]
CLAUDE.md                                        [UPDATE]
docs/PRD.md                                      [UPDATE]
docs/project-management/development-roadmap.md   [UPDATE]
```

### Unchanged Files (Backward Compatible)

```
src/
├── actions/
│   ├── mailchimp-reports.ts                    [NO CHANGES]
│   ├── mailchimp-root.ts                       [NO CHANGES]
│   └── *.test.ts                               [NO CHANGES]
├── schemas/mailchimp/                          [NO CHANGES]
├── types/mailchimp/                            [NO CHANGES]
├── db/repositories/
│   └── mailchimp-connection.ts                 [NO CHANGES]
└── services/
    └── mailchimp-oauth.service.ts              [NO CHANGES]
```

---

## Import/Export Patterns

All new files follow project conventions:

### Error Classes Export

```typescript
// src/lib/errors/index.ts
export {
  MailchimpFetchError,
  MailchimpRateLimitError,
  MailchimpAuthError,
  MailchimpNetworkError,
} from "@/lib/errors/mailchimp-errors";
```

### Usage in Files

```typescript
// Always use path aliases
import { MailchimpFetchError } from "@/lib/errors";
import { getUserMailchimpClient } from "@/lib/mailchimp-client-factory";
import { mailchimpApiCall } from "@/lib/mailchimp-action-wrapper";
import { mailchimpDAL } from "@/dal/mailchimp.dal";

// Never use relative imports
// ❌ import { MailchimpFetchError } from "../errors/mailchimp-errors";
// ✅ import { MailchimpFetchError } from "@/lib/errors";
```

---

## Schema & Type Organization

All schemas and types remain in their existing locations:

```
src/
├── schemas/
│   └── mailchimp/
│       ├── common/
│       │   └── error.schema.ts           [USED BY: error handling]
│       ├── reports-*.schema.ts
│       ├── root-*.schema.ts
│       └── index.ts
└── types/
    └── mailchimp/
        ├── common.ts                      [USED BY: ErrorResponse type]
        ├── reports.ts
        ├── root.ts
        └── index.ts
```

---

## Error Handling Strategy

### Server Actions (Expected Errors)

Follow Next.js best practices - return error values:

```typescript
// ✅ CORRECT: Return error as value
export async function getCampaignReports(): Promise<
  ReportListSuccess | ReportListError
> {
  const response = await mailchimpDAL.getCampaignReports({});

  if (!response.success) {
    return {
      type: "about:blank",
      title: "API Error",
      detail: response.error || "Failed to fetch reports",
      status: response.statusCode || 500,
      instance: "/reports",
    };
  }

  return response.data;
}

// ❌ INCORRECT: Don't use try/catch for expected errors
export async function getCampaignReports() {
  try {
    const response = await mailchimpDAL.getCampaignReports({});
    return response;
  } catch (error) {
    // Don't do this for expected errors
  }
}
```

### Client Components (Uncaught Exceptions)

Use error boundaries for rendering errors:

```typescript
// src/app/mailchimp/reports/error.tsx
"use client";

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Reports error:", error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## Testing Strategy

### Unit Tests (Fast, Isolated)

- Test individual functions and classes
- Mock all dependencies
- Use Vitest with jsdom

```typescript
// Example: mailchimp-fetch-client.test.ts
describe("MailchimpFetchClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("should make GET request with auth header", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: "test" }),
      headers: new Headers(),
    });

    const client = new MailchimpFetchClient({
      accessToken: "test-token",
      serverPrefix: "us1",
    });

    await client.get("/test");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://us1.api.mailchimp.com/3.0/test",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      }),
    );
  });
});
```

### Integration Tests (Realistic Scenarios)

- Test service layer with mocked API
- Use MSW (Mock Service Worker)
- Test error scenarios

```typescript
// Example: mailchimp.service.integration.test.ts
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.get("https://us1.api.mailchimp.com/3.0/reports", (req, res, ctx) => {
    return res(ctx.json({ reports: [] }));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("MailchimpDAL Integration", () => {
  it("should fetch campaign reports", async () => {
    const result = await mailchimpDAL.getCampaignReports({});
    expect(result.success).toBe(true);
  });
});
```

---

## Performance Considerations

### Edge Runtime Compatibility

The new fetch client is Edge Runtime compatible:

```typescript
// Can be used in Edge Functions
export const runtime = "edge";

export async function GET() {
  const client = await getUserMailchimpClient();
  const data = await client.get("/reports");
  return Response.json(data);
}
```

### Bundle Size Reduction

Estimated bundle size savings:

- **Before**: ~150KB (@mailchimp/mailchimp_marketing)
- **After**: ~5KB (native fetch + error classes)
- **Savings**: ~145KB (~97% reduction)

### Rate Limit Management

The new client tracks rate limits:

```typescript
const client = await getUserMailchimpClient();
const data = await client.get("/reports");

const rateLimitInfo = client.getRateLimitInfo();
if (rateLimitInfo && rateLimitInfo.remaining < 10) {
  console.warn("Approaching rate limit", rateLimitInfo);
}
```

---

## Migration Risks & Mitigations

### Risk 1: Breaking Changes in API Responses

**Mitigation**:

- All responses validated with existing Zod schemas
- Integration tests cover all endpoints
- Gradual rollout with feature flags (optional)

### Risk 2: Timeout Issues

**Mitigation**:

- Configurable timeout (default 30s)
- AbortController for proper cleanup
- Error handling for timeout scenarios

### Risk 3: Rate Limit Handling

**Mitigation**:

- Rate limit info extracted from headers
- Proper error handling for 429 responses
- Retry-After header respected

### Risk 4: OAuth Token Issues

**Mitigation**:

- Existing token management unchanged
- Connection validation before API calls
- Clear error messages for auth issues

---

## Success Criteria

### Functional Requirements

- [ ] All existing tests pass without modification
- [ ] All Mailchimp API endpoints work correctly
- [ ] OAuth flow remains functional
- [ ] Error handling works as expected
- [ ] Rate limit tracking works correctly

### Non-Functional Requirements

- [ ] Bundle size reduced by >90%
- [ ] API response times unchanged or improved
- [ ] Code coverage >90% for new code
- [ ] Zero production errors in first 24 hours
- [ ] Edge Runtime compatible

### Documentation Requirements

- [ ] CLAUDE.md updated
- [ ] PRD.md updated
- [ ] Migration guide created (if needed)
- [ ] JSDoc comments on all public APIs

---

## Timeline Estimate

### Phase 0: Setup & Feature Branch (5-10 minutes)

- Create feature branch: 5 minutes
- Verify setup: 2-3 minutes

### Phase 1: Foundation (4-6 hours)

- Error classes: 1 hour
- Fetch client: 2-3 hours
- Client factory: 1 hour
- Unit tests: 1-2 hours
- Validation & commit: 15-20 minutes

**Break**: Clear conversation (saves ~80% token costs)

### Phase 2: Data Access Layer (DAL) (2-3 hours)

- Wrapper function: 1 hour
- Service refactoring: 30 minutes
- Testing: 1-1.5 hours
- Validation & commit: 15-20 minutes

**Break**: Clear conversation

### Phase 3: Testing & Validation (2-3 hours)

- Integration tests: 1-2 hours
- Test validation: 1 hour
- Validation & commit: 15-20 minutes

**Break**: Clear conversation

### Phase 4: Cleanup & Documentation (1-2 hours)

- Dependency removal: 15 minutes
- Documentation: 45 minutes
- Error boundaries: 30-45 minutes
- Validation & commit: 15-20 minutes

**Break**: Clear conversation

### Phase 5: PR & Deployment (1-2 hours)

- Pre-PR validation: 15 minutes
- Push branch: 5 minutes
- Create PR: 15 minutes
- CI/CD monitoring: 15-30 minutes
- Code review: 30-60 minutes (async)
- Merge & deploy: 10 minutes
- Post-deployment monitoring: 30 minutes

**Total Active Development Time**: 10-16 hours (1.5-2 days)

**Total Elapsed Time**: 1.5-3 days (including code review wait time)

**Token Cost Optimization**: Clearing conversations between phases reduces total token usage by ~60-80% compared to single continuous session.

---

## Rollback Plan

If issues occur post-deployment:

1. **Immediate Rollback**:

   ```bash
   git revert <commit-hash>
   git push origin main
   ```

2. **Restore Old SDK**:

   ```bash
   pnpm add @mailchimp/mailchimp_marketing@^3.0.80
   git restore src/lib/mailchimp.ts src/dal/mailchimp.dal.ts
   ```

3. **Redeploy**:
   ```bash
   pnpm build
   vercel --prod
   ```

**Rollback Time**: <5 minutes

---

## Conversation Flow Summary

This plan is designed for **5 separate Claude Code conversations** (one per phase) to optimize token usage and costs:

### Starting a New Phase

When starting each phase, use this prompt template:

```
Continue with Phase [N] of docs/mailchimp-fetch-client-migration-plan.md

Please:
1. Review the Phase [N] section of the plan
2. Implement all items in the phase checklist
3. Run validation commands
4. Create the Git commit
5. Confirm phase completion

Do not proceed to the next phase - I will start a new conversation.
```

### Phase-by-Phase Flow

1. **Current Conversation**: Phase 0 (Setup)
   - Create feature branch
   - Clear conversation ✋

2. **New Conversation**: Phase 1 (Foundation)
   - Build core infrastructure
   - Commit: `feat: add Mailchimp fetch client foundation`
   - Clear conversation ✋

3. **New Conversation**: Phase 2 (Data Access Layer (DAL))
   - Integrate with service layer
   - Commit: `feat: integrate fetch client with service layer`
   - Clear conversation ✋

4. **New Conversation**: Phase 3 (Testing)
   - Add comprehensive tests
   - Commit: `test: add comprehensive test coverage for fetch client`
   - Clear conversation ✋

5. **New Conversation**: Phase 4 (Cleanup)
   - Remove old SDK and update docs
   - Commit: `chore: remove old Mailchimp SDK and update docs`
   - Clear conversation ✋

6. **New Conversation**: Phase 5 (Deployment)
   - Create PR and deploy
   - Monitor production
   - Done! 🎉

### Benefits of This Approach

- 💰 **60-80% token cost savings** vs single conversation
- 🧹 **Clean context** for each phase
- 📝 **Clear Git history** with 4 separate commits
- 🔄 **Easy to pause/resume** between phases
- 🐛 **Isolated debugging** per phase

---

## Conclusion

This migration plan provides a comprehensive roadmap for modernizing the Mailchimp integration by replacing the 3-year-old SDK with a native fetch-based client. The implementation follows Next.js App Router best practices, maintains backward compatibility, and delivers significant performance and maintainability improvements.

The plan is structured in **6 phases** (0-5) with conversation breaks between each phase to optimize token usage and maintain clear context. Each phase ends with a Git commit to maintain clear history and enable easy rollback.

**Next Steps**:

1. ✅ Review and approve this plan (DONE - you're reading it!)
2. 🚀 Start Phase 0: Create feature branch
3. 🔄 Clear conversation after Phase 0
4. 📝 Start new conversation for Phase 1: "Continue with Phase 1 of docs/mailchimp-fetch-client-migration-plan.md"
5. 🔁 Repeat for Phases 2-5
