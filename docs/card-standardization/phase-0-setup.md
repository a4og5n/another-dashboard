# Phase 0: Git Setup and Pre-Implementation Validation

**Estimated Time:** 5-10 minutes

**⚠️ CRITICAL: This phase MUST be completed before any implementation work begins**

---

## Goal

Ensure correct git branch setup and verify no work has already been completed.

---

## Pre-Phase Checklist

Before starting any work:

- [ ] Review `BaseMetricCard` component implementation
- [ ] Review existing Card usage in OpensCard, ClicksCard, DeliveryStatusCard
- [ ] Review project component testing patterns (button.test.tsx)
- [ ] Understand accessibility testing with axe-core
- [ ] Review Badge, Progress, and other UI components used in Cards
- [ ] Verify TypeScript strict mode configuration

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
git checkout -b feature/card-component-standardization

# Verify you're on the correct branch
git branch --show-current
# Should output: feature/card-component-standardization (NOT main)
```

**🛑 DO NOT PROCEED if `git branch --show-current` still returns `main`**

---

## Step 2: Check for Existing Work

Before starting implementation, verify the work hasn't already been done:

```bash
# Check recent commit history
git log --oneline -15

# Look for commits related to Card standardization
git log --oneline --all --grep="card"
git log --oneline --all --grep="StatCard"

# Check if key files already exist
ls src/components/ui/stat-card.tsx 2>/dev/null && echo "StatCard exists" || echo "StatCard does not exist"
ls src/components/ui/stats-grid-card.tsx 2>/dev/null && echo "StatsGridCard exists" || echo "StatsGridCard does not exist"
ls src/components/ui/status-card.tsx 2>/dev/null && echo "StatusCard exists" || echo "StatusCard does not exist"
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

- [ ] Read related documentation (CLAUDE.md Card patterns)
- [ ] Understand current Card implementation patterns
- [ ] Identify files that will be created/modified
- [ ] Review project architectural standards (CLAUDE.md)
- [ ] Understand import/export patterns (path aliases, barrel exports)
- [ ] Know where types should be defined (`src/types/components/ui/`)
- [ ] Know testing patterns (unit + accessibility tests)

---

## Step 4: Confirm Environment

```bash
# Verify Node.js and pnpm versions
node --version  # Should match project requirements (v24.7.0)
pnpm --version  # Should match project requirements (v10.15.0)

# Ensure dependencies are installed
pnpm install

# Verify dev server can start (don't keep running)
pnpm dev
# Press Ctrl+C to stop after confirming it starts
```

---

## Validation Checklist

- [ ] On correct feature branch: `git branch --show-current`
- [ ] No existing work that would be duplicated
- [ ] Pre-implementation checklist reviewed
- [ ] Environment verified and dependencies installed

---

## Checkpoint: Confirm Setup

```bash
# Create initial commit to mark branch creation
git commit --allow-empty -m "chore: initialize feature branch for card component standardization"
```

---

## ✅ Phase 0 Complete

**Next Step:** Proceed to [Phase 1: Create StatCard Component](./phase-1-stat-card.md)

---

## Troubleshooting

### "Already on feature branch but has commits"

```bash
# Check what's been done
git log --oneline main..HEAD

# If commits are related to this plan, continue from where it left off
# If commits are unrelated, create a new branch
git checkout -b feature/card-standardization-v2
```

### "Can't switch branches - uncommitted changes"

```bash
# Option 1: Stash changes
git stash
git checkout -b feature/card-component-standardization
git stash pop

# Option 2: Commit changes first
git add .
git commit -m "wip: work in progress"
git checkout -b feature/card-component-standardization
```

### "Dependencies won't install"

```bash
# Clear cache and try again
pnpm store prune
rm -rf node_modules
pnpm install
```
