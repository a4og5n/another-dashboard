/**
 * Page Pattern Enforcement Tests
 *
 * Ensures consistent patterns across page components:
 * 1. Dynamic route pages use metadata helpers (not inline generation)
 * 2. Dynamic route pages use breadcrumbsSlot pattern (not static breadcrumbs)
 *
 * Background:
 * - Metadata helpers eliminate 20+ lines of boilerplate per page
 * - Dynamic breadcrumbs show actual IDs/names in navigation
 * - Consistent patterns improve maintainability and developer experience
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

/**
 * Dynamic route pages that should use metadata helpers
 * Format: [filePath, expectedHelper]
 */
const DYNAMIC_PAGES_WITH_METADATA: Array<[string, string]> = [
  ["src/app/mailchimp/reports/[id]/page.tsx", "generateCampaignReportMetadata"],
  [
    "src/app/mailchimp/reports/[id]/opens/page.tsx",
    "generateCampaignOpensMetadata",
  ],
  [
    "src/app/mailchimp/reports/[id]/abuse-reports/page.tsx",
    "generateCampaignAbuseReportsMetadata",
  ],
];

/**
 * Dynamic route pages that should use breadcrumbsSlot pattern
 */
const DYNAMIC_PAGES_WITH_BREADCRUMBS = [
  "src/app/mailchimp/reports/[id]/page.tsx",
  "src/app/mailchimp/reports/[id]/opens/page.tsx",
  "src/app/mailchimp/reports/[id]/abuse-reports/page.tsx",
  "src/app/mailchimp/lists/[id]/page.tsx",
];

/**
 * Check if a file uses inline metadata generation
 */
function hasInlineMetadataGeneration(filePath: string): boolean {
  try {
    const content = readFileSync(filePath, "utf-8");

    // Look for inline generateMetadata implementation
    // Pattern: export const generateMetadata: GenerateMetadata = async
    // or: export async function generateMetadata(
    const inlinePatterns = [
      /export\s+const\s+generateMetadata:\s*GenerateMetadata\s*=\s*async/,
      /export\s+async\s+function\s+generateMetadata\s*\(/,
    ];

    return inlinePatterns.some((pattern) => pattern.test(content));
  } catch {
    return false;
  }
}

/**
 * Check if a file uses metadata helper
 */
function usesMetadataHelper(filePath: string, helperName: string): boolean {
  try {
    const content = readFileSync(filePath, "utf-8");

    // Check if helper is imported
    const importPattern = new RegExp(
      `import\\s*{[^}]*${helperName}[^}]*}\\s*from\\s*["']@/utils`,
    );
    const hasImport = importPattern.test(content);

    // Check if helper is used
    const usagePattern = new RegExp(
      `export\\s+const\\s+generateMetadata\\s*=\\s*${helperName}`,
    );
    const hasUsage = usagePattern.test(content);

    return hasImport && hasUsage;
  } catch {
    return false;
  }
}

/**
 * Check if a file uses static breadcrumbs prop
 */
function usesStaticBreadcrumbs(filePath: string): boolean {
  try {
    const content = readFileSync(filePath, "utf-8");

    // Look for breadcrumbs={...} in PageLayout
    // This is the old pattern that should be replaced with breadcrumbsSlot
    const staticBreadcrumbPattern = /breadcrumbs=\{/;

    return staticBreadcrumbPattern.test(content);
  } catch {
    return false;
  }
}

/**
 * Check if a file uses dynamic breadcrumbsSlot pattern
 */
function usesDynamicBreadcrumbsSlot(filePath: string): boolean {
  try {
    const content = readFileSync(filePath, "utf-8");

    // Look for breadcrumbsSlot with Suspense wrapper
    const dynamicBreadcrumbPattern = /breadcrumbsSlot=\{/;
    const suspensePattern = /<Suspense[^>]*>/;
    const breadcrumbComponentPattern =
      /async\s+function\s+BreadcrumbContent\s*\(/;

    return (
      dynamicBreadcrumbPattern.test(content) &&
      suspensePattern.test(content) &&
      breadcrumbComponentPattern.test(content)
    );
  } catch {
    return false;
  }
}

describe("Page Pattern Enforcement", () => {
  describe("Metadata Helpers", () => {
    it("should enforce that dynamic route pages use metadata helpers instead of inline generation", () => {
      const violations: string[] = [];

      for (const [filePath, helperName] of DYNAMIC_PAGES_WITH_METADATA) {
        const hasInline = hasInlineMetadataGeneration(filePath);
        const usesHelper = usesMetadataHelper(filePath, helperName);

        if (hasInline) {
          violations.push(
            `${filePath} - Uses inline metadata generation instead of ${helperName} helper`,
          );
        } else if (!usesHelper) {
          violations.push(
            `${filePath} - Should use ${helperName} helper (import from @/utils/metadata)`,
          );
        }
      }

      if (violations.length > 0) {
        const errorMessage = [
          "\n❌ Metadata helper violations detected!",
          "",
          "The following pages should use metadata helpers instead of inline generation:",
          ...violations.map((v) => `  - ${v}`),
          "",
          "Why this matters:",
          "  • Metadata helpers eliminate 20+ lines of boilerplate per page",
          "  • Centralized helpers ensure consistent metadata format",
          "  • Easier to maintain and update metadata across all pages",
          "",
          "How to fix:",
          "  1. Import the helper: import { generateCampaignOpensMetadata } from '@/utils/metadata'",
          "  2. Replace inline code: export const generateMetadata = generateCampaignOpensMetadata",
          "  3. Remove unused imports (GenerateMetadata type, CampaignReport type)",
          "",
          "Example:",
          "  // Before (25+ lines)",
          "  export const generateMetadata: GenerateMetadata = async ({ params }) => {",
          "    const { id } = schema.parse(await params);",
          "    const response = await mailchimpDAL.fetchCampaignReport(id);",
          "    // ... 20 more lines",
          "  };",
          "",
          "  // After (1 line)",
          "  export const generateMetadata = generateCampaignOpensMetadata;",
          "",
        ].join("\n");

        throw new Error(errorMessage);
      }
    });
  });

  describe("Dynamic Breadcrumbs", () => {
    it("should enforce that dynamic route pages use breadcrumbsSlot pattern", () => {
      const violations: string[] = [];

      for (const filePath of DYNAMIC_PAGES_WITH_BREADCRUMBS) {
        const usesStatic = usesStaticBreadcrumbs(filePath);
        const usesDynamic = usesDynamicBreadcrumbsSlot(filePath);

        if (usesStatic) {
          violations.push(
            `${filePath} - Uses static breadcrumbs prop instead of dynamic breadcrumbsSlot`,
          );
        } else if (!usesDynamic) {
          violations.push(
            `${filePath} - Missing dynamic breadcrumbsSlot pattern`,
          );
        }
      }

      if (violations.length > 0) {
        const errorMessage = [
          "\n❌ Dynamic breadcrumbs violations detected!",
          "",
          "The following pages should use breadcrumbsSlot pattern for dynamic breadcrumbs:",
          ...violations.map((v) => `  - ${v}`),
          "",
          "Why this matters:",
          "  • Dynamic breadcrumbs show actual IDs/names in navigation",
          "  • Provides better UX and context for users",
          "  • Consistent pattern across all dynamic route pages",
          "",
          "How to fix:",
          "  1. Import Suspense and BreadcrumbNavigation",
          "  2. Replace breadcrumbs={...} with breadcrumbsSlot={...}",
          "  3. Add separate async BreadcrumbContent component",
          "  4. Use dynamic breadcrumb helpers (bc.report(id), bc.list(id))",
          "",
          "Pattern:",
          "  <PageLayout",
          "    breadcrumbsSlot={",
          "      <Suspense fallback={null}>",
          "        <BreadcrumbContent params={params} />",
          "      </Suspense>",
          "    }",
          "    title='...'",
          "  >",
          "",
          "  async function BreadcrumbContent({ params }) {",
          "    const { id } = schema.parse(await params);",
          "    return (",
          "      <BreadcrumbNavigation",
          "        items={[bc.home, bc.reports, bc.report(id), bc.current('Details')]}",
          "      />",
          "    );",
          "  }",
          "",
          "Reference:",
          "  • See src/app/mailchimp/reports/[id]/opens/page.tsx for complete example",
          "  • See src/app/mailchimp/reports/[id]/abuse-reports/page.tsx for another example",
          "",
        ].join("\n");

        throw new Error(errorMessage);
      }
    });
  });

  describe("Pattern Consistency", () => {
    it("should verify all dynamic pages follow consistent patterns", () => {
      // This test ensures that pages with [id] in their path follow the patterns
      const allPagesPass = DYNAMIC_PAGES_WITH_BREADCRUMBS.every((filePath) => {
        const usesDynamic = usesDynamicBreadcrumbsSlot(filePath);
        const usesStatic = usesStaticBreadcrumbs(filePath);
        return usesDynamic && !usesStatic;
      });

      expect(
        allPagesPass,
        "All dynamic route pages should use breadcrumbsSlot pattern",
      ).toBe(true);
    });

    it("should verify metadata helpers are used consistently", () => {
      const allPagesPass = DYNAMIC_PAGES_WITH_METADATA.every(
        ([filePath, helperName]) => {
          const usesHelper = usesMetadataHelper(filePath, helperName);
          const hasInline = hasInlineMetadataGeneration(filePath);
          return usesHelper && !hasInline;
        },
      );

      expect(
        allPagesPass,
        "All dynamic route pages should use metadata helpers",
      ).toBe(true);
    });
  });
});
