# Page Generator

Interactive CLI tool for generating complete Mailchimp dashboard pages from API schemas.

## Overview

The page generator automates the creation of all necessary files for a new dashboard page:

- **Page files** (`page.tsx`, `loading.tsx`, `not-found.tsx`)
- **UI schemas** (transform API schemas to UI format)
- **Placeholder components** (with Construction card)
- **DAL methods** (add to existing DAL)
- **Breadcrumb functions** (add to breadcrumb builder)
- **Metadata helpers** (add to metadata utilities)

## Quick Start

```bash
# Run the interactive CLI
pnpm generate:page
```

The CLI will guide you through 8 steps:

1. **Schema Configuration** - Select API schemas
2. **Route Configuration** - Define route path and params
3. **API Configuration** - Configure API endpoint and method
4. **UI Configuration** - Set pagination and breadcrumbs
5. **Validate Configuration** - Automatic validation
6. **Review Configuration** - Preview and confirm
7. **Safety Check** - See files that will be created/modified
8. **Generate Files** - Create all infrastructure files

## Prerequisites

Before running the generator, you must:

1. **Create API schemas** in `src/schemas/mailchimp/`:
   - Params schema (e.g., `clicks-params.schema.ts`)
   - Response schema (e.g., `clicks-success.schema.ts`)
   - Optional: Error schema (defaults to common error schema)

2. **Define schema structure** following project patterns:
   - Use exact API field names (Zod schemas)
   - Include pagination params if needed
   - Document with JSDoc comments

## Example Usage

### Example: Campaign Clicks Page

**Step 1: Create API Schemas**

Create `src/schemas/mailchimp/clicks-params.schema.ts`:

```typescript
import { z } from "zod";

export const clicksPathParamsSchema = z
  .object({
    campaign_id: z.string().min(1),
  })
  .strict();

export const clicksQueryParamsSchema = z
  .object({
    count: z.coerce.number().min(1).max(1000).default(10).optional(),
    offset: z.coerce.number().min(0).default(0).optional(),
  })
  .strict();
```

Create `src/schemas/mailchimp/clicks-success.schema.ts`:

```typescript
import { z } from "zod";

export const clicksSuccessSchema = z
  .object({
    members: z.array(
      z.object({
        email_address: z.string().email(),
        clicks_count: z.number(),
        // ... other fields
      }),
    ),
    total_items: z.number(),
  })
  .strict();
```

**Step 2: Run Generator**

```bash
pnpm generate:page
```

**Step 3: Answer Prompts**

```
📄 Page Generator

Step 1: Schema Configuration
? Select API params schema: src/schemas/mailchimp/clicks-params.schema.ts
? Select API response schema: src/schemas/mailchimp/clicks-success.schema.ts

Step 2: Route Configuration
? Enter route path: /mailchimp/reports/[id]/clicks
? Page title: Campaign Clicks
? Page description: Members who clicked links in this campaign

Step 3: API Configuration
? API endpoint: /reports/{campaign_id}/click-details
? HTTP method: GET

Step 4: UI Configuration
? Enable pagination: Yes
? Breadcrumb label: Clicks
? Parent page config key: report-detail

Step 5: Validate Configuration
✅ Configuration is valid

Step 6: Review Configuration
[JSON preview...]
? Save configuration: Yes
? Config key: report-clicks

Step 7: Safety Check
Files to be created:
  ✨ ./src/app/mailchimp/reports/[id]/clicks/page.tsx
  ✨ ./src/app/mailchimp/reports/[id]/clicks/loading.tsx
  ✨ ./src/app/mailchimp/reports/[id]/clicks/not-found.tsx
  ✨ ./src/schemas/components/mailchimp/report-clicks-page-params.ts
  ✨ ./src/components/mailchimp/reports/campaign-clicks-content.tsx

Files to be modified:
  ✏️  ./src/dal/mailchimp.dal.ts
  ✏️  ./src/utils/breadcrumbs/breadcrumb-builder.ts
  ✏️  ./src/utils/mailchimp/metadata.ts

? Proceed with file generation: Yes

Step 8: Generating Files
✅ All files generated successfully!

Generated 8 files:
  ./src/app/mailchimp/reports/[id]/clicks/page.tsx
  ./src/app/mailchimp/reports/[id]/clicks/loading.tsx
  [...]

Next Steps:
1. Review generated files
2. Implement component logic (replace Construction card)
3. Add proper types to DAL method
4. Test the page at /mailchimp/reports/[id]/clicks
5. Run 'pnpm format' to format generated files
6. Run 'pnpm lint:fix' to fix any linting issues

✅ Page generation completed successfully!
```

**Step 4: Implement Component**

Replace the Construction card in the generated component with actual implementation:

```typescript
// src/components/mailchimp/reports/campaign-clicks-content.tsx

export function CampaignClicksContent({ data, id, currentPage, pageSize }) {
  return (
    <MailchimpConnectionGuard>
      <CampaignClicksTable
        clicksData={data}
        currentPage={currentPage}
        pageSize={pageSize}
        baseUrl={`/mailchimp/reports/${id}/clicks`}
        campaignId={id}
      />
    </MailchimpConnectionGuard>
  );
}
```

## Generated Files

### Page Files (`src/app/mailchimp/[route]/`)

- **page.tsx** - Main page component with:
  - Route and search params validation
  - Data fetching via DAL
  - Error handling (404 detection)
  - PageLayout with breadcrumbs
  - Suspense boundary for content

- **loading.tsx** - Loading skeleton UI

- **not-found.tsx** - 404 error page (for detail/nested-detail pages only)

### Schema Files (`src/schemas/components/mailchimp/`)

- **[config-key]-page-params.ts** - UI schema with:
  - Page params schema (route params)
  - Search params schema (pagination only)
  - TypeScript type exports

### Component Files (`src/components/mailchimp/[category]/`)

- **[page-title]-content.tsx** - Placeholder component with:
  - Construction card UI
  - Data structure documentation
  - TODO comments for implementation

### DAL Method (`src/dal/mailchimp.dal.ts`)

Adds new method to DAL class:

```typescript
async fetchCampaignClickDetails(
  id: string,
  params?: unknown
): Promise<ApiResponse<unknown>> {
  return mailchimpApiCall((client) =>
    client.get<unknown>(`/reports/${id}/click-details`, params)
  );
}
```

### Breadcrumb Function (`src/utils/breadcrumbs/breadcrumb-builder.ts`)

Adds breadcrumb to builder:

```typescript
reportClicks(id: string): BreadcrumbItem {
  return {
    label: "Clicks",
    href: `/mailchimp/reports/${id}/clicks`,
  };
}
```

### Metadata Helper (`src/utils/mailchimp/metadata.ts`)

Adds metadata function:

```typescript
export async function generateCampaignClicksMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  // ... implementation
}
```

## Safety Features

### Validation

The generator validates configuration before file generation:

- ✅ Schema files exist
- ✅ Route path format (`/mailchimp/*`)
- ✅ Route params match dynamic segments
- ✅ Page type matches route structure
- ✅ API endpoint format
- ✅ Breadcrumb parent for nested pages

Validation errors are displayed with clear messages. Generation stops if validation fails.

### File Protection

- **Existing files are NEVER overwritten**
- Writers check for file existence before writing
- Warnings are displayed for existing files
- Only new files are created
- Modified files (DAL, breadcrumb, metadata) append new code

### Confirmation

- Review configuration before proceeding
- See files that will be created/modified
- Confirm after seeing warnings
- Cancel at any step with Ctrl+C

## Page Types

### List Page

Top-level list page with pagination:

- Route: `/mailchimp/lists`
- No dynamic params
- Typically has pagination
- Shows all items

### Detail Page

Detail page with single dynamic param:

- Route: `/mailchimp/reports/[id]`
- One dynamic param at depth 3
- Shows single item details
- Includes not-found.tsx

### Nested Detail Page

Nested detail page under parent detail:

- Route: `/mailchimp/reports/[id]/opens`
- Deeper than depth 3
- Requires breadcrumb parent
- Includes not-found.tsx

## Schema Analysis

The generator automatically detects:

- **Pagination type** (count-offset vs page-perPage)
- **Path parameters** (campaign_id, list_id, etc.)
- **Filters** (status, type, etc.)
- **Sorting** (sort_field, sort_dir)
- **Date filters** (since, before)
- **HTTP method** (GET/POST based on schema structure)

This provides smart defaults during the interactive prompts.

## Troubleshooting

### "Schema file not found"

Make sure API schemas exist before running the generator:

```bash
ls src/schemas/mailchimp/*.schema.ts
```

### "Validation failed"

Review validation errors and fix configuration:

- Check route path starts with `/mailchimp/`
- Verify dynamic segments match params
- Ensure page type matches route structure

### "File already exists"

The generator skips existing files. Options:

1. Delete existing file to regenerate
2. Manually merge changes
3. Use different config key

### TypeScript Errors

Run formatting and linting after generation:

```bash
pnpm format
pnpm lint:fix
pnpm type-check
```

## Architecture

```
CLI Flow:
┌─────────────────────────────────────────────────────────────┐
│ 1. Schema Prompts → Validate schemas exist                  │
│ 2. Route Prompts → Detect page type, params                 │
│ 3. API Prompts → Convert route to endpoint                  │
│ 4. UI Prompts → Detect pagination, suggest parent           │
│ 5. Validate Config → Check all constraints                  │
│ 6. Review Config → Show JSON, ask confirmation              │
│ 7. Safety Check → List files, show warnings                 │
│ 8. Generate Files → Run all 6 writers                       │
└─────────────────────────────────────────────────────────────┘

Writers (scripts/generators/writers/):
- page-writer.ts → Generate page.tsx, loading.tsx, not-found.tsx
- schema-writer.ts → Generate UI schemas
- component-writer.ts → Generate placeholder component
- dal-writer.ts → Add DAL method
- breadcrumb-writer.ts → Add breadcrumb function
- metadata-writer.ts → Add metadata helper

Prompts (scripts/generators/prompts/):
- schema-prompts.ts → Schema selection + analysis
- route-prompts.ts → Route configuration + type detection
- api-prompts.ts → API endpoint + method
- ui-prompts.ts → Pagination + breadcrumbs + parent detection

Analyzers (scripts/generators/analyzers/):
- schema-analyzer.ts → Detect pagination, filters, params
- project-analyzer.ts → Scan existing pages, suggest parents
```

## Next Steps

After generation:

1. **Review files** - Check generated code
2. **Implement component** - Replace Construction card
3. **Add types** - Update DAL method with proper types
4. **Format code** - Run `pnpm format`
5. **Fix linting** - Run `pnpm lint:fix`
6. **Test page** - Visit route in browser
7. **Commit changes** - Add to git

## Related Documentation

- [Execution Plan](../../docs/execution-plans/page-generator-execution-plan.md)
- [PageConfig Interface](../../src/generation/page-configs.ts)
- [Writer README](./writers/README.md)
- [CLAUDE.md](../../CLAUDE.md) - Project guidelines

## Future Enhancements

- [ ] Config registry saving (Phase 6)
- [ ] Multiple route params support
- [ ] Custom component templates
- [ ] Test file generation
- [ ] Storybook story generation
- [ ] Type generation from schemas
