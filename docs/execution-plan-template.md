# Execution Plan Template

**Purpose:** This document provides a standard template for creating detailed, step-by-step execution plans for development tasks. Use this template to ensure consistent, cost-effective, and safe implementation of features and improvements.

**Last Updated:** 2025-10-19

**Document Length:** 2,130 lines (comprehensive AI reference documentation)

---

## 🤖 For AI: How to Use This Template

This template is **comprehensive reference documentation** for AI agents creating execution plans.

### Do NOT:

- ❌ Load entire file into every context unnecessarily
- ❌ Reference all sections for every plan
- ❌ Create 2,000+ line plans for users (plans should be < 800 lines)
- ❌ Skip critical sections marked [CRITICAL]

### DO:

- ✅ Reference specific sections as needed for the task
- ✅ Extract relevant patterns for the task at hand
- ✅ Generate focused plans (< 800 lines) following these guidelines
- ✅ **ALWAYS include Phase 0** (Git Setup - mandatory)
- ✅ **ALWAYS offer to create GitHub Issue** (Hybrid Approach)
- ✅ **ALWAYS check AI Self-Check section** before delivering plan to user
- ✅ Use priority markers to focus on critical elements first

### Section Priority Guide:

- **[CRITICAL]** - Must include in every execution plan
- **[IMPORTANT]** - Should include in most execution plans
- **[REFERENCE]** - Use as needed for specific situations
- **[OPTIONAL]** - Include if relevant to specific task

### AI Checklist: Every Execution Plan MUST Include

Before delivering an execution plan to the user, verify:

- [ ] **[CRITICAL]** Phase 0: Git Setup (lines 310-420) - Mandatory first phase
- [ ] **[CRITICAL]** Hybrid approach explained - Offer to create GitHub Issue
- [ ] **[CRITICAL]** Success criteria clearly defined
- [ ] **[IMPORTANT]** Files to create/modify listed
- [ ] **[IMPORTANT]** Verification steps after each phase
- [ ] **[IMPORTANT]** Commit checkpoints with messages
- [ ] **[IMPORTANT]** Time estimates per phase
- [ ] **[OPTIONAL]** Cost optimization clear points
- [ ] **[OPTIONAL]** Rollback strategy

**After generating plan, always ask:**

> "I can also generate a GitHub issue from this plan for easier tracking. Would you like me to create the issue body?"

---

## 📑 Quick Reference: Critical Sections

For AI agents generating execution plans, these sections are **mandatory**:

| Section                | Priority   | Line Reference  | Must Include                     |
| ---------------------- | ---------- | --------------- | -------------------------------- |
| **Hybrid Approach**    | [CRITICAL] | Lines 57-104    | Explain Markdown + GitHub Issues |
| **Phase 0 Template**   | [CRITICAL] | Lines 521-632   | Git setup, branch verification   |
| **Git Workflow**       | [CRITICAL] | Lines 403-510   | Branch strategy, commit format   |
| **Success Criteria**   | [CRITICAL] | Throughout      | What "done" looks like           |
| **GitHub Issue Offer** | [CRITICAL] | After plan      | Always ask if user wants issue   |
| **AI Self-Check**      | [CRITICAL] | Lines 1401-1515 | Verify before submitting         |

**Non-negotiable checklist before delivering plan:**

1. ✅ Phase 0 is first phase (git setup)
2. ✅ Hybrid approach explained
3. ✅ Offer to create GitHub Issue
4. ✅ Success criteria defined
5. ✅ Time estimates included
6. ✅ Verification steps after each phase

---

## [CRITICAL] How to Use This Template

### [CRITICAL] Hybrid Approach: Markdown + GitHub Issues

This template supports a **hybrid approach** that combines the best of both worlds:

**📄 Markdown Documentation** = Strategic depth, code examples, architectural decisions
**🎯 GitHub Issues** = Tactical execution, progress tracking, accountability

### Usage Workflow:

1. **Create Strategic Plan** (Markdown)
   - Share this template with Claude Code
   - Generate execution plan with analysis, code examples, decisions
   - Save in `docs/` as reference documentation

2. **Create Tactical Issue** (GitHub)
   - Convert plan phases into GitHub issue with checkboxes
   - Track progress with interactive task lists
   - Use labels, milestones, and project boards
   - Link to markdown plan for context

3. **Execute with Both**
   - Open GitHub issue for task tracking
   - Reference markdown plan for code examples and details
   - Check off tasks in GitHub as you complete them
   - Update markdown plan if you discover new requirements

### When to Use Each:

**Use Markdown Plan For:**

- Detailed code examples and snippets
- Architectural decisions and rationale
- Complex multi-step procedures
- Reference documentation
- Understanding the "why"

**Use GitHub Issues For:**

- Daily task tracking (check off items)
- Progress visibility
- Discussion and questions
- Blockers and decisions
- Understanding "what's left"

### Benefits of Hybrid:

- ✅ **Markdown** preserves deep context and examples
- ✅ **Issues** make execution trackable and visible
- ✅ **Issues** persist across conversations
- ✅ **Markdown** provides detailed reference when needed
- ✅ Best of both worlds: depth + trackability

---

## [IMPORTANT] GitHub Issue Creation Guidelines

### [IMPORTANT] Issue Structure Template

When creating a GitHub issue from an execution plan, use this structure:

```markdown
## Title Format:

[Type]: [Short Description] (Priority N)

Examples:

- Refactor: Extract Card Helper Utilities (Priority 1)
- Feature: Create Empty State Component (Priority 3)
- Fix: Consolidate Badge Helper Functions (Priority 4)

## Labels:

- Type: `refactor`, `feature`, `fix`, `chore`
- Priority: `priority-high`, `priority-medium`, `priority-low`
- Effort: `effort-low`, `effort-medium`, `effort-high`
- Impact: `impact-high`, `impact-medium`, `impact-low`
- Category: `technical-debt`, `dx-improvement`, `performance`

## Milestone:

Link to sprint/epic milestone (e.g., "Component Refactoring Sprint")

## Issue Body Template:

### Summary

[1-2 sentence description]

**Lines Saved:** XX+ | **Effort:** Low/Medium/High | **Impact:** High/Medium/Low

### Problem

[What's duplicated or broken]

### Files Affected

- [ ] path/to/file1.ts
- [ ] path/to/file2.tsx
- [ ] path/to/file3.ts

### Implementation Checklist

#### Phase 0: Setup (5-10 min)

- [ ] Create feature branch: `refactor/feature-name`
- [ ] Verify no existing work: `git log --oneline -10`
- [ ] Review related documentation

#### Phase 1: [Phase Name] (XX min)

- [ ] Specific task 1
- [ ] Specific task 2
- [ ] Run validation: `pnpm type-check`
- [ ] Commit: "feat(scope): description"

#### Phase 2: [Phase Name] (XX min)

- [ ] Specific task 1
- [ ] Specific task 2
- [ ] Run tests: `pnpm test`
- [ ] Commit: "test(scope): description"

#### Phase 3: Validation & PR (15 min)

- [ ] Manual testing
- [ ] Run full validation: `pnpm validate`
- [ ] Push branch
- [ ] Create PR linking this issue

### Success Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] All tests pass
- [ ] No visual regressions

### Related

- **Execution Plan:** [docs/path/to/plan.md](../path/to/plan.md)
- **Parent Epic:** #XXX (if applicable)
- **Related Issues:** #XXX, #XXX
```

### Issue Best Practices

1. **Keep Checkboxes Granular**
   - Each checkbox = 5-30 minutes of work
   - Too large = never checked off
   - Too small = checkbox fatigue

2. **Link to Markdown Plan**
   - Always include link to detailed markdown plan
   - Issue = checklist, Markdown = context

3. **Use Time Estimates**
   - Helps with sprint planning
   - Track actual vs estimated time in comments

4. **Update as You Go**
   - Check off tasks immediately after completing
   - Add new tasks if discovered during work
   - Comment on blockers or decisions

5. **Close with PR Reference**
   - Use "Closes #XXX" in PR description
   - Automatically closes issue when PR merges

### Converting Execution Plans to Issues

**For Small Plans (< 800 lines, 1-3 phases):**

- Create 1 GitHub issue with all phases as checkboxes
- Link to markdown plan for details

**For Large Plans (> 800 lines, 4+ phases):**

- Option A: Create 1 issue per phase (more granular)
- Option B: Create 1 epic issue with phase checkboxes
- Always link to phase-specific markdown files

**Example Multi-Issue Structure:**

```
Epic Issue: "Refactor Component DRY Issues"
├── Issue #1: Extract Card Utilities (Priority 1) → links to phase-1.md
├── Issue #2: Create Table Wrapper (Priority 2) → links to phase-2.md
├── Issue #3: Empty State Component (Priority 3) → links to phase-3.md
└── Project Board tracks all issues
```

---

## [CRITICAL] Plan Size Guidelines

### When to Split Into Multiple Files

**⚠️ IMPORTANT:** Execution plans longer than ~800 lines risk instructions being missed due to:

- Cognitive overload (too much information to process)
- Token/context limits
- Critical details buried in walls of text

**Split into separate phase files if:**

- Total plan exceeds 800 lines
- Project has 4+ implementation phases
- Multiple independent components being created
- Plan includes extensive code examples

**Example Structure for Split Plans:**

```
docs/
├── execution-plan-[feature-name].md          # Main overview (keep short, ~150-200 lines)
└── [feature-name]/
    ├── README.md                              # Explains structure, how to use
    ├── phase-0-setup.md                       # Git setup
    ├── phase-1-[component-a].md               # First component
    ├── phase-2-[component-b].md               # Second component
    ├── phase-3-[component-c].md               # Third component
    ├── phase-4-migrations.md                  # Example migrations
    ├── phase-5-documentation.md               # Final docs
    └── reference-checklists.md                # PR template, rollback, manual review
```

**Main Overview Should Contain:**

- Task summary and success criteria
- Files affected (high-level summary only)
- Phase breakdown with links to phase files
- How to use this plan
- Expected benefits

**Each Phase File Should Contain:**

- Pre-phase validation checklist (check if already done)
- Files to create/modify (specific to this phase)
- Implementation steps with code examples
- Validation steps
- Commit checkpoint
- Cost optimization note

**Reference File Should Contain:**

- Manual review checklist
- PR template and push strategy
- Rollback procedures
- Common issues and solutions
- Post-merge tasks

**Benefits of Split Structure:**

- ✅ Load only what you need when you need it
- ✅ Clearer focus on current task
- ✅ Better cost optimization (clear context between phases)
- ✅ Easier to update individual phases
- ✅ Reusable templates for similar projects

**Keep Single File When:**

- Total plan is under 800 lines
- Only 1-3 simple phases
- Minimal code examples
- Quick implementation (under 2 hours)

## [CRITICAL] Pre-Generation Checklist for AI

**Before generating an execution plan, Claude Code should:**

1. **Read project conventions** from CLAUDE.md to understand:
   - Import/export patterns (path aliases, barrel exports)
   - Type definitions location (`src/types/`)
   - Schema definitions location (`src/schemas/`)
   - Testing patterns and architectural enforcement

2. **Verify existing patterns** by reading:
   - Similar files to understand established patterns
   - Index files to see how exports are structured
   - Type files to understand where types are defined
   - Test files to understand testing conventions

3. **Check official documentation** if relevant:
   - Next.js error handling docs for error-related utilities
   - Framework-specific best practices
   - Library documentation for integrations

4. **Identify key files** by searching:
   - Where types are actually defined (not assumed locations)
   - How barrel exports are structured in the project
   - Existing similar implementations to reference

5. **Validate assumptions** before writing the plan:
   - File paths are correct (use Glob/Read to verify)
   - Import paths follow project conventions
   - Type/schema locations match project structure

---

## [IMPORTANT] Execution Plan Structure

### [IMPORTANT] 1. Overview Section

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
- **Documentation to reference** (e.g., Next.js docs, library docs)

**Files Affected**

Organize by category for clarity:

**Files to Create:**

**Types (following project architectural standards):**

- `src/types/[category]/[name].ts` - Type definitions with JSDoc
- `src/types/[category]/index.ts` - Barrel export (if new category)

**Components/Utilities:**

- `src/components/[feature]/[name].tsx` - Component implementation
- `src/utils/[category]/[name].ts` - Utility implementation
- Corresponding index.ts files for barrel exports

**Files to Modify:**

- `src/types/[category]/index.ts` - Export new types
- `src/types/index.ts` - Export new type category (if needed)
- `src/components/[feature]/index.ts` - Export new components
- Any pages/components using the new functionality

**Note:** All file paths should be verified before plan generation

---

### [IMPORTANT] 2. Pre-Implementation Checklist

Before writing any code:

- [ ] **Review related documentation** (PRD, technical specs, patterns)
- [ ] **Understand the current implementation** (if modifying existing code)
- [ ] **Identify existing patterns** to follow (e.g., similar components/pages)
- [ ] **Verify import/export patterns** (read existing index.ts files)
- [ ] **Verify type locations** (read src/types/index.ts and understand barrel exports)
- [ ] **Check for reusable utilities** that already exist
- [ ] **Review test requirements** (what needs to be tested?)
- [ ] **Verify environment setup** (dependencies installed, servers running)
- [ ] **Check official docs** if implementing framework-specific features (Next.js, React, etc.)

---

### [CRITICAL] 3. Git Workflow

#### [CRITICAL] Branch Strategy

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

**⚠️ CRITICAL: Branch Creation is MANDATORY**

**Before starting ANY implementation work, you MUST:**

1. **Verify current branch:**

   ```bash
   git branch --show-current
   ```

2. **If on `main`, STOP immediately and create feature branch:**

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
   ```

3. **Confirm you're on the feature branch:**
   ```bash
   git branch --show-current
   # Should output: feature/your-feature-name (NOT main)
   ```

**Initial Setup (REQUIRED FIRST STEP):**

```bash
# Ensure you're on main and up to date
git checkout main
git pull origin main

# Create new feature branch
git branch feature/your-feature-name
git checkout feature/your-feature-name

# Or use shorthand
git checkout -b feature/your-feature-name

# VERIFY you're on the correct branch
git branch --show-current
```

**❌ DO NOT PROCEED if `git branch --show-current` returns `main`**

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

### [CRITICAL] 4. Implementation Phases

Break down the implementation into phases with clear checkpoints.

**CRITICAL:** All execution plans MUST start with Phase 0 for git setup and pre-implementation validation.

---

#### [CRITICAL] Phase 0 Template (MANDATORY - Always Include This)

````markdown
## Phase 0: Git Setup and Pre-Implementation Validation

**Goal:** Ensure correct git branch setup and verify no work has already been completed

**Estimated Time:** 5-10 minutes

**⚠️ CRITICAL: This phase MUST be completed before any implementation work begins**

### Step 1: Verify Current Branch

```bash
# Check what branch you're currently on
git branch --show-current
```

**Expected outcomes:**

- ✅ **If on feature branch matching this plan:** Proceed to Step 2
- ❌ **If on `main` branch:** STOP and proceed to Step 1b
- ❌ **If on different feature branch:** Confirm with user before proceeding

**Step 1b: Create Feature Branch (if needed)**

**ONLY run these commands if you're on `main` or wrong branch:**

```bash
# Ensure main is up to date
git checkout main
git pull origin main

# Create and switch to feature branch
git checkout -b feature/[feature-name]

# Verify you're on the correct branch
git branch --show-current
# Should output: feature/[feature-name] (NOT main)
```

**🛑 DO NOT PROCEED if `git branch --show-current` still returns `main`**

### Step 2: Check for Existing Work

Before starting implementation, verify the work hasn't already been done:

```bash
# Check recent commit history
git log --oneline -15

# Look for commits related to this task
git log --oneline --all --grep="[keyword-from-task]"

# Check if key files already exist
ls [path-to-files-this-plan-will-create]
```

**If work is already complete:**

- Inform user: "This work appears to be already completed. Found commits: [list] and files: [list]"
- Ask: "Would you like me to verify the implementation or move to the next phase?"
- DO NOT re-implement already completed work

**If work is partially complete:**

- List what's done and what remains
- Ask user how to proceed

### Step 3: Review Pre-Implementation Checklist

Verify you understand the requirements:

- [ ] Read related documentation (PRD, technical specs)
- [ ] Understand current implementation patterns
- [ ] Identify files that will be created/modified
- [ ] Review project architectural standards (CLAUDE.md)
- [ ] Understand import/export patterns
- [ ] Know where types should be defined (`src/types/`)
- [ ] Know where schemas should be defined (`src/schemas/`)

### Step 4: Confirm Environment

```bash
# Verify Node.js and pnpm versions
node --version  # Should match project requirements
pnpm --version  # Should match project requirements

# Ensure dependencies are installed
pnpm install

# Verify dev server can start (don't keep running)
pnpm dev
# Press Ctrl+C to stop after confirming it starts
```

**Validation:**

- [ ] On correct feature branch: `git branch --show-current`
- [ ] No existing work that would be duplicated
- [ ] Pre-implementation checklist reviewed
- [ ] Environment verified and dependencies installed

**Checkpoint: Confirm Setup**

```bash
# Create initial commit to mark branch creation
git commit --allow-empty -m "chore: initialize feature branch for [feature-name]"
```

**✅ Phase 0 Complete - Ready to begin Phase 1**
````

---

#### [IMPORTANT] Phase N Template (For Implementation Phases)

````markdown
### Phase N: [Phase Name]

**Goal:** Clear statement of what this phase accomplishes

**Estimated Time:** X minutes/hours

**Pre-Phase Checklist (Check Before Starting):**

Before starting this phase, verify it hasn't already been completed:

- [ ] Check git commit history: `git log --oneline -10`
- [ ] Verify expected files don't exist: `ls [expected-file-path]` or use Read tool
- [ ] Check if related commits already exist (look for commit messages matching this phase)
- [ ] If phase is already complete, inform user and ask for next steps
- [ ] If partially complete, identify what's done and what remains

**Files to Create:**

**Types:**

- `src/types/[category]/[name].ts` - Type definitions with JSDoc
- `src/types/[category]/index.ts` - Barrel export

**Implementation:**

- `src/components/[feature]/[name].tsx` - Component implementation
- `src/components/[feature]/index.ts` - Barrel export

**Files to Modify:**

- `src/types/[category]/index.ts` - Export new types
- `src/types/index.ts` - Export type category (if new)
- Other affected files

**Implementation Steps:**

1. **Create type definitions FIRST**

   ```bash
   mkdir -p src/types/[category]
   ```

   - Create type definition file with JSDoc
   - Create/update barrel exports
   - Export from main types index

2. **Create implementation**

   ```bash
   mkdir -p src/components/[feature]
   ```

   - Import types from `@/types/[category]`
   - Implement component/utility
   - Create barrel export
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

### [OPTIONAL] 5. Cost Optimization Strategy

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

5. **When token usage exceeds 120K**
   - Monitor token usage in Claude Code
   - Clear before hitting limits

**🔴 Bad Times to Clear Conversation:**

1. **In the middle of debugging an error**
2. **Before committing work in progress**
3. **When you haven't validated changes yet**
4. **Before writing tests for code you just created**
5. **When token usage is low (<100K) and task is simple**
6. **During fast, continuous tasks (<3 hours estimated)**

**What to Keep After Clearing:**
- The execution plan document
- Any error messages or issues encountered
- Current task description and goals

**Decision Framework for Clearing:**

Use this framework to decide whether to clear at a suggested point:

```markdown
**💰 Cost Optimization Decision Point**

Check token usage first:

IF token usage > 120K:
  ✅ CLEAR conversation
  - High cost risk
  - Need to free up context
  Keep: execution plan, current phase, error messages

ELSE IF token usage < 100K AND task is simple (<3 hours):
  ⏩ CONTINUE without clearing
  - Sufficient budget remaining
  - Faster execution
  - Less context switching overhead

ELSE IF token usage 100K-120K:
  ⚖️ EVALUATE based on:
  - Task complexity (simple = continue, complex = clear)
  - Phase independence (independent = safe to clear)
  - Debugging status (active debugging = don't clear)
  - Time remaining (almost done = continue)
```

**Example Clear Points in Execution Plan:**

For plans that suggest clearing, use this improved format:

```markdown
**💰 Cost Optimization: CLEAR CONVERSATION (Conditional)**

Check token usage before deciding:

IF >120K tokens used:
  ✅ CLEAR - Safe because:
  - Phase 1 & 2 complete and committed
  - Utilities tested and working
  - Next phase is independent

IF <100K tokens used:
  ⏩ CONTINUE - Reasons:
  - Sufficient budget remaining
  - Simple refactoring task
  - Faster continuous execution
  - Plenty of token buffer

📋 If clearing, keep:
- This execution plan
- Current task: "Phase 3 - Validation and testing"
```

**AI Guidance:**

When reaching a suggested clear point, AI should:

1. **Check actual token usage** (not assume)
2. **Evaluate task complexity** (simple vs complex)
3. **Consider time remaining** (almost done vs long way to go)
4. **Make informed decision** based on criteria above
5. **Continue by default** if token budget allows and task is straightforward`

---

### [IMPORTANT] 6. Code Examples in Execution Plans

**[IMPORTANT] Quality Standards for Code Examples:**

All code examples in execution plans must follow project conventions exactly. Before writing any code example:

1. **Verify Import Paths:**

   ```bash
   # Read barrel exports to understand import patterns
   cat src/types/index.ts
   cat src/utils/index.ts
   cat src/components/index.ts
   ```

2. **Verify Export Patterns:**

   ```bash
   # Check if project uses relative or absolute paths in barrel exports
   grep "export \* from" src/utils/index.ts
   ```

3. **Verify Type Locations:**

   ```bash
   # Find where types are actually defined
   find src/types -name "*.ts" -type f
   ```

4. **Check Framework Documentation:**
   - For Next.js features: Check Next.js docs
   - For React patterns: Check React docs
   - For libraries: Check library docs

**Import Path Examples - RIGHT vs WRONG:**

```tsx
// ✅ RIGHT - Using barrel export from main index
import type { ApiResponse } from "@/types";

// ✅ RIGHT - Using barrel export from subfolder index
import type { BackButtonProps } from "@/types/components/not-found";

// ❌ WRONG - Importing from specific file (bypass barrel exports)
import type { ApiResponse } from "@/types/api-errors";
import type { BackButtonProps } from "@/types/components/not-found/back-button";

// ✅ RIGHT - Component importing types from @/types
import type { BackButtonProps } from "@/types/components/not-found";

// ❌ WRONG - Inline type definitions (should be in src/types/)
interface BackButtonProps {
  className?: string;
}

// ✅ RIGHT - Absolute path in barrel export
export * from "@/utils/errors/api-error-handler";
export * from "@/types/components/not-found/back-button";

// ❌ WRONG - Relative path in barrel export (depends on project)
export * from "./api-error-handler";
```

**Pre-Writing Checklist for Code Examples:**

- [ ] Verified import paths by reading index.ts files at multiple levels
- [ ] Checked project's barrel export pattern (relative vs absolute)
- [ ] Confirmed file locations with Glob/Bash
- [ ] Referenced official framework docs if applicable
- [ ] All imports use established project aliases (`@/types`, `@/components`)
- [ ] No assumed file locations without verification
- [ ] **CRITICAL:** No inline type definitions - all types defined in `src/types/`
- [ ] Type definitions organized in subfolder structure matching components
- [ ] Types exported through barrel exports (index.ts files)
- [ ] JSDoc comments included in type definitions

**Component Type Organization Pattern:**

When creating new components that need type definitions:

1. **Create type definition file FIRST:**

   ```
   src/types/components/[feature]/[component-name].ts
   ```

2. **Add JSDoc documentation:**

   ```tsx
   /**
    * Types for [ComponentName] component
    *
    * Follows project guidelines for centralized type definitions
    */

   /**
    * Props for the [ComponentName] component
    */
   export interface ComponentNameProps {
     /**
      * Description of the prop
      */
     propName: string;
   }
   ```

3. **Create/update barrel export in feature folder:**

   ```tsx
   // src/types/components/[feature]/index.ts
   export * from "@/types/components/[feature]/[component-name]";
   ```

4. **Update main types index if needed:**

   ```tsx
   // src/types/components/index.ts
   export * from "@/types/components/[feature]";
   ```

5. **Import types in component:**
   ```tsx
   // src/components/[feature]/[component-name].tsx
   import type { ComponentNameProps } from "@/types/components/[feature]";
   ```

**Real Example from 404 Fix:**

```
1. Created: src/types/components/not-found/back-button.ts
2. Created: src/types/components/not-found/index.ts
3. Updated: src/types/components/index.ts
4. Created: src/components/not-found/back-button.tsx (imports from @/types)
5. Created: src/components/not-found/index.ts
```

---

### [IMPORTANT] 7. Testing Strategy

**Test Levels:**

1. **Unit Tests**
   - Test individual functions/utilities in isolation
   - Location: Colocated with source files or in `src/test/`
   - Run: `pnpm test [test-file-path]`

2. **Integration Tests**
   - Test components with their dependencies
   - Location: `src/test/integration/`
   - Run: `pnpm test [test-file-path]`

3. **Architectural Enforcement Tests**
   - Verify project conventions are followed
   - Location: `src/test/architectural-enforcement/`
   - Tests: `alias-enforcement.test.ts`, `types-folder-enforcement.test.ts`, `deprecated-declarations.test.ts`
   - Run: `pnpm test src/test/architectural-enforcement/`
   - **These tests will fail if:**
     - Types are defined inline instead of in `src/types/`
     - Long relative paths are used instead of path aliases
     - Deprecated patterns are used (e.g., `z.string().datetime()`)

4. **Type Checking**
   - Ensure TypeScript types are correct
   - Run: `pnpm type-check`

5. **Linting**
   - Ensure code style is consistent
   - Run: `pnpm lint` or `pnpm lint:fix`

6. **Manual Testing**
   - Test in browser/UI
   - Verify user-facing functionality

**Testing Checkpoints:**

After each phase:

```bash
# Run specific tests
pnpm test path/to/new-test-file.test.ts

# Run architectural enforcement tests (IMPORTANT)
pnpm test src/test/architectural-enforcement/

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

### [IMPORTANT] 8. Manual Review Checklist

**Before Pushing to Origin**

Perform a thorough manual review:

- [ ] **Code Review**
  - [ ] All code follows project patterns and conventions
  - [ ] No commented-out code (unless intentional with explanation)
  - [ ] No console.logs or debug statements
  - [ ] No TODO comments without GitHub issue references
  - [ ] No hardcoded values that should be configurable

- [ ] **Type Safety & Architecture**
  - [ ] No `any` types (unless absolutely necessary with justification)
  - [ ] All imports use path aliases (`@/types`, `@/components`, `@/utils`)
  - [ ] Types defined in `/src/types` (not inline) - enforced by tests
  - [ ] Schemas defined in `/src/schemas` (not inline)
  - [ ] Types organized in subfolder structure matching features
  - [ ] All types exported through barrel exports (index.ts)
  - [ ] JSDoc comments on all type definitions
  - [ ] Component types import from `@/types/components/[feature]`

- [ ] **Testing**
  - [ ] All new functions have unit tests
  - [ ] All tests pass: `pnpm test`
  - [ ] Architectural enforcement tests pass: `pnpm test src/test/architectural-enforcement/`
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

### [REFERENCE] 9. Push and PR Strategy

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

### [REFERENCE] 10. Rollback Strategy

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

### [REFERENCE] 11. Common Pitfalls and How to Avoid Them

**Pitfall 1: Using Incorrect Import Paths in Code Examples**

- **Problem:** Code examples use wrong import paths (e.g., `@/types/api.ts` instead of `@/types`)
- **Solution:** Before writing examples, verify barrel export structure by reading index.ts files
- **Example Check:**
  ```bash
  # Read to understand export pattern
  cat src/types/index.ts
  cat src/utils/index.ts
  ```

**Pitfall 2: Using Relative Imports in Barrel Exports**

- **Problem:** Writing `export * from "./file"` instead of `export * from "@/path/file"`
- **Solution:** Read existing index.ts files to see the project's export pattern
- **Always verify:** Does this project use relative or absolute paths in barrel exports?

**Pitfall 3: Not Verifying File Locations**

- **Problem:** Assuming types are in `src/types/api.ts` when they're actually in `src/types/api-errors.ts`
- **Solution:** Use Glob or Bash to find actual file locations before writing the plan
- **Example:**
  ```bash
  find src/types -name "*api*.ts"
  ```

**Pitfall 4: Not Checking Framework Best Practices**

- **Problem:** Missing important framework-specific patterns (e.g., Next.js error handling)
- **Solution:** Fetch official documentation URLs when implementing framework features
- **Example:** For error handling utilities, check Next.js error handling docs first

**Pitfall 5: Not Committing Frequently Enough**

- **Problem:** Lose hours of work if something goes wrong
- **Solution:** Commit after each logical unit (aim for every 15-30 minutes)

**Pitfall 6: Pushing Broken Code**

- **Problem:** Breaks CI/CD or other developers' work
- **Solution:** Always run `pnpm validate` before pushing

**Pitfall 7: Not Clearing Context When Needed**

- **Problem:** High token costs, slower responses
- **Solution:** Follow clear points in execution plan

**Pitfall 8: Forgetting to Create Branch (MOST COMMON)**

- **Problem:** Commits go directly to main instead of feature branch
- **Impact:** Breaks git workflow, no PR review, harder to rollback, violates best practices
- **Solution:**
  - ALWAYS check branch BEFORE starting Phase 1: `git branch --show-current`
  - If on `main`, STOP and create feature branch immediately
  - Verify again after creating branch
  - Add this check to EVERY execution plan before Phase 1
- **Prevention:**
  - Execution plans MUST include git setup as Phase 0 or pre-Phase 1 checklist
  - AI should ALWAYS verify branch before starting implementation
  - User should run `git branch --show-current` and confirm it's NOT `main`

**Pitfall 9: Large, Unfocused Commits**

- **Problem:** Hard to review, hard to rollback
- **Solution:** Break work into small, focused commits

**Pitfall 10: Not Testing Before Committing**

- **Problem:** Commit broken code, waste time debugging later
- **Solution:** Run validation commands before each commit

**Pitfall 11: Not Reading Existing Code First**

- **Problem:** Duplicate existing functionality or violate patterns
- **Solution:** Always complete pre-implementation checklist

**Pitfall 12: Inline Type Definitions Instead of Centralized**

- **Problem:** Defining types inline in components instead of in `src/types/`
- **Impact:** Architectural enforcement tests will fail, types can't be reused
- **Solution:** ALWAYS create type definitions in `src/types/[category]/` first
- **Example:**

  ```tsx
  // ❌ WRONG - Inline type definition
  interface BackButtonProps {
    className?: string;
  }

  // ✅ RIGHT - Import from centralized location
  import type { BackButtonProps } from "@/types/components/not-found";
  ```

**Pitfall 13: Forgetting Barrel Exports for Types**

- **Problem:** Creating type files but not exporting them through index.ts
- **Impact:** Types can't be imported cleanly, violates project conventions
- **Solution:** Always create/update barrel exports at multiple levels
- **Example:**
  ```
  1. Create: src/types/components/not-found/back-button.ts
  2. Create/Update: src/types/components/not-found/index.ts
  3. Update: src/types/components/index.ts
  ```

**Pitfall 14: Bypassing Barrel Exports in Imports**

- **Problem:** Importing from specific files instead of barrel exports
- **Impact:** Violates project conventions, harder to refactor
- **Solution:** Always import from the nearest barrel export
- **Example:**

  ```tsx
  // ❌ WRONG - Bypassing barrel export
  import type { BackButtonProps } from "@/types/components/not-found/back-button";

  // ✅ RIGHT - Using barrel export
  import type { BackButtonProps } from "@/types/components/not-found";
  ```

**Pitfall 15: Not Checking if Phase is Already Complete**

- **Problem:** User says "Start Phase 2" but Phase 2 is already completed in git history
- **Impact:** Wasted time re-implementing or re-testing already completed work
- **Solution:** ALWAYS check git history and file existence before starting any phase
- **What to check:**
  - Git commit history: `git log --oneline -10`
  - File existence for files the phase should create
  - Commit messages matching the phase description
- **If already complete:** Inform user and ask whether to verify or move to next phase
- **Example:**

  ```bash
  # User says: "Start Phase 2"
  # First check:
  git log --oneline -10
  # See: "test(utils): add comprehensive tests for breadcrumb builder"
  # Response: "Phase 2 appears to be already completed. I can see commit 20799c6..."
  ```

**Pitfall 16: Creating Monolithic Execution Plans (CRITICAL)**

- **Problem:** Creating a single 2,000+ line execution plan instead of splitting into focused phase files
- **Impact:**
  - Instructions get missed due to cognitive overload
  - Token/context limits make it hard to reference entire plan
  - Critical details buried in walls of text
  - Harder to update and maintain
  - Poor developer experience
- **Solution:** Split execution plans over 800 lines into separate phase documents
- **When to split:**
  - Total plan exceeds 800 lines
  - 4+ implementation phases
  - Multiple independent components being created
  - Extensive code examples included
- **How to split:**
  - Main overview: ~150-200 lines (summary, phase links, benefits)
  - Phase files: 300-600 lines each (self-contained, focused)
  - Reference file: Manual review, PR template, rollback strategies
  - README: Explains structure and how to use
- **Example:**

  ```
  ❌ WRONG - Single 2,130 line file
  docs/execution-plan-card-standardization.md (2,130 lines)

  ✅ RIGHT - Split into focused files
  docs/execution-plan-card-standardization.md (162 lines)
  docs/card-standardization/
    ├── README.md
    ├── phase-0-setup.md (182 lines)
    ├── phase-1-stat-card.md (465 lines)
    ├── phase-2-stats-grid-card.md (469 lines)
    ├── phase-3-status-card.md (545 lines)
    ├── phase-4-migrations.md (264 lines)
    ├── phase-5-documentation.md (265 lines)
    └── reference-checklists.md (418 lines)
  ```

- **Benefits of splitting:**
  - ✅ Load only what you need when you need it (82% smaller per file)
  - ✅ Clearer focus on current task
  - ✅ Better cost optimization (clear context between phases)
  - ✅ Easier to update individual phases
  - ✅ Reusable phase templates for future projects
- **AI behavior:** Check plan size BEFORE generating. If it will exceed 800 lines, automatically use split structure

**Pitfall 17: Markdown-Only Execution Without Progress Tracking (NEW)**

- **Problem:** Using only markdown execution plans without GitHub Issues for tracking
- **Impact:**
  - Hard to see what's done vs. pending at a glance
  - Progress lost when conversation context clears
  - No persistence across sessions
  - Tasks get forgotten or repeated
  - No accountability or reminders
  - Difficult to collaborate or get help
- **Solution:** Use hybrid approach with GitHub Issues for task tracking
- **When to create GitHub Issue:**
  - Multi-phase refactoring (like the 6 priorities we identified)
  - Work spanning multiple sessions
  - When you need accountability/reminders
  - When progress visibility is important
  - For collaborative projects
- **How to hybrid:**
  - Markdown plan = Strategic depth, code examples, decisions
  - GitHub Issue = Tactical checklist, progress tracking
  - Open both: reference plan for "how", check off issue for "done"
- **Example:**

  ```
  ✅ RIGHT - Hybrid Approach

  📄 docs/refactoring/component-dry-refactoring-plan.md
     - Analysis of duplication
     - Code examples showing problems
     - Proposed solutions with details

  🎯 GitHub Issue #123: "Refactor: Extract Card Utilities (Priority 1)"
     ✅ Phase 0: Setup (complete)
     ✅ Phase 1: Create utilities (complete)
     ⏳ Phase 2: Update components (in progress)
       ✅ Update metric-card.tsx
       ✅ Update stat-card.tsx
       ⬜ Update stats-grid-card.tsx
       ⬜ Update status-card.tsx
     ⬜ Phase 3: Validation & PR
  ```

- **Benefits of hybrid:**
  - ✅ Visual progress at a glance
  - ✅ Persists across conversation clears
  - ✅ Can pick up where you left off days later
  - ✅ Notifications when issues are updated
  - ✅ Automatic PR linkage
  - ✅ Project board visualization
- **AI behavior:** After generating execution plan, always offer to create GitHub issue for tracking

---

## [CRITICAL] AI Self-Check Before Submitting Execution Plan

### [CRITICAL] For Hybrid Approach (Markdown + GitHub Issue)

When generating both markdown plan and GitHub issue:

**Markdown Plan Should Include:**

- [ ] Detailed problem analysis with code examples
- [ ] All duplicate code snippets side-by-side
- [ ] File paths with line numbers
- [ ] Architectural decisions and rationale
- [ ] Complete implementation examples
- [ ] All phases with detailed steps
- [ ] Reference for "how" and "why"

**GitHub Issue Should Include:**

- [ ] Concise summary (1-2 sentences)
- [ ] Impact metrics (lines saved, effort, impact)
- [ ] Task checklist with granular items (5-30 min each)
- [ ] Time estimates per phase
- [ ] Link to markdown plan for details
- [ ] Success criteria checkboxes
- [ ] Appropriate labels and milestone

**Offer to User:**
After generating execution plan, explicitly offer:

- "I can also generate a GitHub issue from this plan for easier tracking. Would you like me to create the issue body?"
- "This plan can be tracked via GitHub Issue. Should I generate the issue template?"

### [CRITICAL] Standard Self-Check

Before presenting the execution plan to the user, verify:

### [CRITICAL] Plan Size and Structure Check

- [ ] **Count total lines** - If plan exceeds 800 lines, MUST split into separate phase files
- [ ] **Phase count** - If 4+ implementation phases, MUST use split structure
- [ ] **Multiple components** - If creating 3+ independent components, MUST use split structure
- [ ] **If splitting required:**
  - [ ] Create main overview document (~150-200 lines)
  - [ ] Create separate phase-X-[name].md files
  - [ ] Create reference-checklists.md for manual review, PR, rollback
  - [ ] Create README.md explaining structure
  - [ ] Link all phase files from main overview
  - [ ] Each phase file is self-contained (300-600 lines max)
- [ ] **If keeping single file:**
  - [ ] Total lines under 800
  - [ ] Only 1-3 phases
  - [ ] Minimal code examples
  - [ ] Quick implementation (under 2 hours)

### [CRITICAL] Phase 0 Verification (MANDATORY)

- [ ] **Phase 0 is present** - Execution plan MUST start with Phase 0 (Git Setup and Pre-Implementation Validation)
- [ ] **Phase 0 includes all 4 steps:**
  - [ ] Step 1: Verify Current Branch (with `git branch --show-current`)
  - [ ] Step 2: Check for Existing Work (git log, ls commands)
  - [ ] Step 3: Review Pre-Implementation Checklist
  - [ ] Step 4: Confirm Environment (node, pnpm, dev server)
- [ ] **Branch creation instructions** - Clear commands for creating feature branch if needed
- [ ] **Branch name specified** - Exact feature branch name provided (e.g., `feature/page-layout-component`)
- [ ] **STOP warnings** - Explicit instruction to not proceed if on `main` branch
- [ ] **Existing work check** - Commands to verify work hasn't already been done
- [ ] **Phase 0 checkpoint** - Empty commit to mark branch creation
- [ ] **Phase 0 is numbered "0"** - Not called "Setup" or "Pre-Phase 1"

### Import/Export Verification

- [ ] Read `src/types/index.ts` to understand type import patterns
- [ ] Read `src/utils/index.ts` to understand utility export patterns
- [ ] Verified all code examples use correct import paths (barrel exports)
- [ ] Verified all barrel export examples use project's pattern (relative vs absolute)
- [ ] No assumed file paths - all verified with Glob/Bash/Read

### Type and Schema Verification

- [ ] Located actual type definition files (not assumed paths)
- [ ] Verified types are imported from barrel exports (e.g., `@/types/components/feature` not `@/types/components/feature/file`)
- [ ] **CRITICAL:** All type definitions in code examples are in `src/types/` (NEVER inline)
- [ ] Checked if schemas need to be in `src/schemas/` per project conventions
- [ ] All type references in code examples are correct
- [ ] Type folder structure mirrors component/feature structure
- [ ] JSDoc documentation included in all type examples
- [ ] Barrel exports created at all necessary levels (feature folder, category folder, main index)

### Framework Best Practices

- [ ] If Next.js feature: Fetched and referenced Next.js documentation
- [ ] If React pattern: Checked React best practices
- [ ] If error handling: Verified Next.js error handling conventions
- [ ] All code examples follow framework conventions

### File Path Verification

- [ ] All "Files to Create" have verified parent directories exist
- [ ] All "Files to Modify" verified to exist with Read/Glob
- [ ] All file paths use absolute paths from project root
- [ ] No guessed file locations

### Code Example Quality

- [ ] All imports use path aliases (e.g., `@/types`, `@/utils`, `@/components`)
- [ ] No relative imports in examples (unless project uses them)
- [ ] All barrel exports follow project pattern (absolute paths with `@/`)
- [ ] JSDoc examples reference correct types and imports
- [ ] **Type-first approach:** Examples show creating type definitions BEFORE components
- [ ] Examples show complete flow: type file → barrel exports → component import
- [ ] No inline type definitions in any code examples

### Documentation References

- [ ] Official docs fetched/referenced where applicable
- [ ] Links to docs included in plan
- [ ] Best practices from docs incorporated into examples

---

## [REFERENCE] Example Execution Plan

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

**Types:**

- `src/types/utils/errors.ts` - Error handler function types (if needed)

**Implementation:**

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
- [ ] Pre-implementation checklist (now part of Phase 0)
- [ ] **Phase 0: Git Setup and Pre-Implementation Validation** (MANDATORY)
  - [ ] Step 1: Verify Current Branch
  - [ ] Step 2: Check for Existing Work
  - [ ] Step 3: Review Pre-Implementation Checklist
  - [ ] Step 4: Confirm Environment
  - [ ] Empty commit checkpoint
- [ ] Phase 1-N: Implementation phases with clear goals
- [ ] Validation steps after each phase
- [ ] Strategic commit points
- [ ] Cost optimization clear points
- [ ] Testing strategy
- [ ] Manual review checklist
- [ ] Push and PR strategy
- [ ] Rollback plan
- [ ] Post-merge tasks

---

## [REFERENCE] Additional Best Practices

### [REFERENCE] Working with Claude Code

**Context Management:**

- Keep execution plan in context throughout implementation
- Clear context at designated checkpoints to save costs
- After clearing, re-share execution plan and current phase

**Incremental Approach:**

- Work through phases one at a time
- Don't skip validation steps
- Commit frequently for safety

**When User Says "Start Phase X" or References a GitHub Issue:**

CRITICAL - ALWAYS perform these checks in order BEFORE starting work:

1. **FIRST: Check current git branch**

   ```bash
   git branch --show-current
   ```

   - **If on `main`:** STOP immediately and inform user:
     - "⚠️ STOP: You are currently on the `main` branch. The execution plan requires work to be done on a feature branch."
     - "Please create the feature branch specified in the plan: `git checkout -b feature/your-feature-name`"
     - "Do NOT proceed with implementation until you're on the feature branch."
   - **If on feature branch:** Confirm branch name matches the plan, then proceed to step 2

2. **Check git history** for commits related to that phase

   ```bash
   git log --oneline -10
   ```

3. **Check if files exist** that the phase should create
   - Use `ls` or Read tool to verify

4. **If phase is already complete:**
   - Inform user: "Phase X appears to be already completed. I can see commit [hash] with message [message] and files [file list] already exist."
   - Provide summary of what was completed
   - Ask: "Would you like me to verify the phase is working correctly, or should we move to the next phase?"
   - **If working from GitHub Issue:** Remind user to check off completed tasks in the issue

5. **If phase is partially complete:**
   - List what's done and what remains
   - Ask user how to proceed
   - **If working from GitHub Issue:** Remind user which checkboxes should be marked

6. **If phase is not started AND on correct branch:**
   - Proceed with implementation as planned
   - **If working from GitHub Issue:** Remind user to check off tasks as they're completed

**❌ DO NOT START IMPLEMENTATION if user is on `main` branch**

**When Working from GitHub Issue:**

- After completing each major task, remind user: "✅ You can now check off [task name] in GitHub Issue #XXX"
- Keep track of what's been completed vs what remains
- At end of phase, summarize: "Phase complete. Please check off the following items in Issue #XXX: [list]"

**Communication:**

- Ask Claude to confirm understanding before starting each phase
- Share error messages immediately when they occur
- Request clarification on unclear steps
- **NEVER assume a phase needs to be done without checking if it's already complete**

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

## [REFERENCE] Questions to Ask When Creating an Execution Plan

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

## [REFERENCE] Appendix: Useful Git Commands

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

## [REFERENCE] Appendix: Useful pnpm Commands

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
