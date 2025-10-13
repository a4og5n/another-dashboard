# Constants Directory

This directory contains all application-wide constants following a clear organizational pattern.

## Purpose

Centralized location for all constant values used throughout the application, separate from:

- **`/src/types`** - TypeScript type definitions and interfaces
- **`/src/schemas`** - Zod validation schemas (may include enums used in validation)
- **`/src/lib`** - Utility functions and business logic

## Structure

```
/src/constants/
├── index.ts                 # Re-export all constants
├── auth/                    # Authentication-related constants
│   ├── index.ts
│   └── error-codes.ts      # Error codes for OAuth/auth flows
├── mailchimp/              # Mailchimp-specific constants (future)
│   ├── index.ts
│   ├── api.ts              # API configuration constants
│   └── limits.ts           # Rate limits, pagination defaults
└── app/                    # Application-wide constants (future)
    ├── index.ts
    └── config.ts           # App configuration values
```

## What Goes Here?

### ✅ Constants Belong Here:

- **Error codes and messages**: `MAILCHIMP_ERROR_CODES`
- **Configuration values**: API endpoints, timeout values
- **Feature flags**: Boolean toggles for features
- **Business logic constants**: Rate limits, thresholds, defaults
- **Enum-like objects**: Status codes, event types (not used in Zod schemas)

### ❌ NOT Constants (belong elsewhere):

- **Zod validation enums**: Arrays used with `z.enum()` → `/src/schemas`
  - Example: `export const USER_ROLES = ["admin", "user"] as const;` with `z.enum(USER_ROLES)`
- **TypeScript types/interfaces**: → `/src/types`
- **Utility functions**: → `/src/utils` or `/src/lib`
- **React components**: → `/src/components`

## Usage Example

```typescript
// Import from constants
import { MAILCHIMP_ERROR_CODES } from "@/constants/auth";

// Or use centralized export
import { MAILCHIMP_ERROR_CODES } from "@/constants";

// Use in code
if (error) {
  return { error: MAILCHIMP_ERROR_CODES.TOKEN_INVALID };
}
```

## Adding New Constants

1. **Determine the category**: auth, mailchimp, app, etc.
2. **Create or update the file**: `src/constants/{category}/{filename}.ts`
3. **Export from category index**: Add to `src/constants/{category}/index.ts`
4. **Export from main index**: Add to `src/constants/index.ts`
5. **Document the constant**: Add JSDoc comments explaining usage

## Pattern Example

```typescript
// src/constants/auth/error-codes.ts

/**
 * Authentication error codes
 * Used across auth flows for consistent error handling
 */
export const AUTH_ERROR_CODES = {
  INVALID_TOKEN: "invalid_token",
  EXPIRED_SESSION: "expired_session",
  UNAUTHORIZED: "unauthorized",
} as const;

/**
 * Type helper for auth error codes
 */
export type AuthErrorCode =
  (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];
```

## Benefits

- **Discoverability**: Easy to find all constants in one place
- **Maintainability**: Update constants without touching business logic
- **Type safety**: TypeScript ensures correct usage
- **Consistency**: One pattern for the entire codebase
- **Centralized exports**: Import from `@/constants` anywhere

## See Also

- [CLAUDE.md](../../CLAUDE.md) - Project architecture guidelines
- `/src/types` - TypeScript type definitions
- `/src/schemas` - Zod validation schemas
