# Mailchimp Filter Components

Reusable UI filter components for Mailchimp dashboard tables.

## Overview

These components provide consistent filtering UIs across all Mailchimp endpoints. Each component supports **both server and client component patterns** through a hybrid API design.

**Related:** Issue #252 - Filter System Standardization (Phase 1 Step 3)

## Components

### 1. FieldSelector

Multi-select interface for choosing which API fields to include/exclude.

**Reuse Potential:** 100% (all endpoints support field filtering)

**Features:**

- Include/exclude mode toggle
- Dropdown selection (when fields provided) or free-form input
- Visual field badges with remove buttons
- Apply button for server components

**Usage:**

```tsx
// Server Component
<FieldSelector
  selectedFields={fields?.split(',')}
  createFieldUrl={(fields, excludeFields) =>
    `/endpoint?fields=${fields}&exclude_fields=${excludeFields}`
  }
  availableFields={['id', 'name', 'email', 'status']}
/>

// Client Component
<FieldSelector
  selectedFields={fields}
  onChange={({ selected, excluded }) => {
    setFields(selected);
    setExcludedFields(excluded);
  }}
  availableFields={['id', 'name', 'email', 'status']}
/>
```

### 2. DateRangeFilter

Date picker pair for filtering by date ranges (since/before).

**Reuse Potential:** 50% (6/12 endpoints use date filters)

**Features:**

- Dual date inputs (from/to)
- Optional time picker
- Custom field names
- Clear button
- Apply button for server components

**Usage:**

```tsx
// Server Component
<DateRangeFilter
  sinceValue={since}
  beforeValue={before}
  createDateUrl={(since, before) =>
    `/endpoint?since_created_at=${since}&before_created_at=${before}`
  }
  label="Created Date"
  fieldNames={{ since: 'since_created_at', before: 'before_created_at' }}
/>

// Client Component
<DateRangeFilter
  sinceValue={since}
  beforeValue={before}
  onChange={({ since, before }) => setDateRange({ since, before })}
  label="Created Date"
/>
```

### 3. SortingControls

Dropdown interface for selecting sort field and direction.

**Reuse Potential:** 25% (3/12 endpoints use sorting)

**Features:**

- Field dropdown
- ASC/DESC toggle button
- Visual sort display
- Field label customization
- Clear button
- Apply button for server components

**Usage:**

```tsx
// Server Component
<SortingControls
  sortField={sortField}
  sortDirection={sortDir}
  availableFields={['name', 'date_created', 'member_count']}
  createSortUrl={(field, dir) =>
    `/endpoint?sort_field=${field}&sort_dir=${dir}`
  }
  fieldLabels={{
    date_created: 'Created Date',
    member_count: 'Members'
  }}
/>

// Client Component
<SortingControls
  sortField={sortField}
  sortDirection={sortDir}
  availableFields={['name', 'date_created']}
  onChange={({ field, direction }) => setSort({ field, direction })}
/>
```

### 4. MemberStatusToggles

Checkbox toggles for including members with special statuses.

**Reuse Potential:** 17% (2/12 endpoints use member status filters)

**Features:**

- Three toggle switches (cleaned, transactional, unsubscribed)
- Help text explaining each status
- Apply button for server components

**Usage:**

```tsx
// Server Component
<MemberStatusToggles
  includeCleaned={includeCleaned}
  includeTransactional={includeTransactional}
  includeUnsubscribed={includeUnsubscribed}
  createStatusUrl={(cleaned, transactional, unsubscribed) =>
    `/endpoint?include_cleaned=${cleaned}&include_transactional=${transactional}&include_unsubscribed=${unsubscribed}`
  }
/>

// Client Component
<MemberStatusToggles
  includeCleaned={includeCleaned}
  includeTransactional={includeTransactional}
  includeUnsubscribed={includeUnsubscribed}
  onChange={(status) => setMemberStatus(status)}
  showHelp={true}
/>
```

## Design Patterns

### Hybrid API (Server + Client Components)

All filter components support both patterns through a single API:

**Server Components:**

- Use `createXUrl` functions to generate navigation URLs
- User interactions trigger page navigation
- State persists in URL parameters (shareable, SEO-friendly)

**Client Components:**

- Use `onChange` callbacks for state updates
- User interactions trigger state changes
- State persists in component state (more interactive)

**Decision Logic:**

```typescript
const isServerComponent = !!createXUrl;

// In event handler:
if (onChange && !isServerComponent) {
  onChange(newValue); // Client component
}

// In apply button:
if (createXUrl) {
  window.location.href = createXUrl(value); // Server component
}
```

### Component States

**Empty State:**

- Show helpful message explaining default behavior
- Example: "No fields selected. All fields will be included."

**Active State:**

- Visual indicators of applied filters
- Clear/Remove buttons for each filter
- Apply button (server components only)

**Validation:**

- Components handle empty/undefined values gracefully
- No client-side validation (handled by API schemas)

## Integration Examples

### Simple List Page (Server Component)

```tsx
import { FieldSelector, SortingControls } from "@/components/mailchimp/filters";

export default async function ListsPage({ searchParams }) {
  const { fields, sort_field, sort_dir } = searchParams;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <FieldSelector
          selectedFields={fields?.split(",")}
          createFieldUrl={(f) => `/mailchimp/lists?fields=${f}`}
          availableFields={["id", "name", "member_count", "date_created"]}
        />

        <SortingControls
          sortField={sort_field}
          sortDirection={sort_dir}
          availableFields={["name", "date_created", "member_count"]}
          createSortUrl={(field, dir) =>
            `/mailchimp/lists?sort_field=${field}&sort_dir=${dir}`
          }
        />
      </div>

      {/* Table with filtered/sorted data */}
    </div>
  );
}
```

### Complex Filter Panel (Client Component)

```tsx
"use client";

import { useState } from "react";
import {
  FieldSelector,
  DateRangeFilter,
  SortingControls,
  MemberStatusToggles,
} from "@/components/mailchimp/filters";

export function MemberFilters({ onFilterChange }) {
  const [fields, setFields] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ since: "", before: "" });
  const [sort, setSort] = useState({ field: "", direction: "ASC" });
  const [status, setStatus] = useState({ includeCleaned: false });

  const handleApply = () => {
    onFilterChange({ fields, dateRange, sort, status });
  };

  return (
    <div className="space-y-6">
      <FieldSelector
        selectedFields={fields}
        onChange={({ selected }) => setFields(selected || [])}
        availableFields={["email", "full_name", "status", "timestamp_opt"]}
      />

      <DateRangeFilter
        sinceValue={dateRange.since}
        beforeValue={dateRange.before}
        onChange={setDateRange}
        label="Opt-in Date"
      />

      <SortingControls
        sortField={sort.field}
        sortDirection={sort.direction}
        availableFields={["timestamp_opt", "last_changed"]}
        onChange={setSort}
      />

      <MemberStatusToggles {...status} onChange={setStatus} />

      <Button onClick={handleApply} className="w-full">
        Apply All Filters
      </Button>
    </div>
  );
}
```

## Type Safety

All components have TypeScript interfaces in `@/types/components/mailchimp/filters`:

```typescript
import type {
  FieldSelectorProps,
  DateRangeFilterProps,
  SortingControlsProps,
  MemberStatusTogglesProps,
} from "@/types/components/mailchimp/filters";
```

## Testing

Components are client components (`"use client"`) to support:

- Interactive state management
- Event handlers
- useEffect hooks

Test with both server and client patterns to ensure hybrid API works correctly.

## Future Enhancements

**Phase 2 (On-demand):**

- Add to specific tables based on user needs
- Segment Members table (member status filters)
- List Members table (all filters)
- Email Activity table (date filters)

**Phase 3 (Long-term):**

- Pre-composed filter sets (`StandardListFilters`, `SortedListFilters`)
- Endpoint-specific filter panels
- Filter presets/saved filters
- Advanced query builder

## Related Files

**Schemas:**

- `src/schemas/mailchimp/common/sorting.schema.ts` - Sort direction schemas
- `src/schemas/mailchimp/common/date-filters.schema.ts` - Date filter schemas
- `src/schemas/mailchimp/common/member-status-filters.schema.ts` - Status schemas

**Types:**

- `src/types/components/mailchimp/filters.ts` - Component prop types

**Documentation:**

- Issue #252 - Filter System Standardization
- `docs/ai-workflow-learnings.md` - Implementation patterns
