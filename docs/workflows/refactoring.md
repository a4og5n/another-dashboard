# Large-Scale Refactoring Workflow

This document provides best practices for large-scale refactoring work based on successful schema reorganization (Issues #222, #223, October 2025).

## When to Use This Workflow

Use this workflow when:

- Refactoring affects **20+ files**
- Changes impact **multiple layers** (schemas, types, components, DAL)
- There's **risk of breaking existing functionality**
- You need to **test incrementally** before committing

**Examples:** Schema reorganization, folder restructuring, API layer refactoring, component pattern migrations

---

## Pre-Flight Checklist

Before starting any large refactoring, complete all four phases:

### 1. Analysis Phase

- [ ] Document current state (file count, structure, pain points)
- [ ] Identify all affected files and layers
- [ ] Check for existing patterns to follow
- [ ] Create GitHub issues for tracking
- [ ] Read `docs/ai-workflow-learnings.md` for similar past work

### 2. Planning Phase

- [ ] Break work into logical phases (2-4 phases recommended)
- [ ] Identify mandatory stop points for user review
- [ ] Plan rollback strategy for each phase
- [ ] Document expected outcomes per phase
- [ ] Create test plan (which tests must pass after each phase)

### 3. Git Setup

- [ ] Create dedicated feature branch: `refactor/{description}`
- [ ] Ensure you're NOT on main: `git branch --show-current`
- [ ] Link branch to GitHub issues if applicable

### 4. Baseline Validation

- [ ] Run full test suite: `pnpm test`
- [ ] Type-check passes: `pnpm type-check`
- [ ] Lint passes: `pnpm lint`
- [ ] Record baseline (e.g., "801 tests passing")

---

## Phased Refactoring Strategy

### Phase 0: Common Patterns (if applicable)

- Create reusable patterns/utilities first
- Write comprehensive tests (70+ tests recommended)
- Commit when tests pass
- **⏸️ User checkpoint:** Review common patterns before applying

### Phase 1: Low-Risk Refactoring

- Start with files that have fewest dependencies
- Refactor incrementally (5-10 files at a time)
- Run tests after each batch
- **⏸️ User checkpoint:** Review results, confirm approach works

### Phase 2: Medium-Risk Refactoring

- Apply patterns to more complex files
- Update import paths if needed
- Test thoroughly
- **⏸️ User checkpoint:** Review before proceeding to structural changes

### Phase 3: High-Risk Structural Changes

- Folder reorganization, file moves
- Bulk import path updates (use automation)
- Final validation
- **⏸️ User checkpoint:** Full testing before PR

---

## Mandatory Stop Points During Refactoring

### ⏸️ STOP POINT 1: After Creating Common Patterns

User must:

- Review factory functions/utilities for correctness
- Verify tests cover edge cases
- Approve approach before applying to real files

### ⏸️ STOP POINT 2: After First Batch (5-10 files)

User must:

- Verify refactored files maintain functionality
- Check type inference still works
- Confirm no regressions in tests

### ⏸️ STOP POINT 3: After Type Errors

If TypeScript errors appear after refactoring:

- **STOP immediately**
- Analyze root cause (type inference issue? missing import?)
- **DO NOT proceed** if errors indicate fundamental problem
- Consider rollback if approach is flawed

### ⏸️ STOP POINT 4: Before Structural Changes

User must:

- Approve folder structure plan
- Review import path update strategy
- Confirm all previous phases successful

### ⏸️ STOP POINT 5: Before Creating PR

User must:

- Test affected functionality in browser
- Verify all validation passes
- Review commit history for clarity

---

## Refactoring Automation Scripts

### Import Path Bulk Updates

```bash
#!/bin/bash
# Update import paths after folder reorganization
# Save as /tmp/update-imports.sh

# Example: Move schema files to nested folders
declare -A PATH_MAPPINGS=(
  ["abuse-reports-params.schema"]="reports/abuse-reports/params.schema"
  ["abuse-reports-success.schema"]="reports/abuse-reports/success.schema"
  ["abuse-reports-error.schema"]="reports/abuse-reports/error.schema"
  # ... add more mappings
)

for old_path in "${!PATH_MAPPINGS[@]}"; do
  new_path="${PATH_MAPPINGS[$old_path]}"

  # Update all imports across codebase
  find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' \
    "s|@/schemas/mailchimp/${old_path}|@/schemas/mailchimp/${new_path}|g" {} +

  echo "✅ Updated imports: ${old_path} → ${new_path}"
done

echo "🎉 All import paths updated"
```

### File Move Script (preserves git history)

```bash
#!/bin/bash
# Move schema files to new structure with git mv
# Save as /tmp/reorganize-schemas.sh

# Create target directories
mkdir -p src/schemas/mailchimp/reports/{abuse-reports,advice,click-details}

# Move files with git mv (preserves history)
git mv src/schemas/mailchimp/abuse-reports-params.schema.ts \
       src/schemas/mailchimp/reports/abuse-reports/params.schema.ts

git mv src/schemas/mailchimp/abuse-reports-success.schema.ts \
       src/schemas/mailchimp/reports/abuse-reports/success.schema.ts

# ... repeat for all files

echo "✅ Files moved with git history preserved"
```

### Validation After Automation

```bash
#!/bin/bash
# Run after automated changes to verify everything works
# Save as /tmp/validate-refactoring.sh

echo "🔍 Running validation..."

echo "1️⃣ Type-checking..."
pnpm type-check || { echo "❌ Type errors found"; exit 1; }

echo "2️⃣ Linting..."
pnpm lint || { echo "❌ Lint errors found"; exit 1; }

echo "3️⃣ Running tests..."
pnpm test || { echo "❌ Tests failing"; exit 1; }

echo "4️⃣ Checking imports..."
# Ensure no leftover old import paths
if grep -r "@/schemas/mailchimp/abuse-reports-params.schema" src/; then
  echo "❌ Found old import paths"
  exit 1
fi

echo "✅ All validation passed!"
```

---

## Rollback Procedures

### Before Each Phase

Tag current state for easy rollback:

```bash
git tag refactor-phase-1-start
git tag refactor-phase-2-start
# etc.
```

### To Rollback a Single Commit

```bash
# If last commit broke something
git reset HEAD~1          # Undo commit, keep changes
git restore <files>       # Discard changes to specific files

# Or hard reset (lose all changes)
git reset --hard HEAD~1
```

### To Rollback Entire Phase

```bash
# Return to phase start
git reset --hard refactor-phase-2-start

# Or return to specific commit
git log --oneline  # Find commit hash
git reset --hard <commit-hash>
```

### To Rollback After Push

```bash
# ⚠️ ONLY on feature branches, NEVER on main
git reset --hard <commit-hash>
git push --force-with-lease origin refactor/branch-name
```

---

## Red Flags During Refactoring

### 🚩 STOP if you see:

1. **Type errors increase** - Refactoring should maintain or improve type safety
2. **Tests start failing** - Indicates regression or breaking change
3. **Import cycles appear** - Suggests architectural problem
4. **Bundle size increases significantly** - May indicate duplication or bloat
5. **More than 3 attempts needed to fix validation** - Approach may be flawed

### When to Abort and Revert

- Multiple TypeScript errors that spread across codebase
- Fundamental type inference breaks (e.g., factory functions losing specificity)
- Tests fail and root cause is unclear
- Refactoring creates more complexity than it removes

### How to Document Failures

```markdown
## Attempted Refactoring: [Name]

**Goal:** [What we tried to achieve]

**Approach:** [How we tried to do it]

**Result:** ❌ Reverted

**Why it failed:**

- Root cause explanation
- TypeScript limitation / architectural constraint
- Example of what broke

**Lessons learned:**

- What we learned about the codebase
- Why the original pattern exists
- When to accept duplication
```

---

## Commit Strategy for Large Refactorings

### Granular Commits (Recommended)

Break refactoring into 5-7 small commits:

```bash
# 1. Common patterns
git add src/schemas/mailchimp/common/
git commit -m "refactor: add common schema patterns

- Created pagination-params.schema with reusable patterns
- Added path-params.schema for campaign/list IDs
- Includes 70 comprehensive tests"

# 2. First batch of refactored files
git add src/schemas/mailchimp/{file1,file2,file3}*.ts
git commit -m "refactor: apply common patterns to 8 parameter schemas

- Reduced code duplication by 110 lines (39%)
- Maintains full type safety
- All tests passing"

# 3. Folder reorganization
git add src/schemas/mailchimp/
git commit -m "refactor: reorganize schemas into hierarchical structure

- Moved 47 schema files to resource-based folders
- Used 'git mv' to preserve file history
- Updated src/schemas/mailchimp/index.ts"

# 4. Import path updates
git add src/
git commit -m "refactor: update import paths after schema reorganization

- Updated 61 files with new schema paths
- Automated with bash script for consistency"

# 5. Documentation
git add docs/ CLAUDE.md
git commit -m "docs: document schema refactoring learnings

- Added refactoring workflow to CLAUDE.md
- Updated api-coverage.md with new paths"
```

### Benefits of Granular Commits

- Easy to review (5-10 minutes per commit)
- Clear progression through refactoring
- Easy to rollback specific changes
- Better git blame/history

---

## Post-Refactoring Checklist

After completing all phases:

- [ ] All tests passing: `pnpm test`
- [ ] Type-check passes: `pnpm type-check`
- [ ] Lint passes: `pnpm lint`
- [ ] Format check passes: `pnpm format:check`
- [ ] No TODO comments left (or documented in issues)
- [ ] Updated relevant documentation (CLAUDE.md, README, etc.)
- [ ] Import paths updated everywhere
- [ ] Git history preserved (used `git mv` for file moves)
- [ ] Commit history is clean and logical
- [ ] PR description explains motivation and approach

---

## Case Study: Schema Refactoring (October 2025)

### Context

Issues #222 (folder reorg) + #223 (DRY refactoring)

### Phases Executed

1. **Phase 1:** Common patterns (70 tests, 3 schemas) ✅
2. **Phase 2a:** Parameter refactoring (8 files, 110 lines saved) ✅
3. **Phase 2b:** Success schema refactoring ❌ (Type inference broke, reverted)
4. **Phase 3:** Folder reorganization (47 files moved, 61 files updated) ✅

### Results

- 39% code reduction in parameter schemas
- Full type safety maintained
- All 801 tests passing
- Discovered TypeScript limitation with factory functions
- Documented learnings in CLAUDE.md

### Key Lesson

**Type safety > code deduplication**

When factory functions broke type inference for success schemas, we kept the explicit pattern. Some duplication is acceptable when the alternative breaks type safety.

---

## Related Documentation

- [AI-First Development Workflow](README.md) - Standard implementation workflow
- [docs/ai-workflow-learnings.md](../ai-workflow-learnings.md) - Session reviews and patterns
- [Schema Refactoring Learnings](../development-patterns.md#schema-refactoring) - TypeScript limitations and decisions
