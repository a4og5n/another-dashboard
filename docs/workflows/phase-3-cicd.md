# Phase 3.5: CI/CD Monitoring & Failure Recovery

**Status:** Automatic (no user action required)
**Trigger:** Immediately after PR is created in Phase 3
**Duration:** ~3-5 minutes (depending on CI/CD pipeline)

## Overview

After PR creation, AI **automatically monitors CI/CD checks** until all pass, handles any failures, and proceeds to auto-merge when complete.

**Critical Rule:** AI MUST monitor PR until ALL checks pass. DO NOT proceed to merge with failing checks.

---

## Step 1: Initial Check Status

View current status of all PR checks:

```bash
gh pr checks {pr_number}
```

**Output example:**

```
Code Quality Checks  pending  0  https://github.com/.../runs/...
Security Audit       pending  0  https://github.com/.../runs/...
Test Suite          pending  0  https://github.com/.../runs/...
Vercel              pass     0  https://vercel.com/...
```

---

## Step 2: Continuous Monitoring

### ⚠️ CRITICAL: FOREGROUND Mode Only

**This command MUST run in FOREGROUND mode. DO NOT use `run_in_background` parameter.**

```bash
# Monitor PR checks in FOREGROUND (blocks until complete)
gh pr checks {pr_number} --watch

# ❌ DO NOT run in background mode
# ❌ DO NOT use: gh pr checks {pr_number} --watch --run-in-background
```

### Why FOREGROUND is Required

1. **Automatic workflow continuation:** Background processes cannot trigger next phase
2. **Blocking behavior:** Foreground command blocks until checks complete, then AI proceeds immediately
3. **Exit code signal:** When command exits with code 0, ALL checks have passed
4. **No manual intervention:** AI doesn't need to check BashOutput or wait for user

### While Monitoring

- Command refreshes status every 10 seconds automatically
- Output shows which checks are running/pending/passed/failed
- Command exits when all checks are complete (pass or fail)

### When Monitoring Completes (exit code 0)

**IMMEDIATELY proceed to Step 4 (Auto-Merge):**

- ✅ DO: Start Step 4 immediately
- ❌ DO NOT: Stop to check BashOutput
- ❌ DO NOT: Wait for user confirmation
- ❌ DO NOT: Ask "should I proceed?"

The foreground command completion **IS the signal to continue**.

---

## Step 3: Handle CI/CD Failures

**If ANY check fails, AI MUST fix it before proceeding.**

### 3.1: Identify the Failure

```bash
gh run view {run_id}
```

This shows detailed logs of the failed run.

### 3.2: Analyze the Error

**Questions to answer:**

- What exactly failed? (type error, test failure, lint issue, build error?)
- What is the root cause? (missing import, type mismatch, regression?)
- Is it a real issue or flaky test?
- Why didn't local validation catch this?

### 3.3: Fix the Issue

1. Make necessary code changes
2. Run local validation to verify fix:
   ```bash
   pnpm type-check && pnpm lint && pnpm test
   ```
3. Ensure the fix resolves the issue completely

### 3.4: Create Test to Prevent Regression

**If failure was missed by local tests:**

- Add new test case that catches this failure
- If architectural rule was violated, enhance enforcement test
- Document why failure wasn't caught locally

**Example:**

```typescript
// Example: Add architectural test for new pattern
test("should enforce new pattern", () => {
  const files = glob.sync("src/**/*.tsx");
  files.forEach((file) => {
    const content = fs.readFileSync(file, "utf-8");
    expect(content).not.toMatch(/anti-pattern/);
  });
});
```

### 3.5: Commit the Fix

```bash
git add -A
git commit -m "fix: resolve CI/CD failure - {brief description}

Issue: {describe what failed in CI/CD}
Root Cause: {why it failed}
Solution: {what was fixed}
Prevention: {test added to catch this earlier}

CI Run: {run_id}"
```

### 3.6: Push the Fix

```bash
git push origin {branch-name}
```

### 3.7: Resume Monitoring

Go back to **Step 1** and watch the new CI/CD run.

---

## Common CI/CD Failures & Fixes

| Failure Type      | Local Command to Reproduce | Fix Strategy                                 |
| ----------------- | -------------------------- | -------------------------------------------- |
| **Type errors**   | `pnpm type-check`          | Fix type issues, ensure local command passes |
| **Lint errors**   | `pnpm lint`                | Run `pnpm lint:fix`, commit fixes            |
| **Test failures** | `pnpm test`                | Fix failing test, ensure it passes locally   |
| **Format issues** | `pnpm format:check`        | Run `pnpm format`, commit changes            |
| **Accessibility** | `pnpm test:a11y`           | Fix a11y violations, test locally            |
| **Build errors**  | `pnpm build`               | Fix build issues, test production build      |

### Prevention Strategy

**Every CI/CD failure is a learning opportunity:**

1. **Why wasn't this caught locally?**
   - Missing test?
   - Insufficient validation?
   - Edge case not considered?

2. **Add test to catch it earlier:**
   - Unit test for logic errors
   - Integration test for API errors
   - Architectural test for pattern violations

3. **Update pre-commit hooks if needed:**
   - Add validation step
   - Enhance existing check

---

## Step 4: Auto-Merge PR

Once ALL checks pass, AI **automatically merges** the PR:

```bash
# Merge PR with squash
gh pr merge {pr_number} --squash --delete-branch

# The --delete-branch flag automatically deletes the remote branch after merge
```

### After Merge Completes

**AI MUST immediately proceed to Phase 4:**

1. **Output status message:**

```
✅ CI/CD Complete - All checks passed

**Check Results:**
- ✅ Code Quality Checks (1m 30s)
- ✅ Security Audit (45s)
- ✅ Test Suite (2m 15s)
- ✅ Vercel Preview (deployed)

**PR Status:** Merged to main
**Branch:** Deleted automatically
**Proceeding immediately to Phase 4 post-merge cleanup...**
```

2. **IMMEDIATELY proceed to Phase 4:**
   - DO NOT stop after outputting the message
   - DO NOT ask "Should I proceed to Phase 4?"
   - DO NOT wait for user confirmation
   - Start executing Phase 4 Step 1 automatically
   - Phase 4 is fully automatic, no checkpoints

3. **DO NOT STOP** - Phase 4 cleanup is part of the merge workflow, not optional

---

## Important Notes

- **User can block auto-merge:** By requesting changes on GitHub
- **User can comment on PR:** Before checks complete
- **User approval already given:** In Phase 1 (schema review)
- **Auto-merge ensures speed:** Fast iteration without manual steps
- **Phase 4 executes automatically:** No user interaction needed

---

## Troubleshooting

### Issue: CI/CD checks stuck in "pending" state

**Diagnosis:** GitHub Actions queue delay or runner availability issue

**Action:**

1. Wait 2-3 minutes for queue to process
2. Check GitHub Actions tab to see if runs are queued
3. If stuck >5 minutes, alert user

### Issue: Flaky test causes intermittent failures

**Diagnosis:** Non-deterministic test (timing, random data, external dependency)

**Action:**

1. Identify flaky test in logs
2. Add retry logic or increase timeout
3. Make test deterministic (mock external deps, use fixed seeds)
4. Document fix in commit message

### Issue: Multiple checks fail at once

**Diagnosis:** Fundamental issue (missing file, broken import, major type error)

**Action:**

1. Fix root cause first (usually a type error cascading)
2. Run full validation suite locally
3. Push single fix commit that resolves all failures
4. Resume monitoring

---

## Success Criteria

- [ ] All CI/CD checks pass (green checkmarks)
- [ ] PR is merged to main branch
- [ ] Remote feature branch is deleted
- [ ] Phase 4 starts automatically
- [ ] No failures left unresolved

**Next:** [Phase 4: Post-Merge Cleanup & Documentation](phase-4-post-merge.md)
