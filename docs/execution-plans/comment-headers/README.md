# Consistent Comment Headers - Execution Plan

**Status:** Ready to Execute
**Estimated Time:** 2 hours
**Complexity:** Low (Documentation only)

---

## Quick Start

**📋 Start Here:** [execution-plan.md](execution-plan.md) - Read the full plan first

**🚀 Then Follow Phases in Order:**

1. **[Phase 0: Git Setup](phase-0-setup.md)** ⚠️ REQUIRED FIRST
   - Create feature branch
   - Verify no duplicate work
   - 5-10 minutes

2. **[Phase 1: VSCode Snippet](phase-1-checklist.md)**
   - Create `.vscode/page-header.code-snippets`
   - 15-20 minutes
   - **STOP after this phase** ✋

3. **[Phase 2: Root & Mailchimp Pages](phase-2-checklist.md)**
   - Update 4 pages (root, Mailchimp landing, reports, lists)
   - 30-35 minutes
   - **STOP after this phase** ✋

4. **[Phase 3: Dynamic Route Pages](phase-3-checklist.md)**
   - Update 5 pages (all `[id]` routes)
   - 35-40 minutes
   - **STOP after this phase** ✋

5. **[Phase 4: Settings & Auth Pages](phase-4-checklist.md)**
   - Update 4 pages (settings, login, auth-error, example)
   - 25-30 minutes
   - **STOP after this phase** ✋

6. **[Phase 5: Documentation](completion-checklist.md)**
   - Update CLAUDE.md
   - Final validation
   - Create PR
   - 20-25 minutes

---

## What Gets Built

### VSCode Snippet

```
.vscode/page-header.code-snippets
```

- Type `pageheader` + Tab to insert template
- Dropdown for @requires field
- Tab navigation through fields

### Page Headers (13 files updated)

```
src/app/page.tsx                                    ✅ NEW
src/app/mailchimp/page.tsx                          ✅ NEW
src/app/mailchimp/lists/page.tsx                    ✅ NEW
src/app/mailchimp/lists/[id]/page.tsx               ✅ NEW
src/app/mailchimp/reports/page.tsx                  🔄 UPDATE
src/app/mailchimp/reports/[id]/page.tsx             🔄 UPDATE
src/app/mailchimp/reports/[id]/opens/page.tsx       ✅ NEW
src/app/mailchimp/reports/[id]/abuse-reports/page.tsx ✅ NEW
src/app/mailchimp/general-info/page.tsx             🔄 UPDATE
src/app/settings/integrations/page.tsx              🔄 UPDATE
src/app/login/page.tsx                              ✅ NEW
src/app/auth-error/page.tsx                         ✅ NEW
src/app/example/page.tsx                            ✅ NEW
```

### Documentation

```
CLAUDE.md - Add "Page Component Headers" section
```

---

## Standard Header Template

```tsx
/**
 * [Page Title]
 * [Brief 1-2 sentence description]
 *
 * @route [/path/to/page]
 * @requires [None | Kinde Auth | Mailchimp connection]
 * @features [Key features, comma-separated]
 */
```

**Example:**

```tsx
/**
 * Mailchimp Lists Page
 * Displays paginated list of Mailchimp audiences with filtering
 *
 * @route /mailchimp/lists
 * @requires Mailchimp connection
 * @features Pagination, Filtering, Real-time data
 */
```

---

## Key Rules

### Phase Boundaries

- ⚠️ **STOP at the end of each phase**
- ✅ **COMMIT after every phase**
- 🔄 **User must explicitly start next phase**
- 💰 **Safe to clear conversation between phases**

### Git Workflow

1. **Phase 0:** Create `feature/consistent-comment-headers` branch
2. **Each phase:** Commit with focused message
3. **Phase 5:** Push to origin and create PR
4. **Never commit directly to main**

### Validation

- Run `pnpm type-check` after each phase
- Run `pnpm lint` after each phase
- Run `pnpm validate` before pushing (Phase 5)
- No functionality changes expected

---

## Progress Tracking

```
Phase 0: Git Setup                      [ ] → 0/13 pages
Phase 1: VSCode Snippet                 [ ] → 0/13 pages
Phase 2: Root & Mailchimp (4 pages)     [ ] → 4/13 pages (31%)
Phase 3: Dynamic Routes (5 pages)       [ ] → 9/13 pages (69%)
Phase 4: Settings & Auth (4 pages)      [ ] → 13/13 pages (100%)
Phase 5: Documentation                  [ ] → Complete!
```

---

## Success Criteria

- ✅ All 13 pages have standardized headers
- ✅ Headers follow exact template format
- ✅ VSCode snippet works correctly
- ✅ CLAUDE.md documentation complete
- ✅ All validation passes (`pnpm validate`)
- ✅ No functionality changes
- ✅ PR created and ready for review

---

## Cost Optimization

**Clear Conversation Points:**

- After Phase 1 (snippet created)
- After Phase 2 (4 pages done)
- After Phase 3 (9 pages done)
- After Phase 4 (all pages done)

**Why it's safe:**

- Each phase is committed
- Phases are independent
- Can resume with just the execution plan

---

## Troubleshooting

**"I'm on main branch"**

- Go to Phase 0, follow branch creation steps
- NEVER proceed with implementation on main

**"VSCode snippet doesn't work"**

- Reload VSCode window
- Check `.vscode/page-header.code-snippets` exists
- Verify file is valid JSON

**"Type checking failed"**

- Verify you only added comments (no code changes)
- Check for syntax errors in headers
- Ensure `/**` and `*/` are balanced

**"Git conflicts"**

- Pull latest main: `git checkout main && git pull`
- Rebase your branch: `git checkout feature/consistent-comment-headers && git rebase main`

---

## Related Documents

- [page-pattern-improvements.md](../../page-pattern-improvements.md) - Parent planning doc (#5)
- [execution-plan-template.md](../../execution-plan-template.md) - Template used
- [CLAUDE.md](../../../CLAUDE.md) - Will be updated with this pattern

---

## Notes

- **No tests needed** - This is documentation only
- **Low risk** - Only adding comments, no code changes
- **Quick wins** - Each phase provides immediate value
- **Reusable pattern** - VSCode snippet makes future pages easy

---

**Ready to start?** Open [phase-0-setup.md](phase-0-setup.md) to begin! 🚀
