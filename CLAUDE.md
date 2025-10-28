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

### Path Aliases & Import Rules

**Aliases:** `@/*`, `@/components/*`, `@/actions/*`, `@/types/*`, `@/schemas/*`, `@/utils/*`, `@/lib/*`, `@/skeletons/*`

**Critical Rules:**

- ✅ Use path aliases (no relative imports) - enforced by tests
- ✅ Types in `/src/types` only - enforced by tests
- ✅ Schemas in `/src/schemas` only - enforced by tests
- ✅ Skeletons from `@/skeletons/mailchimp` NOT `@/components/ui/skeleton`
- ✅ Dates from `@/utils/format-date` NOT `@/utils/mailchimp/date`
- ✅ Breadcrumbs from `@/utils/breadcrumbs` (use `bc` utility)

**See:** [Development Patterns](docs/development-patterns.md) for complete import patterns

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

1. Update `docs/api-coverage.md` in **TWO places**:

   **A. Mark endpoint as ✅ Implemented (in endpoint list section):**
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

   **B. Update recommendation section (at bottom of file):**
   - ⚠️ **CRITICAL:** If the implemented endpoint is listed in the "💡 Recommendation" section, remove it or update the recommendations
   - Find alternative next priority endpoints
   - Update "Top Choice" and "Second Choice" to reflect remaining work

   **Why this matters:** Issue #358 - Member Activity and List Locations were completed but still appeared in recommendations, causing confusion and duplicate work attempts.

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

3. **⚠️ CRITICAL: Validate the update was successful**
   ```bash
   # Verify docs/api-coverage.md contains the ✅ marker for this endpoint
   git diff HEAD~1 docs/api-coverage.md | grep "✅.*{Endpoint Name}" || {
     echo ""
     echo "❌ CRITICAL ERROR: docs/api-coverage.md was not updated correctly!"
     echo ""
     echo "Expected to find: ✅ **{Endpoint Name}**"
     echo "But the marker was not added to docs/api-coverage.md"
     echo ""
     echo "Phase 4 Step 4 FAILED - Cannot proceed until fixed."
     echo ""
     exit 1
   }
   echo "✅ Verified: docs/api-coverage.md correctly marked as implemented"
   ```

**Why this validation matters:** Issue #338 - In PR #327 (List Interests), Phase 4 ran but Step 4 was silently skipped, leaving docs/api-coverage.md with stale 📋 markers. This led to duplicate work in Issue #336. This validation catches such failures immediately.

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

**📚 Complete Guide:** [docs/development-patterns.md](docs/development-patterns.md)

### Quick Reference

**Critical patterns to remember:**

- **Error Handling:** All pages must have `error.tsx` + `not-found.tsx`, NO `loading.tsx`. Use `handleApiError()` + `MailchimpConnectionGuard`
- **Tables:** Pagination OUTSIDE Card, Server Components by default
- **Navigation:** Use `CardFooter` with `Button asChild` + `ArrowRight` icon
- **Breadcrumbs:** `bc` utility from `@/utils/breadcrumbs`
- **Data Formatting:** `.toLocaleString()` for numbers, `formatDateTimeSafe()` for dates

### Common Import Patterns

```typescript
// Error handling
import { handleApiError } from "@/utils/errors";
import { MailchimpConnectionGuard } from "@/components/dashboard/mailchimp-connection-guard";
import { DashboardInlineError } from "@/components/dashboard/dashboard-inline-error";

// Date formatting
import { formatDateTimeSafe } from "@/utils/format-date";

// Breadcrumbs
import { bc } from "@/utils/breadcrumbs";

// Skeletons
import { MemberTagsSkeleton } from "@/skeletons/mailchimp";

// Page params
import { validatePageParams } from "@/utils/mailchimp/page-params";
```

### Schema Patterns

**📚 Complete Guide:** [docs/schema-patterns.md](docs/schema-patterns.md)

**Quick checklist:**

- ✅ Check for reusable common schemas first
- ✅ Export path/query schemas separately (no `.merge()`)
- ✅ Add `.strict()` with comment
- ✅ Use `.min(1)` for all ID fields
- ✅ Extract enums to constants
- ❌ NEVER use `.default().optional()` (redundant)

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
