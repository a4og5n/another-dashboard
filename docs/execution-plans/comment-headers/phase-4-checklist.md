# Phase 4: Update Settings and Auth Pages (4 pages)

**Goal:** Complete remaining pages - settings, authentication, and example pages

**Estimated Time:** 25-30 minutes

---

## Prerequisites

**Before starting this phase:**

- [ ] Phase 3 complete (verify: 9 pages have standard headers)
- [ ] On feature branch: `git branch --show-current` shows `feature/consistent-comment-headers`
- [ ] Phase 3 committed: `git log --oneline -2` should show Phase 3 commit

---

## Pre-Phase Check: Verify Phase Not Already Complete

```bash
# Check if these pages already have standardized headers
head -n 15 src/app/settings/integrations/page.tsx
head -n 15 src/app/login/page.tsx
head -n 15 src/app/auth-error/page.tsx
head -n 15 src/app/example/page.tsx

# Check recent commits for this work
git log --oneline --all --grep="settings.*page\|auth.*page"
```

**If pages already have standard headers:**

- Inform user: "These pages already have standardized headers"
- Ask: "Would you like me to verify consistency or move to Phase 5?"

---

## Pages to Update

1. `src/app/settings/integrations/page.tsx` - Settings integrations (UPDATE EXISTING)
2. `src/app/login/page.tsx` - Login page (ADD NEW)
3. `src/app/auth-error/page.tsx` - Auth error page (ADD NEW)
4. `src/app/example/page.tsx` - Example page (ADD NEW)

---

## Task 1: Update Settings Integrations Page

**File:** `src/app/settings/integrations/page.tsx`

**Current state:** Has minimal header

**Current header:**

```tsx
/**
 * Settings - Integrations Page
 * Centralized management for all OAuth connections and API integrations
 */
```

**Replace with standard header:**

```tsx
/**
 * Settings - Integrations Page
 * Manage OAuth connections and API integrations for third-party services
 *
 * @route /settings/integrations
 * @requires Kinde Auth
 * @features OAuth management, Connection status, Connect/disconnect actions
 */
```

**Steps:**

1. Read current file
2. Replace existing header with new standard format
3. Use Edit tool to replace the header

**Validation:**

- [ ] Header updated to standard format
- [ ] @route path is correct
- [ ] @requires shows Kinde Auth (not Mailchimp)
- [ ] No imports or code moved/broken

---

## Task 2: Update Login Page

**File:** `src/app/login/page.tsx`

**Current state:** No header (likely minimal - verify first)

**Add this header:**

```tsx
/**
 * Login Page
 * Authentication entry point redirecting to Kinde OAuth flow
 *
 * @route /login
 * @requires None
 * @features OAuth redirect, Post-login redirect handling
 */
```

**Steps:**

1. Read current file (may be very minimal)
2. Add header at the top of the file
3. Use Edit tool to insert the header

**Validation:**

- [ ] Header added at the top
- [ ] @requires is "None" (this is the login page)
- [ ] No imports or code moved/broken

---

## Task 3: Update Auth Error Page

**File:** `src/app/auth-error/page.tsx`

**Current state:** No header

**Add this header:**

```tsx
/**
 * Authentication Error Page
 * Displays authentication errors and provides recovery options
 *
 * @route /auth-error
 * @requires None
 * @features Error display, Recovery actions, Retry login
 */
```

**Steps:**

1. Read current file
2. Add header at the top of the file
3. Use Edit tool to insert the header

**Validation:**

- [ ] Header added at the top
- [ ] @requires is "None" (error page is public)
- [ ] No imports or code moved/broken

---

## Task 4: Update Example Page

**File:** `src/app/example/page.tsx`

**Current state:** No header (this may be a demo/test page)

**Add this header:**

```tsx
/**
 * Example Page
 * Demonstration page for testing components and patterns (development only)
 *
 * @route /example
 * @requires None
 * @features Component demos, Pattern examples, Development utilities
 */
```

**Steps:**

1. Read current file first to understand what it does
2. Add header at the top of the file (adjust description if needed)
3. Use Edit tool to insert the header

**Note:** If the example page is significantly different from described, adjust the description and features accordingly.

**Validation:**

- [ ] Header added at the top
- [ ] Description accurately reflects page purpose
- [ ] @requires is appropriate
- [ ] No imports or code moved/broken

---

## Validation

Run validation commands:

```bash
# Type checking (should pass - only added comments)
pnpm type-check

# Linting (should pass - comments don't affect linting)
pnpm lint

# Quick visual check of headers
head -n 10 src/app/settings/integrations/page.tsx
head -n 10 src/app/login/page.tsx
head -n 10 src/app/auth-error/page.tsx
head -n 10 src/app/example/page.tsx
```

**Checklist:**

- [ ] All 4 pages have headers
- [ ] Headers follow standard template format
- [ ] @route paths are correct
- [ ] @requires values are accurate (None for login/auth-error/example)
- [ ] @features are relevant to each page
- [ ] `pnpm type-check` passes
- [ ] `pnpm lint` passes
- [ ] No functionality changes (header-only)

---

## Checkpoint: COMMIT

```bash
# Stage the modified files
git add src/app/settings/integrations/page.tsx
git add src/app/login/page.tsx
git add src/app/auth-error/page.tsx
git add src/app/example/page.tsx

# Commit with descriptive message
git commit -m "docs(pages): add standard headers to settings and auth pages

- Update settings integrations page header
- Add header to login page
- Add header to auth error page
- Add header to example page
- Complete header standardization for all pages (13/13)"

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

**Phase 4 Complete!**

**What we accomplished:**

- ✅ Updated final 4 pages with standardized headers
- ✅ All settings and auth pages now have headers
- ✅ Updated 1 existing header to standard format
- ✅ Added 3 new headers
- ✅ All headers follow the template format

**Progress:** 13/13 pages complete (100%)

**🎉 All pages now have standardized headers!**

**Before continuing:**

1. ✅ Code committed
2. ✅ Validation commands pass
3. ✅ Manual review of headers complete
4. ✅ All 13 pages updated

**💰 Cost Optimization:** Safe to clear conversation now

- Phase 4 is committed and validated
- Next phase (documentation) is independent
- Can start fresh with just the execution plan

**Next Steps:**

- Clear conversation if desired
- User: "Start Phase 5" or open [completion-checklist.md](completion-checklist.md)

**DO NOT PROCEED** to Phase 5 without user confirmation.
