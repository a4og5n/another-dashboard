# Phase 3: Update Dynamic Route Pages (5 pages)

**Goal:** Add/update headers for all pages with dynamic route segments ([id])

**Estimated Time:** 35-40 minutes

---

## Prerequisites

**Before starting this phase:**

- [ ] Phase 2 complete (verify: 4 pages have standard headers)
- [ ] On feature branch: `git branch --show-current` shows `feature/consistent-comment-headers`
- [ ] Phase 2 committed: `git log --oneline -2` should show Phase 2 commit

---

## Pre-Phase Check: Verify Phase Not Already Complete

```bash
# Check if these pages already have standardized headers
head -n 15 src/app/mailchimp/reports/[id]/page.tsx
head -n 15 src/app/mailchimp/reports/[id]/opens/page.tsx
head -n 15 src/app/mailchimp/reports/[id]/abuse-reports/page.tsx
head -n 15 src/app/mailchimp/lists/[id]/page.tsx
head -n 15 src/app/mailchimp/general-info/page.tsx

# Check recent commits for this work
git log --oneline --all --grep="dynamic.*page\|detail.*page"
```

**If pages already have standard headers:**

- Inform user: "These pages already have standardized headers"
- Ask: "Would you like me to verify consistency or move to Phase 4?"

---

## Pages to Update

1. `src/app/mailchimp/reports/[id]/page.tsx` - Campaign report detail (UPDATE EXISTING)
2. `src/app/mailchimp/reports/[id]/opens/page.tsx` - Report opens (ADD NEW)
3. `src/app/mailchimp/reports/[id]/abuse-reports/page.tsx` - Abuse reports (ADD NEW)
4. `src/app/mailchimp/lists/[id]/page.tsx` - List detail (ADD NEW)
5. `src/app/mailchimp/general-info/page.tsx` - General info (UPDATE EXISTING)

---

## Task 1: Update Campaign Report Detail Page

**File:** `src/app/mailchimp/reports/[id]/page.tsx`

**Current state:** Has existing header with issue reference

**Current header:**

```tsx
/**
 * Campaign Report Detail Page
 * Server component that fetches campaign report data and displays detailed analytics
 *
 * Issue #135: Agent 4 - Campaign report detail routing and pages
 * Following Next.js 15 App Router patterns and established page structures
 */
```

**Replace with standard header:**

```tsx
/**
 * Campaign Report Detail Page
 * Displays detailed analytics and metrics for a specific campaign report
 *
 * @route /mailchimp/reports/[id]
 * @requires Mailchimp connection
 * @features Dynamic routing, Tab navigation, Real-time metrics, Export data
 */
```

**Steps:**

1. Read current file
2. Replace existing header with new standard format
3. Use Edit tool to replace the header

**Validation:**

- [ ] Header updated to standard format
- [ ] Dynamic route `[id]` shown in @route
- [ ] Issue reference removed

---

## Task 2: Update Report Opens Page

**File:** `src/app/mailchimp/reports/[id]/opens/page.tsx`

**Current state:** No header

**Add this header:**

```tsx
/**
 * Campaign Opens Detail Page
 * Displays list of members who opened a specific campaign
 *
 * @route /mailchimp/reports/[id]/opens
 * @requires Mailchimp connection
 * @features Pagination, Dynamic routing, Member details, Export data
 */
```

**Steps:**

1. Read current file
2. Add header at the top of the file
3. Use Edit tool to insert the header

**Validation:**

- [ ] Header added at the top
- [ ] Nested dynamic route shown correctly
- [ ] No imports or code moved/broken

---

## Task 3: Update Abuse Reports Page

**File:** `src/app/mailchimp/reports/[id]/abuse-reports/page.tsx`

**Current state:** No header

**Add this header:**

```tsx
/**
 * Campaign Abuse Reports Page
 * Displays abuse reports and complaints for a specific campaign
 *
 * @route /mailchimp/reports/[id]/abuse-reports
 * @requires Mailchimp connection
 * @features Pagination, Dynamic routing, Abuse report details, Export data
 */
```

**Steps:**

1. Read current file
2. Add header at the top of the file
3. Use Edit tool to insert the header

**Validation:**

- [ ] Header added at the top
- [ ] Nested dynamic route shown correctly
- [ ] No imports or code moved/broken

---

## Task 4: Update List Detail Page

**File:** `src/app/mailchimp/lists/[id]/page.tsx`

**Current state:** No header

**Add this header:**

```tsx
/**
 * Mailchimp List Detail Page
 * Displays detailed information and stats for a specific Mailchimp audience (list)
 *
 * @route /mailchimp/lists/[id]
 * @requires Mailchimp connection
 * @features Dynamic routing, List metrics, Member stats, Real-time data
 */
```

**Steps:**

1. Read current file
2. Add header at the top of the file
3. Use Edit tool to insert the header

**Validation:**

- [ ] Header added at the top
- [ ] Dynamic route `[id]` shown in @route
- [ ] No imports or code moved/broken

---

## Task 5: Update General Info Page

**File:** `src/app/mailchimp/general-info/page.tsx`

**Current state:** Has existing header with issue reference

**Current header:**

```tsx
/**
 * Mailchimp General Info Page (OAuth-based)
 * Displays general information from the API Root endpoint
 *
 * Issue #122: General Info navigation and routing
 * Uses components from: @/components/mailchimp/general-info
 * Uses MailchimpConnectionGuard for automatic connection validation
 */
```

**Replace with standard header:**

```tsx
/**
 * Mailchimp General Info Page
 * Displays general account information and API statistics from Mailchimp
 *
 * @route /mailchimp/general-info
 * @requires Mailchimp connection
 * @features Account info, API stats, Connection status, Real-time data
 */
```

**Steps:**

1. Read current file
2. Replace existing header with new standard format
3. Use Edit tool to replace the header

**Validation:**

- [ ] Header updated to standard format
- [ ] Issue reference removed
- [ ] OAuth-based note removed (not part of standard)

---

## Validation

Run validation commands:

```bash
# Type checking (should pass - only added comments)
pnpm type-check

# Linting (should pass - comments don't affect linting)
pnpm lint

# Quick visual check of headers
head -n 10 src/app/mailchimp/reports/[id]/page.tsx
head -n 10 src/app/mailchimp/reports/[id]/opens/page.tsx
head -n 10 src/app/mailchimp/reports/[id]/abuse-reports/page.tsx
head -n 10 src/app/mailchimp/lists/[id]/page.tsx
head -n 10 src/app/mailchimp/general-info/page.tsx
```

**Checklist:**

- [ ] All 5 pages have headers
- [ ] Headers follow standard template format
- [ ] Dynamic routes shown correctly with `[id]`
- [ ] Nested routes shown correctly (e.g., `/reports/[id]/opens`)
- [ ] @requires values are accurate
- [ ] @features are relevant to each page
- [ ] `pnpm type-check` passes
- [ ] `pnpm lint` passes
- [ ] No functionality changes (header-only)

---

## Checkpoint: COMMIT

```bash
# Stage the modified files
git add src/app/mailchimp/reports/[id]/page.tsx
git add src/app/mailchimp/reports/[id]/opens/page.tsx
git add src/app/mailchimp/reports/[id]/abuse-reports/page.tsx
git add src/app/mailchimp/lists/[id]/page.tsx
git add src/app/mailchimp/general-info/page.tsx

# Commit with descriptive message
git commit -m "docs(pages): add standard headers to dynamic route pages

- Update campaign report detail page header
- Add header to report opens page
- Add header to abuse reports page
- Add header to list detail page
- Update general info page header to standard format
- All headers show dynamic routes correctly with [id] syntax"

# Verify commit
git log --oneline -1
git show --stat
```

**Verification:**

- [ ] Commit created successfully
- [ ] Commit includes all 5 modified pages
- [ ] Commit message follows conventional format

---

## 🛑 STOP HERE

**Phase 3 Complete!**

**What we accomplished:**

- ✅ Updated 5 pages with standardized headers
- ✅ All dynamic route pages now have headers
- ✅ Updated 2 existing headers to standard format
- ✅ Added 3 new headers
- ✅ All headers follow the template format

**Progress:** 9/13 pages complete (69%)

**Before continuing:**

1. ✅ Code committed
2. ✅ Validation commands pass
3. ✅ Manual review of headers complete

**💰 Cost Optimization:** Safe to clear conversation now

- Phase 3 is committed and validated
- Next phase (settings and auth pages) is independent
- Can start fresh with just the execution plan

**Next Steps:**

- Clear conversation if desired
- User: "Start Phase 4" or open [phase-4-checklist.md](phase-4-checklist.md)

**DO NOT PROCEED** to Phase 4 without user confirmation.
