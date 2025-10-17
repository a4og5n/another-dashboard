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

- ✅ **If on feature branch matching this plan:** `feature/consistent-comment-headers` → Proceed to Step 2
- ❌ **If on `main` branch:** STOP and proceed to Step 1b
- ❌ **If on different feature branch:** Confirm with user before proceeding

---

## Step 1b: Create Feature Branch (if needed)

**ONLY run these commands if you're on `main` or wrong branch:**

```bash
# Ensure main is up to date
git checkout main
git pull origin main

# Create and switch to feature branch
git checkout -b feature/consistent-comment-headers

# Verify you're on the correct branch
git branch --show-current
# Should output: feature/consistent-comment-headers (NOT main)
```

**🛑 DO NOT PROCEED if `git branch --show-current` still returns `main`**

---

## Step 2: Check for Existing Work

Before starting implementation, verify the work hasn't already been done:

```bash
# Check recent commit history
git log --oneline -15

# Look for commits related to comment headers or page documentation
git log --oneline --all --grep="comment header"
git log --oneline --all --grep="page header"
git log --oneline --all --grep="JSDoc"

# Check if VSCode snippet already exists
ls -la .vscode/page-header.code-snippets

# Check if pages already have standardized headers (sample check)
head -n 10 src/app/mailchimp/lists/page.tsx
```

**If work is already complete:**

- Inform user: "This work appears to be already completed. Found commits: [list] and VSCode snippet exists at .vscode/page-header.code-snippets"
- Ask: "Would you like me to verify the implementation or move to the next phase?"
- DO NOT re-implement already completed work

**If work is partially complete:**

- List what's done (e.g., "VSCode snippet exists but only 4/13 pages have headers")
- List what remains (e.g., "9 pages still need headers added")
- Ask user how to proceed

---

## Step 3: Review Pre-Implementation Checklist

Verify you understand the requirements:

- [ ] Read [execution-plan.md](execution-plan.md) - Full plan overview
- [ ] Understand current state: 4 pages have headers (inconsistent), 9 pages don't
- [ ] Review proposed standard template format
- [ ] Know which files will be created (VSCode snippet)
- [ ] Know which files will be modified (13 page.tsx files + CLAUDE.md)
- [ ] Understand this is documentation-only (no functionality changes)

---

## Step 4: Confirm Environment

```bash
# Verify Node.js and pnpm versions
node --version  # Should be v24.7.0
pnpm --version  # Should be v10.15.0

# Ensure dependencies are installed
pnpm install

# Verify dev server can start (optional - don't keep running)
# pnpm dev
# Press Ctrl+C to stop after confirming it starts
```

**Note:** Dev server check is optional for this task since we're only adding comments.

---

## Step 5: Validation Checklist

**Before proceeding to Phase 1:**

- [ ] On correct feature branch: `git branch --show-current` shows `feature/consistent-comment-headers`
- [ ] No existing work that would be duplicated
- [ ] Pre-implementation checklist reviewed
- [ ] Environment verified and dependencies installed
- [ ] Understand the standard header template format

---

## Checkpoint: Confirm Setup

```bash
# Verify branch one more time
git branch --show-current
# Expected: feature/consistent-comment-headers

# Create initial commit to mark branch creation
git commit --allow-empty -m "chore: initialize feature branch for consistent comment headers"

# Verify commit was created
git log --oneline -1
```

---

## ✅ Phase 0 Complete - Ready to Begin Phase 1

**Before continuing:**

- ✅ On feature branch: `feature/consistent-comment-headers`
- ✅ No duplicate work exists
- ✅ Environment ready
- ✅ Empty commit created as checkpoint

**Next Steps:**

User should open [phase-1-checklist.md](phase-1-checklist.md) to begin Phase 1.

**💰 Cost Optimization Note:** Safe to clear conversation here if needed. Keep:

- This execution plan
- Current task: "Phase 0 complete, ready to start Phase 1"
