# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `pnpm dev` - Start development server with HTTPS, Turbopack, and experimental features
- `pnpm build` - Build production version with Turbopack
- `pnpm start` - Start production server
- `pnpm clean` - Remove build artifacts (.next, out, dist)

### Quality Assurance

- `pnpm lint` - Run ESLint on src and scripts directories
- `pnpm lint:fix` - Fix auto-fixable ESLint issues
- `pnpm type-check` - Run TypeScript compiler without emitting files
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting without fixing

### Testing

- `pnpm test` - Run all tests with Vitest
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:ui` - Run tests with Vitest UI interface
- `pnpm test:coverage` - Generate test coverage report
- `pnpm test:a11y` - Run accessibility-specific tests only

### Validation Workflows

- `pnpm quick-check` - Fast validation (type-check + lint)
- `pnpm pre-commit` - Full validation: format, secrets check, lint, type-check, test, a11y
- `pnpm validate` - Complete validation including production build
- `pnpm check:no-secrets-logged` - Scan for suspicious logging patterns that could leak secrets

### Documentation

- `pnpm docs` - Generate TypeDoc documentation
- `pnpm docs:watch` - Generate documentation in watch mode

## Architecture

### Project Status & Context

- **Status**: MVP Complete with OAuth 2.0 migration
- **Current Phase**: Post-MVP feature development and multi-user OAuth implementation
- **Key Achievement**: 70x acceleration - 10-week roadmap completed in 1 day
- **Architecture**: Neon Postgres database with OAuth 2.0 user authentication
- **Data Strategy**: User-scoped API access with encrypted token storage

### Environment Requirements

- **Node.js**: v24.7.0 (Latest LTS)
- **pnpm**: v10.15.0 (managed via Homebrew)
  - **Installation**: `brew install pnpm`
  - **Updates**: `brew upgrade pnpm` (prevents auto-update conflicts)
  - **Location**: `/usr/local/bin/pnpm`
  - **Note**: Using Homebrew prevents "Auto-update failed" messages

### Core Framework & Libraries

- **Next.js 15** with App Router architecture
- **TypeScript** with strict configuration and comprehensive path aliases
- **Tailwind CSS v4** for styling with shadcn/ui components
- **Vitest** for testing with jsdom environment and React Testing Library
- **Zod** for runtime schema validation and type inference
- **ES Modules**: All scripts use ES module syntax (`import`/`export`), `require()` is forbidden

### Project Structure & Import Strategy

- **Path aliases configured**: `@/*`, `@/components/*`, `@/actions/*`, `@/types/*`, `@/schemas/*`, `@/utils/*`, `@/lib/*`
- **Centralized exports**: All folders use index.ts files with path aliases (no relative imports)
- **Type enforcement**: Shared types must be defined in `/src/types` (no inline definitions)
- **Schema enforcement**: Zod schemas must be defined in `/src/schemas` (no inline definitions)

### Key Directories

- `src/app/` - Next.js App Router pages, layouts, and API routes
- `src/components/` - Reusable UI components organized by feature (ui/, dashboard/, layout/, accessibility/, performance/, pwa/, social/)
- `src/actions/` - Server actions and business logic with comprehensive test coverage
- `src/types/` - TypeScript type definitions with strict subfolder organization (mailchimp/, components/)
- `src/schemas/` - Zod validation schemas for API and form validation with nested organization (mailchimp/)
- `src/utils/` - Pure utility functions with comprehensive test coverage
- `src/lib/` - Configuration and library utilities (config.ts with environment validation, encryption.ts, mailchimp-fetch-client.ts, mailchimp-client-factory.ts, mailchimp-action-wrapper.ts, utils.ts, web-vitals, errors/)
- `src/services/` - API service classes with singleton pattern and OAuth flow management
- `src/hooks/` - Custom React hooks for pagination and real-time data
- `src/db/` - Database schema, migrations, and repositories (Drizzle ORM with Neon Postgres)
- `src/test/` - Testing setup, utilities, helpers, and architectural enforcement tests
- `src/translations/` - Internationalization files (en.json, es.json) for next-intl

### Configuration Files

- **tsconfig.json**: Strict TypeScript with comprehensive path aliases
- **vitest.config.ts**: Test configuration with jsdom environment and coverage setup
- **next.config.ts**: Minimal Next.js configuration
- **drizzle.config.ts**: Database configuration for Drizzle ORM migrations
- **scripts/check-no-secrets-logged.js**: Security script to prevent secret logging

### Core Features & Integrations

- **Mailchimp Integration**: OAuth 2.0 authentication with modern fetch-based API client
  - Native fetch API client (Edge Runtime compatible, 97% smaller than old SDK)
  - Each user connects their own Mailchimp account via OAuth flow
  - Tokens encrypted at rest using AES-256-GCM encryption
  - Database-backed token storage with Neon Postgres
  - CSRF protection with state parameters
  - Built-in rate limit tracking and timeout handling
  - Comprehensive error handling with typed error classes
  - Full API integration with campaigns, audiences, and dashboard data
  - Connection management at `/settings/integrations`
- **Database**: Neon Postgres with Drizzle ORM
  - Serverless PostgreSQL via Vercel integration
  - Type-safe queries with Drizzle ORM
  - Encrypted OAuth token storage
  - Connection pooling and optimization
- **Authentication**: Kinde for user authentication + Mailchimp OAuth for API access
- **Accessibility (A11y)**: axe-core integration with development-time checking and test utilities
- **Performance Monitoring**: Web Vitals tracking with multiple analytics provider support
- **Progressive Web App**: PWA components and utilities for installation prompts
- **Internationalization**: next-intl setup with English and Spanish translations
- **Error Handling**: React Error Boundaries and centralized error management

### Quality Standards

- **Pre-commit hooks**: Automatic formatting, linting, type-checking, testing, and security scanning
- **Accessibility testing**: Automated WCAG 2.1 AA compliance testing in development and CI
- **Type safety**: Strict TypeScript configuration with no implicit any
- **Security**: Automated secret detection and environment variable validation
- **Performance**: Core Web Vitals monitoring and bundle size optimization

### Environment & Configuration

- **Environment validation**: Zod-based environment variable validation in `src/lib/config.ts`
- **Mock data support**: Configurable mock data for development and CI environments
- **Security scanning**: Automated detection of logged secrets or API keys
- **HTTPS development**: Local development server with HTTPS certificates

### Testing Strategy

- **Unit tests**: Vitest with React Testing Library
- **Accessibility tests**: axe-core integration for automated a11y testing
- **Architectural enforcement tests**: Automated tests to enforce coding standards
  - `alias-enforcement.test.ts` - Enforces path alias usage (no long relative paths)
  - `types-folder-enforcement.test.ts` - Enforces type definitions in `/src/types` only
  - `server-component-enforcement.test.ts` - Enforces Server Component architecture for proper 404 handling
    - Prevents "use client" in layout.tsx, dashboard-shell.tsx, and all not-found.tsx files
    - Critical for maintaining proper 404 status codes (notFound() only works in Server Components)
    - Auto-discovers all not-found.tsx files to prevent regression
  - `deprecated-declarations.test.ts` - Prevents usage of deprecated APIs and patterns
- **Coverage reporting**: HTML, JSON, and text coverage reports
- **Test utilities**: Custom render functions and helpers in `src/test/`

## Development Guidelines

### Required Documentation Reading

Before starting any development work, always review:

1. **`docs/PRD.md`** - Product Requirements Document with problem statement, solution overview, and success criteria
2. **`docs/project-management/development-roadmap.md`** - Development progress and current status
3. **`docs/project-management/task-tracking.md`** - Current priorities and performance metrics

### Code Organization

- **Path aliases**: Use consistently - avoid relative imports in index.ts files (enforced by automated tests)
- **Type definitions**: Define shared types in `/src/types` with subfolder organization, never inline (enforced by automated tests)
- **Schema definitions**: Create Zod schemas in `/src/schemas` for all validation, never inline (enforced by automated tests)
- **Service pattern**: Use singleton pattern for API services with health check capabilities (`src/services/`)
- **Component organization**: Group by feature with proper index.ts exports (ui/, dashboard/, layout/, accessibility/, performance/, pwa/, social/)
- **Internationalization**: Use next-intl with JSON files in `src/translations/`

### Error Handling Utilities

The project includes standardized error handling utilities for API responses in `src/utils/errors/`:

**Core Functions:**

- `is404Error(message: string)` - Detects 404/not found errors in API responses
- `handleApiError(response: ApiResponse<unknown>)` - Automatically handles 404 detection with `notFound()` call
- `handleApiErrorWithFallback(response: ApiResponse<unknown>, fallbackMessage: string)` - Same as above with custom fallback

**Usage Pattern:**

```typescript
import { handleApiError } from "@/utils/errors";

const response = await mailchimpDAL.fetchCampaignReport(id);
const error = handleApiError(response);

if (error) {
  // Handle non-404 errors in UI if needed
  return <ErrorDisplay message={error} />;
}

// Render success UI with response.data
```

**Benefits:**

- Eliminates repeated 404 detection logic across pages (~7 lines per page)
- Consistent error handling following Next.js App Router best practices
- Automatic `notFound()` triggering for 404 errors (renders not-found.tsx)
- Returns error messages as values (not thrown) for conditional UI rendering
- Fully tested with 100% coverage

**Next.js Error Handling Philosophy:**

- **Expected errors** (404s, API failures): Return as values, use `notFound()` for 404s
- **Unexpected errors** (bugs, exceptions): Let error boundaries catch them
- Reference: [Next.js Error Handling Docs](https://nextjs.org/docs/app/getting-started/error-handling)

### Breadcrumb Pattern

The project includes a centralized breadcrumb builder utility for consistent navigation across all pages in `src/utils/breadcrumbs/`:

**Core Object:**

- `bc` - Breadcrumb builder with static routes, dynamic functions, and helpers

**Usage Pattern:**

```tsx
import { bc } from "@/utils/breadcrumbs";

// Simple static breadcrumbs
<BreadcrumbNavigation items={[bc.home, bc.mailchimp, bc.current("Reports")]} />

// Breadcrumbs with dynamic IDs
<BreadcrumbNavigation
  items={[bc.home, bc.mailchimp, bc.reports, bc.report(id), bc.current("Opens")]}
/>
```

**Available Routes:**

**Static Routes:**

- `bc.home` - Dashboard home page (`/`)
- `bc.mailchimp` - Mailchimp section (`/mailchimp`)
- `bc.reports` - Reports list (`/mailchimp/reports`)
- `bc.lists` - Lists list (`/mailchimp/lists`)
- `bc.generalInfo` - General info page (`/mailchimp/general-info`)
- `bc.settings` - Settings section (`/settings`)
- `bc.integrations` - Integrations settings (`/settings/integrations`)

**Dynamic Functions:**

- `bc.report(id)` - Individual report page (`/mailchimp/reports/{id}`)
- `bc.list(id)` - Individual list page (`/mailchimp/lists/{id}`)
- `bc.reportOpens(id)` - Report opens page (`/mailchimp/reports/{id}/opens`)
- `bc.reportAbuseReports(id)` - Abuse reports page (`/mailchimp/reports/{id}/abuse-reports`)

**Helper Functions:**

- `bc.current(label)` - Mark breadcrumb as current page (no href, `isCurrent: true`)
- `bc.custom(label, href)` - Create custom breadcrumb for non-standard routes

**Benefits:**

- Eliminates 5-8 lines of boilerplate per page
- Centralized route definitions prevent typos in labels and URLs
- Type-safe using existing `BreadcrumbItem` type
- Consistent breadcrumb experience across all pages
- Easy to maintain - update labels/URLs in one place

**When to Add New Routes:**

If you find yourself using `bc.custom()` multiple times for the same route, add it as a static route or dynamic function in the breadcrumb builder instead.

### Schema & API Patterns

- **Error response strategy**: Compare fields to shared error schema, extend with `.extend({ ... })` if needed, or create custom schema if fundamentally different
- **API naming consistency**: Always use the same object/property names as the API when defining Zod schemas and TypeScript types
- **Enum pattern**: Define as constant array (e.g., `export const VISIBILITY = ["pub", "prv"] as const;`) and use in `z.enum(VISIBILITY)`
- **DateTime validation**:
  - Use `z.iso.datetime({ offset: true })` for ISO 8601 datetime strings with timezone support (recommended for API dates)
  - Use `z.iso.datetime()` for strict UTC-only datetime strings (`YYYY-MM-DDTHH:MM:SSZ`)
  - Use `z.string()` only for basic string validation without datetime format enforcement
  - **Deprecated**: Never use `z.string().datetime()` (enforced by architectural tests)

### Component Development

- **Server Components**: Use by default, only mark with 'use client' when needed
  - **CRITICAL**: Layout components (`layout.tsx`, `dashboard-shell.tsx`) MUST remain Server Components
  - **CRITICAL**: All `not-found.tsx` files MUST be Server Components for proper 404 status codes
  - **Rule**: Only add "use client" when component uses hooks (useState, useEffect, etc.) or browser APIs
  - **Pattern**: Keep parent as Server Component, extract client logic to child components
  - **Enforcement**: Architectural tests prevent "use client" in critical files (enforced by CI)
  - **Why**: Next.js `notFound()` only works in Server Components; violating this returns 200 instead of 404
- **Atomic design**: Follow atoms, molecules, organisms pattern
- **shadcn/ui**: Use as base building blocks
- **JSDoc**: Document component usage with comments

### Quality Assurance Workflow

1. **Automatic pre-commit validation** (enforced by Husky hooks):
   - **lint-staged**: Automatically formats and lints only staged files
   - **Full validation**: Secret checking, type-checking, testing, and accessibility testing
   - All checks must pass before commits are allowed
   - Formatted changes are automatically included in the commit
2. **Manual validation options**:
   - `pnpm pre-commit` - Full validation suite (same as automatic pre-commit)
   - `pnpm quick-check` - Fast validation (type-check + lint only)
   - `pnpm format:check` - Check formatting without fixing

### Branch & Commit Strategy

- **Branch naming**: Use `feature/description-of-feature` or `fix/description-of-fix` with lowercase and hyphens
- **Conventional commits**: Follow `type(scope): description` format
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
  - Example: `feat: add user dashboard component`
- **Pull requests**: Always use PRs, never push directly to main
- **Code review**: Reviewers must confirm all index.ts files use path aliases for exports

### Performance Guidelines

- **Core Web Vitals**: Track LCP, FID, CLS using WebVitalsReporter component
- **Performance monitoring**: Use hooks like `useWebVitals`, `usePageLoadPerformance`
- **Bundle optimization**: Monitor bundle size and implement performance budgets
- **Next.js Image**: Use for all images with proper code splitting

### Accessibility Standards

- **WCAG 2.1 AA compliance**: Minimum standard with automated testing
- **Semantic HTML**: Use proper elements (header, nav, main, section)
- **Keyboard navigation**: Ensure all interactive elements work via keyboard
- **Screen readers**: Test with VoiceOver, NVDA, JAWS
- **Color contrast**: Minimum 4.5:1 ratio for normal text
- **Development tools**: Use A11yProvider for real-time checking

### Security & Best Practices

- Never log environment variables, API keys, OAuth tokens, or secrets (enforced by automated scanning)
- Use the centralized environment validation in `src/lib/config.ts`
- All API endpoints must use Zod schemas for input validation
- Follow accessibility guidelines with automated testing
- OAuth tokens are encrypted at rest using AES-256-GCM
- HTTPS-only in production for OAuth redirects
- CSRF protection via state parameters in OAuth flow

### Mailchimp OAuth Setup

**Authentication Method:** OAuth 2.0 (user-scoped tokens)

**Initial Setup:**

1. **Create Neon Database via Vercel:**
   - Go to Vercel Dashboard → Your Project → Storage tab
   - Click "Create Database" → Select "Neon" (Serverless Postgres)
   - Vercel automatically adds environment variables (`DATABASE_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL`)

2. **Pull Environment Variables:**

   ```bash
   vercel env pull .env.local
   ```

3. **Register OAuth App at Mailchimp:**
   - Login to Mailchimp → Account → Extras → API Keys → "Register an App"
   - Fill in app details:
     - App Name: Another Dashboard
     - App Website: Your production Vercel URL
     - Redirect URI (local): `https://127.0.0.1:3000/api/auth/mailchimp/callback`
     - Redirect URI (production): `https://your-domain.vercel.app/api/auth/mailchimp/callback`
   - Copy Client ID and Client Secret

4. **Add OAuth Credentials to Environment:**

   ```bash
   # Add to .env.local
   MAILCHIMP_CLIENT_ID=your-client-id
   MAILCHIMP_CLIENT_SECRET=your-client-secret
   MAILCHIMP_REDIRECT_URI=https://127.0.0.1:3000/api/auth/mailchimp/callback

   # Generate encryption key
   openssl rand -base64 32
   ENCRYPTION_KEY=your-generated-key
   ```

5. **Push Database Schema:**

   ```bash
   pnpm db:push
   ```

6. **Start Development Server:**

   ```bash
   pnpm dev
   ```

7. **Connect Mailchimp Account:**
   - Visit `https://127.0.0.1:3000/mailchimp` or `/settings/integrations`
   - Click "Connect Mailchimp"
   - Authorize access in Mailchimp
   - Redirected back to dashboard with active connection

**Database Structure:**

- **Table:** `mailchimp_connections` links Kinde user IDs to encrypted Mailchimp OAuth tokens
- **Encryption:** Tokens encrypted at rest using AES-256-GCM
- **Repository Pattern:** `src/db/repositories/mailchimp-connection.ts` handles all database operations

**OAuth Flow:**

- `POST /api/auth/mailchimp/authorize` - Initiate OAuth flow
- `GET /api/auth/mailchimp/callback` - OAuth callback handler (processes authorization code)
- `POST /api/auth/mailchimp/disconnect` - Disconnect Mailchimp account
- `GET /api/auth/mailchimp/status` - Check connection status

**User Experience:**

- Users without connected Mailchimp see empty state with "Connect Mailchimp" button
- Settings page at `/settings/integrations` shows connection status and management options
- Success/error banners provide feedback after OAuth flow
- Connection validation happens hourly via Mailchimp ping endpoint
- Invalid tokens automatically deactivate connections

**Security Features:**

- Tokens encrypted at rest in database
- CSRF protection via state parameter
- HTTPS-only redirects in production
- HTTP-only cookies for OAuth state
- Tokens never logged or exposed to client
- Hourly token validation with auto-deactivation

### Kinde Authentication Setup

**Local Development Cookie Configuration:**

For local HTTPS development with self-signed certificates on `127.0.0.1`, you MUST set the cookie domain explicitly in `.env.local`:

```bash
# Cookie configuration for local HTTPS development
# CRITICAL: Must match the domain you're developing on (without port)
KINDE_COOKIE_DOMAIN=127.0.0.1
```

**Why This Is Required:**

The Kinde Next.js SDK needs explicit cookie domain configuration for HTTPS on `127.0.0.1` to ensure OAuth state cookies persist between the authorization request and callback. Without this, you'll encounter "State not found" errors because the browser won't properly scope the cookies.

**Troubleshooting OAuth "State not found" Errors:**

If you encounter "State not found" errors after setting `KINDE_COOKIE_DOMAIN`, follow these steps in order:

1. **Kill all Next.js dev servers** (multiple instances cause state conflicts):

   ```bash
   pkill -f "next dev"
   ```

2. **Clear Next.js cache**:

   ```bash
   pnpm clean
   ```

3. **Verify environment variables are set**:

   ```bash
   grep KINDE_COOKIE_DOMAIN .env.local
   # Should output: KINDE_COOKIE_DOMAIN=127.0.0.1
   ```

4. **Start fresh dev server**:

   ```bash
   pnpm dev
   ```

5. **Clear browser state** using the utility endpoint: `https://127.0.0.1:3000/api/auth/clear-state`

6. **Clear browser cache completely**: Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)
   - Select "Cookies and other site data"
   - Choose "All time"
   - Click "Clear data"

7. **Verify configuration** using the health endpoint: `https://127.0.0.1:3000/api/auth/health`

8. **Test login in incognito/private browsing mode** (eliminates browser cache issues)

**Common Causes:**

- Multiple dev servers running (check with `ps aux | grep "next dev"`)
- Stale Next.js cache in `.next/` directory
- Browser cached cookies from previous sessions
- `KINDE_COOKIE_DOMAIN` not set or server not restarted after setting it

**Production Note:** In production on Vercel, remove `KINDE_COOKIE_DOMAIN` or set it to your custom domain (e.g., `KINDE_COOKIE_DOMAIN=yourdomain.com`). Do not use `127.0.0.1` in production.

### Mailchimp Fetch Client Architecture

The project uses a modern, native fetch-based client for Mailchimp API integration, replacing the legacy `@mailchimp/mailchimp_marketing` SDK.

**Architecture Layers:**

```
Server Actions → Data Access Layer (DAL) → Action Wrapper → Fetch Client → Mailchimp API
```

**Key Components:**

1. **Error Classes** (`src/lib/errors/mailchimp-errors.ts`):
   - `MailchimpFetchError` - Base API error
   - `MailchimpAuthError` - Authentication/authorization errors
   - `MailchimpRateLimitError` - Rate limit exceeded errors
   - `MailchimpNetworkError` - Network/connection errors

2. **Fetch Client** (`src/lib/mailchimp-fetch-client.ts`):
   - Native `fetch` API (Edge Runtime compatible)
   - Automatic OAuth token injection
   - Rate limit tracking from response headers
   - Timeout support with AbortController
   - Comprehensive error handling
   - Supports GET, POST, PATCH, PUT, DELETE methods

3. **Client Factory** (`src/lib/mailchimp-client-factory.ts`):
   - `getUserMailchimpClient()` - Creates user-scoped client instances
   - Retrieves decrypted OAuth tokens from database
   - Validates user authentication and connection status

4. **Action Wrapper** (`src/lib/mailchimp-action-wrapper.ts`):
   - `mailchimpApiCall()` - Wrapper for server actions
   - Returns `ApiResponse<T>` for consistent error handling
   - Follows Next.js App Router best practices (return errors, don't throw)
   - Includes rate limit info in responses

5. **Data Access Layer (DAL)** (`src/dal/mailchimp.dal.ts`):
   - Business logic and API orchestration
   - Methods for campaigns, audiences, reports
   - Singleton pattern for app-wide use

**Benefits:**

- ✅ **97% bundle size reduction** (~150KB → ~5KB)
- ✅ **Edge Runtime compatible** for faster API routes
- ✅ **Type-safe** with Zod schema validation
- ✅ **Rate limit tracking** built-in
- ✅ **Timeout handling** with configurable timeouts
- ✅ **Comprehensive error handling** with typed error classes
- ✅ **Zero breaking changes** - backward compatible API

**Usage Example:**

```typescript
import { mailchimpDAL } from "@/dal/mailchimp.dal";

// Service layer handles all the complexity
const result = await mailchimpDAL.fetchCampaignReports({
  count: 10,
  offset: 0,
});

if (!result.success) {
  // Handle error
  console.error(result.error);
  return;
}

// Use data
const reports = result.data.reports;
```

### Architectural Enforcement

The codebase includes automated tests to enforce architectural patterns and prevent common issues:

#### Deprecated Declarations Detection (enforced by `deprecated-declarations.test.ts`):

- **No deprecated Zod methods**: Prevents usage of `z.string().datetime()` (use `z.iso.datetime({ offset: true })` for ISO 8601 datetime validation, or `z.string()` for basic string validation)
- **No deprecated React patterns**: Warns about `React.FC` usage (prefer regular function components)
- **No deprecated lifecycle methods**: Prevents usage of deprecated React lifecycle methods
- **No deprecated Node.js APIs**: Prevents usage of deprecated Node.js APIs

#### How to Run Architectural Tests:

```bash
# Run deprecated declarations detection
pnpm test src/test/architectural-enforcement/deprecated-declarations.test.ts

# Run all architectural enforcement tests
pnpm test src/test/architectural-enforcement/
```

These tests run automatically as part of the full test suite (`pnpm test`) and will fail CI if violations are found.
