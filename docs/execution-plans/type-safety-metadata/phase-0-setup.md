# Phase 0: Git Setup and Pre-Implementation Validation

**Goal:** Ensure correct git branch setup and verify no work has already been completed

**Estimated Time:** 5-10 minutes

**⚠️ CRITICAL: This phase MUST be completed before any implementation work begins**

---

## Step 1: Verify Current Branch

```bash
# Check what branch you're currently on
git branch --show-current
```

**Expected outcomes:**

- ✅ **If on feature branch matching this plan:** Proceed to Step 2
- ❌ **If on `main` branch:** STOP and proceed to Step 1b
- ❌ **If on different feature branch:** Confirm with user before proceeding

### Step 1b: Create Feature Branch (if needed)

**ONLY run these commands if you're on `main` or wrong branch:**

```bash
# Ensure main is up to date
git checkout main
git pull origin main

# Create and switch to feature branch
git checkout -b feature/type-safety-metadata

# Verify you're on the correct branch
git branch --show-current
# Should output: feature/type-safety-metadata (NOT main)
```

**🛑 DO NOT PROCEED if `git branch --show-current` still returns `main`**

---

## Step 2: Check for Existing Work

Before starting implementation, verify the work hasn't already been done:

```bash
# Check recent commit history
git log --oneline -15

# Look for commits related to metadata type safety
git log --oneline --all --grep="metadata.*type\|type.*metadata\|createMetadataFunction"

# Check if type helper file already exists
ls src/types/components/metadata.ts 2>/dev/null && echo "✅ File exists" || echo "❌ File doesn't exist"

# Check existing metadata patterns in pages
grep -l "generateMetadata" src/app/**/page.tsx | head -5
```

**If work is already complete:**

- Inform user: "This work appears to be already completed. Found commits: [list] and files: [list]"
- Ask: "Would you like me to verify the implementation or move to the next phase?"
- DO NOT re-implement already completed work

**If work is partially complete:**

- List what's done and what remains
- Ask user how to proceed

---

## Step 3: Review Pre-Implementation Checklist

Verify you understand the requirements:

**Documentation to Review:**

- [ ] Read Next.js `generateMetadata` documentation
- [ ] Understand `params: Promise<T>` pattern in Next.js 15
- [ ] Review [page-pattern-improvements.md](../../page-pattern-improvements.md) - Improvement #6

**Code to Review:**

```bash
# Review current metadata implementations
grep -A 15 "generateMetadata" src/app/mailchimp/reports/[id]/opens/page.tsx
grep -A 15 "generateMetadata" src/app/mailchimp/reports/[id]/abuse-reports/page.tsx

# Review project type organization
ls -la src/types/components/
cat src/types/components/index.ts
```

**Understanding Requirements:**

- [ ] Understand current pain point (manual type annotations)
- [ ] Understand desired solution (type-safe helper function)
- [ ] Know where to place types (`src/types/components/`)
- [ ] Understand TypeScript generics for flexible type helpers
- [ ] Know project barrel export pattern

---

## Step 4: Confirm Environment

```bash
# Verify Node.js and pnpm versions
node --version  # Should be v24.7.0
pnpm --version  # Should be v10.15.0

# Ensure dependencies are installed
pnpm install

# Verify TypeScript compilation works
pnpm type-check

# Quick validation
pnpm quick-check
```

**Expected Results:**

- ✅ Node.js v24.7.0
- ✅ pnpm v10.15.0
- ✅ Dependencies installed
- ✅ Type checking passes
- ✅ Linting passes

---

## Validation Checklist

Before proceeding to Phase 1:

- [ ] ✅ On correct feature branch: `feature/type-safety-metadata`
- [ ] ✅ Verified branch with: `git branch --show-current`
- [ ] ✅ No existing work that would be duplicated
- [ ] ✅ Reviewed existing metadata implementations
- [ ] ✅ Understand project type organization
- [ ] ✅ Environment verified (node, pnpm, type-check passes)
- [ ] ✅ Pre-implementation checklist completed

---

## Checkpoint: Confirm Setup

```bash
# Create initial commit to mark branch creation
git commit --allow-empty -m "chore: initialize feature branch for type-safety-metadata"

# Verify commit was created
git log --oneline -1
```

**Expected output:**

```
abc1234 chore: initialize feature branch for type-safety-metadata
```

---

## ✅ Phase 0 Complete

**You are now ready to begin Phase 1!**

**What's Next:**

- User should confirm: "Start Phase 1" or open `phase-1-checklist.md`
- Do NOT proceed automatically to Phase 1

---

## 🛑 STOP HERE

**DO NOT PROCEED to Phase 1 without user confirmation**

Phase 0 is complete. Wait for user to:

1. Review the branch setup
2. Confirm readiness to start implementation
3. Explicitly say "Start Phase 1"

---

**Next:** [Phase 1: Create Type Helper](phase-1-checklist.md)
