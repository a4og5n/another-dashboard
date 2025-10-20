# Phase 0: Git Setup and Pre-Implementation Validation

**GitHub Issue:** [#206](https://github.com/a4og5n/fichaz/issues/206)
**Estimated Time:** 10 minutes
**Status:** Ready to start

---

## ⚠️ CRITICAL: This Phase MUST Be Completed First

This phase ensures correct git branch setup and verifies no work has already been completed. **Do not proceed to Phase 1 without completing this phase.**

---

## AI Instructions

When user says "Start Phase 0" or "Begin page generator implementation":

### Step 1: Verify Current Branch

```bash
git branch --show-current
```

**AI Decision Tree:**

- ✅ **If on `feature/page-generator-schema-first`:** Proceed to Step 2
- ❌ **If on `main` branch:** Execute Step 1b
- ⚠️ **If on different feature branch:** Ask user to confirm before proceeding

**Step 1b: Create Feature Branch (if on main)**

```bash
# Ensure main is up to date
git checkout main
git pull origin main

# Create and switch to feature branch
git checkout -b feature/page-generator-schema-first

# Verify branch
git branch --show-current
# Expected output: feature/page-generator-schema-first
```

**🛑 STOP if still on main branch** - Do not proceed until on feature branch.

---

### Step 2: Check for Existing Work

Check if any phase has already been implemented:

```bash
# Check recent commits
git log --oneline -15

# Search for page-generator related commits
git log --oneline --all --grep="page-generator\\|generation\\|generator"

# Check if key files exist
ls -la src/generation/ 2>/dev/null
ls -la scripts/generate-page.ts 2>/dev/null
```

**AI Decision:**

- **If Phase 1+ files exist:**
  - Inform user: "Phase X appears complete. Found [files]. Would you like to verify or skip to Phase Y?"
  - Do NOT re-implement

- **If no files found:**
  - Confirm: "No existing work detected. Ready to begin Phase 1."

---

### Step 3: Review Pre-Implementation Context

**AI should verify understanding of:**

- [ ] Schema-first generation approach (schemas created manually, metadata in registry)
- [ ] Interactive CLI with Clack library
- [ ] Smart defaults from schema analysis
- [ ] Overwrite protection and safety checks
- [ ] Full working code generation (not just templates)

**Key files to reference during implementation:**

- `src/app/mailchimp/reports/[id]/opens/page.tsx` - Example dynamic page pattern
- `src/schemas/mailchimp/reports-params.schema.ts` - Example API schema
- `src/schemas/components/mailchimp/reports-page-params.ts` - Example UI schema
- `src/dal/mailchimp.dal.ts` - DAL pattern
- `src/utils/breadcrumbs/breadcrumb-builder.ts` - Breadcrumb pattern

---

### Step 4: Confirm Environment

```bash
# Verify Node.js version
node --version
# Expected: v24.7.0 or compatible

# Verify pnpm version
pnpm --version
# Expected: v10.15.0 or compatible

# Install dependencies if needed
pnpm install

# Verify dev server starts
pnpm dev
# Press Ctrl+C after confirming startup
```

---

## Validation Checklist

AI should confirm:

- [ ] On correct feature branch: `git branch --show-current` returns `feature/page-generator-schema-first`
- [ ] No existing phase work detected (or properly identified)
- [ ] Pre-implementation context understood
- [ ] Environment validated (node, pnpm, dev server)
- [ ] GitHub Issue #206 referenced

---

## Checkpoint: Initial Commit

```bash
# Create empty commit to mark branch start
git commit --allow-empty -m "chore: initialize page generator feature branch (#206)

- Schema-first generation approach
- Interactive CLI with Clack
- Generates complete working pages
- Overwrite protection and safety checks"

# Verify commit
git log --oneline -1
```

---

## 🛑 STOP HERE

**Phase 0 Complete!**

**Before continuing:**

- ✅ On feature branch (not main)
- ✅ Initial commit created
- ✅ No existing work conflicts
- ✅ Environment validated

**💰 Cost Optimization:** ⏩ Continue immediately to Phase 1 (Phase 0 is quick)

**Next Steps:**

- User says: "Start Phase 1" or "Continue to Phase 1"
- AI opens: [phase-1-config-structure.md](phase-1-config-structure.md)
- AI verifies Phase 0 complete before starting Phase 1

---

**Related:**

- Main Plan: [page-generator-execution-plan.md](../page-generator-execution-plan.md)
- GitHub Issue: [#206](https://github.com/a4og5n/fichaz/issues/206)
- Next Phase: [phase-1-config-structure.md](phase-1-config-structure.md)
