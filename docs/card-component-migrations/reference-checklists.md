# Reference Checklists and Procedures

This document contains reusable checklists, procedures, and troubleshooting guides for the Card component migrations.

---

## Table of Contents

1. [Manual Review Checklist](#manual-review-checklist)
2. [Push and PR Strategy](#push-and-pr-strategy)
3. [Rollback Procedures](#rollback-procedures)
4. [Common Issues and Solutions](#common-issues-and-solutions)
5. [Post-Merge Tasks](#post-merge-tasks)

---

## Manual Review Checklist

Use this before pushing to origin.

### Code Quality

- [ ] **No debug code**
  - [ ] No `console.log` statements
  - [ ] No `debugger` statements
  - [ ] No commented-out code blocks
  - [ ] No TODO comments without GitHub issue references

- [ ] **Clean imports**
  - [ ] No unused imports
  - [ ] All imports use path aliases (`@/components`, `@/types`, etc.)
  - [ ] Imports organized (React first, then external, then internal)

- [ ] **Type safety**
  - [ ] No `any` types (unless explicitly necessary)
  - [ ] All component props properly typed
  - [ ] Type checking passes: `pnpm type-check`

### Component Quality

- [ ] **StatsGridCard usage correct**
  - [ ] `title` prop provided
  - [ ] `icon` prop provided (Lucide icon component)
  - [ ] `iconColor` prop provided (text-\* class)
  - [ ] `stats` array correct structure: `{ value, label }[]`
  - [ ] `columns` prop set appropriately (1-4)
  - [ ] `footer` prop used for additional content (if needed)
  - [ ] `className` prop passed through (if original had it)

- [ ] **Functionality preserved**
  - [ ] All original metrics displayed
  - [ ] Number formatting maintained (`.toLocaleString()`, custom formatters)
  - [ ] All calculations correct (percentages, rates, etc.)
  - [ ] Icons match original (or sensibly consolidated)
  - [ ] Colors match original intent

- [ ] **JSDoc comments updated**
  - [ ] Component header mentions migration
  - [ ] Example: "Migrated to StatsGridCard for consistency and reduced boilerplate"

### Testing

- [ ] **All tests pass**
  - [ ] Unit tests: `pnpm test`
  - [ ] Accessibility tests: `pnpm test:a11y`
  - [ ] Type checking: `pnpm type-check`
  - [ ] Linting: `pnpm lint`
  - [ ] Full validation: `pnpm validate`

- [ ] **Manual testing complete**
  - [ ] Component renders in browser
  - [ ] All metrics display correctly
  - [ ] Responsive behavior works
  - [ ] No console errors
  - [ ] Accessibility tested (keyboard navigation, screen reader)

### Documentation

- [ ] **Component documentation**
  - [ ] JSDoc comments accurate
  - [ ] Migration mentioned in component file
  - [ ] Props documented (if changed)

- [ ] **Project documentation**
  - [ ] CLAUDE.md updated with examples (Phase 5)
  - [ ] Migration guide created (if applicable)

### Git Hygiene

- [ ] **Commits clean**
  - [ ] Commit messages follow convention: `refactor(scope): description`
  - [ ] Each commit has clear purpose
  - [ ] No "WIP" or "fix" commits without squashing

- [ ] **Branch correct**
  - [ ] On feature branch: `git branch --show-current` shows `feature/card-component-migrations`
  - [ ] All changes committed: `git status` shows clean working tree
  - [ ] No untracked files (except intentional)

- [ ] **Changes reviewed**
  - [ ] Review full diff: `git diff main`
  - [ ] All changes intentional
  - [ ] No accidental file changes

---

## Push and PR Strategy

### Pre-Push Final Checks

```bash
# 1. Ensure on correct branch
git branch --show-current
# Expected: feature/card-component-migrations

# 2. Final validation
pnpm validate
# Expected: All checks pass

# 3. Review commit history
git log --oneline main..HEAD
# Expected: ~6 commits (init + 4 migrations + docs)

# 4. Review all changes
git diff main --stat
# Expected: 4 component files + CLAUDE.md modified

# 5. Verify no uncommitted changes
git status
# Expected: nothing to commit, working tree clean
```

### Pushing to Origin

```bash
# First push - create remote branch
git push -u origin feature/card-component-migrations

# Subsequent pushes (if needed)
git push
```

**Expected output:**

```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
...
To github.com:a4og5n/another-dashboard.git
 * [new branch]      feature/card-component-migrations -> feature/card-component-migrations
Branch 'feature/card-component-migrations' set up to track remote branch...
```

### Creating Pull Request

**Using GitHub CLI:**

```bash
gh pr create \
  --title "refactor: migrate dashboard components to standardized Cards" \
  --body "$(cat <<'EOF'
## Summary

Migrates 4 dashboard components to use the new standardized Card components (StatsGridCard) from PR #192, reducing boilerplate and improving consistency.

## Changes

**Components Migrated:**
- ✅ `SocialEngagementCard` - 3 metrics, vertical layout (~38 lines saved)
- ✅ `ForwardsCard` - 2 metrics with footer context (~42 lines saved)
- ✅ `ClicksCard` - 3 metrics with complex footer (~60 lines saved)
- ✅ `ListStats` - Consolidated 3 cards into 1 (~72 lines saved)

**Documentation:**
- ✅ Added migration examples to CLAUDE.md
- ✅ Created migration decision guide
- ✅ Documented real results and benefits

**Impact:**
- **Total lines saved:** ~210 lines of boilerplate
- **Breaking changes:** None - all functionality preserved
- **Test coverage:** Maintained at 100%
- **Accessibility:** WCAG 2.1 AA compliance maintained

## Testing

- [x] All unit tests pass (`pnpm test`)
- [x] Accessibility tests pass (`pnpm test:a11y`)
- [x] Type checking passes (`pnpm type-check`)
- [x] Linting passes (`pnpm lint`)
- [x] Full validation passes (`pnpm validate`)
- [x] Manual browser testing complete for all 4 components
- [x] Responsive behavior verified
- [x] No console errors

## Benefits

- ✅ Consistent card styling across dashboard
- ✅ Easier to maintain (centralized component logic)
- ✅ Reduced code duplication
- ✅ Faster development for new dashboard cards
- ✅ Built-in accessibility features
- ✅ Full TypeScript type safety

## Checklist

- [x] Code follows project patterns (path aliases, type safety)
- [x] All tests pass
- [x] No breaking changes
- [x] Documentation updated
- [x] JSDoc comments updated
- [x] All functionality preserved
- [x] Manual testing complete

## Related

- Builds on: PR #192 (Add standardized Card components)
- Related issue: Card component standardization analysis

## Screenshots

Before/After examples (optional):
- Campaign report page with migrated cards
- Lists page with migrated ListStats

EOF
)"
```

**Using GitHub Web UI:**

1. Go to: https://github.com/a4og5n/another-dashboard/pulls
2. Click "New Pull Request"
3. Base: `main` | Compare: `feature/card-component-migrations`
4. Fill in the PR template (use the body content from above)
5. Click "Create Pull Request"

**PR Title:**

```
refactor: migrate dashboard components to standardized Cards
```

---

## Rollback Procedures

### Before Pushing (Local Only)

**Undo last commit (keep changes):**

```bash
git reset --soft HEAD~1
```

**Undo last commit (discard changes):**

```bash
git reset --hard HEAD~1
```

**Undo multiple commits:**

```bash
# See commit history
git log --oneline

# Reset to specific commit (keep changes)
git reset --soft <commit-hash>

# Reset to specific commit (discard changes)
git reset --hard <commit-hash>
```

**Undo specific file changes:**

```bash
# Restore file from main branch
git checkout main -- path/to/file.tsx

# Or restore from specific commit
git checkout <commit-hash> -- path/to/file.tsx
```

### After Pushing (Remote Branch Exists)

**Revert last commit (safe, preserves history):**

```bash
git revert HEAD
git push
```

**Revert specific commit:**

```bash
git revert <commit-hash>
git push
```

**Force push to undo (DANGEROUS - only if nobody else has pulled):**

```bash
git reset --hard <commit-hash>
git push --force
```

⚠️ **Warning:** Only use force push if:

- No one else has pulled your branch
- You're absolutely sure you want to discard commits
- You've confirmed the commit hash is correct

### After Merge (PR Merged to Main)

**Option 1: Revert the merge commit (safest):**

```bash
# Fetch latest main
git checkout main
git pull origin main

# Find the merge commit
git log --oneline --merges -5

# Revert the merge
git revert -m 1 <merge-commit-hash>
git push origin main
```

**Option 2: Create new PR to undo changes:**

```bash
# Create revert branch
git checkout main
git pull origin main
git checkout -b revert/card-migrations

# Manually restore old files
git checkout <commit-before-merge> -- path/to/file1.tsx
git checkout <commit-before-merge> -- path/to/file2.tsx

# Commit and push
git commit -m "revert: restore original card implementations"
git push -u origin revert/card-migrations

# Create PR
gh pr create --title "revert: restore original card implementations"
```

---

## Common Issues and Solutions

### Issue: TypeScript Errors After Migration

**Symptom:** `pnpm type-check` fails with type errors

**Possible causes:**

1. StatsGridCard import path incorrect
2. Stats array structure wrong
3. Missing required props
4. Type mismatch in value field

**Solutions:**

```bash
# Check import path
grep "StatsGridCard" src/components/ui/stats-grid-card.tsx
# Import should be: import { StatsGridCard } from "@/components/ui/stats-grid-card";

# Verify stats array structure
# Should be: Array<{ value: string | number; label: string }>

# Check required props
# Required: title, icon, stats
# Optional: iconColor, columns, footer, className
```

### Issue: Card Doesn't Display in Browser

**Symptom:** Blank space where card should be, or no card at all

**Possible causes:**

1. Component not imported in parent
2. StatsGridCard not exported correctly
3. Props undefined
4. Conditional rendering hiding it

**Debug steps:**

```bash
# Check browser console for errors
# Look for import errors or prop warnings

# Verify parent component imports
grep -n "import.*Card" src/app/path/to/page.tsx

# Check if props are defined
# Add console.log temporarily to see values
```

### Issue: Styling Doesn't Match Original

**Symptom:** Card looks different from original (colors, spacing, layout)

**Possible causes:**

1. iconColor not set correctly
2. columns prop wrong value
3. Missing className prop
4. Footer styling not preserved

**Solutions:**

```bash
# Compare original and new side-by-side
git diff main -- path/to/component.tsx

# Check iconColor prop
# Should be: iconColor="text-blue-600" (not "blue-600" or "#blue")

# Verify columns matches layout
# 1 = vertical, 2 = two columns, 3 = three columns

# Ensure className passed through
# <StatsGridCard ... className={className} />
```

### Issue: Number Formatting Not Working

**Symptom:** Numbers display without thousands separators or wrong format

**Possible causes:**

1. Forgot `.toLocaleString()` in value
2. Custom formatter not called
3. Value is string instead of number

**Solutions:**

```tsx
// Ensure toLocaleString() is called
stats={[
  {
    value: myNumber.toLocaleString(), // ✅ Correct
    label: "My Metric"
  }
]}

// For custom formatters
const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
};

stats={[
  {
    value: formatNumber(myNumber), // ✅ Correct
    label: "My Metric"
  }
]}
```

### Issue: Footer Content Not Showing

**Symptom:** Additional content below metrics doesn't appear

**Possible causes:**

1. Footer prop not provided
2. Footer content has wrong structure
3. StatsGridCard doesn't support footer

**Solutions:**

```tsx
// Ensure footer prop is used
<StatsGridCard
  title="My Card"
  icon={MyIcon}
  stats={[...]}
  footer={  // ✅ Add this
    <div>
      {/* Footer content */}
    </div>
  }
/>

// Preserve original styling in footer
footer={
  <div className="pt-2 border-t">  // ✅ Keep original classes
    {/* Original footer content */}
  </div>
}
```

### Issue: Tests Failing After Migration

**Symptom:** `pnpm test` shows failures

**Possible causes:**

1. Tests check for specific Card structure
2. Tests query by specific class names
3. Tests expect specific HTML structure

**Solutions:**

```bash
# Identify failing tests
pnpm test 2>&1 | grep "FAIL"

# Read the failing test
cat path/to/failing.test.tsx

# Update test queries if needed
# OLD: screen.getByRole('heading', { name: /email clicks/i })
# NEW: screen.getByText('Email Clicks')

# Or update snapshots if using snapshot tests
pnpm test -u
```

### Issue: Responsive Layout Broken

**Symptom:** Cards don't stack properly on mobile

**Possible causes:**

1. StatsGridCard has built-in responsive behavior
2. Parent container has conflicting styles
3. Columns prop forces desktop layout

**Solutions:**

```bash
# Test in browser at different widths
# Resize to 375px (mobile), 768px (tablet), 1024px (desktop)

# StatsGridCard auto-handles responsive:
# - 1 column on mobile
# - Specified columns on desktop

# If issues persist, check parent container
# Remove any conflicting grid or flex styles
```

---

## Post-Merge Tasks

After the PR is merged to main:

### 1. Update Local Repository

```bash
# Switch to main
git checkout main

# Pull latest changes
git pull origin main

# Verify merge is included
git log --oneline -10
# Should see merge commit with your changes
```

### 2. Delete Feature Branch

```bash
# Delete local branch
git branch -d feature/card-component-migrations

# Delete remote branch (if not auto-deleted)
git push origin --delete feature/card-component-migrations

# Prune deleted remote branches
git fetch --prune
```

### 3. Verify Deployment

If your project has automatic deployment:

```bash
# Check deployment status
gh pr view <pr-number> --web

# Or visit deployment URL
# Verify all migrated components work in production
```

**Test in production:**

- [ ] SocialEngagementCard displays correctly
- [ ] ForwardsCard displays correctly
- [ ] ClicksCard displays correctly
- [ ] ListStats displays correctly
- [ ] No console errors in production
- [ ] Responsive behavior works

### 4. Update Project Tracking

If using project management:

- [ ] Mark migration task as complete
- [ ] Update project dashboard with results
- [ ] Close related GitHub issues
- [ ] Update any related documentation

### 5. Share Results

Consider sharing results with team:

**Metrics to share:**

- Components migrated: 4
- Lines saved: ~210
- Time taken: ~1.5-2 hours
- Breaking changes: 0
- Test coverage: Maintained
- Accessibility: Maintained

**Template:**

```markdown
## Card Component Migrations Complete ✅

Successfully migrated 4 dashboard components to use standardized Cards:

- SocialEngagementCard
- ForwardsCard
- ClicksCard
- ListStats

**Results:**

- 📉 ~210 lines of boilerplate removed
- ⚡ Faster development for new cards
- ♿ Accessibility maintained (WCAG 2.1 AA)
- ✅ All tests passing
- 🚀 Zero breaking changes

See PR #XXX for details.
```

### 6. Plan Next Steps

Consider next improvements:

- [ ] Identify other components that could use standardized Cards
- [ ] Create more examples in Storybook (if using)
- [ ] Document lessons learned
- [ ] Update component library documentation
- [ ] Train team on new patterns

---

## Emergency Contacts

If something goes wrong and you need help:

**Git Issues:**

- Uncommitted changes: `git stash` to save, `git stash pop` to restore
- Wrong branch: `git checkout <correct-branch>`
- Lost changes: `git reflog` to find lost commits

**Build Issues:**

- Clear cache: `pnpm clean && rm -rf node_modules && pnpm install`
- Check Node version: `node --version` (should be v24.7.0)
- Check pnpm version: `pnpm --version` (should be v10.15.0)

**Testing Issues:**

- Clear test cache: `pnpm test --clearCache`
- Run specific test: `pnpm test path/to/test.tsx`
- Debug test: Add `console.log` and run with `--verbose`

**When All Else Fails:**

- Start fresh: Delete branch and start over
- Restore from backup: Use git reset to restore to known good state
- Ask for review: Push WIP branch and request team review

---

## Useful Commands Reference

**Git:**

```bash
git status                                  # Check current state
git branch --show-current                   # Show current branch
git log --oneline -10                       # Recent commits
git diff main                               # Compare with main
git reset --soft HEAD~1                     # Undo last commit (keep changes)
git reset --hard HEAD~1                     # Undo last commit (discard changes)
git stash                                   # Save uncommitted changes
git stash pop                               # Restore stashed changes
git reflog                                  # Show all HEAD changes (recovery)
```

**Testing:**

```bash
pnpm test                                   # Run all tests
pnpm test path/to/test                      # Run specific test
pnpm test:watch                             # Watch mode
pnpm test:coverage                          # Coverage report
pnpm test:a11y                              # Accessibility tests
pnpm type-check                             # TypeScript checking
pnpm lint                                   # Run ESLint
pnpm lint:fix                               # Auto-fix lint issues
pnpm validate                               # Full validation suite
```

**Development:**

```bash
pnpm dev                                    # Start dev server
pnpm build                                  # Production build
pnpm start                                  # Start production server
pnpm clean                                  # Clean build artifacts
```

---

**End of Reference Checklists**

Return to: [Main Execution Plan](../execution-plan-card-migrations.md)
