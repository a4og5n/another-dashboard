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

- ✅ **If on `feature/card-component-migrations`:** Proceed to Step 2
- ❌ **If on `main` branch:** STOP and proceed to Step 1b
- ❌ **If on different feature branch:** Confirm with user before proceeding

### Step 1b: Create Feature Branch (if needed)

**ONLY run these commands if you're on `main` or wrong branch:**

```bash
# Ensure main is up to date
git checkout main
git pull origin main

# Create and switch to feature branch
git checkout -b feature/card-component-migrations

# Verify you're on the correct branch
git branch --show-current
# Should output: feature/card-component-migrations (NOT main)
```

**🛑 DO NOT PROCEED if `git branch --show-current` still returns `main`**

---

## Step 2: Check for Existing Work

Before starting implementation, verify the work hasn't already been done:

```bash
# Check recent commit history
git log --oneline -15

# Look for commits related to card migrations
git log --oneline --all --grep="card"
git log --oneline --all --grep="StatsGridCard"

# Check if any of the target files have been recently modified
git log --oneline -5 -- src/components/dashboard/reports/SocialEngagementCard.tsx
git log --oneline -5 -- src/components/dashboard/reports/ForwardsCard.tsx
git log --oneline -5 -- src/components/dashboard/reports/ClicksCard.tsx
git log --oneline -5 -- src/components/mailchimp/lists/list-stats.tsx
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

- [ ] **Read PR #192** to understand the standardized Card components
- [ ] **Review StatsGridCard API:**
  - `title`: Card title (string)
  - `icon`: Lucide icon component
  - `iconColor`: Icon color class (string)
  - `stats`: Array of `{ value: string | number, label: string }`
  - `columns`: Number of columns (1-4)
  - `footer`: Optional React node for additional content
- [ ] **Review reference implementation:** [EmailsSentCard.tsx](../../src/components/dashboard/reports/EmailsSentCard.tsx)
- [ ] **Understand component locations:**
  - `src/components/dashboard/reports/` - Report card components
  - `src/components/mailchimp/lists/` - List-related components
  - `src/components/ui/` - Shared UI components (StatCard, StatsGridCard, StatusCard)
- [ ] **Know import patterns:**
  - Import StatsGridCard: `import { StatsGridCard } from "@/components/ui/stats-grid-card";`
  - Import icons: `import { IconName } from "lucide-react";`
  - Import types: `import type { ComponentProps } from "@/types/components/dashboard/reports";`

---

## Step 4: Confirm Environment

```bash
# Verify Node.js and pnpm versions
node --version  # Should be v24.7.0 or compatible
pnpm --version  # Should be v10.15.0 or compatible

# Ensure dependencies are installed
pnpm install

# Verify dev server can start (don't keep running)
pnpm dev
# Press Ctrl+C to stop after confirming it starts successfully
```

**Validation:**

- [ ] Dependencies installed without errors
- [ ] Dev server starts successfully
- [ ] No TypeScript errors on startup

---

## Step 5: Read Target Components

Before proceeding, let's examine the components we'll be migrating to understand their current structure:

```bash
# Read each component to understand current implementation
cat src/components/dashboard/reports/SocialEngagementCard.tsx
cat src/components/dashboard/reports/ForwardsCard.tsx
cat src/components/dashboard/reports/ClicksCard.tsx
cat src/components/mailchimp/lists/list-stats.tsx
```

**What to look for:**

- Current card structure and layout
- Number of metrics displayed
- Icon usage and colors
- Additional content sections (context, footer)
- Props and types used

---

## Validation Checklist

Before proceeding to Phase 1:

- [ ] **Git branch:** On `feature/card-component-migrations` (verified with `git branch --show-current`)
- [ ] **No existing work:** No commits found that would duplicate this effort
- [ ] **Pre-implementation checklist:** All items reviewed and understood
- [ ] **Environment:** Dependencies installed and dev server confirmed working
- [ ] **Components reviewed:** Read all 4 target components to understand structure
- [ ] **Reference implementation:** Reviewed EmailsSentCard.tsx to see migration pattern
- [ ] **StatsGridCard API:** Understand the props and usage pattern

---

## Checkpoint: Confirm Setup

```bash
# Create initial commit to mark branch creation
git commit --allow-empty -m "chore: initialize feature branch for card component migrations"
```

**Output should show:** Empty commit created on `feature/card-component-migrations`

---

## Common Issues

**Issue: Can't create branch because uncommitted changes exist**

```bash
# Stash changes temporarily
git stash

# Create branch
git checkout -b feature/card-component-migrations

# Apply stashed changes
git stash pop
```

**Issue: Branch already exists**

```bash
# Switch to existing branch
git checkout feature/card-component-migrations

# Verify it's the right branch
git log --oneline -5
```

**Issue: Dev server won't start**

- Check if another dev server is running: `ps aux | grep "next dev"`
- Kill existing process: `pkill -f "next dev"`
- Try again: `pnpm dev`

---

## ✅ Phase 0 Complete

**Confirmation:**

- You are on the `feature/card-component-migrations` branch
- No duplicate work detected
- Environment is ready
- You understand the component structure and migration pattern

**Ready to proceed?** Continue with [Phase 1: Migrate SocialEngagementCard](phase-1-social-engagement.md)

---

**Next:** [Phase 1: Migrate SocialEngagementCard](phase-1-social-engagement.md)
