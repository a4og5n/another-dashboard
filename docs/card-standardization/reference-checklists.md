# Reference: Checklists and Strategies

This document contains reference material for the Card Component Standardization project.

---

## Manual Review Checklist

Use this checklist before pushing to origin.

### Code Quality

#### Type Safety

- [ ] No `any` types used
- [ ] All props have proper TypeScript interfaces
- [ ] All types defined in `/src/types/components/ui/`
- [ ] Types exported through barrel exports (`index.ts`)

#### Code Review

- [ ] All components have JSDoc comments
- [ ] No console.logs or debug statements
- [ ] No commented-out code
- [ ] Follows project conventions (path aliases, barrel exports)
- [ ] DisplayName set for all components

#### Component Architecture

- [ ] All imports use path aliases (`@/components`, `@/types`)
- [ ] Loading states implemented with Skeleton
- [ ] Accessibility attributes included
- [ ] Responsive design considered

### Testing

#### Unit Tests

- [ ] All new components have unit tests
- [ ] Test coverage is comprehensive (render, props, edge cases)
- [ ] All tests pass: `pnpm test`

#### Accessibility Tests

- [ ] axe-core tests included for all components
- [ ] No a11y violations reported
- [ ] Keyboard navigation tested

#### Architectural Tests

- [ ] Architectural enforcement tests pass
- [ ] Types properly organized in `/src/types/`
- [ ] No deprecated patterns used

#### Manual Testing

- [ ] Components render correctly in isolation
- [ ] Migrated components show no visual regressions
- [ ] Loading states work correctly
- [ ] No console errors in browser

### Documentation

#### Component Documentation

- [ ] JSDoc comments on all components
- [ ] Usage examples in JSDoc
- [ ] Props documented with descriptions

#### Project Documentation

- [ ] CLAUDE.md updated with patterns
- [ ] Usage examples included
- [ ] Migration guidance provided

### Git Hygiene

#### Review Changes

- [ ] Review all changes: `git diff main`
- [ ] All commits follow conventional commit format
- [ ] Each commit leaves codebase in working state
- [ ] No unintended files staged

#### Branch Validation

- [ ] On correct feature branch: `git branch --show-current`
- [ ] All changes committed
- [ ] Commit messages are descriptive

---

## Push and PR Strategy

### Before Pushing

```bash
# Final validation
pnpm validate

# Review commit history
git log --oneline main..HEAD

# Review all changes
git diff main

# Ensure you're on the correct branch
git branch --show-current
```

### Pushing to Origin

```bash
# First push of new branch
git push -u origin feature/card-component-standardization

# Subsequent pushes (if needed)
git push
```

### Creating a Pull Request

**PR Title:**

```
feat: add standardized Card components for metric display
```

**PR Description:**

```markdown
## Summary

Creates three standardized Card components to eliminate code duplication across 20+ Card instances throughout the project. These components provide consistent patterns for metric display, reducing boilerplate by ~400 lines of code (when fully migrated).

## Changes

**New Components:**

- Created `StatCard` component for simple metric display
- Created `StatsGridCard` component for multi-stat grid layouts
- Created `StatusCard` component for status with badge and metrics
- Added comprehensive TypeScript types for all components
- Added unit tests and accessibility tests (100% coverage)

**Migrations:**

- Migrated `EmailsSentCard` to use `StatCard` pattern (41% code reduction)
- Updated `CLAUDE.md` with Card component patterns and usage guidelines

**Impact:**

- ~12 lines saved in EmailsSentCard migration
- ~400 lines of code eliminated across existing components (when fully migrated)
- ~50% faster to create new card-based features
- Consistent styling and behavior across all metric cards
- Built-in accessibility and responsive design

## Testing

- [x] Unit tests pass (36+ new tests)
- [x] Accessibility tests pass (no violations)
- [x] Type checking passes
- [x] Architectural enforcement tests pass
- [x] Manual testing completed in browser
- [x] No visual regressions

## Checklist

- [x] Code follows project patterns (path aliases, barrel exports)
- [x] Types defined in `/src/types/components/ui/`
- [x] Tests added with full coverage
- [x] JSDoc documentation on all components
- [x] No breaking changes
- [x] Documentation updated (CLAUDE.md)

## Files Created

**Types (3 files):**

- `src/types/components/ui/stat-card.ts`
- `src/types/components/ui/stats-grid-card.ts`
- `src/types/components/ui/status-card.ts`

**Components (6 files):**

- `src/components/ui/stat-card.tsx` + `.test.tsx`
- `src/components/ui/stats-grid-card.tsx` + `.test.tsx`
- `src/components/ui/status-card.tsx` + `.test.tsx`

**Modified (4 files):**

- `src/types/components/ui/index.ts`
- `src/components/dashboard/reports/EmailsSentCard.tsx`
- `src/components/dashboard/reports/OpensCard.tsx` (added migration notes)
- `CLAUDE.md`

## Related

- Pattern analysis: Card component patterns across codebase
- Future work: Migrate remaining 15+ Card components
- Estimated additional savings: ~300 LOC when remaining components migrated
```

---

## Rollback Strategy

### If Something Goes Wrong

#### Rollback Last Commit (not pushed)

```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Undo last commit and discard changes (DANGEROUS)
git reset --hard HEAD~1
```

#### Rollback to Specific Phase

```bash
# See commit history
git log --oneline

# Find the commit hash of the phase you want to return to
# Example: To go back to Phase 2 completion

# Rollback but keep changes (safe)
git reset --soft <commit-hash-of-phase-2>

# Rollback and discard changes (DANGEROUS)
git reset --hard <commit-hash-of-phase-2>
```

#### Rollback After Pushing

```bash
# Create a revert commit (safe, preserves history)
git revert <commit-hash>
git push

# For reverting multiple commits
git revert <oldest-commit>..<newest-commit>
git push
```

#### Emergency: Discard All Changes

```bash
# Stash current changes (can recover later)
git stash

# To recover stashed changes
git stash pop

# Or discard completely (CANNOT UNDO)
git checkout .
git clean -fd  # Remove untracked files
```

#### Rollback Specific Phase

If a specific phase needs to be undone while keeping others:

```bash
# Example: Undo Phase 4 (migration) but keep Phases 1-3

# Find the commits for Phase 4
git log --oneline --grep="Phase 4"

# Revert the Phase 4 commits
git revert <phase-4-commit-hash>

# Or manually undo changes to specific files
git checkout <commit-before-phase-4> -- src/components/dashboard/reports/EmailsSentCard.tsx
git commit -m "revert: undo EmailsSentCard migration"
```

---

## Post-Merge Tasks

After PR is merged:

### Cleanup

- [ ] Update local main branch: `git checkout main && git pull origin main`
- [ ] Delete feature branch locally: `git branch -d feature/card-component-standardization`
- [ ] Delete feature branch remotely: `git push origin --delete feature/card-component-standardization`

### Documentation

- [ ] Update project documentation with completion status
- [ ] Share Card component patterns with team
- [ ] Add to team knowledge base or wiki

### Follow-up (Optional)

- [ ] Create follow-up issues for remaining component migrations
- [ ] Schedule team review of new Card components
- [ ] Plan migration timeline for remaining 15+ components

---

## Common Issues and Solutions

### Issue: Tests fail in CI but pass locally

```bash
# Clear all caches
pnpm store prune
rm -rf node_modules
rm -rf .next

# Reinstall
pnpm install

# Run tests in same environment as CI
pnpm test --run
```

### Issue: Type errors after merging main into feature branch

```bash
# Update feature branch with main
git checkout main
git pull origin main
git checkout feature/card-component-standardization
git merge main

# Fix any merge conflicts
# Run type check
pnpm type-check

# Fix type errors and commit
```

### Issue: Architectural tests fail

```bash
# Check where types are defined
find src -name "stat-card.ts" -o -name "stats-grid-card.ts" -o -name "status-card.ts"

# They should all be in src/types/components/ui/
# If not, move them:
git mv src/components/ui/stat-card.types.ts src/types/components/ui/stat-card.ts

# Run tests again
pnpm test src/test/architectural-enforcement/
```

### Issue: PR checks fail

1. **Check which check failed** in GitHub PR interface
2. **Run the same check locally:**
   - Lint: `pnpm lint`
   - Type: `pnpm type-check`
   - Test: `pnpm test`
   - Build: `pnpm build`
3. **Fix the issue and push:**
   ```bash
   # Fix the issue
   git add .
   git commit -m "fix: resolve PR check failure"
   git push
   ```

### Issue: Merge conflicts when PR is ready to merge

```bash
# Update feature branch with latest main
git checkout main
git pull origin main
git checkout feature/card-component-standardization
git merge main

# Resolve conflicts in your editor
# Then:
git add .
git commit -m "chore: resolve merge conflicts with main"
git push
```

---

## Future Enhancement Ideas

After completing this project, consider:

### Additional Card Components

- **ComparisonCard** - Side-by-side metric comparison
- **TrendCard** - Historical trend visualization
- **AlertCard** - Warning/error card with actions
- **EmptyStateCard** - Standardized empty state display

### Tooling

- **Card Component Generator** - CLI tool to scaffold new card components
- **Migration Script** - Automated detection and migration of card patterns
- **Storybook Stories** - Interactive documentation for all card components

### Documentation

- **Migration Guide** - Detailed before/after examples for all patterns
- **Design System** - Add cards to project design system documentation
- **Video Tutorial** - Screen recording showing card component usage

---

## Contact and Support

If you encounter issues during this project:

1. **Check this reference document** first
2. **Review the specific phase document** you're working on
3. **Check git history** for similar situations: `git log --grep="card"`
4. **Ask for help** from team members familiar with the codebase

---

**End of Reference Document**
