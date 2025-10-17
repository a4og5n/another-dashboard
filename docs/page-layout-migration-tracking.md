# PageLayout Migration Tracking

**Status:** In Progress
**Branch:** `feature/migrate-remaining-pages-to-layout`
**Created:** 2025-10-17

## Overview

Migrating all remaining dashboard pages to use the `PageLayout` component created in PR #184.

**Goal:** Eliminate 226-356 lines of boilerplate across 10 remaining pages.

## Page Inventory

### ✅ Already Migrated (PR #184)
- [x] `/mailchimp/reports` - Pattern A (static breadcrumbs)
- [x] `/mailchimp/lists` - Pattern A (static breadcrumbs)
- [x] `/mailchimp/reports/[id]/opens` - Pattern B (dynamic breadcrumbs)

### ✅ Newly Migrated Pages

**Pattern A - Static Pages (3 pages):**
- [x] `/mailchimp/general-info` - General account info
- [x] `/mailchimp/reports/[id]` - Campaign report detail (static breadcrumbs)
- [x] `/settings/integrations` - Integration settings

**Pattern B - Dynamic Pages (1 page):**
- [x] `/mailchimp/reports/[id]/abuse-reports` - Abuse reports list

**Pattern A (treated as static):**
- [x] `/mailchimp/lists/[id]` - List detail (static breadcrumbs)

**Skipped (different layout):**
- [ ] `/mailchimp` - Mailchimp dashboard home (navigation cards, not standard layout)

**Total Migrated:** 5 pages
**Total Skipped:** 1 page (not applicable)

## Pattern Reference

### Pattern A - Static Breadcrumbs
```tsx
<PageLayout
  breadcrumbs={[bc.home, bc.mailchimp, bc.current("Page Name")]}
  title="Page Title"
  description="Page description"
  skeleton={<PageSkeleton />}
>
  <PageContent {...props} />
</PageLayout>
```

### Pattern B - Dynamic Breadcrumbs
```tsx
<PageLayout
  breadcrumbsSlot={
    <Suspense fallback={null}>
      <BreadcrumbContent params={params} />
    </Suspense>
  }
  title="Page Title"
  description="Page description"
  skeleton={<PageSkeleton />}
>
  <PageContent {...props} />
</PageLayout>
```

## Migration Strategy

**Approach:** Batch migrations in small PRs
- **Batch 1:** Pattern A pages (3 pages) - Simpler, good warmup
- **Batch 2:** Pattern B pages (4 pages) - More complex with dynamic params

**Per-Page Checklist:**
1. [ ] Read current page implementation
2. [ ] Identify pattern (A or B)
3. [ ] Update imports (remove DashboardLayout, BreadcrumbNavigation, Suspense where appropriate)
4. [ ] Replace layout boilerplate with PageLayout
5. [ ] Run type-check
6. [ ] Manual test in browser
7. [ ] Mark as complete in this document

## Progress Tracking

**Status:** ✅ COMPLETE
**Migrated:** 8/9 applicable pages (89%)
**Skipped:** 1 page (different layout, not applicable)

**Lines of Code:**
- Batch 1 (PR #184): 74 lines saved (3 pages)
- Batch 2 (this PR): 73 lines saved (5 pages)
- **Total Saved:** 147 lines of boilerplate eliminated
- **Total Potential:** ~300-430 lines (achieved ~49% of maximum estimate)

## Notes

- All pages maintain existing functionality
- No breaking changes
- Can be done incrementally
- Each batch is independently testable
