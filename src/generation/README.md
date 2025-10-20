# Page Generation Configuration

**Location:** `src/generation/page-configs.ts`

This directory contains configuration metadata for the Mailchimp page generator. Configurations stored here are used **only during code generation** (not at runtime).

---

## Quick Start

### Generate a New Page

```bash
pnpm generate:page
```

The interactive CLI will guide you through:

1. Schema selection (with validation)
2. Route configuration (with smart defaults)
3. API setup (auto-suggested)
4. UI options (auto-detected)
5. Review and confirm

**Result:** Complete working page with infrastructure in ~2-3 minutes

---

## Configuration Structure

### PageConfig Interface

```typescript
export interface PageConfig {
  schemas: {
    apiParams: string; // Path to API params schema
    apiResponse: string; // Path to API response schema
    apiError?: string; // Optional, defaults to common/error.schema.ts
  };
  route: {
    path: string; // Next.js route (e.g., "/mailchimp/reports/[id]/clicks")
    params?: string[]; // Dynamic params (e.g., ["id"])
  };
  api: {
    endpoint: string; // Mailchimp API endpoint
    method: HttpMethod; // GET | POST | PATCH | PUT | DELETE
    dalMethod?: string; // Optional DAL method name
  };
  page: {
    type: PageType; // list | detail | nested-detail
    title: string; // Page title
    description: string; // Page description
    features: string[]; // Feature tags for JSDoc
  };
  ui: {
    hasPagination: boolean; // Pagination support
    breadcrumbs: {
      parent?: string; // Parent page config key
      label: string; // Breadcrumb label
    };
  };
}
```

---

## Smart Defaults

The CLI provides smart defaults based on schema analysis:

### Auto-Detection

| Field                | Detection Logic               | Example                                                 |
| -------------------- | ----------------------------- | ------------------------------------------------------- |
| **Route Path**       | Infer from schema param names | `campaign_id` → `/reports/[id]`                         |
| **Page Type**        | Based on route depth          | 4+ segments → `nested-detail`                           |
| **HTTP Method**      | Schema structure              | Only params → `GET`                                     |
| **Pagination**       | Schema fields                 | `count`/`offset` → `true`                               |
| **DAL Method**       | Endpoint to camelCase         | `/click-details` → `fetchCampaignClickDetails`          |
| **Breadcrumb Label** | Route last segment            | `/clicks` → `"Clicks"`                                  |
| **Parent Page**      | Route hierarchy               | `/reports/[id]/clicks` → parent is `/reports/[id]`      |
| **Features**         | Capabilities                  | Pagination + [id] → `["Pagination", "Dynamic routing"]` |

### Default Values

- **Error Schema:** `src/schemas/mailchimp/common/error.schema.ts` (most endpoints reuse this)
- **DAL Method:** Auto-generated from endpoint name
- **Route Params:** Extracted from route path `[segments]`

---

## Example Configurations

### Example 1: List Page (Pagination)

```typescript
"reports-list": {
  schemas: {
    apiParams: "src/schemas/mailchimp/reports-params.schema.ts",
    apiResponse: "src/schemas/mailchimp/reports-success.schema.ts",
  },
  route: {
    path: "/mailchimp/reports",
    params: [],
  },
  api: {
    endpoint: "/reports",
    method: "GET",
    dalMethod: "fetchCampaignReports",
  },
  page: {
    type: "list",
    title: "Reports",
    description: "View and analyze your Mailchimp campaign reports",
    features: ["Pagination", "Filtering", "Real-time data"],
  },
  ui: {
    hasPagination: true,
    breadcrumbs: {
      label: "Reports",
    },
  },
} satisfies PageConfig
```

### Example 2: Nested Detail Page (Dynamic Route)

```typescript
"report-opens": {
  schemas: {
    apiParams: "src/schemas/mailchimp/report-open-details-params.schema.ts",
    apiResponse: "src/schemas/mailchimp/report-open-details-success.schema.ts",
    // apiError omitted - defaults to common/error.schema.ts
  },
  route: {
    path: "/mailchimp/reports/[id]/opens",
    params: ["id"],
  },
  api: {
    endpoint: "/reports/{campaign_id}/open-details",
    method: "GET",
    dalMethod: "fetchCampaignOpenList",
  },
  page: {
    type: "nested-detail",
    title: "Campaign Opens",
    description: "Members who opened this campaign",
    features: ["Pagination", "Dynamic routing", "Member details"],
  },
  ui: {
    hasPagination: true,
    breadcrumbs: {
      parent: "report-detail",
      label: "Opens",
    },
  },
} satisfies PageConfig
```

---

## Workflow

### 1. Create Schemas (Manual)

```typescript
// src/schemas/mailchimp/clicks-params.schema.ts
export const clicksParamsSchema = z
  .object({
    campaign_id: z.string(),
    count: z.number().min(1).max(1000).default(10),
    offset: z.number().min(0).default(0),
  })
  .strict();

// src/schemas/mailchimp/clicks-success.schema.ts
export const clicksSuccessSchema = z.object({
  clicks: z.array(clickSchema),
  total_items: z.number(),
  _links: linksSchema,
});
```

### 2. Run Generator

```bash
pnpm generate:page
```

### 3. Interactive Prompts

```
🎨 Mailchimp Page Generator

? Config key: report-clicks
? Schema paths:
  - API params: src/schemas/mailchimp/clicks-params.schema.ts ✓
  - API response: src/schemas/mailchimp/clicks-success.schema.ts ✓
  - API error: (default) ✓

📊 Auto-detected:
  • Pagination: Yes (count, offset found)
  • Route param: id (from campaign_id)
  • HTTP method: GET

? Route path: (/mailchimp/reports/[id]/clicks)
? Page type: (nested-detail)
? Has pagination: (Y)
? Breadcrumb label: (Clicks)
? Parent page: (report-detail)

✨ Configuration saved!
? Generate files now? (Y)

🚀 Generating...
  ✅ page.tsx
  ✅ not-found.tsx
  ✅ loading.tsx
  ✅ UI schema
  ✅ Component placeholder
  ✅ DAL method
  ✅ Breadcrumb function
  ✅ Metadata helper

🔍 Running quality checks...
  ✅ Type check passed
  ✅ Lint passed
  ✅ Tests passed

✨ Complete! Manual implementation required:
   → src/components/mailchimp/reports/campaign-clicks-table.tsx
```

### 4. Generated Files

The generator creates:

**Pages:**

- `src/app/mailchimp/reports/[id]/clicks/page.tsx` - Complete working page
- `src/app/mailchimp/reports/[id]/clicks/not-found.tsx` - 404 page
- `src/app/mailchimp/reports/[id]/clicks/loading.tsx` - Loading page

**Schemas:**

- `src/schemas/components/mailchimp/clicks-page-params.ts` - UI schema (auto-generated from API schema)

**Types:**

- `src/types/components/mailchimp/clicks-page.ts` - Page props types

**Components:**

- `src/components/mailchimp/reports/campaign-clicks-table.tsx` - Placeholder with TODO card
- `src/skeletons/mailchimp/campaign-clicks-skeleton.tsx` - Loading skeleton

**Infrastructure Updates:**

- `src/dal/mailchimp.dal.ts` - Added `fetchCampaignClickDetails` method
- `src/utils/breadcrumbs/breadcrumb-builder.ts` - Added `reportClicks` function
- `src/utils/metadata.ts` - Added `generateCampaignClicksMetadata` function

**Index Updates:**

- All relevant `index.ts` files updated with new exports

---

## Safety Features

### Overwrite Protection

```
⚠️  WARNING: Existing files detected:
   📄 src/app/mailchimp/reports/[id]/clicks/page.tsx

? How to proceed?
  ○ Skip existing files (only generate missing)
  ○ Backup existing (.backup suffix)
  ○ Overwrite (DESTRUCTIVE)
  ○ Cancel
```

### Conflict Detection

```
⚠️  CONFLICT: DAL method already exists

   src/dal/mailchimp.dal.ts:Line 95
   async fetchCampaignClickDetails(...)

? This method exists with different signature:
  ○ Keep existing (skip DAL generation)
  ○ Add as fetchCampaignClickDetails2
  ○ Show diff
  ○ Overwrite (DESTRUCTIVE)
```

### Automatic Validation

After generation, runs automatically:

- `pnpm type-check` - TypeScript validation
- `pnpm lint` - ESLint validation
- `pnpm test` - Test suite

**If any fail:** Generator offers to rollback or fix automatically.

---

## Component Placeholder Pattern

Generated components show a TODO card until implemented:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

export function CampaignClicksTable({ clicksData, ...props }) {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Construction className="h-5 w-5" />
          Click Details - Implementation Required
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-blue-800">
          This component is ready to be implemented.
        </p>
        {/* Shows available data */}
      </CardContent>
    </Card>
  );
}
```

**Benefits:**

- Page loads and renders immediately
- Clear visual indicator
- Shows actual data available
- Suggests reusable components
- Links to reference implementations

---

## Type Safety

All configs use `satisfies PageConfig` for compile-time validation:

```typescript
export const pageConfigs = {
  "my-page": {
    // ... config
  } satisfies PageConfig, // ← Type safety
} as const;
```

**Benefits:**

- IDE autocomplete
- Catch typos immediately
- Enforce required fields
- Type inference for helper functions

---

## Helper Functions

```typescript
import {
  getPageConfig,
  hasPageConfig,
  getPageConfigKeys,
} from "@/generation/page-configs";

// Get specific config
const config = getPageConfig("report-clicks");

// Check if config exists
if (hasPageConfig("report-clicks")) {
  // ...
}

// List all config keys
const keys = getPageConfigKeys();
// ["reports-list", "report-opens", ...]
```

---

## Related Documentation

- **Execution Plan:** [docs/execution-plans/page-generator-execution-plan.md](../../docs/execution-plans/page-generator-execution-plan.md)
- **Phase Summary:** [docs/execution-plans/page-generator/PHASE-SUMMARY.md](../../docs/execution-plans/page-generator/PHASE-SUMMARY.md)
- **Parent Doc:** [docs/page-pattern-improvements.md](../../docs/page-pattern-improvements.md)
- **GitHub Issue:** [#206](https://github.com/a4og5n/fichaz/issues/206)

---

**Created:** 2025-01-20
**GitHub Issue:** [#206](https://github.com/a4og5n/fichaz/issues/206)
