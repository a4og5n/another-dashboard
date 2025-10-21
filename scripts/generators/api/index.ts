/**
 * Programmatic Page Generator API
 *
 * This module provides a clean, type-safe API for generating pages without
 * interactive prompts. Ideal for AI-assisted workflows and automation.
 *
 * ## Usage
 *
 * ### High-Level API (Recommended for AI)
 *
 * The simplest way to generate a page with smart defaults:
 *
 * ```typescript
 * import { generatePage } from '@/scripts/generators/api';
 *
 * const result = await generatePage({
 *   apiParamsPath: "src/schemas/mailchimp/clicks-params.schema.ts",
 *   apiResponsePath: "src/schemas/mailchimp/clicks-success.schema.ts",
 *   routePath: "/mailchimp/reports/[id]/clicks",
 *   pageTitle: "Click Details",
 *   pageDescription: "Members who clicked links in this campaign",
 *   apiEndpoint: "/reports/{campaign_id}/click-details"
 * });
 *
 * console.log(`Generated ${result.files.length} files`);
 * ```
 *
 * ### Low-Level API (Full Control)
 *
 * For complete control over the configuration:
 *
 * ```typescript
 * import { generatePageFromConfig } from '@/scripts/generators/api';
 * import type { PageConfig } from '@/generation/page-configs';
 *
 * const config: PageConfig = {
 *   // ... complete configuration
 * };
 *
 * const result = await generatePageFromConfig(config, "report-clicks");
 * ```
 *
 * ### Validation Only
 *
 * Validate a configuration without generating files:
 *
 * ```typescript
 * import { validateConfig } from '@/scripts/generators/api';
 *
 * const errors = validateConfig(config);
 * if (errors.length > 0) {
 *   console.error('Invalid configuration:', errors);
 * }
 * ```
 *
 * ## AI-First Workflow
 *
 * ### Phase 1: Schema Creation & Review
 *
 * 1. AI analyzes Mailchimp API documentation
 * 2. AI creates Zod schemas (params + response + error)
 * 3. AI shows schemas to user
 * 4. **STOP** - Wait for user approval
 * 5. User reviews and either approves or requests changes
 *
 * ### Phase 2: Page Generation (After Approval)
 *
 * 6. AI calls `generatePage()` with approved schema paths
 * 7. Generator creates all infrastructure files
 * 8. AI implements component logic
 * 9. AI runs tests and type-check
 *
 * @see docs/api-coverage.md - Track which endpoints need pages
 * @see scripts/generators/README.md - Full generator documentation
 */

// High-level API (recommended)
export { generatePage } from "./generate-page";

// Low-level API (full control)
export { generatePageFromConfig } from "./generate-from-config";

// Validation utilities
export { validateConfig, checkFilesWillBeGenerated } from "./validators";

// Type exports
export type {
  GeneratePageParams,
  GenerationResult,
  ValidationError,
  FileConflict,
} from "./types";
