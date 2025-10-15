# Execution Plan Template

**Purpose:** This document provides a standard template for creating detailed, step-by-step execution plans for development tasks. Use this template to ensure consistent, cost-effective, and safe implementation of features and improvements.

**Last Updated:** 2025-10-15

---

## How to Use This Template

1. **Share this document** with Claude Code along with your specific development task
2. **Request an execution plan** following this template structure
3. **Review the generated plan** before starting implementation
4. **Follow the plan step-by-step** to ensure nothing is missed
5. **Update the plan** as you discover new requirements or blockers

---

## Execution Plan Structure

### 1. Overview Section

**Task Summary**

- Clear, concise description of what will be built/changed
- Reference to related documentation (PRD, implementation plan, GitHub issue)
- Success criteria (what does "done" look like?)

**Estimated Effort**

- Total time estimate (e.g., 2-3 hours)
- Breakdown by phase if applicable

**Prerequisites**

- Required knowledge or context
- Dependencies that must be completed first
- Files or patterns to review before starting

**Files Affected**

- List of files that will be created
- List of files that will be modified
- List of files that will be deleted (if any)

---

### 2. Pre-Implementation Checklist

Before writing any code:

- [ ] **Review related documentation** (PRD, technical specs, patterns)
- [ ] **Understand the current implementation** (if modifying existing code)
- [ ] **Identify existing patterns** to follow (e.g., similar components/pages)
- [ ] **Check for reusable utilities** that already exist
- [ ] **Review test requirements** (what needs to be tested?)
- [ ] **Verify environment setup** (dependencies installed, servers running)

---

### 3. Git Workflow

#### Branch Strategy

**Branch Naming Convention:**

```bash
feature/description-of-feature
fix/description-of-fix
refactor/description-of-refactor
docs/description-of-docs-change
```

**Examples:**

- `feature/error-handling-utility`
- `feature/breadcrumb-builder`
- `refactor/extract-page-layout`

**Initial Setup:**

```bash
# Ensure you're on main and up to date
git checkout main
git pull origin main

# Create new feature branch
git branch feature/your-feature-name
git checkout feature/your-feature-name

# Or use shorthand
git checkout -b feature/your-feature-name
```

#### Commit Strategy

**Commit Early, Commit Often**

- Commit after each logical unit of work
- Commits should be small and focused
- Each commit should leave the codebase in a working state

**Commit Points (Recommended)**

1. After creating new utility/component files
2. After adding exports to index files
3. After writing tests
4. After updating first example page/component
5. After running validation suite (tests, type-check, lint)
6. After updating documentation

**Commit Message Format:**

```
<type>(<scope>): <short description>

<optional longer description>

<optional footer>
```

**Types:**

- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `test:` Adding or updating tests
- `docs:` Documentation changes
- `chore:` Maintenance tasks

**Examples:**

```bash
git commit -m "feat(utils): add error handling utilities for API responses"
git commit -m "test(utils): add unit tests for is404Error function"
git commit -m "refactor(pages): update reports page to use error handler"
git commit -m "docs: update CLAUDE.md with error handling patterns"
```

---

### 4. Implementation Phases

Break down the implementation into phases with clear checkpoints.

#### Phase Template

````markdown
### Phase N: [Phase Name]

**Goal:** Clear statement of what this phase accomplishes

**Estimated Time:** X minutes/hours

**Files to Create:**

- `path/to/file.ts` - Description

**Files to Modify:**

- `path/to/file.ts` - What changes will be made

**Implementation Steps:**

1. **Step description**
   ```bash
   # Commands to run (if applicable)
   ```
````

```tsx
// Code snippets (if helpful)
```

2. **Next step description**
   - Sub-step if needed
   - Another sub-step

**Validation:**

- [ ] Manual test: Description of what to verify
- [ ] Run: `pnpm type-check`
- [ ] Run: `pnpm lint`
- [ ] Run: `pnpm test [specific-test-file]`

**Checkpoint: COMMIT**

```bash
git add .
git commit -m "feat(scope): description of what was completed"
```

**💰 Cost Optimization: CLEAR CONVERSATION**

- Reason: Explain why this is a good point to clear context
- What to keep: List any important context to retain

````

---

### 5. Cost Optimization Strategy

**Token Management**

Clearing conversation context helps reduce costs. Here are optimal points to clear:

**🟢 Good Times to Clear Conversation:**

1. **After completing a full phase** with a git commit
   - You have a checkpoint to return to if needed
   - Implementation is validated and working

2. **Before starting a new, independent feature**
   - New feature doesn't depend on previous conversation
   - Can start fresh with just the plan

3. **After creating utility files but before using them**
   - Utilities are tested and committed
   - Next phase is just importing and using them

4. **After reading large files for context**
   - You've extracted the pattern/information needed
   - Don't need the full file content anymore

5. **When context window is filling up**
   - Monitor token usage in Claude Code
   - Clear before hitting limits

**🔴 Bad Times to Clear Conversation:**

1. **In the middle of debugging an error**
2. **Before committing work in progress**
3. **When you haven't validated changes yet**
4. **Before writing tests for code you just created**

**What to Keep After Clearing:**
- The execution plan document
- Any error messages or issues encountered
- Current task description and goals

**Example Clear Points in Execution Plan:**
```markdown
**💰 Cost Optimization: CLEAR CONVERSATION**
✅ Safe to clear because:
- Phase 1 is complete and committed
- Utilities are tested and working
- Next phase is independent (just consuming the utilities)

📋 What to keep:
- This execution plan
- File: docs/page-pattern-improvements.md
- Current task: "Implement error handling utility and update 3 pages"
````

---

### 6. Testing Strategy

**Test Levels:**

1. **Unit Tests**
   - Test individual functions/utilities in isolation
   - Location: Colocated with source files or in `src/test/`
   - Run: `pnpm test [test-file-path]`

2. **Integration Tests**
   - Test components with their dependencies
   - Location: `src/test/integration/`
   - Run: `pnpm test [test-file-path]`

3. **Type Checking**
   - Ensure TypeScript types are correct
   - Run: `pnpm type-check`

4. **Linting**
   - Ensure code style is consistent
   - Run: `pnpm lint` or `pnpm lint:fix`

5. **Manual Testing**
   - Test in browser/UI
   - Verify user-facing functionality

**Testing Checkpoints:**

After each phase:

```bash
# Run specific tests
pnpm test path/to/new-test-file.test.ts

# Run type checking
pnpm type-check

# Run linting
pnpm lint
```

Before committing:

```bash
# Run all tests
pnpm test

# Or run pre-commit checks
pnpm pre-commit
```

---

### 7. Manual Review Checklist

**Before Pushing to Origin**

Perform a thorough manual review:

- [ ] **Code Review**
  - [ ] All code follows project patterns and conventions
  - [ ] No commented-out code (unless intentional with explanation)
  - [ ] No console.logs or debug statements
  - [ ] No TODO comments without GitHub issue references
  - [ ] No hardcoded values that should be configurable

- [ ] **Type Safety**
  - [ ] No `any` types (unless absolutely necessary with justification)
  - [ ] All imports use path aliases (not relative paths in index.ts)
  - [ ] Types defined in `/src/types` (not inline)
  - [ ] Schemas defined in `/src/schemas` (not inline)

- [ ] **Testing**
  - [ ] All new functions have unit tests
  - [ ] All tests pass: `pnpm test`
  - [ ] Type checking passes: `pnpm type-check`
  - [ ] Linting passes: `pnpm lint`

- [ ] **Documentation**
  - [ ] JSDoc comments on all exported functions/components
  - [ ] README.md updated if adding new utilities/patterns
  - [ ] CLAUDE.md updated if establishing new patterns

- [ ] **Git Hygiene**
  - [ ] Review all changes: `git diff main`
  - [ ] Ensure no unintended files are staged
  - [ ] Commit messages follow conventions
  - [ ] Each commit leaves codebase in working state

- [ ] **Manual Testing**
  - [ ] Start dev server: `pnpm dev`
  - [ ] Test affected pages/components in browser
  - [ ] Test error states and edge cases
  - [ ] Test on different screen sizes (if UI change)

---

### 8. Push and PR Strategy

#### Before Pushing

```bash
# Final validation
pnpm validate  # Runs full validation suite

# Review all changes one more time
git log --oneline main..HEAD  # Review commit history
git diff main                 # Review all changes

# Ensure you're on the correct branch
git branch --show-current
```

#### Pushing to Origin

```bash
# First push of new branch
git push -u origin feature/your-feature-name

# Subsequent pushes
git push
```

#### Creating a Pull Request

**PR Title Format:**

```
<type>: <short description>
```

**Examples:**

- `feat: add error handling utilities for API responses`
- `refactor: extract common page layout pattern`
- `fix: resolve 404 detection in campaign pages`

**PR Description Template:**

```markdown
## Summary

Brief description of what this PR does

## Changes

- Created `src/utils/errors/api-error-handler.ts` with error handling utilities
- Added unit tests for error detection functions
- Updated 3 pages to use new error handlers

## Testing

- [x] Unit tests pass
- [x] Type checking passes
- [x] Manual testing completed
- [x] No console errors in browser

## Checklist

- [x] Code follows project patterns
- [x] Tests added/updated
- [x] Documentation updated
- [x] No breaking changes (or documented)

## Related

- Issue: #123
- Implementation Plan: docs/page-pattern-improvements.md (#1)
```

---

### 9. Rollback Strategy

**If Something Goes Wrong**

**Rollback Last Commit (not pushed):**

```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Undo last commit and discard changes (DANGEROUS)
git reset --hard HEAD~1
```

**Rollback to Previous Commit (not pushed):**

```bash
# See commit history
git log --oneline

# Rollback to specific commit (keep changes)
git reset --soft <commit-hash>

# Rollback to specific commit (discard changes)
git reset --hard <commit-hash>
```

**Rollback After Pushing:**

```bash
# Create a revert commit (safe, preserves history)
git revert <commit-hash>
git push
```

**Emergency: Discard All Changes**

```bash
# Stash current changes
git stash

# Or discard completely
git checkout .
git clean -fd  # Remove untracked files
```

---

### 10. Common Pitfalls and How to Avoid Them

**Pitfall 1: Not Committing Frequently Enough**

- **Problem:** Lose hours of work if something goes wrong
- **Solution:** Commit after each logical unit (aim for every 15-30 minutes)

**Pitfall 2: Pushing Broken Code**

- **Problem:** Breaks CI/CD or other developers' work
- **Solution:** Always run `pnpm validate` before pushing

**Pitfall 3: Not Clearing Context When Needed**

- **Problem:** High token costs, slower responses
- **Solution:** Follow clear points in execution plan

**Pitfall 4: Forgetting to Create Branch**

- **Problem:** Commits go directly to main
- **Solution:** Always check branch before first commit: `git branch --show-current`

**Pitfall 5: Large, Unfocused Commits**

- **Problem:** Hard to review, hard to rollback
- **Solution:** Break work into small, focused commits

**Pitfall 6: Not Testing Before Committing**

- **Problem:** Commit broken code, waste time debugging later
- **Solution:** Run validation commands before each commit

**Pitfall 7: Not Reading Existing Code First**

- **Problem:** Duplicate existing functionality or violate patterns
- **Solution:** Always complete pre-implementation checklist

---

## Example Execution Plan

Here's a concrete example of how an execution plan might look:

---

# Execution Plan: Implement Error Handling Utility

**Task Reference:** [docs/page-pattern-improvements.md](docs/page-pattern-improvements.md) - Improvement #1
**Estimated Effort:** 2-3 hours
**Created:** 2025-10-15

## Overview

**Goal:** Create reusable error handling utilities to standardize 404 detection and error handling across all pages, reducing code duplication and improving consistency.

**Success Criteria:**

- ✅ Error handling utilities created and tested
- ✅ At least 3 pages updated to use new utilities
- ✅ All tests pass
- ✅ Documentation updated

**Files to Create:**

- `src/utils/errors/api-error-handler.ts` - Core error handling functions
- `src/utils/errors/api-error-handler.test.ts` - Unit tests
- `src/utils/errors/index.ts` - Exports

**Files to Modify:**

- `src/utils/index.ts` - Add errors export
- `src/app/mailchimp/reports/[id]/page.tsx` - Use error handler
- `src/app/mailchimp/lists/[id]/page.tsx` - Use error handler
- `src/app/mailchimp/reports/[id]/opens/page.tsx` - Use error handler

## Pre-Implementation Checklist

- [ ] Review current error handling pattern in existing pages
- [ ] Review Next.js `notFound()` function documentation
- [ ] Review `ApiResponse` type definition
- [ ] Understand existing DAL response patterns

## Git Setup

```bash
# Create feature branch
git checkout main
git pull origin main
git checkout -b feature/error-handling-utility
```

---

## Phase 1: Create Error Handling Utilities

**Goal:** Create the core error handling functions with proper typing and documentation

**Estimated Time:** 30 minutes

**Implementation Steps:**

1. **Create the utility file**

   ```bash
   mkdir -p src/utils/errors
   touch src/utils/errors/api-error-handler.ts
   ```

2. **Implement error handling functions**
   - Create `is404Error()` function
   - Create `handleApiError()` function
   - Create `handleApiErrorWithFallback()` function
   - Add comprehensive JSDoc comments

3. **Create barrel export**

   ```bash
   touch src/utils/errors/index.ts
   ```

   - Export all functions from api-error-handler.ts

4. **Update main utils export**
   - Modify `src/utils/index.ts`
   - Add: `export * from "./errors";`

**Validation:**

- [ ] TypeScript compiles: `pnpm type-check`
- [ ] No linting errors: `pnpm lint`

**Checkpoint: COMMIT**

```bash
git add src/utils/errors/
git commit -m "feat(utils): add error handling utilities for API responses

- Add is404Error() to detect 404/not found errors
- Add handleApiError() for automatic 404 detection
- Add handleApiErrorWithFallback() for custom messages"
```

---

## Phase 2: Write Unit Tests

**Goal:** Ensure error handling functions work correctly with comprehensive test coverage

**Estimated Time:** 30 minutes

**Implementation Steps:**

1. **Create test file**

   ```bash
   touch src/utils/errors/api-error-handler.test.ts
   ```

2. **Write tests for `is404Error()`**
   - Test: Returns true for "not found"
   - Test: Returns true for "404"
   - Test: Returns true for "does not exist"
   - Test: Returns false for other errors

3. **Write tests for `handleApiError()`**
   - Test: Calls notFound() for 404 errors
   - Test: Returns error message for non-404 errors
   - Test: Returns null for successful responses

4. **Write tests for `handleApiErrorWithFallback()`**
   - Test: Uses custom fallback message
   - Test: Calls notFound() for 404 errors

**Validation:**

- [ ] All tests pass: `pnpm test src/utils/errors/api-error-handler.test.ts`
- [ ] Coverage is adequate (aim for 100% for utilities)

**Checkpoint: COMMIT**

```bash
git add src/utils/errors/api-error-handler.test.ts
git commit -m "test(utils): add comprehensive tests for error handling utilities

- Test 404 error detection with various messages
- Test notFound() is called for 404 errors
- Test error messages are returned correctly
- Test fallback message functionality"
```

**💰 Cost Optimization: CLEAR CONVERSATION**
✅ Safe to clear because:

- Phase 1 & 2 complete and committed
- Utilities are tested and working
- Next phase is independent (just using the utilities in pages)

📋 What to keep:

- This execution plan document
- Current task: "Update 3 pages to use error handling utilities"

---

## Phase 3: Update First Page (Proof of Concept)

**Goal:** Update campaign report detail page to use new error handlers

**Estimated Time:** 15 minutes

**Implementation Steps:**

1. **Read the current implementation**

   ```bash
   # Review current error handling pattern
   ```

2. **Update imports**

   ```tsx
   import { handleApiError } from "@/utils/errors";
   ```

3. **Replace inline error handling**
   - Find the inline 404 detection code
   - Replace with: `handleApiError(response);`

4. **Manual testing**
   - Start dev server: `pnpm dev`
   - Test valid campaign ID (should work normally)
   - Test invalid campaign ID (should show 404 page)

**Validation:**

- [ ] Page loads correctly for valid IDs
- [ ] 404 page shows for invalid IDs
- [ ] TypeScript compiles: `pnpm type-check`
- [ ] No console errors

**Checkpoint: COMMIT**

```bash
git add src/app/mailchimp/reports/[id]/page.tsx
git commit -m "refactor(pages): use error handler in campaign report page

- Replace inline 404 detection with handleApiError()
- Reduces code duplication
- Improves consistency"
```

---

## Phase 4: Update Remaining Pages

**Goal:** Apply the same pattern to list detail and opens pages

**Estimated Time:** 30 minutes

**Implementation Steps:**

1. **Update list detail page**
   - File: `src/app/mailchimp/lists/[id]/page.tsx`
   - Add import for `handleApiError`
   - Replace inline error handling
   - Manual test in browser

2. **Update opens page**
   - File: `src/app/mailchimp/reports/[id]/opens/page.tsx`
   - Add import for `handleApiError`
   - Replace inline error handling
   - Manual test in browser

**Validation:**

- [ ] All pages load correctly
- [ ] 404 handling works on all pages
- [ ] TypeScript compiles: `pnpm type-check`
- [ ] All tests pass: `pnpm test`

**Checkpoint: COMMIT**

```bash
git add src/app/mailchimp/lists/[id]/page.tsx src/app/mailchimp/reports/[id]/opens/page.tsx
git commit -m "refactor(pages): apply error handler to list and opens pages

- Update list detail page with handleApiError()
- Update opens page with handleApiError()
- Consistent error handling across all detail pages"
```

---

## Phase 5: Documentation and Final Validation

**Goal:** Update documentation and run full validation suite

**Estimated Time:** 15 minutes

**Implementation Steps:**

1. **Update CLAUDE.md** (if needed)
   - Document the new error handling pattern
   - Add usage examples

2. **Run full validation**

   ```bash
   pnpm validate
   ```

3. **Review all changes**
   ```bash
   git log --oneline main..HEAD
   git diff main
   ```

**Validation:**

- [ ] All tests pass
- [ ] Type checking passes
- [ ] Linting passes
- [ ] No console errors in dev server

**Checkpoint: COMMIT** (if documentation was updated)

```bash
git add CLAUDE.md
git commit -m "docs: add error handling utility usage pattern"
```

---

## Manual Review Checklist

Before pushing to origin:

- [ ] **Code Quality**
  - [ ] No `any` types used
  - [ ] All functions have JSDoc comments
  - [ ] No console.logs or debug code
  - [ ] Follows project conventions

- [ ] **Testing**
  - [ ] Unit tests added and passing
  - [ ] Manual browser testing completed
  - [ ] All validation commands pass

- [ ] **Documentation**
  - [ ] JSDoc added to all public functions
  - [ ] Usage patterns documented

- [ ] **Git**
  - [ ] Commit messages follow conventions
  - [ ] All changes staged and committed
  - [ ] On correct branch: `git branch --show-current`

---

## Push to Origin

```bash
# Final validation
pnpm validate

# Review commit history
git log --oneline main..HEAD

# Push to origin
git push -u origin feature/error-handling-utility
```

---

## Create Pull Request

**Title:** `feat: add error handling utilities for API responses`

**Description:**

```markdown
## Summary

Implements improvement #1 from page-pattern-improvements.md. Creates reusable error handling utilities to standardize 404 detection across all pages.

## Changes

- Created `src/utils/errors/api-error-handler.ts` with three utility functions
- Added comprehensive unit tests with 100% coverage
- Updated 3 pages to use new error handlers (campaign report, list detail, opens page)
- Reduced code duplication by ~15 lines per page

## Testing

- [x] Unit tests pass (8/8)
- [x] Type checking passes
- [x] Manual testing completed for all affected pages
- [x] 404 handling verified in browser

## Checklist

- [x] Code follows project patterns
- [x] Tests added with full coverage
- [x] No breaking changes
- [x] JSDoc documentation added

## Related

- Implementation Plan: docs/page-pattern-improvements.md (#1)
```

---

## Rollback Plan

If issues are discovered:

```bash
# If not pushed yet - reset to main
git reset --hard main

# If pushed - create revert commit
git revert <commit-hash>
git push
```

---

## Post-Merge Tasks

- [ ] Delete feature branch locally: `git branch -d feature/error-handling-utility`
- [ ] Delete feature branch remotely: `git push origin --delete feature/error-handling-utility`
- [ ] Check off improvement #1 in page-pattern-improvements.md
- [ ] Update project documentation if needed

---

**End of Execution Plan**

---

## Template Sections Checklist

When creating an execution plan, ensure it includes:

- [ ] Overview with clear goal and success criteria
- [ ] List of files to create/modify
- [ ] Pre-implementation checklist
- [ ] Git setup commands
- [ ] Multiple phases with clear goals
- [ ] Validation steps after each phase
- [ ] Strategic commit points
- [ ] Cost optimization clear points
- [ ] Testing strategy
- [ ] Manual review checklist
- [ ] Push and PR strategy
- [ ] Rollback plan

---

## Additional Best Practices

### Working with Claude Code

**Context Management:**

- Keep execution plan in context throughout implementation
- Clear context at designated checkpoints to save costs
- After clearing, re-share execution plan and current phase

**Incremental Approach:**

- Work through phases one at a time
- Don't skip validation steps
- Commit frequently for safety

**Communication:**

- Ask Claude to confirm understanding before starting each phase
- Share error messages immediately when they occur
- Request clarification on unclear steps

### File Organization

**Creating New Files:**

- Always create barrel exports (index.ts) for directories
- Follow existing file naming conventions
- Place files in appropriate directories

**Modifying Existing Files:**

- Read the full file before modifying
- Preserve existing patterns and style
- Use Edit tool for modifications (not Write)

### Testing Discipline

**Test as You Go:**

- Write tests immediately after creating utilities
- Test manually after each page update
- Don't accumulate untested changes

**Validation Commands:**

- `pnpm type-check` - Fast, run frequently
- `pnpm lint` - Fast, run frequently
- `pnpm test` - Run after adding/changing tests
- `pnpm validate` - Full suite, run before pushing

---

## Questions to Ask When Creating an Execution Plan

1. **Scope:**
   - Is this task too large and should be broken down?
   - Are there dependencies that should be completed first?

2. **Patterns:**
   - What existing patterns should be followed?
   - Are there similar implementations to reference?

3. **Testing:**
   - What level of testing is appropriate?
   - What edge cases need to be tested?

4. **Cost:**
   - Where are the natural break points for clearing context?
   - Which phases are independent vs. dependent?

5. **Risk:**
   - What could go wrong?
   - What's the rollback strategy?
   - Should changes be feature-flagged?

6. **Documentation:**
   - What documentation needs updating?
   - Are new patterns being established?

---

## Appendix: Useful Git Commands

**Status and Information:**

```bash
git status                    # Current status
git branch --show-current     # Current branch name
git log --oneline            # Commit history (short)
git log --oneline -n 5       # Last 5 commits
git diff                     # Unstaged changes
git diff --staged            # Staged changes
git diff main                # Changes vs main branch
```

**Branch Management:**

```bash
git branch                   # List local branches
git branch -a                # List all branches
git branch -d feature/name   # Delete local branch
git checkout main            # Switch to main
git checkout -b feature/new  # Create and switch to new branch
```

**Staging and Committing:**

```bash
git add .                    # Stage all changes
git add path/to/file         # Stage specific file
git reset path/to/file       # Unstage specific file
git commit -m "message"      # Commit staged changes
git commit --amend           # Amend last commit
```

**Remote Operations:**

```bash
git fetch                    # Fetch from remote
git pull                     # Pull from remote
git push                     # Push to remote
git push -u origin branch    # Push new branch
```

**Undoing Changes:**

```bash
git checkout -- file         # Discard changes to file
git reset --soft HEAD~1      # Undo last commit (keep changes)
git reset --hard HEAD~1      # Undo last commit (discard changes)
git revert <commit>          # Create revert commit
git stash                    # Stash current changes
git stash pop                # Apply stashed changes
```

---

## Appendix: Useful pnpm Commands

**Development:**

```bash
pnpm dev                     # Start dev server
pnpm build                   # Build for production
pnpm start                   # Start production server
```

**Code Quality:**

```bash
pnpm type-check              # TypeScript type checking
pnpm lint                    # Run ESLint
pnpm lint:fix                # Fix auto-fixable issues
pnpm format                  # Format with Prettier
pnpm format:check            # Check formatting
```

**Testing:**

```bash
pnpm test                    # Run all tests
pnpm test path/to/test       # Run specific test
pnpm test:watch              # Watch mode
pnpm test:coverage           # Coverage report
```

**Validation:**

```bash
pnpm quick-check             # Fast validation (type + lint)
pnpm pre-commit              # Full validation (format, lint, type, test)
pnpm validate                # Complete validation + build
```

---

**End of Template**
