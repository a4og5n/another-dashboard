# Session Review Template

This template is used in **Phase 4 Step 6** of the AI-First Development Workflow to document implementation sessions in `docs/ai-workflow-learnings.md`.

## Template

Add this at the TOP of the "Session Reviews" section:

````markdown
### Session: {Endpoint Name} Implementation (YYYY-MM-DD)

**Endpoint:** `{HTTP_METHOD} /path/to/endpoint`
**Route:** `/mailchimp/{route}`
**Issue:** #{issue_number} | **PR:** #{pr_number} | **Status:** ✅ Merged

#### What Worked Exceptionally Well ✅

**1. {Pattern/Approach That Worked}** ⭐⭐⭐

**What Happened:**

- {Describe what was successful}
- {Why it worked well}

**Implementation Details:**

```{language}
// Show code example if relevant
```

**Why This Matters:**

- {Benefit 1}
- {Benefit 2}

#### Issues Encountered & Solutions 🔧

**1. {Problem Description}**

**Problem:** {What went wrong}

**Root Cause:** {Why it happened}

**Solution:** {How it was fixed}

**Prevention:** {How to avoid in future}

#### Implementation Stats 📊

**Development Time:**

- Phase 1 (Schemas): ~X minutes
- Phase 2 (Implementation): ~Y minutes
- Phase 2.75 (Testing & Iteration): ~Z iterations
- **Total:** ~N hours

**Code Metrics:**

- Files Created: {count}
- Files Modified: {count}
- Lines Added: ~{count}
- Lines Removed: ~{count}

**Validation:**

- ✅ Type-check: passed
- ✅ Lint: passed
- ✅ Format: passed
- ✅ Tests: {count} passing
- ✅ CI/CD: All checks passed

#### Key Learnings for Future Implementations 💡

1. **{Learning 1 Title}**
   - {Description}
   - {Actionable takeaway}

2. **{Learning 2 Title}**
   - {Description}
   - {Actionable takeaway}

#### Files Modified/Created 📁

**Created:**

- `{file_path}` - {purpose}
- `{file_path}` - {purpose}

**Modified:**

- `{file_path}` - {change description}
- `{file_path}` - {change description}

---
````

## Commit Command

After creating the session review:

```bash
git add docs/ai-workflow-learnings.md
git commit -m "docs: add session review for {Endpoint Name} implementation

Documented implementation session for Issue #${issue_number}, PR #${pr_number}.

Captured:
- What worked exceptionally well
- Issues encountered and solutions
- Implementation stats and metrics
- Key learnings for future work
- Complete file change list

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Note:** This commit happens on the `docs/post-merge-issue-{number}` branch and will be pushed in Phase 4 Step 7.
