# Phase 2: Update Root and Mailchimp Pages (4 pages)

**Goal:** Add/update headers for root dashboard, Mailchimp landing, and two list pages

**Estimated Time:** 30-35 minutes

---

## Prerequisites

**Before starting this phase:**

- [ ] Phase 1 complete (verify: VSCode snippet exists at `.vscode/page-header.code-snippets`)
- [ ] On feature branch: `git branch --show-current` shows `feature/consistent-comment-headers`
- [ ] Phase 1 committed: `git log --oneline -2` should show snippet commit

---

## Pre-Phase Check: Verify Phase Not Already Complete

```bash
# Check if these pages already have standardized headers
head -n 15 src/app/page.tsx
head -n 15 src/app/mailchimp/page.tsx
head -n 15 src/app/mailchimp/reports/page.tsx
head -n 15 src/app/mailchimp/lists/page.tsx

# Check recent commits for this work
git log --oneline --all --grep="root.*page\|mailchimp.*page"
```

**If pages already have standard headers:**

- Inform user: "These pages already have standardized headers"
- Show examples of existing headers
- Ask: "Would you like me to verify consistency or move to Phase 3?"

---

## Pages to Update

1. `src/app/page.tsx` - Root dashboard (ADD NEW)
2. `src/app/mailchimp/page.tsx` - Mailchimp landing (ADD NEW)
3. `src/app/mailchimp/reports/page.tsx` - Reports list (UPDATE EXISTING)
4. `src/app/mailchimp/lists/page.tsx` - Lists page (ADD NEW)

---

## Task 1: Update Root Dashboard Page (`src/app/page.tsx`)

**Current state:** No header

**Add this header:**

```tsx
/**
 * Dashboard Home Page
 * Main dashboard landing page with navigation to all app sections
 *
 * @route /
 * @requires Kinde Auth
 * @features Navigation cards, Real-time status, Quick actions
 */
```

**Steps:**

1. Read current file: Use Read tool on `src/app/page.tsx`
2. Add header at the top of the file (before imports)
3. Use Edit tool to insert the header

**Validation:**

- [ ] Header added at the top of the file
- [ ] No imports or code moved/broken
- [ ] File still exports default component

---

## Task 2: Update Mailchimp Landing Page (`src/app/mailchimp/page.tsx`)

**Current state:** No header

**Add this header:**

```tsx
/**
 * Mailchimp Dashboard Page
 * Main Mailchimp section with navigation to reports, lists, and settings
 *
 * @route /mailchimp
 * @requires Mailchimp connection
 * @features Navigation cards, Connection status, Quick links
 */
```

**Steps:**

1. Read current file: Use Read tool on `src/app/mailchimp/page.tsx`
2. Add header at the top of the file
3. Use Edit tool to insert the header

**Validation:**

- [ ] Header added at the top of the file
- [ ] No imports or code moved/broken
- [ ] File still exports default component

---

## Task 3: Update Reports Page (`src/app/mailchimp/reports/page.tsx`)

**Current state:** Has existing header, needs updating to standard format

**Current header:**

```tsx
/**
 * Mailchimp Reports Page
 * Displays reports with server-side data fetching
 *
 * Issue #140: Reports page implementation following App Router patterns
 * Based on ListsPage pattern with server-side URL cleanup and proper prop handling
 * Implements Next.js best practices for error handling and layout consistency
 */
```

**Replace with standard header:**

```tsx
/**
 * Mailchimp Reports Page
 * Displays paginated list of campaign reports with filtering and search
 *
 * @route /mailchimp/reports
 * @requires Mailchimp connection
 * @features Pagination, Filtering, Real-time data, Server-side URL cleanup
 */
```

**Steps:**

1. Read current file: Use Read tool on `src/app/mailchimp/reports/page.tsx`
2. Replace the existing header with the new standard format
3. Use Edit tool to replace the header

**Validation:**

- [ ] Old header replaced with new standard format
- [ ] No imports or code moved/broken
- [ ] Key information preserved (pagination, filtering)
- [ ] Issue reference removed (not part of standard format)

---

## Task 4: Update Lists Page (`src/app/mailchimp/lists/page.tsx`)

**Current state:** No header

**Add this header:**

```tsx
/**
 * Mailchimp Lists Page
 * Displays paginated list of Mailchimp audiences (lists) with filtering
 *
 * @route /mailchimp/lists
 * @requires Mailchimp connection
 * @features Pagination, Filtering, Real-time data, Audience management
 */
```

**Steps:**

1. Read current file: Use Read tool on `src/app/mailchimp/lists/page.tsx`
2. Add header at the top of the file
3. Use Edit tool to insert the header

**Validation:**

- [ ] Header added at the top of the file
- [ ] No imports or code moved/broken
- [ ] File still exports default component

---

## Validation

Run validation commands:

```bash
# Type checking (should pass - only added comments)
pnpm type-check

# Linting (should pass - comments don't affect linting)
pnpm lint

# Quick visual check of headers
head -n 10 src/app/page.tsx
head -n 10 src/app/mailchimp/page.tsx
head -n 10 src/app/mailchimp/reports/page.tsx
head -n 10 src/app/mailchimp/lists/page.tsx
```

**Checklist:**

- [ ] All 4 pages have headers
- [ ] Headers follow standard template format
- [ ] @route paths are correct
- [ ] @requires values are accurate
- [ ] @features are relevant to each page
- [ ] `pnpm type-check` passes
- [ ] `pnpm lint` passes
- [ ] No functionality changes (header-only)

---

## Checkpoint: COMMIT

```bash
# Stage the modified files
git add src/app/page.tsx
git add src/app/mailchimp/page.tsx
git add src/app/mailchimp/reports/page.tsx
git add src/app/mailchimp/lists/page.tsx

# Commit with descriptive message
git commit -m "docs(pages): add standard headers to root and Mailchimp pages

- Add header to root dashboard page (/)
- Add header to Mailchimp landing page (/mailchimp)
- Update reports page header to standard format
- Add header to lists page
- All headers follow standard template with route, requires, features"

# Verify commit
git log --oneline -1
git show --stat
```

**Verification:**

- [ ] Commit created successfully
- [ ] Commit includes all 4 modified pages
- [ ] Commit message follows conventional format

---

## 🛑 STOP HERE

**Phase 2 Complete!**

**What we accomplished:**

- ✅ Updated 4 pages with standardized headers
- ✅ Root dashboard page header added
- ✅ Mailchimp landing page header added
- ✅ Reports page header updated to standard format
- ✅ Lists page header added
- ✅ All headers follow the template format

**Progress:** 4/13 pages complete (31%)

**Before continuing:**

1. ✅ Code committed
2. ✅ Validation commands pass
3. ✅ Manual review of headers complete

**💰 Cost Optimization:** Safe to clear conversation now

- Phase 2 is committed and validated
- Next phase (dynamic route pages) is independent
- Can start fresh with just the execution plan

**Next Steps:**

- Clear conversation if desired
- User: "Start Phase 3" or open [phase-3-checklist.md](phase-3-checklist.md)

**DO NOT PROCEED** to Phase 3 without user confirmation.
