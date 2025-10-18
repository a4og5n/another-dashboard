# Card Component Migrations - Execution Plan

This directory contains the detailed execution plan for migrating dashboard components to use the new standardized Card components (StatCard, StatsGridCard, StatusCard) from PR #192.

## Structure

```
docs/
├── execution-plan-card-migrations.md    # Main overview (start here)
└── card-component-migrations/
    ├── README.md                        # This file
    ├── phase-0-setup.md                 # Git setup and validation
    ├── phase-1-social-engagement.md     # Migrate SocialEngagementCard
    ├── phase-2-forwards.md              # Migrate ForwardsCard
    ├── phase-3-clicks.md                # Migrate ClicksCard
    ├── phase-4-list-stats.md            # Migrate ListStats
    ├── phase-5-documentation.md         # Update docs and validate
    └── reference-checklists.md          # Manual review, PR, rollback
```

## How to Use

### First Time

1. **Read main overview:** [../execution-plan-card-migrations.md](../execution-plan-card-migrations.md)
2. **Start with Phase 0:** [phase-0-setup.md](phase-0-setup.md)
3. **Work sequentially:** Phases 1-5 in order
4. **Reference checklists:** [reference-checklists.md](reference-checklists.md) before pushing

### Resuming Work

1. Check current branch: `git branch --show-current`
2. Check last commit: `git log --oneline -5`
3. Identify last completed phase
4. Continue with next phase

### Cost Optimization

**Clear conversation context at:**

- After Phase 2 (pattern established)
- After Phase 4 (migrations complete)

**Keep in context:**

- Main overview document
- Current phase document
- Any error messages

## Phase Overview

| Phase     | Component            | Complexity | Time          | Lines Saved |
| --------- | -------------------- | ---------- | ------------- | ----------- |
| 0         | Git Setup            | N/A        | 5-10 min      | N/A         |
| 1         | SocialEngagementCard | Simple     | 15-20 min     | ~38         |
| 2         | ForwardsCard         | Simple     | 15-20 min     | ~42         |
| 3         | ClicksCard           | Medium     | 20-25 min     | ~60         |
| 4         | ListStats            | Medium     | 20-25 min     | ~72         |
| 5         | Documentation        | Simple     | 15-20 min     | N/A         |
| **Total** | **4 components**     | -          | **1.5-2 hrs** | **~210**    |

## Quick Reference

**Branch:** `feature/card-component-migrations`

**Key Files:**

- Reference implementation: [src/components/dashboard/reports/EmailsSentCard.tsx](../../src/components/dashboard/reports/EmailsSentCard.tsx)
- StatsGridCard: [src/components/ui/stats-grid-card.tsx](../../src/components/ui/stats-grid-card.tsx)
- StatCard: [src/components/ui/stat-card.tsx](../../src/components/ui/stat-card.tsx)

**Commands:**

```bash
pnpm dev           # Start dev server
pnpm test          # Run tests
pnpm type-check    # Type checking
pnpm validate      # Full validation
```

## Success Criteria

- ✅ All 4 components migrated to StatsGridCard
- ✅ ~210 lines of boilerplate removed
- ✅ All tests pass (unit + accessibility)
- ✅ Manual testing confirms functionality unchanged
- ✅ Documentation updated

## Questions?

- Review [CLAUDE.md](../../CLAUDE.md) for project conventions
- Check [reference-checklists.md](reference-checklists.md) for common issues
- See main overview for prerequisites and required reading
