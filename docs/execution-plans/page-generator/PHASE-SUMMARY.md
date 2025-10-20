# Page Generator - Phase Summary (AI Quick Reference)

**GitHub Issue:** [#206](https://github.com/a4og5n/fichaz/issues/206)
**Status:** Phase 0 complete, ready for Phase 1
**Created:** 2025-01-20

---

## Quick Navigation

| Phase | Status     | Time  | Description       | File                                 |
| ----- | ---------- | ----- | ----------------- | ------------------------------------ |
| 0     | ✅ Ready   | 10min | Git Setup         | [phase-0-setup.md](phase-0-setup.md) |
| 1     | 📝 Next    | 1-2h  | Config Structure  | Create when needed                   |
| 2     | ⏳ Pending | 2-3h  | CLI Prompts       | Create when needed                   |
| 3     | ⏳ Pending | 1-2h  | Analyzers         | Create when needed                   |
| 4     | ⏳ Pending | 3-4h  | Generators        | Create when needed                   |
| 5     | ⏳ Pending | 1-2h  | Integration       | Create when needed                   |
| 6     | ⏳ Pending | 1h    | Validation & Docs | Create when needed                   |

---

## Phase 1: Config Structure (1-2h)

**Goal:** Create PageConfig interface and central registry

**Files to Create:**

- `src/generation/page-configs.ts` - Central registry with TypeScript interface
- `src/generation/README.md` - Usage documentation

**Key Decisions:**

- TypeScript-only config (no JSON)
- Type-safe with `satisfies PageConfig`
- Example configs for existing pages
- Error schema with smart default

**AI Tasks:**

1. Create PageConfig interface with all fields
2. Create empty registry with 1-2 example configs
3. Document config structure in README
4. Validate with `pnpm type-check`
5. Commit: "feat(generation): add page config structure (#206)"

**Clear Context After:** ✅ Yes (config is independent)

---

## Phase 2: CLI Prompts (2-3h)

**Goal:** Interactive CLI with Clack library

**Files to Create:**

- `scripts/generate-page.ts` - Main CLI entry
- `scripts/generators/prompts/schema-prompts.ts`
- `scripts/generators/prompts/route-prompts.ts`
- `scripts/generators/prompts/api-prompts.ts`
- `scripts/generators/prompts/ui-prompts.ts`

**Key Features:**

- Install Clack: `pnpm add @clack/prompts`
- Beautiful prompts with validation
- Smart defaults (pre-fill based on detection)
- Save config to registry
- Ask if user wants to generate now

**AI Tasks:**

1. Install Clack
2. Create main CLI with basic flow
3. Implement each prompt module
4. Test CLI flow manually
5. Commit: "feat(generation): add interactive CLI prompts (#206)"

**Clear Context After:** ✅ Yes (CLI complete and tested)

---

## Phase 3: Analyzers (1-2h)

**Goal:** Smart defaults from schema analysis

**Files to Create:**

- `scripts/generators/analyzers/schema-analyzer.ts`
- `scripts/generators/analyzers/project-analyzer.ts`

**Key Features:**

- Detect pagination (count/offset in schema)
- Infer route params (campaign_id → [id])
- Suggest HTTP method (GET if only params)
- Auto-generate DAL method names
- Scan existing pages for parent detection

**AI Tasks:**

1. Create schema analyzer with detection logic
2. Create project analyzer for existing page scanning
3. Integrate with CLI prompts (pass analyzed data)
4. Test with existing schemas
5. Commit: "feat(generation): add schema analyzers for smart defaults (#206)"

**Clear Context After:** ✅ Yes (analyzers complete and integrated)

---

## Phase 4: Generators (3-4h) - LARGEST PHASE

**Goal:** File generators for all artifacts

**Files to Create:**

- `scripts/generators/writers/page-writer.ts`
- `scripts/generators/writers/schema-writer.ts`
- `scripts/generators/writers/component-writer.ts`
- `scripts/generators/writers/dal-writer.ts`
- `scripts/generators/writers/breadcrumb-writer.ts`
- `scripts/generators/writers/metadata-writer.ts`

**Key Features:**

- Generate complete working page.tsx
- Generate not-found.tsx, loading.tsx
- Generate UI schema from API schema
- Generate placeholder component with TODO card
- Update DAL with new method
- Update breadcrumb builder
- Generate metadata helper

**AI Tasks:**

1. Create page writer (most complex)
2. Create schema writer (transform API → UI)
3. Create component writer (placeholder with Construction card)
4. Create DAL writer (add method to existing file)
5. Create breadcrumb writer (add function to existing file)
6. Create metadata writer (add helper to existing file)
7. Test each generator independently
8. Commit: "feat(generation): add file generators for page infrastructure (#206)"

**Clear Context After:** ✅ Yes (generators complete, integration next)

---

## Phase 5: Integration (1-2h)

**Goal:** Tie everything together with safety checks

**Files to Create:**

- `scripts/generators/validators/config-validator.ts`
- `scripts/generators/validators/safety-checker.ts`
- Update `package.json` - Add `generate:page` script

**Key Features:**

- Pre-flight check for existing files
- Overwrite protection (skip/backup/overwrite options)
- Conflict detection in DAL methods
- Smart merging for index files
- Automatic quality checks (type/lint/test)
- Detailed generation log

**AI Tasks:**

1. Create safety checker with file existence checks
2. Create config validator
3. Integrate all generators in main CLI
4. Add automatic quality checks after generation
5. Add `generate:page` script to package.json
6. Test full flow end-to-end
7. Commit: "feat(generation): integrate generators with safety checks (#206)"

**Clear Context After:** ⏩ Continue to Phase 6 (almost done)

---

## Phase 6: Validation & Documentation (1h)

**Goal:** Verify everything works and document usage

**Files to Modify:**

- `CLAUDE.md` - Add page generator usage section
- `docs/page-pattern-improvements.md` - Mark #8 complete

**Key Tasks:**

- Generate a test page using CLI
- Verify generated code passes all checks
- Update CLAUDE.md with usage instructions
- Create migration guide (how to use generator)
- Run full validation: `pnpm validate`
- Commit: "docs: add page generator documentation (#206)"

**Final Steps:**

- Manual testing with multiple page types
- Push branch
- Create PR with demo video/screenshots

---

## AI Workflow Summary

**When user says "Start Phase N":**

1. ✅ Check git branch (must be on feature branch)
2. ✅ Check if phase already complete (git log, file existence)
3. ✅ If complete: inform user, ask to verify or skip
4. ✅ If not complete: proceed with implementation
5. ✅ Commit after phase complete
6. ✅ Ask user about clearing context (based on token usage)

**Context Clearing Points:**

- After Phase 1: ✅ Clear (1-2h work committed)
- After Phase 2: ✅ Clear (2-3h work committed)
- After Phase 3: ✅ Clear (before largest phase)
- After Phase 4: ⚠️ Optional (check tokens)
- After Phase 5: ⏩ Continue (phase 6 is quick)

**What to Keep When Clearing:**

- GitHub Issue #206
- Current phase number
- Any blockers or errors encountered
- This phase summary document

---

## Key Patterns to Follow

**Config Structure (Phase 1):**

```typescript
export interface PageConfig {
  schemas: {
    apiParams: string;
    apiResponse: string;
    apiError?: string; // Optional, defaults to common/error.schema.ts
  };
  route: {
    path: string; // e.g., "/mailchimp/reports/[id]/clicks"
    params?: string[]; // e.g., ["id"]
  };
  api: {
    endpoint: string; // e.g., "/reports/{campaign_id}/click-details"
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    dalMethod?: string; // e.g., "fetchCampaignClickDetails"
  };
  page: {
    type: "list" | "detail" | "nested-detail";
    title: string;
    description: string;
    features: string[];
  };
  ui: {
    hasPagination: boolean;
    breadcrumbs: {
      parent?: string; // Config key of parent page
      label: string;
    };
  };
}
```

**Generated Page Structure:**

```tsx
/**
 * [Page Title]
 * [Description]
 *
 * @route [/path]
 * @requires Mailchimp connection
 * @features [list]
 */

import { Suspense } from "react";
import { PageLayout, BreadcrumbNavigation } from "@/components/layout";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
// ... other imports

export default async function Page({ params, searchParams }) {
  // Parameter validation
  // Data fetching
  // Error handling

  return (
    <PageLayout
      breadcrumbsSlot={...}
      title="..."
      description="..."
      skeleton={<Skeleton />}
    >
      <PageContent {...props} />
    </PageLayout>
  );
}

// Breadcrumb component (for dynamic pages)
async function BreadcrumbContent({ params }) {
  // ...
}

// Force dynamic
export const dynamic = "force-dynamic";

// Metadata
export const generateMetadata = generatedMetadataHelper;
```

**Component Placeholder:**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

export function ComponentName(props) {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Construction className="h-5 w-5" />
          [Feature Name] - Implementation Required
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-blue-800 mb-4">
          This component is ready to be implemented.
        </p>
        {/* Show available data */}
      </CardContent>
    </Card>
  );
}
```

---

## Success Criteria

At the end of Phase 6:

- [ ] CLI generates complete working pages from schemas
- [ ] Generated code passes type-check, lint, and test
- [ ] Smart defaults reduce manual input by 70%+
- [ ] Overwrite protection prevents data loss
- [ ] Documentation clear and comprehensive
- [ ] Team can use generator independently

---

## Emergency Contacts

**If something goes wrong:**

- Rollback: `git reset --hard HEAD~1` (if not pushed)
- Check issue: https://github.com/a4og5n/fichaz/issues/206
- Reference main plan: [page-generator-execution-plan.md](../page-generator-execution-plan.md)

---

**Created:** 2025-01-20
**GitHub Issue:** [#206](https://github.com/a4og5n/fichaz/issues/206)
**Status:** Ready to start Phase 1
