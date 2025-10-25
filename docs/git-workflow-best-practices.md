# Git Workflow Best Practices

This document provides comprehensive guidance on Git workflows, pre-commit hooks, and commit strategies for this project.

## Table of Contents

- [Pre-Commit Hook Workflow](#pre-commit-hook-workflow)
- [Issue Discovery: Type Imports and Formatters](#issue-discovery-type-imports-and-formatters)
- [Recommended Development Workflow](#recommended-development-workflow)
- [Troubleshooting](#troubleshooting)

---

## Pre-Commit Hook Workflow

### Current Hook Configuration (Updated 2025-10-25)

The `.husky/pre-commit` hook runs validation in this specific order:

```bash
echo "🔍 Running pre-commit validation..."

# Step 1: ⚡ Quick validation - NEW (catches issues before formatting)
echo "⚡ Quick validation (catches issues before formatting)..."
pnpm type-check || { echo "❌ Type errors found! Fix before committing."; exit 1; }

# Step 2: 📝 Format and lint staged files
echo "📝 Formatting and linting staged files..."
pnpm lint-staged

# Step 3: ✅ Verify formatting
echo "✅ Verifying code formatting..."
pnpm format:check || { echo "❌ Format check failed! Run 'pnpm format' to fix."; exit 1; }

# Step 4: 🧪 Full validation suite
echo "🧪 Running full validation suite..."
pnpm check:no-secrets-logged && pnpm type-check && pnpm test && pnpm test:a11y
```

### Why This Order Matters

**Critical Improvement (Issue #213):** The early type-check in Step 1 prevents a subtle but frustrating issue where formatters can remove "unused" type imports that are actually used.

**Execution Flow:**

1. **Step 1 - Early Type-Check:** Validates original staged code before any modifications
2. **Step 2 - Formatting:** lint-staged reformats files (may remove imports, reorganize code)
3. **Step 3 - Format Verification:** Ensures formatting is consistent
4. **Step 4 - Full Validation:** Double-checks everything still works after formatting

**What Each Step Catches:**

- ✅ **Step 1:** Type errors in original code (before formatters can break it)
- ✅ **Step 2:** Auto-fixes formatting and linting issues
- ✅ **Step 3:** Catches formatting inconsistencies
- ✅ **Step 4:** Validates no secrets logged, types still work, tests pass, accessibility compliance

---

## Issue Discovery: Type Imports and Formatters

### The Problem

During implementation of Issue #213, we discovered that lint-staged (Prettier) can remove type-only imports after files are staged, causing type-check failures.

**What Happened:**

```typescript
// Original test file (correct)
import { AuthErrorRecovery, detectAuthErrorType } from "./auth-error-recovery";
import type { AuthErrorType } from "@/types/components/auth/error-recovery";

// Test uses AuthErrorType for type annotations
const errorTypes: AuthErrorType[] = ["network", "timeout", ...];
```

**Commit Attempt Flow:**

1. Developer writes code with correct type imports
2. Developer runs `git add -A` (stages all files)
3. Pre-commit hook runs `pnpm lint-staged`
4. **Prettier removes the type import** (thinks it's unused because type re-exports aren't detected)
5. Type-check fails: "Module declares 'AuthErrorType' locally but it is not exported"

### Root Cause

Type-only imports can be removed by formatters when they appear "unused", even though they ARE used for type annotations. This happens because:

- Type re-exports like `export type { Foo } from "@/types"` are not detected as "using" the type
- Prettier sees the import and doesn't find it in the component body
- Prettier removes it as an optimization
- Type-check then fails because the type is actually used

### The Solution

**Run type-check BEFORE lint-staged:**

```bash
# Catch type errors in original code
pnpm type-check || exit 1

# Then format (which might remove imports)
pnpm lint-staged

# Then verify formatting is correct
pnpm format:check

# Finally run full validation (catches if formatting broke something)
pnpm type-check && pnpm test && pnpm test:a11y
```

**Benefits:**

- ✅ Catches type errors before formatters can modify files
- ✅ Provides clearer error messages (based on original code)
- ✅ Prevents frustrating commit failures
- ✅ Reduces developer friction

### Architectural Best Practice

**Always import types from `@/types`, not from component files:**

```typescript
// ✅ CORRECT - Import types from @/types
import { AuthErrorRecovery } from "./auth-error-recovery";
import type { AuthErrorType } from "@/types/components/auth/error-recovery";

// ❌ INCORRECT - Importing type from component file
import { AuthErrorRecovery, type AuthErrorType } from "./auth-error-recovery";
```

**Why:**

- Types in `@/types` are guaranteed stable (architectural test enforcement)
- Formatters won't remove these imports
- Clearer separation of concerns
- Easier to refactor components without breaking type imports

**Enforcement:**

The architectural test `src/test/types-folder-enforcement.test.ts` ensures:

- No inline type definitions in components or actions
- All types must be in `@/types` directory
- Type re-exports are allowed: `export type { Foo } from "@/types"`

---

## Recommended Development Workflow

### Before Committing

**Option 1: Quick Validation (Recommended)**

```bash
# Stage your changes
git add -A

# Quick check before commit
pnpm type-check

# If types pass, commit
git commit -m "your message"
# Pre-commit hook will run full validation
```

**Option 2: Full Validation**

```bash
# Stage your changes
git add -A

# Run full validation suite
pnpm type-check && pnpm lint:fix && pnpm format && pnpm test

# Commit with confidence
git commit -m "your message"
```

**Option 3: Use Convenience Scripts**

```bash
# Quick check (type-check + lint)
pnpm quick-check

# Full validation (includes build)
pnpm validate

# Pre-commit validation (mirrors hook)
pnpm pre-commit
```

### When Pre-Commit Fails

**If the hook fails, follow these steps:**

```bash
# 1. Check what changed
git status
git diff

# 2. Identify the issue
pnpm type-check  # See type errors
pnpm lint        # See lint issues
pnpm format:check  # See format issues

# 3. Fix the issues
pnpm lint:fix    # Auto-fix lint issues
pnpm format      # Auto-format code
# Manually fix type errors if needed

# 4. Re-stage fixed files
git add -A

# 5. Try again
git commit -m "your message"
```

### Common Failure Scenarios

#### Scenario 1: Type Error After Formatting

**Symptoms:**

```
⚡ Quick validation (catches issues before formatting)...
✅ Type-check passed

📝 Formatting and linting staged files...
✅ lint-staged completed

🧪 Running full validation suite...
❌ Type-check failed: Cannot find name 'AuthErrorType'
```

**Cause:** Formatter removed a type import during lint-staged

**Fix:**

```bash
# Check what lint-staged changed
git diff

# Restore the type import or fix the import source
# Ensure types are imported from @/types, not component files

# Re-stage and commit
git add -A
git commit -m "your message"
```

**Note:** This scenario should be extremely rare now that we have early type-check validation.

#### Scenario 2: Format Check Fails

**Symptoms:**

```
✅ Verifying code formatting...
❌ Format check failed! Run 'pnpm format' to fix.
```

**Cause:** Files were modified outside of lint-staged, or formatting is inconsistent

**Fix:**

```bash
# Format all files
pnpm format

# Re-stage and commit
git add -A
git commit -m "your message"
```

#### Scenario 3: Tests Fail

**Symptoms:**

```
🧪 Running full validation suite...
❌ Tests failed: 2 failing
```

**Fix:**

```bash
# Run tests to see failures
pnpm test

# Fix the failing tests

# Re-stage and commit
git add -A
git commit -m "your message"
```

---

## Troubleshooting

### Pre-commit Hooks Not Running

**Check 1: Verify hooks path is configured**

```bash
git config --get core.hooksPath
# Expected output: .husky
```

**If empty or wrong:**

```bash
git config core.hooksPath .husky
```

**Check 2: Verify hook file exists and is executable**

```bash
ls -la .husky/pre-commit
# Should start with: -rwxr-xr-x
```

**If not executable:**

```bash
chmod +x .husky/pre-commit
```

**Check 3: Test hook manually**

```bash
# Run hook directly
./.husky/pre-commit

# Should see all validation steps run
```

**Check 4: Reinstall Husky**

```bash
# Reinstall dependencies (runs "prepare" script)
pnpm install

# Verify hooks are set up
git config --get core.hooksPath
```

### CI/CD Passes but Local Hooks Fail

**Possible causes:**

1. **Hooks not configured:** Run `git config core.hooksPath .husky`
2. **Different pnpm/node versions:** Check versions match CI (`node -v`, `pnpm -v`)
3. **Stale dependencies:** Run `pnpm install` to sync

### CI/CD Fails but Local Hooks Pass

**Possible causes:**

1. **Hooks not running locally:** Verify with `git config --get core.hooksPath`
2. **Committed files different from staged:** Check `git status` before commit
3. **Environment differences:** CI might have stricter settings

**Fix:**

```bash
# Reconfigure hooks
git config core.hooksPath .husky

# Test hooks work
git commit --allow-empty -m "test: verify hooks"

# Should see: 🔍 Running pre-commit validation...
```

### Bypassing Hooks (Use Sparingly!)

**When you might need this:**

- Emergency hotfix (hooks will still run in CI/CD)
- Debugging hook issues
- WIP commit (will fix before PR)

**Command:**

```bash
git commit --no-verify -m "message"
```

**⚠️ Warning:** CI/CD will still catch issues, but you'll waste time pushing broken code.

---

## First-Time Setup for New Developers

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/a4og5n/fichaz.git
   cd fichaz
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure Git hooks**

   ```bash
   git config core.hooksPath .husky
   ```

4. **Verify hooks are active**

   ```bash
   # Check configuration
   git config --get core.hooksPath
   # Should output: .husky

   # Test hooks run
   git commit --allow-empty -m "test: verify hooks"
   # Should see: 🔍 Running pre-commit validation...
   ```

5. **Optional: Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

### Verification Checklist

- [ ] `git config --get core.hooksPath` returns `.husky`
- [ ] Test commit shows validation messages
- [ ] `pnpm dev` starts development server
- [ ] `pnpm test` runs all tests
- [ ] `pnpm type-check` passes without errors

---

## Summary

### Key Takeaways

1. **Early type-check validation** prevents formatters from breaking type imports
2. **Always import types from `@/types`** directories, not component files
3. **Pre-commit hooks run in specific order** for a reason (don't bypass unless necessary)
4. **Verify hooks are configured** on first setup (`git config core.hooksPath .husky`)
5. **Run `pnpm type-check` before committing** to catch issues early

### Related Documentation

- **Pre-commit hook file:** `.husky/pre-commit`
- **Architectural tests:** `src/test/types-folder-enforcement.test.ts`
- **AI workflow learnings:** `docs/ai-workflow-learnings.md`
- **CLAUDE.md Git Strategy:** See "Git Strategy" section

### Related Issues

- **Issue #213:** Improve Authentication Resilience and Error Recovery (introduced early type-check validation)
- **Issue #214:** Refactor TanStack tables to server components

---

## Changelog

### 2025-10-25 - Early Type-Check Validation

**Added:**

- Pre-commit hook now runs `pnpm type-check` BEFORE `pnpm lint-staged`
- Prevents formatters from removing "unused" type imports
- Updated documentation with troubleshooting guide

**Impact:**

- Reduces frustrating commit failures
- Provides clearer error messages
- Improves developer experience

**Related PR:** #245 - Improve authentication resilience and error recovery (Phase 1)
