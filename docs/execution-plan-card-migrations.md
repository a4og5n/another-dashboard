# Execution Plan: Card Component Migrations

**Purpose:** Migrate 4 high-priority dashboard components to use the new standardized Card components (StatCard, StatsGridCard, StatusCard) from PR #192

**Related PR:** [#192 - Add standardized Card components](https://github.com/a4og5n/another-dashboard/pull/192)

**Created:** 2025-10-18

---

## Overview

**Goal:** Reduce boilerplate code across dashboard components by migrating to standardized Card components, improving consistency and maintainability.

**Success Criteria:**

- ✅ 4 components successfully migrated to use StatsGridCard
- ✅ ~210 lines of boilerplate code removed
- ✅ All tests pass (including accessibility tests)
- ✅ Manual testing confirms functionality unchanged
- ✅ Documentation updated in CLAUDE.md

**Estimated Total Effort:** 1.5-2 hours

**Expected Benefits:**

- **Code Reduction:** ~210 lines of boilerplate removed
- **Consistency:** Uniform card styling and behavior
- **Maintainability:** Centralized card logic easier to update
- **Accessibility:** Built-in WCAG 2.1 AA compliance
- **Type Safety:** Full TypeScript support with proper types

---

## Files Affected Summary

### Components to Migrate (4 total)

1. **SocialEngagementCard.tsx** - 3 metrics → StatsGridCard (~38 lines saved)
2. **ForwardsCard.tsx** - 2 metrics → StatsGridCard (~42 lines saved)
3. **ClicksCard.tsx** - 3 metrics → StatsGridCard (~60 lines saved)
4. **ListStats.tsx** - 3 cards → StatsGridCard (~72 lines saved)

### Documentation to Update

- `CLAUDE.md` - Add migration examples to Standard Card Components section

---

## Implementation Phases

### Phase 0: Git Setup and Pre-Implementation Validation

**File:** [docs/card-component-migrations/phase-0-setup.md](card-component-migrations/phase-0-setup.md)
**Estimated Time:** 5-10 minutes

Verify git branch setup and confirm no work has been completed yet.

### Phase 1: Migrate SocialEngagementCard (Simplest - Proof of Concept)

**File:** [docs/card-component-migrations/phase-1-social-engagement.md](card-component-migrations/phase-1-social-engagement.md)
**Estimated Time:** 15-20 minutes

Migrate the simplest component first to validate the pattern. This component has 3 metrics displayed as rows.

### Phase 2: Migrate ForwardsCard

**File:** [docs/card-component-migrations/phase-2-forwards.md](card-component-migrations/phase-2-forwards.md)
**Estimated Time:** 15-20 minutes

Migrate ForwardsCard with 2-column grid plus additional context section.

### Phase 3: Migrate ClicksCard

**File:** [docs/card-component-migrations/phase-3-clicks.md](card-component-migrations/phase-3-clicks.md)
**Estimated Time:** 20-25 minutes

Migrate ClicksCard with 3-column grid, additional metrics, and date formatting.

### Phase 4: Migrate ListStats

**File:** [docs/card-component-migrations/phase-4-list-stats.md](card-component-migrations/phase-4-list-stats.md)
**Estimated Time:** 20-25 minutes

Migrate ListStats component with 3 separate cards into a unified StatsGridCard with custom number formatting.

### Phase 5: Documentation and Final Validation

**File:** [docs/card-component-migrations/phase-5-documentation.md](card-component-migrations/phase-5-documentation.md)
**Estimated Time:** 15-20 minutes

Update CLAUDE.md with migration examples and run full validation suite.

---

## Reference Materials

**Checklists and Procedures:**
[docs/card-component-migrations/reference-checklists.md](card-component-migrations/reference-checklists.md)

Contains:

- Manual review checklist
- PR template and push strategy
- Rollback procedures
- Common issues and solutions
- Post-merge tasks

---

## How to Use This Plan

### Starting Fresh

1. Read [Phase 0: Git Setup](card-component-migrations/phase-0-setup.md) first
2. Complete Phase 0 to ensure proper branch setup
3. Work through phases 1-5 sequentially
4. Use reference checklists before pushing

### Cost Optimization

Clear conversation context at these points:

- ✅ After Phase 2 (first 2 components complete, pattern established)
- ✅ After Phase 4 (all migrations complete, before documentation)

### If Interrupted

1. Check current branch: `git branch --show-current`
2. Check last commit: `git log --oneline -1`
3. Review which phase was last completed
4. Continue from next uncompleted phase

---

## Quick Reference

**Branch Name:** `feature/card-component-migrations`

**Key Commands:**

```bash
# Start development server
pnpm dev

# Run tests
pnpm test

# Type check
pnpm type-check

# Full validation
pnpm validate
```

**Reference Implementation:**

- [EmailsSentCard.tsx](../src/components/dashboard/reports/EmailsSentCard.tsx) - Already migrated to StatCard
- [StatCard Component](../src/components/ui/stat-card.tsx)
- [StatsGridCard Component](../src/components/ui/stats-grid-card.tsx)
- [StatusCard Component](../src/components/ui/status-card.tsx)

---

## Prerequisites

Before starting, ensure you understand:

- [ ] How the new standardized Card components work (review PR #192)
- [ ] The StatsGridCard API (props: title, icon, iconColor, stats, columns, footer)
- [ ] Project conventions for component development (CLAUDE.md)
- [ ] How to run and validate tests

**Required Reading:**

1. [CLAUDE.md - Standard Card Components section](../CLAUDE.md#standard-card-components)
2. [EmailsSentCard.tsx](../src/components/dashboard/reports/EmailsSentCard.tsx) - Reference implementation
3. [StatsGridCard.tsx](../src/components/ui/stats-grid-card.tsx) - Component API

---

## Cost Optimization Strategy

**Clear Points:**

1. **After Phase 2:** Pattern established, next phases are repetitive
2. **After Phase 4:** All migrations complete, documentation is independent

**What to Keep After Clearing:**

- This execution plan (main overview)
- Current phase document
- Any error messages encountered

---

**Ready to Begin?** Start with [Phase 0: Git Setup](card-component-migrations/phase-0-setup.md)
