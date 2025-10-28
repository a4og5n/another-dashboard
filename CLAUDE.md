# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ CRITICAL: Git Branching Strategy

**🛑 BEFORE EDITING ANY FILE - CHECK YOUR BRANCH FIRST:**

```bash
git branch --show-current  # MUST run this BEFORE making ANY changes
```

**If output is "main" → STOP and create feature branch NOW**

---

**NEVER WORK DIRECTLY ON MAIN BRANCH**

This project uses a **feature branch workflow**. All development MUST happen on feature branches, never directly on `main`.

### Correct Workflow:

```bash
# 1. Create feature branch
git checkout -b feature/endpoint-name

# 2. Make commits on feature branch
git add -A
git commit -m "feat: ..."

# 3. Push feature branch
git push origin feature/endpoint-name

# 4. Create PR
gh pr create --base main --head feature/endpoint-name

# 5. Merge PR after approval and CI passes
```

### Why This Matters:

- ❌ **Direct main commits bypass code review** - No PR discussion, no approval process
- ❌ **No opportunity to catch issues** - Changes go live without review
- ❌ **Breaks team collaboration** - Others can't review or suggest improvements
- ✅ **Feature branches enable proper review** - PRs allow discussion before merge
- ✅ **CI runs on PRs** - Checks pass before merge, not after
- ✅ **Safe experimentation** - Branch can be deleted if approach doesn't work

### No Exceptions: All Changes Go Through PRs

**⚠️ CRITICAL: Git hooks enforce branch-first workflow for ALL changes (including documentation).**

**Correct workflow for ANY change:**

1. Create GitHub issue (if not exists)
2. Create feature branch: `docs/description-issue-123` or `feature/description-issue-123`
3. Make changes and commit on branch
4. Push and create PR
5. Merge after CI/CD passes

**Why no exceptions:**

- ✅ **Consistent workflow:** Same process for all changes (simpler mental model)
- ✅ **Git hook enforcement:** Pre-commit hook blocks commits to main
- ✅ **AI workflow alignment:** AI always creates branches first, never assumes exceptions
- ✅ **Audit trail:** All changes trackable via PRs and issues
- ✅ **CI/CD validation:** Even docs go through linting and formatting checks

**Previous exception removed (2025-10-27):**

- Old rule: "Documentation can be committed directly to main"
- Problem: AI relied on git hooks to catch mistakes instead of being proactive
- New rule: AI creates branches FIRST, for all changes (code or docs)
- Result: No failed attempts, cleaner workflow, better audit trail

### Historical Context:

**2025-10-23**: Domain Performance endpoint was mistakenly pushed directly to main (commits c87c5f6 through cf324b4). While CI passed retroactively, this bypassed the PR review process.

**2025-10-25**: Issue #239 cleanup was mistakenly committed directly to main (commit 440ee8a). The commit was reverted (ce4d609) and resubmitted via PR #243 for proper CI/CD validation.

**Lesson:** Even low-risk technical debt cleanup MUST go through the PR process.

**2025-10-27**: Updated workflow to remove documentation exception. AI now creates branches FIRST for all changes (code or docs), preventing reliance on git hooks to catch mistakes.

### AI Implementation Guidelines

**Before making ANY changes (code or documentation):**

1. ✅ **Check current branch:** `git branch --show-current`
2. ✅ **If on main:** Create issue + feature branch IMMEDIATELY
3. ✅ **Never assume exceptions:** All changes go through PR workflow
4. ✅ **Be proactive:** Don't wait for git hooks to block commits

**Decision Tree:**

```
User requests change
    ↓
Is there an issue for this work?
    ├─ NO → Create issue first (gh issue create)
    └─ YES → Continue
         ↓
Are we on main branch?
    ├─ YES → Create feature branch NOW (git checkout -b docs/... or feature/...)
    └─ NO → Continue on existing feature branch
         ↓
Make changes → Commit → Push → Create PR → Merge
```

See "Phase 0: Git Setup" in the AI-First Development Workflow section below for complete implementation details.

## Commands {#commands}

**Development:** `pnpm dev` (HTTPS + Turbopack) | `pnpm build` | `pnpm start` | `pnpm clean`

**Quality:** `pnpm lint` | `pnpm lint:fix` | `pnpm type-check` | `pnpm format` | `pnpm format:check`

**Testing:** `pnpm test` | `pnpm test:watch` | `pnpm test:ui` | `pnpm test:coverage` | `pnpm test:a11y`

**Workflows:** `pnpm quick-check` (type + lint) | `pnpm pre-commit` (full validation) | `pnpm validate` (includes build)

**Standard Validation Suite** (run before committing):

1. `pnpm type-check` - Must pass with zero errors
2. `pnpm lint:fix` - Auto-fix linting issues
3. `pnpm format` - Format all files
4. `pnpm test` - All tests must pass

**Database:** `pnpm db:push` | `pnpm db:generate` | `pnpm db:migrate` | `pnpm db:studio`

**Docs:** `pnpm docs` | `pnpm docs:watch`

**Page Generator:** `pnpm generate:page` (interactive CLI for humans)

## Architecture

**Stack:** Next.js 15 (App Router) + TypeScript (strict) + Tailwind v4 + Vitest + Zod + Drizzle ORM + Neon Postgres

**Auth:** Kinde (user auth) + Mailchimp OAuth 2.0 (API access, tokens encrypted AES-256-GCM)

**Project Status:** MVP complete, OAuth 2.0 migration done, post-MVP feature development

**Node/pnpm:** v24.7.0 / v10.15.0 (via Homebrew: `brew install pnpm`)

### Project Structure

- `src/app/` - Next.js pages, layouts, API routes
- `src/components/` - UI components (ui/, dashboard/, layout/, accessibility/, performance/, pwa/, social/)
- `src/actions/` - Server actions with test coverage
- `src/types/` - TypeScript type definitions (mailchimp/, components/)
- `src/schemas/` - Zod validation schemas (mailchimp/)
- `src/utils/` - Pure utility functions
- `src/lib/` - Config, encryption, Mailchimp client, error classes
- `src/services/` - API service classes (singleton pattern)
- `src/hooks/` - React hooks
- `src/db/` - Database schema, migrations, repositories
- `src/test/` - Test setup, utilities, architectural enforcement
- `src/translations/` - i18n files (en.json, es.json)

### Path Aliases

**Configured:** `@/*`, `@/components/*`, `@/actions/*`, `@/types/*`, `@/schemas/*`, `@/utils/*`, `@/lib/*`, `@/skeletons/*`

**Rules:**

- Use path aliases consistently (no relative imports in index.ts) - enforced by tests
- Define shared types in `/src/types` only (no inline) - enforced by tests
- Define Zod schemas in `/src/schemas` only (no inline) - enforced by tests

### Common Import Patterns

**⚠️ CRITICAL: Use correct import paths to avoid errors**

**Skeletons:**

```typescript
import { MemberTagsSkeleton } from "@/skeletons/mailchimp";
// NOT: "@/components/ui/skeleton" ❌
```

**Date Utilities:**

```typescript
import { formatDateTimeSafe } from "@/utils/format-date";
// NOT: "@/utils/mailchimp/date" ❌
```

**Breadcrumbs:**

```typescript
import { bc } from "@/utils/breadcrumbs";
// Usage: bc.memberProfile(listId, subscriberHash)
// NEVER use route placeholders: bc.memberProfile(id, "[subscriber_hash]") ❌
```

**Error Handling:**

```typescript
import { handleApiError } from "@/utils/errors";
// Usage: const error = handleApiError(response); if (error) return <ErrorDisplay />;
```

**Page Params Validation:**

```typescript
import { validatePageParams } from "@/utils/mailchimp/page-params";
// UI schema MUST use optional strings: z.object({ page: z.string().optional() })
// NOT coerced numbers: z.coerce.number().optional() ❌
```

**UI Components:**

```typescript
// shadcn/ui components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Pagination components
import { Pagination } from "@/components/ui/pagination";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
```

**Mailchimp Types:**

```typescript
// Import from @/types/mailchimp, not inline definitions
import type {
  MemberNote,
  MemberNotesResponse,
} from "@/types/mailchimp/member-notes";
```

**Zod Schemas:**

```typescript
// Import from @/schemas/mailchimp, not inline definitions
import {
  memberNotesPathParamsSchema,
  memberNotesQueryParamsSchema,
} from "@/schemas/mailchimp/lists/member-notes/params.schema";
```

### Testing & Quality

**Pre-commit hooks:** Auto-format, lint, type-check, test, a11y test, secret scan (Husky + lint-staged)

**Architectural tests enforce:**

- Path alias usage (no long relative paths)
- Types in `/src/types` only
- Server Components for layouts/not-found.tsx (404 status codes)
- No deprecated APIs (`z.string().datetime()`, `React.FC`, etc.)

**Run:** `pnpm test src/test/architectural-enforcement/`

### Required Reading Before Development

1. `docs/PRD.md` - Product requirements
2. `docs/project-management/development-roadmap.md` - Progress
3. `docs/project-management/task-tracking.md` - Priorities
4. `docs/api-coverage.md` - Mailchimp API implementation status
5. `docs/ai-workflow-learnings.md` - Learnings from recent implementations (table patterns, navigation, formatting)

### Pre-Implementation Checklist

**Before starting any new endpoint implementation**, verify:

- [ ] **Review error handling pattern** - Check `docs/error-handling-quick-reference.md` for current standard pattern
- [ ] **Confirm endpoint priority** - Verify in `docs/api-coverage.md` that this endpoint is next in priority
- [ ] **Search for similar endpoints** - Find comparable pages to match patterns (e.g., other list detail pages, other report drill-downs)
- [ ] **Verify parent page exists** - If nested endpoint (e.g., `/lists/[id]/segments`), confirm parent page (`/lists/[id]`) exists
- [ ] **⚠️ Plan navigation integration** - Determine ALL navigation entry points (WILL BE IMPLEMENTED IN STEP 16):
  - [ ] **For nested pages:** Which parent page needs a link/button to this new page?
  - [ ] **For top-level pages:** Should this be linked from main dashboard (`/mailchimp`)?
  - [ ] **Navigation pattern:** Find similar existing navigation (e.g., "View All Tags" button in member-profile-content.tsx)
  - [ ] **Breadcrumbs:** Ensure bc.funcName helper exists in breadcrumb-builder.ts
  - [ ] Does this replace an existing page or add new functionality?

  **Example:** For Member Notes (`/lists/[id]/members/[subscriber_hash]/notes`):
  - Parent page: Member Profile (`/lists/[id]/members/[subscriber_hash]`)
  - Add "View All Notes" button in "Last Note" card header (following "View All Tags" pattern)

- [ ] **Review existing schemas** - Check `src/schemas/mailchimp/` for reusable common schemas before creating new ones

**Quick References:**

- Error handling: `docs/error-handling-quick-reference.md`
- Comprehensive error analysis: `docs/error-handling-analysis.md`
- Pattern examples: `src/app/mailchimp/lists/[id]/segments/page.tsx` (reference implementation)

---

## AI-First Development Workflow

**📚 Complete workflow:** [docs/workflows/README.md](docs/workflows/README.md)

### Quick Reference

**Phases:** 0 (Git Setup) → 1 (Schemas) → 2 (Implementation) → 3 (PR) → 4 (Post-Merge)

**Checkpoints:**

- Phase 0 → 1: User says "yes" after issue created
- Phase 1 → 2: User says "approved" (AI proceeds automatically through Phase 2 completion)
- Phase 2 → 2.75: AI presents summary, user tests naturally (no explicit checkpoint)
- Phase 2.75 → 3: User says "ready to push" or "smoke test passed"

### User Intent Classification

| User Says                 | Intent         | AI Response                                        |
| ------------------------- | -------------- | -------------------------------------------------- |
| "Can we learn from X?"    | Research       | Present findings + ASK before implementing         |
| "Improve X"               | Ambiguous      | ASK: "(A) Analyze (B) Create issue (C) Implement?" |
| "Implement X"             | Implementation | ✅ Proceed to Phase 0                              |
| "approved" / "looks good" | Approval       | ✅ Proceed automatically (no additional pause)     |

**Red Flags:**

- ❌ User didn't say "implement" explicitly
- ❌ No issue number yet
- ❌ Currently on main branch
- ❌ Request is vague

### Phase 0: Git Setup (MANDATORY)

**Before ANY code:**

1. Create GitHub issue: `gh issue create --title "..." --body "..."`
2. Create branch: `git checkout -b feature/description-issue-123`
3. Initialize TodoWrite with issue number
4. ⏸️ Wait for user: "yes" / "proceed"

### Phase 1: Schema Creation

1. Fetch Mailchimp API docs
2. Create Zod schemas: `*-params.schema.ts`, `*-success.schema.ts`, `*-error.schema.ts`
3. Present schemas for review
4. ⏸️ Wait for user: "approved"
5. **When user says "approved":** Immediately proceed to Phase 2 (no additional pause)
   - DO NOT ask "Would you like me to proceed?"
   - DO NOT wait for additional confirmation
   - Respond: "✅ Schemas approved. Proceeding to Phase 2 (implementation)..."
   - Start Phase 2 implementation immediately

### Phase 2: Implementation

1. Add PageConfig to `src/generation/page-configs.ts`
2. Run page generator
3. Implement: types, skeleton, page.tsx, components
4. Update DAL method
5. Run [Standard Validation Suite](#commands)
6. **Add navigation links** (MANDATORY)
7. Create local commit (DO NOT PUSH)
8. **Present implementation summary immediately** (don't ask for permission to continue)

**Phase 2 completion message format:**

```
✅ Phase 2 Implementation Complete

**List [Endpoint Name] endpoint is now fully implemented:**

### Files Created (X):
- [list files]

### Files Modified (Y):
- [list files]

### Validation Results:
- ✅ Type-check: Passes
- ✅ Lint: Passes
- ✅ Format: Passes
- ✅ Tests: X/Y passing

### Commit Created:
- Commit hash: [hash]
- Branch: [branch-name]
- Status: Local only (NOT PUSHED)

The implementation is ready for testing. I'll wait for your feedback.
```

**Important:** Don't ask "Would you like to test now?" or "Please confirm smoke test" - just present what was done and naturally wait for user feedback.

### Phase 2.75: Testing Loop (User-Driven)

**User reviews → AI fixes → amend commit → repeat**

```bash
git add -A && git commit --amend --no-edit
```

⏸️ When done, user says: "ready to push" or "smoke test passed"

### Phase 3: PR Creation

1. Push: `git push -u origin {branch}`
2. Create PR: `gh pr create ...`
3. Monitor CI/CD (auto-fix failures)
4. Auto-merge when checks pass

### Phase 4: Post-Merge

**Automatic (no user action):**

1. Checkout main, pull changes
2. Delete implementation branch
3. Close GitHub issue
4. Create `docs/post-merge-issue-{number}` branch
5. Update `docs/api-coverage.md` (commit to docs branch)
6. **CLAUDE.md documentation review** (check for redundancy, bloat, new patterns)
7. Add session review to `ai-workflow-learnings.md` (commit to docs branch)
8. Push docs branch & create PR
9. Auto-merge docs PR when CI passes
10. Present completion summary

---

**See [docs/workflows/](docs/workflows/) for detailed phase documentation.**

## Git Amend Workflow (Phase 2.75 Reference)

During Phase 2.75 local iteration, use `git commit --amend --no-edit` to keep one clean commit:

```bash
# Make changes, then:
git add -A && git commit --amend --no-edit
```

**Why:** Single atomic commit instead of messy "fix: X", "fix: Y" history.

**Safe when:** Commit is local-only (not pushed). **Never** amend after pushing without force-push.

### Phase 3: Push & Create PR (ONLY after explicit approval)

**⚠️ CRITICAL: AI must NOT proceed to Phase 3 without user explicitly saying:**

- "ready to push"
- "create PR"
- "push to origin"
- "ready for PR"

**DO NOT accept vague approval like "looks good" - user must explicitly request PR creation.**

**After explicit approval, AI automatically:**

1. Pushes branch to origin: `git push -u origin {branch-name}`
2. Creates PR using GitHub CLI:

   ```bash
   gh pr create --title "feat: implement {Endpoint Name}" --body "$(cat <<'EOF'
   ## Summary
   Implements {Endpoint Name} endpoint following AI-First Development Workflow.

   ## Implementation
   - Complete page with all components
   - Type-safe with Zod schemas
   - Proper error handling
   - Loading states and skeletons
   - Navigation integration

   ## Validation
   - ✅ Type-check: Passes
   - ✅ Lint: Passes
   - ✅ Tests: XXX/XXX passing
   - ✅ Manual testing: Complete

   ## Test Plan
   - [x] Tested with real Mailchimp data
   - [x] Verified schema matches API response
   - [x] Checked navigation works
   - [x] Tested error states

   Resolves #{issue_number}

   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   EOF
   )"
   ```

3. Presents PR URL: "✅ PR created: {URL}"

### Phase 3.5: CI/CD Monitoring & Failure Recovery (Automatic)

**After PR creation, AI automatically monitors CI/CD until all checks pass, handles failures, and proceeds to auto-merge.**

See [docs/workflows/phase-3-cicd.md](docs/workflows/phase-3-cicd.md) for complete monitoring and failure recovery procedures.

**Critical Rules:**

- ⚠️ **MUST monitor in FOREGROUND mode** (NOT background): `gh pr checks {pr_number} --watch`
- ⚠️ **MUST fix ALL failures** before proceeding to merge
- ⚠️ **Auto-merge ONLY when ALL checks pass:** `gh pr merge {pr_number} --squash --delete-branch`
- ⚠️ **IMMEDIATELY proceed to Phase 4** after merge (no user confirmation needed)

### Phase 4: Post-Merge Cleanup & Documentation (Automatic)

**⚠️ CRITICAL: This phase is FULLY AUTOMATIC. Do NOT stop or ask for confirmation.**

**Trigger**: Immediately after PR is auto-merged in Phase 3.5 Step 4

**AI automatically executes these steps in order without stopping:**

#### Step 1: Branch Cleanup & Sync

```bash
# Checkout main and pull merged changes
git checkout main && git pull origin main

# Delete local branch (remote already deleted by auto-merge)
BRANCH_EXISTS=$(git branch --list {branch-name})
if [ -n "$BRANCH_EXISTS" ]; then
  git branch -d {branch-name}
  echo "✅ Deleted local branch: {branch-name}"
else
  echo "✅ Local branch already deleted: {branch-name}"
fi

echo "✅ Remote branch already deleted by auto-merge"
```

#### Step 2: Close Related GitHub Issues

**AI MUST close the issue that triggered this implementation:**

```bash
# Close the issue that was implemented
gh issue close {issue_number} --comment "Implemented in PR #{pr_number} and merged to main."
```

**If there were related issues mentioned in commits, close those too:**

```bash
# Example: If implementation also fixed a bug
gh issue close {related_issue} --comment "Fixed as part of {Endpoint Name} implementation (PR #{pr_number})."
```

#### Step 3: Create Branch for Post-Merge Documentation

**⚠️ CRITICAL:** All changes go through PR workflow, including post-merge documentation.

**Create documentation branch:**

```bash
# Create branch for post-merge documentation updates
git checkout -b docs/post-merge-issue-{issue_number}
```

**Why a new branch?** Maintains consistent workflow - all changes go through PR, no exceptions.

#### Step 4: Update API Coverage Documentation

**For Mailchimp endpoint implementations:**

1. Update `docs/api-coverage.md`:
   - Mark endpoint as ✅ Implemented
   - Add implementation details:
     - Route: `/mailchimp/{path}`
     - Features: List key features
     - Issue/PR numbers
   - Update coverage stats (X/Y endpoints, Z%)

**Example update:**

```markdown
- ✅ **List Locations** - `GET /lists/{list_id}/locations`
  - Route: `/mailchimp/lists/[id]/locations`
  - Features: Geographic member distribution, Country-based subscriber analytics
  - **Priority 3:** Analytics insight
  - **Implemented:** Issue #278, PR #279
```

2. Commit to documentation branch:
   ```bash
   git add docs/api-coverage.md
   git commit -m "docs: mark {Endpoint Name} as implemented
   ```

Issue #${issue_number}, PR #${pr_number}

Updated API coverage:

- Marked {Endpoint Name} as ✅ implemented
- Added route and features documentation
- Updated progress: X/Y endpoints (Z%)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

````

**Note:** No push yet - will be included in final step.

#### Step 5: CLAUDE.md Documentation Review (MANDATORY)

**⚠️ CRITICAL: AI MUST perform this check after EVERY implementation, not just when patterns change.**

**5.1: Check for New Patterns**

Did this implementation introduce:
- New component architecture?
- New error handling pattern?
- New validation approach?
- New navigation pattern?
- Any deviation from existing workflow?

**5.2: Check for Redundancy & Bloat**

**Token Awareness Check:**
- Does CLAUDE.md have duplicate sections?
- Is any section >500 lines? (Consider extracting to `docs/`)
- Are there verbose examples that could be condensed?
- Can any section reference external docs instead of repeating?

**Documentation Health Metrics:**
```bash
# Run this check
wc -l CLAUDE.md
grep -c "^## " CLAUDE.md  # Count major sections
grep -c "CRITICAL" CLAUDE.md  # Should be <20
````

**Red Flags:**

- ❌ CLAUDE.md >3,000 lines (extract to sub-docs)
- ❌ Same content in 2+ places (consolidate)
- ❌ >20 "CRITICAL" warnings (dilutes importance)
- ❌ Verbose workflow steps (create condensed version)

**5.3: Take Action**

**If new patterns found:**

```bash
# Add to appropriate section (NOT as new top-level section)
git add CLAUDE.md
git commit -m "docs: document {pattern} from Issue #${issue_number}"
# Note: Committed to docs branch, will be pushed in final step
```

**If redundancy/bloat detected:**

```bash
# Create issue for future cleanup
gh issue create --title "docs: CLAUDE.md cleanup needed" --body "$(cat <<'EOF'
## Problem
CLAUDE.md has grown to {lines} lines with detected redundancy.

## Redundancy Found
- {duplicate section 1}
- {verbose section 2}

## Proposed Solution
- Extract {section} to docs/{file}.md
- Consolidate {duplicate content}
- Create condensed reference in CLAUDE.md

## Benefits
- Reduce token usage
- Improve readability
- Easier maintenance
EOF
)"
```

**5.4: Documentation Principles (Apply Always)**

✅ **DO:**

- Extract workflows >200 lines to `docs/workflows/`
- Extract patterns >300 lines to `docs/development-patterns.md`
- Create condensed summaries with links to detailed docs
- Use markdown anchors for cross-referencing
- Define things ONCE, reference everywhere

❌ **DON'T:**

- Duplicate content across sections
- Create verbose examples inline (extract to docs/)
- Add new top-level sections (group under existing)
- Repeat validation commands (reference Standard Validation Suite)
- Embed complete workflows (summarize + link)

**Example: Good Documentation Structure**

```markdown
## Feature X

**Quick Reference:** See [docs/feature-x-guide.md](docs/feature-x-guide.md)

### Essential Info (keep in CLAUDE.md)

- Critical rules (2-3 bullet points)
- Common command: `command --flags`
- Link to detailed guide

### Detailed Guide (extract to docs/)

- Step-by-step instructions
- All edge cases
- Verbose examples
- Troubleshooting
```

**Token Cost Awareness:**

- Every 1,000 lines ≈ 3,000 tokens
- CLAUDE.md should stay <2,500 lines (<7,500 tokens)
- Aim for: "Can AI read entire file in one context window"`

#### Step 6: Add Session Review to ai-workflow-learnings.md

**AI MUST document this implementation session:**

**Create comprehensive session review at the TOP of the "Session Reviews" section:**

````markdown
### Session: {Endpoint Name} Implementation (YYYY-MM-DD)

**Endpoint:** `{HTTP_METHOD} /path/to/endpoint`
**Route:** `/mailchimp/{route}`
**Issue:** #{issue_number} | **PR:** #{pr_number} | **Status:** ✅ Merged

#### What Worked Exceptionally Well ✅

**1. {Pattern/Approach That Worked}** ⭐⭐⭐

**What Happened:**

- {Describe what was successful}
- {Why it worked well}

**Implementation Details:**

```{language}
// Show code example if relevant
```
````

**Why This Matters:**

- {Benefit 1}
- {Benefit 2}

#### Issues Encountered & Solutions 🔧

**1. {Problem Description}**

**Problem:** {What went wrong}

**Root Cause:** {Why it happened}

**Solution:** {How it was fixed}

**Prevention:** {How to avoid in future}

#### Implementation Stats 📊

**Development Time:**

- Phase 1 (Schemas): ~X minutes
- Phase 2 (Implementation): ~Y minutes
- Phase 2.75 (Testing & Iteration): ~Z iterations
- **Total:** ~N hours

**Code Metrics:**

- Files Created: {count}
- Files Modified: {count}
- Lines Added: ~{count}
- Lines Removed: ~{count}

**Validation:**

- ✅ Type-check: passed
- ✅ Lint: passed
- ✅ Format: passed
- ✅ Tests: {count} passing
- ✅ CI/CD: All checks passed

#### Key Learnings for Future Implementations 💡

1. **{Learning 1 Title}**
   - {Description}
   - {Actionable takeaway}

2. **{Learning 2 Title}**
   - {Description}
   - {Actionable takeaway}

#### Files Modified/Created 📁

**Created:**

- `{file_path}` - {purpose}
- `{file_path}` - {purpose}

**Modified:**

- `{file_path}` - {change description}
- `{file_path}` - {change description}

---

#### Step 6: Present Completion Summary (Automatic - DO NOT SKIP)

**⚠️ CRITICAL: After completing all Phase 4 steps, AI MUST automatically present a completion summary. DO NOT wait for user to ask.**

**AI must immediately output:**

```
✅ Workflow Complete

**PR #{pr_number} Status:**
- ✅ All CI/CD checks passed
- ✅ Merged to main
- ✅ Branches cleaned up (remote and local)

**Phase 4 Cleanup Complete:**
- ✅ Issue #{issue_number} closed
- ✅ API coverage updated: docs/api-coverage.md (if applicable)
- ✅ Workflow documentation updated: CLAUDE.md (if applicable)
- ✅ Session review added: docs/ai-workflow-learnings.md (if applicable)

**Changes Merged:**
{Brief 1-2 sentence summary of what was implemented/fixed}

**Implementation Summary:**
- Files created: {count}
- Files modified: {count}
- Tests: {count} passing
- Total time: ~{time}

The workflow is now complete. All changes have been merged to main and documented.
```

**Rules:**

1. **DO NOT STOP** after Phase 4 cleanup - immediately present this summary
2. **DO NOT WAIT** for user to ask "is it done?" or "did it work?"
3. **DO NOT ASK** "would you like a summary?" - just present it
4. This is the final step of the workflow - present it automatically

**Why this matters:** Silent completion makes the workflow appear stuck or incomplete. Users should not have to prompt AI to confirm the workflow finished successfully.

---

````

**Commit the session review:**

```bash
git add docs/ai-workflow-learnings.md
git commit -m "docs: add session review for {Endpoint Name} implementation

Documented implementation session for Issue #${issue_number}, PR #${pr_number}.

Captured:
- What worked exceptionally well
- Issues encountered and solutions
- Implementation stats and metrics
- Key learnings for future work
- Complete file change list

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
# Note: No push yet - will be included in final step
````

#### Step 7: Push Documentation Branch & Create PR

**Push all documentation updates and create PR:**

```bash
# Push documentation branch
git push -u origin docs/post-merge-issue-{issue_number}

# Create PR for post-merge documentation
gh pr create --title "docs: post-merge updates for {Endpoint Name} (Issue #{issue_number})" --body "$(cat <<'EOF'
## Summary
Post-merge documentation updates for {Endpoint Name} implementation.

## Updates
- ✅ Updated API coverage documentation
- ✅ Added CLAUDE.md patterns (if applicable)
- ✅ Added session review to ai-workflow-learnings.md

## Related
- Original implementation: PR #{pr_number}
- Issue: #{issue_number}

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"

# Monitor CI/CD checks
gh pr checks --watch

# Auto-merge when checks pass
gh pr merge --squash --delete-branch
```

**After documentation PR merges:**

```bash
# Return to main and pull
git checkout main && git pull origin main
```

#### Step 8: Implementation Review & Improvement Identification

**AI MUST review the merged implementation and identify improvements:**

**Review Checklist:**

- [ ] Are there repeated code patterns that could be extracted?
- [ ] Could any components be more reusable?
- [ ] Is the error handling consistent with other pages?
- [ ] Are there accessibility improvements needed?
- [ ] Could the user experience be enhanced?
- [ ] Are there performance optimizations possible?
- [ ] Is the navigation intuitive?
- [ ] Are there missing features that would add value?

**Create improvement recommendations:**

```
✅ Post-merge review complete

**Implementation Quality:** {Excellent/Good/Needs Improvement}

**Identified Improvements:**

1. **{Improvement Title}** (Priority: High/Medium/Low)
   - Current: {What it does now}
   - Improvement: {What could be better}
   - Benefit: {Why this matters}
   - Effort: {Small/Medium/Large}

2. **{Improvement Title}** (Priority: High/Medium/Low)
   - Current: {What it does now}
   - Improvement: {What could be better}
   - Benefit: {Why this matters}
   - Effort: {Small/Medium/Large}

**Recommendation:** {Create follow-up branch now / Address later / No changes needed}
```

**If improvements are identified, ask user:**

> "I've identified {count} potential improvements to the {Endpoint Name} implementation:
>
> {List improvements with priorities}
>
> Would you like me to:
>
> 1. Create a new branch and implement these improvements now
> 2. Create GitHub issues for future work
> 3. Skip improvements for now
>
> What would you prefer?"

#### Step 9: Create Improvement Branch (If Requested)

**If user says "implement improvements" or similar:**

1. **Create new issue for improvements:**

   ```bash
   gh issue create --title "refactor: improve {Endpoint Name} implementation" --body "..."
   ```

2. **Create feature branch:**

   ```bash
   git checkout -b feature/improve-{endpoint}-issue-{new_number}
   ```

3. **Implement improvements:**
   - Follow same Phase 1-3 workflow
   - Keep changes focused and reviewable
   - Maintain backward compatibility

4. **Create PR when ready:**
   - Reference original implementation
   - Explain improvements made
   - Show before/after examples

#### Step 10: Final Summary

**AI presents complete summary:**

```
✅ Phase 4 Complete - Post-Merge Tasks Finished

**Git Operations:**
- ✅ Switched to main branch
- ✅ Pulled latest changes
- ✅ Deleted implementation branch: {branch-name}

**Documentation Updates:**
- ✅ Closed Issue #{issue_number}
- ✅ Created docs PR: #{docs_pr_number}
- ✅ Updated docs/api-coverage.md (if applicable)
- ✅ Updated CLAUDE.md with new patterns (if applicable)
- ✅ Added session review to ai-workflow-learnings.md

**Implementation Review:**
- ✅ Quality assessment: {rating}
- ✅ Improvements identified: {count}
- ✅ Follow-up: {action taken}

**Next Steps:**
- {Improvement branch created | Ready for next feature | Other}

🎉 {Endpoint Name} implementation cycle complete!
```

**Important Rules:**

- DO NOT wait for user to request cleanup or documentation
- DO NOT update `docs/api-coverage.md` during implementation (Phase 2)
- DO NOT skip session review - it's required for all implementations
- DO NOT skip improvement review - continuous improvement is mandatory
- ✅ **ALL changes go through PR workflow** - including documentation
- Create `docs/post-merge-issue-{number}` branch for Phase 4 updates
- Always close related GitHub issues
- Always ask before creating improvement branch

### Enhancement Commits Pattern

**When user requests small improvements AFTER main feature is merged:**

Make separate focused commits (< 20 lines ideal):

```bash
# Example: User requests "make emails clickable for future detail page"
git add src/components/mailchimp/lists/list-members-content.tsx
git commit -m "feat: make member emails clickable links to detail pages

Prepares for future Member Info implementation by converting email
addresses in the members table to clickable links that navigate to
/lists/{list_id}/members/{subscriber_hash}.

Changes:
- Added Link component to list-members-content.tsx
- Email addresses now link to member detail pages
- Applied primary color and hover underline styling

Related to future endpoint: GET /lists/{list_id}/members/{subscriber_hash}

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Guidelines**:

- Separate commit when user explicitly requests enhancement
- Include "Related to" or "Prepares for" context
- Reference future work in commit message
- Keep focused and small
- Create new PR if needed

### What Gets Generated Automatically

The programmatic API generates complete, working infrastructure:

```
src/app/mailchimp/{resource}/[id]/{endpoint}/
├── page.tsx              # Main page with data fetching
├── loading.tsx           # Loading skeleton
└── not-found.tsx         # 404 page (for detail pages)

src/schemas/components/mailchimp/
└── {endpoint}-page-params.ts  # UI schema for route/search params

src/components/mailchimp/{resource}/
└── {endpoint}-content.tsx     # Placeholder component (AI implements)

src/dal/mailchimp.dal.ts        # New method added
src/utils/breadcrumbs/breadcrumb-builder.ts  # New function added
src/utils/mailchimp/metadata.ts              # New helper added
```

### Benefits of This Approach

✅ **Quality Control** - User reviews API contract before building infrastructure
✅ **Learning** - User sees and understands schema structure
✅ **Easy Corrections** - Fix schemas before generating 500+ lines of code
✅ **Clear Checkpoints** - Explicit approval makes workflow predictable
✅ **Async-Friendly** - User can review schemas later, then approve
✅ **Consistency** - All pages follow same patterns automatically
✅ **Speed** - 2-3 hours → 5-10 minutes per page

### Tracking Progress

Check `docs/api-coverage.md` to see:

- ✅ Implemented endpoints
- ⭐ Priority endpoints (next to implement)
- 📋 Planned endpoints
- Implementation progress (X/Y endpoints, Z%)

### Workflow Summary

**User Involvement Required:**

- ✅ Approve Phase 1 schemas (after review)
- ✅ Confirm PR has been merged

**Fully Automatic (No User Action Needed):**

- ✅ Branch creation
- ✅ Phase 1 commit (after approval)
- ✅ Phase 2 implementation
- ✅ Phase 2 commit (after validation)
- ✅ PR creation and push
- ✅ Post-merge cleanup (after confirmation)

### Example Session Flow

```
User: "Implement the Location Activity endpoint"

AI: [Automatically creates feature/location-activity-endpoint branch]
AI: "✅ Created branch: feature/location-activity-endpoint"
AI: [Fetches Mailchimp API docs]
AI: [Creates schemas matching API exactly]
AI: [Presents schemas with source docs and response example]
AI: "I've created schemas based on Mailchimp API docs. Please review."

User: "Approved"

AI: [Automatically commits Phase 1]
AI: "✅ Phase 1 committed (4240049)"
AI: [Runs page generator]
AI: [Implements components, types, skeleton]
AI: [Updates DAL with proper types]
AI: [Runs validation: type-check, lint, format, test]
AI: [Automatically commits Phase 2]
AI: "✅ Phase 2 committed (fb17638)"
AI: [Automatically pushes branch]
AI: [Automatically creates PR]
AI: "✅ PR created: https://github.com/.../pull/218"
AI: "⏸️ Please review and merge the PR. Say 'PR merged' when done."

User: "PR merged"

AI: [Automatically checks out main, pulls, deletes branch]
AI: "✅ Cleanup complete. On main branch, ready for next feature!"
```

**Key Points:**

- User only interacts at 2 checkpoints (approve schemas, confirm merge)
- All git operations happen automatically
- Clean, atomic commits for each phase
- No need to manually request branches, commits, or PRs

### Programmatic API Reference

**High-Level API** (recommended):

```typescript
import { generatePage } from '@/scripts/generators/api';

const result = await generatePage({
  apiParamsPath: string,
  apiResponsePath: string,
  apiErrorPath?: string,
  routePath: string,
  pageTitle: string,
  pageDescription: string,
  apiEndpoint: string,
  configKey?: string,  // auto-derived if not provided
  overrides?: {
    httpMethod?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
    pageType?: "list" | "detail" | "nested-detail",
    enablePagination?: boolean,
    breadcrumbLabel?: string,
    breadcrumbParent?: string,
    features?: string[]
  }
});
```

**Low-Level API** (full control):

```typescript
import { generatePageFromConfig } from "@/scripts/generators/api";
import type { PageConfig } from "@/generation/page-configs";

const config: PageConfig = {
  /* complete config */
};
const result = await generatePageFromConfig(config, "config-key");
```

**See Also:**

- `scripts/generators/README.md` - Full generator documentation
- `scripts/generators/api/index.ts` - API documentation and examples
- `docs/execution-plans/page-generator-execution-plan.md` - Implementation details

---

## Large-Scale Refactoring Workflow

**When to use:** Refactoring affects 20+ files, multiple layers, risk of breaking functionality.

See [docs/workflows/refactoring.md](docs/workflows/refactoring.md) for complete workflow, automation scripts, and rollback procedures.

**Key Principles:**

- **Type safety > code deduplication** - Accept duplication when refactoring breaks type inference
- **Test incrementally** - Run validation after each phase, not just at the end
- **Document rollback strategy** - Tag phases with `git tag refactor-phase-N-start`
- **Add tests for failures** - If CI catches something local tests missed, add test to catch it earlier

**Required Reading:** Issues #222, #223 (October 2025 schema reorganization case study)

---

## Development Patterns

### Error Handling

**⚠️ CRITICAL: Standard Error Handling Pattern (Issue #240)**

All dynamic route pages MUST follow this pattern:

**Required Files:**

- ✅ **error.tsx** - Client Component for unexpected crashes
- ✅ **not-found.tsx** - Server Component for 404 errors
- ❌ **NO loading.tsx** - Interferes with 404 flow (NEVER use)

**Enforced by:** `src/test/architectural-enforcement/error-handling-enforcement.test.ts`

**Standard Pattern:**

```tsx
export default async function Page({ params, searchParams }: PageProps) {
  // 1. Parse route params
  const { id } = routeParamsSchema.parse(await params);

  // 2. Fetch data
  const response = await mailchimpDAL.fetchData(id, apiParams);

  // 3. Handle API errors (auto-triggers notFound() for 404s)
  handleApiError(response);

  // 4. Extract data safely
  const data = response.success ? response.data : null;

  // 5. Render with connection guard
  return (
    <PageLayout {...}>
      <MailchimpConnectionGuard errorCode={response.errorCode}>
        {data ? (
          <ContentComponent data={data} {...} />
        ) : (
          <DashboardInlineError error="Failed to load data" />
        )}
      </MailchimpConnectionGuard>
    </PageLayout>
  );
}
```

**Utilities:** `src/utils/errors/`

- `handleApiError(response)` - Auto-handles 404s with `notFound()`, returns error message for UI
- `handleApiErrorWithFallback(response, fallback)` - Same with custom fallback
- `is404Error(message)` - Detects 404/not found errors

**Key Principles:**

1. ✅ **404 Handling**: Always use `handleApiError()` - it auto-triggers `notFound()`
2. ✅ **Connection Errors**: Always use `MailchimpConnectionGuard` with `errorCode`
3. ✅ **Other Errors**: Use `DashboardInlineError` component (not raw divs)
4. ❌ **Never**: Call `notFound()` manually - `handleApiError()` does it
5. ❌ **Never**: Use loading.tsx - interferes with 404 flow
6. 📄 **error.tsx**: Only for unexpected crashes, not API errors

**Philosophy:** Return expected errors as values, use `notFound()` for 404s, let error boundaries catch unexpected errors.

### Breadcrumbs

**Utility:** `bc` from `@/utils/breadcrumbs`

**Usage:** `<BreadcrumbNavigation items={[bc.home, bc.mailchimp, bc.reports, bc.report(id), bc.current("Details")]} />`

**Routes:** `bc.home`, `bc.mailchimp`, `bc.reports`, `bc.lists`, `bc.generalInfo`, `bc.settings`, `bc.integrations`, `bc.report(id)`, `bc.list(id)`, `bc.reportOpens(id)`, `bc.reportAbuseReports(id)`, `bc.current(label)`, `bc.custom(label, href)`

### Standard Card Components

**Components:** `StatCard` (single metric) | `StatsGridCard` (multi-metric grid) | `StatusCard` (status + badge + metrics)

**Decision:**

- StatCard: Single metric with optional trend
- StatsGridCard: 2-4 related metrics (simple value + label)
- StatusCard: Status info with badge
- Custom: Interactive features, charts, tables

**Import types:** `@/types/components/ui` (StatCardProps, StatsGridCardProps, StatusCardProps)

### URL Params Processing

**Decision tree:**

- Pagination (`?page=N&perPage=M`) → `validatePageParams()` from `@/utils/mailchimp/page-params`
- Route params (`[id]`, `[slug]`) → `processRouteParams()` from `@/utils/mailchimp/route-params`
- Neither → No utility needed

**Docs:** `src/utils/params/README.md`

### Data Formatting

**Number Formatting:**

```tsx
// Format large numbers with thousand separators
<CardTitle>Email Activity ({totalItems.toLocaleString()})</CardTitle>;
// Output: "Email Activity (7,816)"

// Format percentages
const percentage = ((clicks / total) * 100).toFixed(2);
// Output: "12.34"

// Format currency
const amount = revenue.toLocaleString("en-US", {
  style: "currency",
  currency: "USD",
});
// Output: "$1,234.56"
```

**Date Formatting:**

Use `formatDateTimeSafe()` from `@/utils/mailchimp/date`:

```tsx
import { formatDateTimeSafe } from "@/utils/mailchimp/date";

// ISO 8601 → "Jan 15, 2025 at 2:30 PM"
<TableCell>{formatDateTimeSafe(email.timestamp)}</TableCell>;
```

**Display Priority Guidelines:**

1. **Card Titles:** Always format numbers (`.toLocaleString()`)
2. **Table Headers:** Format if displaying counts
3. **Table Cells:** Format dates, large numbers, percentages
4. **Badges:** Raw values are okay (e.g., status badges)

**See:** `docs/ai-workflow-learnings.md` for complete formatting guide

### Adding Navigation Links to Detail Pages

When implementing a new detail page (like Growth History), add navigation links from parent pages following this standard pattern:

**Pattern** (used in campaign/list detail pages):

1. **Location**: Add to the relevant tab (Stats, Details, Overview, etc.)
2. **Component**: Use `CardFooter` with border styling
3. **Button**: `Button` with `asChild`, `variant="outline"`, `size="sm"`
4. **Link**: Next.js `Link` component
5. **Icon**: Include `ArrowRight` icon for consistency

**Example Implementation:**

```tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

<Card>
  <CardHeader>
    <CardTitle>Engagement Metrics</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Metrics content */}
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Open Rate:</span>
        <span className="font-semibold">{openRate.toFixed(1)}%</span>
      </div>
      {/* More metrics... */}
    </div>
  </CardContent>
  <CardFooter className="border-t pt-4">
    <Button asChild variant="outline" size="sm" className="w-full">
      <Link href={`/mailchimp/lists/${list.id}/growth-history`}>
        View Growth History
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  </CardFooter>
</Card>;
```

**Key Points:**

- `CardFooter` always has `className="border-t pt-4"` for visual separation
- Button uses `variant="outline"` for secondary action appearance
- Button uses `size="sm"` and `className="w-full"` for consistent sizing
- Arrow icon uses `className="ml-2 h-4 w-4"` for spacing and size
- Text should be action-oriented: "View X", "Explore Y", "See Z"

**Reference Implementation:**

- Campaign Reports: `src/components/dashboard/reports/CampaignReportDetail.tsx`
- List Details: `src/components/mailchimp/lists/list-detail.tsx:369-381`

### Table Implementation Patterns {#table-implementation-patterns}

#### Pagination Placement (CRITICAL)

**✅ CORRECT** - Pagination OUTSIDE Card:

```tsx
<div className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle>Title ({total.toLocaleString()})</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>{/* Table rows */}</Table>
    </CardContent>
  </Card>

  {/* Pagination Controls - OUTSIDE Card */}
  {total_items > 0 && (
    <div className="flex items-center justify-between">
      <PerPageSelector
        value={pageSize}
        createPerPageUrl={createPerPageUrl}
        itemName="items"
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        createPageUrl={createPageUrl}
      />
    </div>
  )}
</div>
```

**❌ INCORRECT** - Pagination inside CardContent:

```tsx
<Card>
  <CardContent>
    <Table>{/* Table rows */}</Table>

    {/* DON'T PUT PAGINATION HERE - breaks visual hierarchy */}
    <div className="flex items-center justify-between pt-4">
      <PerPageSelector ... />
      <Pagination ... />
    </div>
  </CardContent>
</Card>
```

**Why**: Pagination controls should be siblings of the Card, not children of CardContent, to maintain proper visual separation and spacing consistency.

**Reference Files**:

- `src/components/mailchimp/reports/campaign-email-activity-table.tsx:148-163`
- `src/components/mailchimp/reports/click-details-content.tsx:196-212`
- `src/components/mailchimp/lists/list-activity-content.tsx:127-141`

#### Server Component Tables (Default Pattern)

**Use for:** Simple lists, paginated data, read-only displays

```typescript
// Server Component (no "use client")
export function CampaignUnsubscribesTable({
  data,
  currentPage,
  pageSize,
  campaignId,
}: Props) {
  const baseUrl = `/mailchimp/reports/${campaignId}/unsubscribes`;

  // URL generation functions
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("perPage", pageSize.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const createPerPageUrl = (newPerPage: number) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("perPage", newPerPage.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Unsubscribes ({data.total_items.toLocaleString()})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.members.map((member) => (
                <TableRow key={member.email_id}>
                  <TableCell>{member.email_address}</TableCell>
                  <TableCell>{formatDateShort(member.timestamp)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination OUTSIDE Card */}
      {data.total_items > 0 && (
        <div className="flex items-center justify-between">
          <PerPageSelector value={pageSize} createPerPageUrl={createPerPageUrl} itemName="members" />
          <Pagination currentPage={currentPage} totalPages={Math.ceil(data.total_items / pageSize)} createPageUrl={createPageUrl} />
        </div>
      )}
    </div>
  );
}
```

**Benefits**:

- Server Component (smaller bundle, better performance)
- URL-based pagination (SEO-friendly, shareable links)
- No hooks needed (simpler code)
- Always use shadcn/ui `Table` component (never raw HTML `<table>`)

**See:** `docs/ai-workflow-learnings.md` for complete table patterns and decision tree

### PageLayout Component

**Usage:** All dashboard pages use `PageLayout` from `@/components/layout`

**Patterns:**

- **Static pages:** `breadcrumbs={[bc.home, bc.current("Page")]}`
- **Dynamic pages:** `breadcrumbsSlot={<Suspense><BreadcrumbContent /></Suspense>}`

**Props:** title, description, skeleton (required) + breadcrumbs XOR breadcrumbsSlot

### Metadata Helpers

**Helpers:** `generateCampaignReportMetadata`, `generateCampaignOpensMetadata`, `generateCampaignAbuseReportsMetadata` from `@/utils/metadata`

**Usage:** `export const generateMetadata = generateCampaignOpensMetadata;` (1 line vs 30+ inline)

**Type helper:** `import type { GenerateMetadata } from "@/types/components/metadata"` for type-safe metadata functions

### Page Component Headers

**Template:**

```tsx
/**
 * [Page Title]
 * [1-2 sentence description]
 *
 * @route [/path/to/page]
 * @requires [None | Kinde Auth | Mailchimp connection | Both]
 * @features [Feature 1, Feature 2, Feature 3]
 */
```

**VSCode snippet:** Type `pageheader` + Tab

### Schema & API Patterns

**IMPORTANT: Schema refactoring in progress** (Issues #222, #223)

- Folder reorganization: Moving to hierarchical structure
- DRY refactoring: Extracting common patterns
- Comment standardization: Enforcing consistent style
- Branch: `refactor/schema-organization`

**Until refactoring is complete, follow these standards for new schemas:**

#### Comment Standards (User-Approved Pattern)

**File Header - Always Include:**

```typescript
/**
 * [Resource Name] [Params|Success|Error] Schema
 * Schema for [description]
 *
 * Endpoint: [METHOD] /[full/path]
 * Documentation: [Mailchimp API URL]
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
```

**Property Comments - Inline Only (NOT JSDoc @property):**

```typescript
export const schema = z.object({
  field_name: z.string(), // Brief description without period
  count: z.number().int().min(0), // Integer count of items
  rate: z.number().min(0).max(1), // Decimal rate (0-1)
  timestamp: z.iso.datetime({ offset: true }), // ISO 8601 with timezone
  _links: z.array(linkSchema), // HATEOAS navigation links
});
```

**Strict Mode - Always Comment:**

```typescript
export const schema = z
  .object({
    // properties...
  })
  .strict(); // Reject unknown properties for input validation
```

**Common Field Comments (Standardized):**

- `fields` → `// Comma-separated fields to include`
- `exclude_fields` → `// Comma-separated fields to exclude`
- `count` → `// Number of records (1-1000)`
- `offset` → `// Records to skip for pagination`
- `total_items` → `// Total count`
- `_links` → `// HATEOAS navigation links`
- IDs → `// [Resource] ID`
- Rates → `// Decimal rate (0-1)`
- Dates → `// ISO 8601 with timezone`

#### Common Schemas (Use When Applicable)

**Path Parameters:**

```typescript
// For campaign endpoints
import { campaignIdPathParamsSchema } from "@/schemas/mailchimp/common/path-params.schema";
export const pathParamsSchema = campaignIdPathParamsSchema;

// For list endpoints
import { listIdPathParamsSchema } from "@/schemas/mailchimp/common/path-params.schema";
export const pathParamsSchema = listIdPathParamsSchema;
```

**Query Parameters:**

```typescript
// Standard pagination + field filtering (most common)
import { standardQueryParamsSchema } from "@/schemas/mailchimp/common/pagination-params.schema";
export const queryParamsSchema = standardQueryParamsSchema;

// With additional parameters
export const queryParamsSchema = standardQueryParamsSchema.extend({
  since: z.iso.datetime({ offset: true }).optional(), // ISO 8601 filter
});
```

**Paginated Response:**

```typescript
// ⚠️ DO NOT use factory function - it breaks TypeScript type inference
// TypeScript cannot infer specific property names from computed object keys
// See "Schema Refactoring Learnings" section below for details

// Instead, define the schema explicitly:
export const responseSchema = z.object({
  resource_name: z.array(itemSchema), // Array of items
  campaign_id: z.string().min(1), // Parent resource ID (optional)
  total_items: z.number().min(0), // Total count
  _links: z.array(linkSchema), // HATEOAS navigation links
});
```

**Error Schemas:**

```typescript
// Always use common error schema
import { errorSchema } from "@/schemas/mailchimp/common/error.schema";
export const endpointErrorSchema = errorSchema;
```

#### Schema Creation Checklist (Critical Rules) {#schema-creation-checklist-critical-rules}

**Before creating new schemas, always check existing patterns:**

```bash
# Check parameter schema patterns
grep -r "ParamsSchema" src/schemas/mailchimp/*-params.schema.ts

# Check for reusable common schemas
grep -r "schemaName" src/schemas/mailchimp/common/

# Find similar endpoint schemas (for pattern reference)
ls src/schemas/mailchimp/*-success.schema.ts
```

**Parameter Schemas (`*-params.schema.ts`):**

1. ✅ **Export path and query schemas separately** (do NOT use `.merge()`)

   ```typescript
   // ✅ Good
   export const pathParamsSchema = z.object({ id: z.string().min(1) }).strict();
   export const queryParamsSchema = z
     .object({ count: z.coerce.number() })
     .strict();

   // ❌ Bad - DO NOT merge
   export const paramsSchema = pathParamsSchema.merge(queryParamsSchema);
   ```

2. ✅ **Always add `.strict()` with comment**

   ```typescript
   .strict(); // Reject unknown properties for input validation
   ```

3. ✅ **ID fields MUST use `.min(1)` to prevent empty strings**

   ```typescript
   campaign_id: z.string().min(1), // Campaign ID
   list_id: z.string().min(1), // List ID
   ```

4. ✅ **Use const arrays for enums**

   ```typescript
   export const SORT_FIELD = "month" as const;
   export const SORT_DIRECTIONS = ["ASC", "DESC"] as const;

   sort_field: z.literal(SORT_FIELD).optional(),
   sort_dir: z.enum(SORT_DIRECTIONS).optional(),
   ```

**Zod 4 Best Practices:**

- ✅ **Optional with default:** Use `.default(value)` alone
  ```typescript
  count: z.coerce.number().min(1).max(1000).default(10), // NOT .default(10).optional()
  ```
- ✅ **Optional without default:** Use `.optional()` alone
  ```typescript
  fields: z.string().optional(),
  ```
- ❌ **NEVER use `.default().optional()`** (redundant - `.default()` makes it optional automatically)

**Success Schemas (`*-success.schema.ts`):**

1. ✅ **All ID fields MUST use `.min(1)`**

   ```typescript
   list_id: z.string().min(1), // List ID
   campaign_id: z.string().min(1), // Campaign ID
   email_id: z.string().min(1), // Email ID
   ```

2. ✅ **Compare with similar endpoints** to match flat vs nested patterns
   - Check if other endpoints for same resource use nested objects or flat structure

3. ✅ **Check `common/` directory** for reusable schemas before inlining
   - `linkSchema`, `errorSchema`, `campaignIdPathParamsSchema`, etc.

4. ✅ **If duplicating schemas**, create GitHub issue for future refactoring
   - Add TODO comment with issue number

**Advanced Validation Patterns:**

From List Members implementation (October 2025):

```typescript
// ISO 8601 datetime with timezone offset
since_timestamp_opt: z.iso.datetime({ offset: true }).optional();

// IP address (IPv4 or IPv6)
ip_signup: z.union([z.ipv4(), z.ipv6()]).optional();

// ISO 4217 currency code (3 uppercase letters)
currency_code: z.string().length(3).toUpperCase();

// Boolean from query param (requires coercion)
vip_only: z.coerce.boolean().optional();

// Extracted enum constants (reusable)
export const MEMBER_STATUS_FILTER = [
  "subscribed",
  "unsubscribed",
  "cleaned",
  "pending",
  "transactional",
  "archived",
] as const;
status: z.enum(MEMBER_STATUS_FILTER).optional();
```

**Schema validation checklist:**

- ✅ Use `z.iso.datetime({ offset: true })` for timestamps with timezone
- ✅ Use `z.union([z.ipv4(), z.ipv6()])` for IP addresses
- ✅ Use `.length(3).toUpperCase()` for ISO 4217 currency codes
- ✅ Use `z.coerce.boolean()` for boolean query parameters
- ✅ Extract enums to constants for reusability and type safety

**Deprecated Fields:**

- Use inline comments (not TypeScript `@deprecated` JSDoc):
  ```typescript
  existing: z.number().int().min(0), // @deprecated - Always returns 0, do not use
  imports: z.number().int().min(0), // @deprecated - Always returns 0, do not use
  ```

#### Schema File Structure Standards

**File Header Format (JSDoc)**:

```typescript
/**
 * {Endpoint Name} {Params|Success|Error} Schema
 * {1-line description of what this validates}
 *
 * Endpoint: {METHOD} {/api/path}
 * Source: {URL to Mailchimp API docs or "User-provided actual structure"}
 */
```

**Property Comments (inline, NOT JSDoc blocks)**:

```typescript
export const listActivityItemSchema = z.object({
  day: z.iso.datetime({ offset: true }), // ISO 8601 date
  emails_sent: z.number().int().min(0), // Integer count of emails sent
  unique_opens: z.number().int().min(0), // Integer count of unique opens
});
```

**Schema Files Should Contain**:

- ✅ Import statements
- ✅ Constant arrays (enums): `export const STATUS = ["active", "inactive"] as const;`
- ✅ Schema definitions with inline comments
- ✅ Schema exports
- ❌ NO type exports (use `z.infer` in `/src/types` instead)
- ❌ NO helper functions (put in `/src/utils`)
- ❌ NO JSDoc blocks on individual properties (use inline comments)

**Error Schema Pattern (Minimal)**:

```typescript
/**
 * {Endpoint Name} Error Response Schema
 * Validates error responses from {endpoint description}
 *
 * Endpoint: {METHOD} {/path}
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

export const {endpoint}ErrorSchema = errorSchema;
```

**Reference**: `src/schemas/mailchimp/domain-performance-error.schema.ts`

**Note:** See [Schema Creation Checklist](#schema-creation-checklist-critical-rules) above for comprehensive schema standards and patterns.

**Note:** For table implementation patterns, see [Table Implementation Patterns](#table-implementation-patterns) in the Development Patterns section.

### Component Development

**Server Components by default:**

- **CRITICAL:** layouts (`layout.tsx`, `dashboard-shell.tsx`) and `not-found.tsx` MUST be Server Components (404 status codes)
- Only use `"use client"` for hooks (useState, useEffect) or browser APIs
- Extract client logic to child components, keep parent as Server Component
- **Tables:** Default to Server Components with URL-based pagination (see Table Implementation Patterns above)
- Enforced by architectural tests

**Patterns:** Atomic design, shadcn/ui base, JSDoc comments

### UI Component Patterns

#### Star Rating Display

**When to use**: Member ratings, reviews, quality scores (0-5 scale)

```typescript
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-3 w-3 ${
            index < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
          }`}
        />
      ))}
    </div>
  );
}
```

**Key points**:

- 5-star maximum (industry standard)
- Dark mode support with conditional classes
- Small size (`h-3 w-3`) for inline display
- Yellow fill for active stars, gray for inactive

#### Badge Variant Mapping

**Problem**: shadcn/ui Badge only has 4 variants, but you have 6+ statuses

**Solution**: Map multiple statuses to available variants

```typescript
function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "subscribed":
      return "default"; // Positive/active
    case "unsubscribed":
      return "destructive"; // Negative/error
    case "cleaned":
      return "secondary"; // Neutral/inactive
    case "pending":
      return "outline"; // Pending/transitional
    case "transactional":
      return "outline";
    case "archived":
      return "secondary";
    default:
      return "default";
  }
}
```

**Mapping strategy**:

- **default**: Positive/active states (subscribed, success, active)
- **destructive**: Negative/error states (unsubscribed, failed, error)
- **secondary**: Neutral/inactive states (cleaned, archived, disabled)
- **outline**: Pending/transitional states (pending, transactional, processing)

#### Clickable Primary Identifier with Subtext

**When to use**: Table cells with primary identifier + optional secondary info

```typescript
<TableCell>
  <div className="space-y-1">
    <Link
      href={`/mailchimp/lists/${listId}/members/${member.id}`}
      className="font-medium text-primary hover:underline"
    >
      {member.email_address}
    </Link>
    {member.full_name && (
      <div className="text-sm text-muted-foreground">
        {member.full_name}
      </div>
    )}
  </div>
</TableCell>
```

**Key points**:

- Primary identifier is clickable link
- `text-primary` for brand color consistency
- `hover:underline` for clear affordance
- Secondary info in smaller, muted text
- Conditional rendering of optional fields

**Examples**:

- Email + Name (list members)
- Campaign ID + Title (reports)
- List ID + Description (lists)

### Mailchimp Fetch Client Architecture

**Layers:** Server Actions → DAL → Action Wrapper → Fetch Client → Mailchimp API

**Files:**

- `src/lib/errors/mailchimp-errors.ts` - Error classes
- `src/lib/mailchimp-fetch-client.ts` - Native fetch client (Edge compatible)
- `src/lib/mailchimp-client-factory.ts` - `getUserMailchimpClient()`
- `src/lib/mailchimp-action-wrapper.ts` - `mailchimpApiCall()` returns ApiResponse<T>
- `src/dal/mailchimp.dal.ts` - Business logic (singleton)

**Usage:** `const result = await mailchimpDAL.fetchCampaignReports({ count: 10 }); if (!result.success) ...`

**Benefits:** 97% smaller bundle, Edge Runtime compatible, rate limit tracking, timeout handling

### OAuth Setup (Quick Reference)

**Mailchimp OAuth:**

1. Create Neon DB via Vercel (Storage tab)
2. `vercel env pull .env.local`
3. Register OAuth app at Mailchimp → Add client ID/secret to `.env.local`
4. Generate encryption key: `openssl rand -base64 32` → Add to `.env.local`
5. `pnpm db:push` → `pnpm dev`
6. Visit `/settings/integrations` to connect

**Kinde Local HTTPS:**

- **Required:** `KINDE_COOKIE_DOMAIN=127.0.0.1` in `.env.local` for OAuth state persistence
- **Troubleshooting "State not found":** `pkill -f "next dev"` → `pnpm clean` → `pnpm dev` → Clear browser cache → Test in incognito
- **Production:** Remove or set to custom domain

## Schema Refactoring Learnings

See [docs/development-patterns.md#schema-refactoring](docs/development-patterns.md#schema-refactoring) for detailed analysis of what works and what doesn't.

**Key Takeaway:** **Type safety > code deduplication**

**When to accept duplication:**

- Eliminating it breaks type inference
- Pattern is simple (4-5 lines) and stable
- Alternative requires manual type assertions everywhere

**Related Issues:** #222, #223 (October 2025)

## Pre-commit Hooks Setup

**First-time setup:**

```bash
# Configure Git to use Husky hooks
git config core.hooksPath .husky

# Verify hooks are enabled
git config core.hooksPath
# Should output: .husky
```

**Hooks run automatically on every commit:**

1. **Quick validation** (`pnpm type-check`) - **NEW:** Catches type errors BEFORE formatting
2. Format staged files (`pnpm lint-staged`)
3. Verify formatting (`pnpm format:check`)
4. Type-check again (`pnpm type-check`)
5. Run tests (`pnpm test`)
6. Accessibility tests (`pnpm test:a11y`)
7. Secret scan (`pnpm check:no-secrets-logged`)

**Note:** The early type-check (step 1) prevents lint-staged from removing "unused" type imports that are actually used. This improvement was added in Issue #213.

**Troubleshooting:**

If CI/CD fails with formatting errors but local commits succeed:

```bash
# Verify hooks are configured
git config core.hooksPath

# If empty, reconfigure
git config core.hooksPath .husky

# Verify hooks exist
ls -la .husky/pre-commit

# Test hooks with dummy commit
git add . && git commit -m "test: verify hooks" --allow-empty
```

**See:** `.husky/pre-commit` for complete hook configuration

## Security

- Never log env vars, API keys, OAuth tokens, secrets (auto-scanned)
- Environment validation: `src/lib/config.ts`
- All API endpoints use Zod validation
- OAuth tokens encrypted at rest (AES-256-GCM)
- HTTPS-only in production, CSRF protection via state params
