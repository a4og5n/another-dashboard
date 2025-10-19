# Component DRY Refactoring Plan

**Purpose:** Identify and consolidate duplicated code across React components to improve maintainability and follow DRY principles.

**Last Updated:** 2025-10-19

**Status:** ✅ Complete - All 6 Priorities Finished!

**Document Type:** Strategic Analysis & Refactoring Roadmap

---

## 🎯 How to Use This Plan

This document provides **strategic analysis** of code duplication across the codebase. For tactical execution:

1. **Review this plan** to understand duplication patterns and priorities
2. **Choose a priority** to work on (recommended: start with Priority 1)
3. **Create a GitHub Issue** using the issue template provided for each priority
4. **Create detailed execution plan** following [execution-plan-template.md](../execution-plan-template.md)
5. **Track progress** via GitHub Issue checkboxes
6. **Reference this plan** for context and code examples

**Hybrid Approach:**

- 📄 **This Markdown Plan** = Analysis, examples, architectural decisions
- 🎯 **GitHub Issues** = Task tracking, progress visibility, accountability

---

## Summary

This analysis identified **460+ lines of duplicated code** across **22+ files** that can be consolidated through refactoring.

### Total Impact (Final Results)

- **378+ lines eliminated** (All 6 priorities complete!)
- **0 lines remaining** - 100% complete! 🎉
- **Reduced maintenance burden** across 22+ files
- **Improved consistency** in component styling and behavior
- **Faster development** when adding new similar components
- **Better adherence to DRY principle**
- **Comprehensive test coverage** for all new utilities

---

## Priority Overview

| Priority | Component Type   | Files Affected | Lines Saved | Effort | Impact | Status      |
| -------- | ---------------- | -------------- | ----------- | ------ | ------ | ----------- |
| 1        | Card Utilities   | 5 files        | 78          | Low    | High   | ✅ Complete |
| 2        | Table Wrapper    | 2 files        | 70          | Medium | High   | ✅ Complete |
| 3        | Empty State Card | 4 files        | 120+        | Low    | Medium | ✅ Complete |
| 4        | Badge Helpers    | 4 files        | 40+         | Low    | Medium | ✅ Complete |
| 5        | Value Formatting | 5 files        | 40+         | Low    | Medium | ✅ Complete |
| 6        | Chart Utilities  | 2 files        | 30+         | Medium | Low    | ✅ Complete |

---

## Priority 1: Card Utilities (HIGH IMPACT) ✅ COMPLETE

**Status:** ✅ **Complete** - Merged to main on 2025-10-19

**Actual Results:** 78 lines saved | 5 files modified | Low effort | High impact

**PR:** [#194](https://github.com/a4og5n/another-dashboard/pull/194)

**Execution Plan:** [execution-plan-priority-1-card-utilities.md](execution-plan-priority-1-card-utilities.md)

### Problem

Helper functions duplicated across 6 card components:

- `getTrendIcon()` - identical in [metric-card.tsx](../../src/components/dashboard/metric-card.tsx:25-35) and [stat-card.tsx](../../src/components/ui/stat-card.tsx:36-46)
- `getTrendColor()` - identical in both files
- `formatValue()` - duplicated in 4 files
- `formatPercentage()` - in [BaseMetricCard.tsx](../../src/components/dashboard/reports/BaseMetricCard.tsx)
- `formatNumber()` - in [list-card.tsx](../../src/components/mailchimp/lists/list-card.tsx)

### Files Affected

1. `src/components/dashboard/metric-card.tsx`
2. `src/components/ui/stat-card.tsx`
3. `src/components/ui/stats-grid-card.tsx`
4. `src/components/ui/status-card.tsx`
5. `src/components/dashboard/reports/BaseMetricCard.tsx`
6. `src/components/mailchimp/lists/list-card.tsx`

### Solution

Create `src/components/ui/helpers/card-utils.ts`:

```typescript
export const getTrendIcon = (trend?: "up" | "down" | "neutral")
export const getTrendColor = (trend?: "up" | "down" | "neutral")
export const formatValue = (val: string | number): string
export const formatNumber = (num: number): string
export const formatPercentage = (value: number): string
```

### Duplicate Code Example

**In metric-card.tsx (lines 25-45):**

```typescript
const getTrendIcon = () => {
  switch (trend) {
    case "up": return <TrendingUp className="h-4 w-4 text-green-600" />;
    case "down": return <TrendingDown className="h-4 w-4 text-red-600" />;
    default: return <Minus className="h-4 w-4 text-gray-600" />;
  }
};
const getTrendColor = () => {
  switch (trend) {
    case "up": return "text-green-600";
    case "down": return "text-red-600";
    default: return "text-gray-600";
  }
};
```

**Also in stat-card.tsx (lines 36-56):** Same implementation, word-for-word identical.

---

## Priority 2: Table Pagination Hook (HIGH IMPACT) ✅ COMPLETE

**Status:** ✅ **Complete** - Merged to main on 2025-10-19

**Actual Results:** 70 lines saved | 2 files modified | Medium effort | High impact

**PR:** [#195](https://github.com/a4og5n/another-dashboard/pull/195)

**Execution Plan:** [execution-plan-priority-2-table-pagination.md](execution-plan-priority-2-table-pagination.md)

### Problem

Two table components have **identical code** for:

1. **URL Parameter Generation** (30+ lines duplicated)
2. **Empty State Handling** (10+ lines each)
3. **TanStack Table Setup** (15+ lines each)
4. **Badge Functions** (`getStatusBadge()`, `getVipBadge()`)

### Files Affected

1. `src/components/dashboard/reports/CampaignOpensTable.tsx` (343 lines)
2. `src/components/dashboard/reports/CampaignAbuseReportsTable.tsx` (355 lines)

### Duplicate Code Example

**Identical URL generation in both files (lines 52-79):**

```typescript
const createPageUrl = useCallback(
  (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (pageSize !== 10) params.set("perPage", pageSize.toString());
    return `${baseUrl}${params.toString() ? `?${params.toString()}` : ""}`;
  },
  [baseUrl, pageSize],
);

const createPerPageUrl = useCallback(
  (newPerPage: number) => {
    const params = new URLSearchParams();
    if (newPerPage !== 10) params.set("perPage", newPerPage.toString());
    return `${baseUrl}${params.toString() ? `?${params.toString()}` : ""}`;
  },
  [baseUrl],
);
```

### Solution Implemented

Created `src/hooks/use-table-pagination.ts` - Custom hook for table pagination URL management:

```typescript
export function useTablePagination({
  baseUrl,
  pageSize,
  defaultPageSize = 10,
}): UseTablePaginationReturn {
  // createPageUrl() - Generate URL for specific page
  // createPerPageUrl() - Generate URL for page size change
}
```

Also created `src/components/ui/helpers/badge-utils.tsx` for shared badge utilities:

```typescript
export function getVipBadge(
  isVip: boolean,
  variant: "simple" | "with-icon" = "simple",
);
export function getMemberStatusBadge(status: string);
export function getActiveStatusBadge(isActive: boolean);
```

---

## Priority 3: Empty State Card Component (MEDIUM IMPACT) ✅ COMPLETE

**Status:** ✅ **Complete** - Merged to main on 2025-10-19

**Actual Results:** 120+ lines saved | 4 files modified | Low effort | Medium impact

**PR:** [#196](https://github.com/a4og5n/another-dashboard/pull/196)

**Execution Plan:** [execution-plan-priority-3-empty-state-card.md](execution-plan-priority-3-empty-state-card.md)

### Problem

Four components use nearly identical empty state patterns with the same card structure, icon display, and button groups.

### Files Affected

1. `src/components/dashboard/reports/CampaignOpensEmpty.tsx` (74 lines)
2. `src/components/dashboard/reports/CampaignAbuseReportsEmpty.tsx` (64 lines)
3. `src/components/mailchimp/mailchimp-empty-state.tsx` (188 lines)
4. `src/components/dashboard/shared/dashboard-error.tsx` (58 lines)

### Duplicate Pattern

All use identical structure:

```tsx
<Card>
  <CardContent className="flex flex-col items-center justify-center py-12">
    <div className="rounded-full bg-[color]/10 p-3 mb-4">
      <Icon className="h-8 w-8 text-[color]" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground text-center max-w-md">{message}</p>
    <div className="flex items-center gap-3">{/* Action Buttons */}</div>
  </CardContent>
</Card>
```

### Solution Implemented

Created `src/components/ui/empty-state-card.tsx` - Generic empty state component with flexible configuration:

```typescript
export interface EmptyStateCardProps {
  icon: LucideIcon;
  iconColor?: "default" | "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "default" | "outline";
  }>;
  variant?: "empty" | "error" | "success";
}

export function EmptyStateCard({
  icon: Icon,
  iconColor = "default",
  title,
  message,
  actions,
  variant = "empty",
});
```

### Refactor Impact (Achieved)

- CampaignOpensEmpty: Replaced with EmptyStateCard usage
- CampaignAbuseReportsEmpty: Replaced with EmptyStateCard usage
- DashboardError: Replaced with EmptyStateCard usage
- MailchimpEmptyState: Partially refactored to use EmptyStateCard
- Total: 120+ lines eliminated across 4 files

---

## Priority 4: Badge Helper Functions (MEDIUM IMPACT) ✅ COMPLETE

**Status:** ✅ **Complete** - Merged to main on 2025-10-19

**Actual Results:** 40+ lines saved | 4 files modified | Low effort | Medium impact

**PR:** [#198](https://github.com/a4og5n/another-dashboard/pull/198)

**Execution Plan:** [execution-plan-priority-4-badge-helpers.md](execution-plan-priority-4-badge-helpers.md)

### Problem

Status badge logic scattered across multiple files with duplicate implementations.

### Files Affected

1. `src/components/ui/helpers/badge-utils.tsx` (added 2 new functions)
2. `src/components/ui/helpers/badge-utils.test.tsx` (created with 26 tests)
3. `src/components/mailchimp/lists/list-card.tsx` (refactored)
4. `src/components/mailchimp/lists/list-overview.tsx` (refactored)

### Solution Implemented

Enhanced existing `src/components/ui/helpers/badge-utils.tsx` with:

```typescript
// New functions added in Priority 4
export function getVisibilityBadge(
  visibility: "pub" | "prv",
  variant: "simple" | "with-icon" = "simple",
): React.ReactNode;

export function getCampaignStatusBadge(status: string): {
  variant: "default" | "secondary" | "outline" | "destructive";
  label: string;
};
```

### Refactor Impact (Achieved)

- **list-card.tsx:** Removed inline `getVisibilityBadge()` function (11 lines saved)
- **list-overview.tsx:** Replaced inline badge logic with utility (9 lines saved)
- **badge-utils.test.tsx:** Created comprehensive test suite (26 tests, 100% coverage)
- **Total:** 40+ lines of duplicate code eliminated across 4 files

---

## Priority 5: Value Formatting Utilities (MEDIUM IMPACT) ✅ COMPLETE

**Status:** ✅ **Complete** - Merged to main on 2025-10-19

**Actual Results:** 40+ lines saved | 5 files modified | Low effort | Medium impact

**PR:** [#200](https://github.com/a4og5n/another-dashboard/pull/200) (Initial migration) + [#201](https://github.com/a4og5n/another-dashboard/pull/201) (Cleanup)

**Execution Plan:** [execution-plan-priority-5-format-utilities.md](execution-plan-priority-5-format-utilities.md)

### Problem

**5+ different implementations** of essentially the same number/value formatting logic across components with inconsistent behavior.

### Files Affected

1. `src/utils/format-number.ts` (enhanced with new functions)
2. `src/utils/format-number.test.ts` (created with 27 tests)
3. `src/components/ui/helpers/card-utils.tsx` (removed duplicate)
4. `src/components/dashboard/reports/BaseMetricCard.tsx` (removed duplicate)
5. `src/components/dashboard/reports/ListPerformanceCard.tsx` (removed duplicate)
6. `src/components/dashboard/reports/DeliveryIssuesCard.tsx` (updated imports)
7. `src/components/dashboard/reports/ListHealthCard.tsx` (updated imports)
8. `src/components/dashboard/reports/index.ts` (updated barrel export)

### Solution Implemented

Enhanced `src/utils/format-number.ts` with comprehensive formatting utilities:

```typescript
// New functions added in Priority 5
export function formatPercentage(value: number, decimals: number = 1): string;
export function formatPercentageValue(
  value: number,
  decimals: number = 1,
): string;
export function formatValue(val: string | number): string;

// Existing functions (already present)
export function formatNumber(num: number): string;
export function formatPercent(value: number | null | undefined): string;
```

### Refactor Impact (Achieved)

- **card-utils.tsx:** Removed duplicate `formatPercentage()` (10 lines)
- **BaseMetricCard.tsx:** Removed duplicate `formatPercentage()` (8 lines)
- **ListPerformanceCard.tsx:** Removed inline `formatPercentage()` (6 lines)
- **DeliveryIssuesCard.tsx:** Updated to import from centralized location
- **ListHealthCard.tsx:** Updated to import from centralized location
- **format-number.test.ts:** Added comprehensive test suite (27 tests, 100% coverage)
- **PR #201:** Removed unnecessary "backward compatibility" re-exports (14 lines cleaned)
- **Total:** 40+ lines of duplicate code eliminated, enforced single source of truth

---

## Priority 6: Chart Utilities (LOW IMPACT) ✅ COMPLETE

**Status:** ✅ **Complete** - Merged to main on 2025-10-19

**Actual Results:** 30+ lines saved | 2 files modified | Medium effort | Low impact

**PR:** [#202](https://github.com/a4og5n/another-dashboard/pull/202)

**Execution Plan:** [execution-plan-priority-6-chart-utilities.md](execution-plan-priority-6-chart-utilities.md)

### Problem

Similar custom tooltip implementations for Recharts with duplicate styling and formatting logic.

### Files Affected

1. `src/components/dashboard/reports/TimeseriesCard.tsx` - `CustomTooltip` component (23 lines)
2. `src/components/dashboard/reports/ReportCharts.tsx` - Different tooltip formatting

### Solution Implemented

Created `src/components/dashboard/helpers/chart-utils.tsx` with:

```typescript
// Custom tooltip component for Recharts
export function CustomChartTooltip<T = Record<string, unknown>>({
  active,
  payload,
  label,
  valueFormatter,
  labelFormatter,
}: CustomChartTooltipProps<T>);

// Chart color scheme
export const defaultChartColors: ChartColorScheme = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  success: "hsl(142, 76%, 36%)",
  warning: "hsl(38, 92%, 50%)",
  error: "hsl(0, 84%, 60%)",
  neutral: "hsl(215, 16%, 47%)",
};

// Formatting utilities
export function formatChartNumber(value: number | string): string;
export function formatChartPercentage(
  value: number | string,
  decimals?: number,
): string;
export function formatChartDate(date: string | Date): string;
```

Also created comprehensive type definitions in `src/types/components/dashboard/chart-utils.ts`:

```typescript
export interface CustomChartTooltipProps<T = Record<string, unknown>>;
export interface ChartColorScheme;
```

### Refactor Impact (Achieved)

- **TimeseriesCard.tsx:** Removed inline `CustomTooltip` component (~25 lines saved)
- **ReportCharts.tsx:** Updated to use shared `formatChartNumber` helper
- **chart-utils.test.tsx:** Created comprehensive test suite (21 tests, 100% coverage)
- **Total:** 30+ lines of duplicate code eliminated across 2 files

---

## Existing Standardized Components (Good Practices)

The project already has good standardization in place:

### Well-Designed Components

1. **StatCard** (`src/components/ui/stat-card.tsx`) - Standard single metric display ✓
2. **StatsGridCard** (`src/components/ui/stats-grid-card.tsx`) - Multi-stat grid ✓
3. **StatusCard** (`src/components/ui/status-card.tsx`) - Status with badge ✓
4. **CampaignStatusBadge** (`src/components/ui/campaign-status-badge.tsx`) - Status display ✓
5. **Card/CardHeader/CardContent** - Base primitives ✓

### Components Using Standardized Card Components

- **ClicksCard** - Migrated to `StatsGridCard` ✓
- **ForwardsCard** - Migrated to `StatsGridCard` ✓
- **SocialEngagementCard** - Migrated to `StatsGridCard` ✓
- **EmailsSentCard** - Uses `StatCard` ✓

---

## Component Organization Gaps

### Missing Abstraction Layers

1. **No Generic Table Wrapper** - Each table reimplements:
   - Pagination URL generation
   - Per-page selector logic
   - Empty state handling
   - TanStack table setup

2. **No Empty State Factory** - 4+ custom implementations of similar empty states

3. **No Card Utilities Module** - Helper functions scattered across components

4. **No Badge Helper Module** - Status badge logic duplicated across tables

5. **No Chart Utility Module** - Custom tooltip/chart helpers duplicated

---

## Recommended Action Plan

### Sprint 1: Quick Wins (Low effort, high impact)

**Estimated Savings: 170+ lines**

1. ✅ Create `src/components/ui/helpers/card-utils.ts`
   - Extract `getTrendIcon()`, `getTrendColor()`, `formatValue()`
   - Update 6 card components to import utilities

2. ✅ Create `src/components/ui/helpers/badge-helpers.ts`
   - Extract badge functions from tables
   - Centralize status mapping logic

3. ✅ Create generic `EmptyStateCard` component - **COMPLETE**
   - Created `EmptyStateCard` with variant support and flexible actions
   - Refactored 4 empty state components to use it
   - Removed ~120 lines of duplicate code

### Sprint 2: Medium Effort (Medium effort, high impact)

**Estimated Savings: 160+ lines**

1. ✅ Extract table pagination logic - **COMPLETE**
   - Created `useTablePagination()` hook for URL generation
   - Created badge utilities (`getVipBadge`, `getMemberStatusBadge`, `getActiveStatusBadge`)
   - Refactored 2 table components (CampaignOpensTable, CampaignAbuseReportsTable)
   - Removed ~70 lines of duplicate code

2. ✅ Consolidate formatting utilities - **COMPLETE**
   - Enhanced `src/utils/format-number.ts` with 3 new formatting functions
   - Removed 5+ duplicate implementations across components
   - Added comprehensive test suite (27 tests, 100% coverage)
   - Removed unnecessary re-exports (PR #201 cleanup)
   - Removed ~40 lines of duplicate code

### Sprint 3: Polish (Optional)

1. Extract chart utilities
2. Add component library documentation
3. Create usage examples

---

## Next Steps

Each priority can be converted into a detailed execution plan when ready to implement:

1. **To start Priority 1 (Card Utilities):**
   - Create detailed execution plan based on template
   - Identify all specific functions to extract
   - Plan migration path for 6 affected components

2. **To start Priority 2 (Table Wrapper):**
   - Analyze table component commonalities in detail
   - Design reusable component/hook API
   - Plan migration for 2 table components

3. **Continue for remaining priorities...**

---

## Related Documentation

- **Recent Success:** [execution-plan-card-migrations.md](../execution-plan-card-migrations.md) - Shows successful component standardization
- **Execution Plan Template:** [execution-plan-template.md](../execution-plan-template.md) - Use this to create detailed plans
- **Component Standards:** Check CLAUDE.md for component patterns

---

## GitHub Issue Templates

Use these templates to create trackable GitHub Issues for each priority. Copy the template, create a new issue, and check off tasks as you complete them.

### Priority 1: GitHub Issue Template

```markdown
**Title:** Refactor: Extract Card Helper Utilities (Priority 1)

**Labels:** `refactor`, `priority-high`, `effort-low`, `impact-high`, `technical-debt`

**Milestone:** Component Refactoring Sprint

---

### Summary

Extract duplicated helper functions from 6 card components into a shared utility module.

**Lines Saved:** 80+ | **Effort:** Low | **Impact:** High

### Problem

Helper functions duplicated across 6 card components:

- `getTrendIcon()` - identical in metric-card.tsx and stat-card.tsx
- `getTrendColor()` - identical in both files
- `formatValue()` - duplicated in 4 files
- `formatPercentage()` - in BaseMetricCard.tsx
- `formatNumber()` - in list-card.tsx

### Files Affected

- [ ] src/components/dashboard/metric-card.tsx
- [ ] src/components/ui/stat-card.tsx
- [ ] src/components/ui/stats-grid-card.tsx
- [ ] src/components/ui/status-card.tsx
- [ ] src/components/dashboard/reports/BaseMetricCard.tsx
- [ ] src/components/mailchimp/lists/list-card.tsx

### Implementation Checklist

#### Phase 0: Setup (5-10 min)

- [ ] Create feature branch: `refactor/card-utilities`
- [ ] Verify no existing work: `git log --oneline -10`
- [ ] Review component-dry-refactoring-plan.md Priority 1

#### Phase 1: Create Utilities (30 min)

- [ ] Create `src/components/ui/helpers/` directory
- [ ] Create `src/components/ui/helpers/card-utils.ts`
- [ ] Implement `getTrendIcon()` function
- [ ] Implement `getTrendColor()` function
- [ ] Implement `formatValue()` function
- [ ] Implement `formatNumber()` function
- [ ] Implement `formatPercentage()` function
- [ ] Add JSDoc comments to all functions
- [ ] Create `src/components/ui/helpers/index.ts` barrel export
- [ ] Run `pnpm type-check`
- [ ] Commit: "feat(ui): create card helper utilities"

#### Phase 2: Update Components (45 min)

- [ ] Update metric-card.tsx to import utilities
- [ ] Update stat-card.tsx to import utilities
- [ ] Update stats-grid-card.tsx to import utilities
- [ ] Update status-card.tsx to import utilities
- [ ] Update BaseMetricCard.tsx to import utilities
- [ ] Update list-card.tsx to import utilities
- [ ] Remove duplicate function implementations
- [ ] Run `pnpm lint`
- [ ] Run `pnpm test`
- [ ] Commit: "refactor(components): use shared card utilities"

#### Phase 3: Validation & PR (15 min)

- [ ] Manual testing - verify all cards render correctly
- [ ] Test trend icons display properly
- [ ] Test value formatting is consistent
- [ ] Run `pnpm validate`
- [ ] Push branch
- [ ] Create PR with "Closes #XXX"

### Success Criteria

- [ ] All 6 components use shared utilities
- [ ] ~80 lines of duplicate code removed
- [ ] All tests pass
- [ ] No visual regressions
- [ ] Type checking passes

### Related

- **Execution Plan:** [docs/refactoring/component-dry-refactoring-plan.md](component-dry-refactoring-plan.md) - Priority 1
- **Parent Epic:** Component DRY Refactoring
```

---

### Priority 2: GitHub Issue Template

```markdown
**Title:** Refactor: Create Reusable Table Pagination Logic (Priority 2)

**Labels:** `refactor`, `priority-high`, `effort-medium`, `impact-high`, `technical-debt`

**Milestone:** Component Refactoring Sprint

---

### Summary

Extract duplicated table pagination URL generation logic into a reusable hook or component.

**Lines Saved:** 120+ | **Effort:** Medium | **Impact:** High

### Problem

Two table components have identical code for:

- URL Parameter Generation (30+ lines duplicated)
- Empty State Handling (10+ lines each)
- TanStack Table Setup (15+ lines each)
- Badge Functions (getStatusBadge(), getVipBadge())

### Files Affected

- [ ] src/components/dashboard/reports/CampaignOpensTable.tsx
- [ ] src/components/dashboard/reports/CampaignAbuseReportsTable.tsx

### Implementation Checklist

#### Phase 0: Setup (5-10 min)

- [ ] Create feature branch: `refactor/table-pagination`
- [ ] Verify no existing work
- [ ] Review component-dry-refactoring-plan.md Priority 2

#### Phase 1: Create Hook/Wrapper (45 min)

- [ ] Decide: Hook vs Component (useTablePagination or DataTableWrapper)
- [ ] Create implementation file
- [ ] Extract URL generation logic
- [ ] Extract pagination state management
- [ ] Add TypeScript types
- [ ] Add JSDoc comments
- [ ] Run `pnpm type-check`
- [ ] Commit: "feat(ui): create table pagination utilities"

#### Phase 2: Refactor First Table (30 min)

- [ ] Update CampaignOpensTable.tsx
- [ ] Remove duplicate pagination code
- [ ] Use new hook/component
- [ ] Test pagination functionality
- [ ] Test URL generation
- [ ] Commit: "refactor(tables): use shared pagination in CampaignOpensTable"

#### Phase 3: Refactor Second Table (30 min)

- [ ] Update CampaignAbuseReportsTable.tsx
- [ ] Remove duplicate pagination code
- [ ] Use new hook/component
- [ ] Test pagination functionality
- [ ] Test URL generation
- [ ] Commit: "refactor(tables): use shared pagination in CampaignAbuseReportsTable"

#### Phase 4: Validation & PR (15 min)

- [ ] Manual testing - verify both tables work correctly
- [ ] Test pagination edge cases
- [ ] Run `pnpm validate`
- [ ] Push branch
- [ ] Create PR

### Success Criteria

- [ ] Both tables use shared pagination logic
- [ ] ~120 lines of duplicate code removed
- [ ] All tests pass
- [ ] Pagination works identically in both tables

### Related

- **Execution Plan:** [docs/refactoring/component-dry-refactoring-plan.md](component-dry-refactoring-plan.md) - Priority 2
```

---

### Priority 3: GitHub Issue Template

```markdown
**Title:** Refactor: Create Generic Empty State Component (Priority 3)

**Labels:** `refactor`, `priority-medium`, `effort-low`, `impact-medium`, `technical-debt`

**Milestone:** Component Refactoring Sprint

---

### Summary

Create a generic EmptyStateCard component to replace 4 duplicate empty state implementations.

**Lines Saved:** 120+ | **Effort:** Low | **Impact:** Medium

### Problem

Four components use nearly identical empty state patterns with the same card structure, icon display, and button groups.

### Files Affected

- [ ] src/components/dashboard/reports/CampaignOpensEmpty.tsx
- [ ] src/components/dashboard/reports/CampaignAbuseReportsEmpty.tsx
- [ ] src/components/mailchimp/mailchimp-empty-state.tsx
- [ ] src/components/dashboard/shared/dashboard-error.tsx

### Implementation Checklist

#### Phase 0: Setup (5-10 min)

- [ ] Create feature branch: `refactor/empty-state-component`
- [ ] Verify no existing work
- [ ] Review component-dry-refactoring-plan.md Priority 3

#### Phase 1: Create Component (30 min)

- [ ] Create `src/components/ui/empty-state-card.tsx`
- [ ] Define EmptyStateCardProps interface
- [ ] Implement EmptyStateCard component
- [ ] Add variant support (empty, error, success)
- [ ] Add iconColor prop
- [ ] Add actions prop for buttons
- [ ] Add JSDoc comments
- [ ] Create barrel export in ui/index.ts
- [ ] Run `pnpm type-check`
- [ ] Commit: "feat(ui): create generic EmptyStateCard component"

#### Phase 2: Refactor Components (45 min)

- [ ] Refactor CampaignOpensEmpty.tsx
- [ ] Refactor CampaignAbuseReportsEmpty.tsx
- [ ] Refactor dashboard-error.tsx
- [ ] Refactor mailchimp-empty-state.tsx (partially)
- [ ] Remove duplicate code
- [ ] Test all empty states render correctly
- [ ] Commit: "refactor(components): use generic EmptyStateCard"

#### Phase 3: Validation & PR (15 min)

- [ ] Manual testing - verify all empty states display correctly
- [ ] Test different variants
- [ ] Test action buttons
- [ ] Run `pnpm validate`
- [ ] Push branch
- [ ] Create PR

### Success Criteria

- [ ] 4 components refactored to use EmptyStateCard
- [ ] ~120 lines of duplicate code removed
- [ ] All tests pass
- [ ] No visual regressions

### Related

- **Execution Plan:** [docs/refactoring/component-dry-refactoring-plan.md](component-dry-refactoring-plan.md) - Priority 3
```

---

**End of Refactoring Plan**
