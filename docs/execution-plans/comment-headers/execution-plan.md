# Execution Plan: Consistent Comment Headers for Page Components

**Task Reference:** [docs/page-pattern-improvements.md](../../page-pattern-improvements.md) - Improvement #5
**Estimated Effort:** 2 hours
**Created:** 2025-10-17
**Branch:** `feature/consistent-comment-headers`

---

## Overview

**Goal:** Standardize JSDoc comment headers across all page components to improve code documentation, discoverability, and maintainability. Create a reusable VSCode snippet for quick insertion.

**Success Criteria:**

- ✅ Standard JSDoc header template defined
- ✅ All 13 page.tsx files updated with consistent headers
- ✅ VSCode snippet created for `pageheader` shortcut
- ✅ Documentation added to CLAUDE.md
- ✅ All tests pass
- ✅ No breaking changes

---

## Current State Analysis

**Pages with headers (3/13):**

- ✅ `/mailchimp/reports/page.tsx` - Has detailed header with issue reference
- ✅ `/mailchimp/reports/[id]/page.tsx` - Has header with issue reference
- ✅ `/mailchimp/general-info/page.tsx` - Has header with issue reference
- ✅ `/settings/integrations/page.tsx` - Has minimal header

**Pages without headers (9/13):**

- ❌ `/mailchimp/lists/page.tsx` - No header
- ❌ `/mailchimp/lists/[id]/page.tsx` - No header
- ❌ `/mailchimp/reports/[id]/opens/page.tsx` - No header
- ❌ `/mailchimp/reports/[id]/abuse-reports/page.tsx` - No header
- ❌ `/mailchimp/page.tsx` - No header
- ❌ `/page.tsx` (root) - No header
- ❌ `/login/page.tsx` - No header
- ❌ `/auth-error/page.tsx` - No header
- ❌ `/example/page.tsx` - No header

**Existing Header Styles (Inconsistent):**

**Style A - Detailed with issue reference:**

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

**Style B - Minimal:**

```tsx
/**
 * Settings - Integrations Page
 * Centralized management for all OAuth connections and API integrations
 */
```

---

## Proposed Standard Template

After analyzing existing headers and project needs, here's the recommended standard:

```tsx
/**
 * [Page Title]
 * [Brief 1-2 sentence description]
 *
 * @route [/path/to/page]
 * @requires [Authentication requirement: None | Kinde Auth | Mailchimp connection]
 * @features [Key features: Pagination | Filtering | OAuth | etc.]
 */
```

**Example - List Page:**

```tsx
/**
 * Mailchimp Lists Page
 * Displays paginated list of Mailchimp audiences with filtering and search
 *
 * @route /mailchimp/lists
 * @requires Mailchimp connection
 * @features Pagination, Filtering, Real-time data
 */
```

**Example - Detail Page:**

```tsx
/**
 * Campaign Report Detail Page
 * Displays detailed analytics and metrics for a specific campaign
 *
 * @route /mailchimp/reports/[id]
 * @requires Mailchimp connection
 * @features Dynamic routing, Tab navigation, Real-time data
 */
```

**Example - Settings Page:**

```tsx
/**
 * Settings - Integrations Page
 * Manage OAuth connections and API integrations
 *
 * @route /settings/integrations
 * @requires Kinde Auth
 * @features OAuth management, Connection status
 */
```

---

## Files Affected

**Files to Create:**

- `.vscode/page-header.code-snippets` - VSCode snippet file

**Files to Modify:**

- `src/app/page.tsx` - Add header
- `src/app/mailchimp/page.tsx` - Add header
- `src/app/mailchimp/lists/page.tsx` - Add header
- `src/app/mailchimp/lists/[id]/page.tsx` - Add header
- `src/app/mailchimp/reports/page.tsx` - Update to standard format
- `src/app/mailchimp/reports/[id]/page.tsx` - Update to standard format
- `src/app/mailchimp/reports/[id]/opens/page.tsx` - Add header
- `src/app/mailchimp/reports/[id]/abuse-reports/page.tsx` - Add header
- `src/app/mailchimp/general-info/page.tsx` - Update to standard format
- `src/app/settings/integrations/page.tsx` - Update to standard format
- `src/app/login/page.tsx` - Add header
- `src/app/auth-error/page.tsx` - Add header
- `src/app/example/page.tsx` - Add header
- `CLAUDE.md` - Document the pattern

---

## Implementation Phases

### Phase 0: Git Setup and Pre-Implementation Validation

See: [phase-0-setup.md](phase-0-setup.md)

### Phase 1: Define Standard Template and Create VSCode Snippet

See: [phase-1-checklist.md](phase-1-checklist.md)

**Goal:** Define the standard header template and create VSCode snippet

**Tasks:**

1. Create `.vscode/` directory if it doesn't exist
2. Create `page-header.code-snippets` with the standard template
3. Test snippet in VSCode

### Phase 2: Update Root and Mailchimp Pages (4 pages)

See: [phase-2-checklist.md](phase-2-checklist.md)

**Goal:** Update root, Mailchimp landing, and two detail pages

**Pages:**

- `/page.tsx` (root dashboard)
- `/mailchimp/page.tsx` (Mailchimp landing)
- `/mailchimp/reports/page.tsx` (update existing)
- `/mailchimp/lists/page.tsx` (add new)

### Phase 3: Update Dynamic Route Pages (5 pages)

See: [phase-3-checklist.md](phase-3-checklist.md)

**Goal:** Add/update headers for all dynamic route pages

**Pages:**

- `/mailchimp/reports/[id]/page.tsx` (update existing)
- `/mailchimp/reports/[id]/opens/page.tsx` (add new)
- `/mailchimp/reports/[id]/abuse-reports/page.tsx` (add new)
- `/mailchimp/lists/[id]/page.tsx` (add new)
- `/mailchimp/general-info/page.tsx` (update existing)

### Phase 4: Update Settings and Auth Pages (4 pages)

See: [phase-4-checklist.md](phase-4-checklist.md)

**Goal:** Complete remaining pages (settings, auth, example)

**Pages:**

- `/settings/integrations/page.tsx` (update existing)
- `/login/page.tsx` (add new)
- `/auth-error/page.tsx` (add new)
- `/example/page.tsx` (add new)

### Phase 5: Documentation and Final Validation

See: [completion-checklist.md](completion-checklist.md)

**Goal:** Update documentation and run full validation

**Tasks:**

1. Update CLAUDE.md with comment header pattern
2. Run full validation suite
3. Review all changes
4. Create pull request

---

## Header Template Guidelines

### Title Format

- Use page's primary purpose: `[Feature] [Type] Page`
- Examples: "Campaign Report Detail Page", "Mailchimp Lists Page", "Settings - Integrations Page"

### Description

- Keep to 1-2 sentences
- Focus on what the page does, not how it does it
- Be specific about the data/functionality

### @route Tag

- Use exact route path
- Use `[id]` for dynamic segments
- Examples: `/mailchimp/lists`, `/mailchimp/reports/[id]`

### @requires Tag

- Options: `None`, `Kinde Auth`, `Mailchimp connection`, `Kinde Auth + Mailchimp connection`
- Use the most specific requirement
- If page redirects unauthenticated users, use `Kinde Auth`

### @features Tag

- List 2-4 key features (comma-separated)
- Common features: `Pagination`, `Filtering`, `Real-time data`, `Dynamic routing`, `Tab navigation`, `OAuth management`
- Be specific to the page's functionality

---

## Testing Strategy

**No automated tests needed** - This is a documentation-only change.

**Manual validation:**

1. Verify TypeScript compiles: `pnpm type-check`
2. Verify linting passes: `pnpm lint`
3. Review each header for consistency
4. Test VSCode snippet works correctly
5. Verify no functionality changes

---

## Cost Optimization Strategy

**Clear Points:**

1. **After Phase 1** - VSCode snippet created and committed
2. **After Phase 2** - First 4 pages updated and committed
3. **After Phase 3** - Dynamic route pages updated and committed
4. **After Phase 4** - All pages updated, before documentation

**Rationale:** Each phase is independent, involves editing different files, and has a clear commit checkpoint.

---

## Rollback Strategy

**Safe rollback points:**

- After each phase commit
- No functionality changes, so rollback is low-risk

**Rollback commands:**

```bash
# If not pushed yet
git reset --hard main

# If pushed
git revert <commit-hash>
```

---

## Success Metrics

- ✅ All 13 page.tsx files have standardized headers
- ✅ Headers follow the exact template format
- ✅ VSCode snippet works correctly
- ✅ Documentation updated in CLAUDE.md
- ✅ All validation commands pass
- ✅ No functionality changes (header-only PR)

---

## Related Documents

- [page-pattern-improvements.md](../../page-pattern-improvements.md) - Parent planning document
- [execution-plan-template.md](../../execution-plan-template.md) - Template used for this plan
- [CLAUDE.md](../../../CLAUDE.md) - Will be updated with this pattern

---

**Next Steps:**

1. Review this execution plan
2. Open [phase-0-setup.md](phase-0-setup.md) to begin git setup
3. Follow phases sequentially with commits between each phase
