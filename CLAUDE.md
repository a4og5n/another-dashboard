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

- **Status**: MVP Complete with ongoing enhancements
- **Current Phase**: Post-MVP feature development and workflow optimization
- **Key Achievement**: 70x acceleration - 10-week roadmap completed in 1 day

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

- **Path aliases configured**: `@/*`, `@/components/*`, `@/actions/*`, `@/types/*`, `@/schemas/*`, `@/utils/*`, `@/lib/*`, `@/dal/*`
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
- `src/lib/` - Configuration and library utilities (config.ts with environment validation, utils.ts, web-vitals)
- `src/services/` - API service classes with singleton pattern and health check capabilities
- `src/hooks/` - Custom React hooks for pagination and real-time data
- `src/test/` - Testing setup, utilities, helpers, and architectural enforcement tests
- `src/translations/` - Internationalization files (en.json, es.json) for next-intl
- `src/dal/` - Data Access Layer structure for future database integration

### Configuration Files

- **tsconfig.json**: Strict TypeScript with comprehensive path aliases
- **vitest.config.ts**: Test configuration with jsdom environment and coverage setup
- **next.config.ts**: Minimal Next.js configuration
- **scripts/check-no-secrets-logged.js**: Security script to prevent secret logging

### Core Features & Integrations

- **Mailchimp Integration**: Full API integration with campaigns, audiences, and dashboard data
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
- **Data Access Layer**: Follow DAL pattern for future database integration

### Schema & API Patterns

- **Error response strategy**: Compare fields to shared error schema, extend with `.extend({ ... })` if needed, or create custom schema if fundamentally different
- **API naming consistency**: Always use the same object/property names as the API when defining Zod schemas and TypeScript types
- **Enum pattern**: Define as constant array (e.g., `export const VISIBILITY = ["pub", "prv"] as const;`) and use in `z.enum(VISIBILITY)`

### Component Development

- **Server Components**: Use by default, only mark with 'use client' when needed
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

- Never log environment variables, API keys, or secrets (enforced by automated scanning)
- Use the centralized environment validation in `src/lib/config.ts`
- All API endpoints must use Zod schemas for input validation
- Follow accessibility guidelines with automated testing
