# Phase 2.75: Testing Loop (Git Amend Workflow)

**Status:** User-driven iteration after Phase 2 implementation completes

**Pattern:** User reviews → AI fixes → amend commit → repeat

## Git Amend Command

During Phase 2.75 local iteration, use `git commit --amend --no-edit` to keep one clean commit:

```bash
# Make changes, then:
git add -A && git commit --amend --no-edit
```

## Why Use Git Amend?

**Benefit:** Single atomic commit instead of messy "fix: X", "fix: Y" history.

**Safe when:** Commit is local-only (not pushed). **Never** amend after pushing without force-push.

## When Phase 2.75 Ends

⏸️ User says: "ready to push" or "smoke test passed" or similar explicit approval.

**Next:** Proceed to [Phase 3: Push & Create PR](phase-3-cicd.md)
