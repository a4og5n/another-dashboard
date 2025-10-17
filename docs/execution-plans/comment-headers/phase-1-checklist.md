# Phase 1: Define Standard Template and Create VSCode Snippet

**Goal:** Create the standard header template as a VSCode snippet for easy insertion

**Estimated Time:** 15-20 minutes

---

## Prerequisites

**Before starting this phase:**

- [ ] Phase 0 complete (verify: `git branch --show-current` shows `feature/consistent-comment-headers`)
- [ ] On feature branch, NOT on main
- [ ] Empty initial commit created

---

## Pre-Phase Check: Verify Phase Not Already Complete

```bash
# Check if .vscode directory and snippet already exist
ls -la .vscode/page-header.code-snippets

# Check recent commits
git log --oneline -5
```

**If snippet already exists:**

- Inform user: "VSCode snippet already exists at .vscode/page-header.code-snippets"
- Read the file and verify it matches the standard template
- Ask: "Would you like me to verify the snippet or move to Phase 2?"
- DO NOT re-create if it already exists and is correct

---

## Tasks

### Task 1: Create .vscode Directory (if needed)

```bash
# Check if .vscode directory exists
ls -la .vscode

# Create if it doesn't exist
mkdir -p .vscode
```

**Validation:**

- [ ] Directory exists: `ls -la .vscode`

---

### Task 2: Create VSCode Snippet File

Create `.vscode/page-header.code-snippets` with the following content:

```json
{
  "Page Header Comment": {
    "scope": "typescript,typescriptreact",
    "prefix": "pageheader",
    "description": "Insert standard page component header",
    "body": [
      "/**",
      " * ${1:Page Title}",
      " * ${2:Brief description of what this page does}",
      " *",
      " * @route ${3:/path/to/page}",
      " * @requires ${4|None,Kinde Auth,Mailchimp connection,Kinde Auth + Mailchimp connection|}",
      " * @features ${5:Key features (comma-separated)}",
      " */"
    ]
  }
}
```

**Snippet explanation:**

- `$1`, `$2`, etc. are tab stops for easy navigation
- `${4|..|}` creates a dropdown menu for @requires options
- Type `pageheader` and press Tab to insert the template

**Implementation:**

Use the Write tool to create this file.

**Validation:**

- [ ] File exists: `ls -la .vscode/page-header.code-snippets`
- [ ] File contains valid JSON
- [ ] TypeScript compiles: `pnpm type-check`

---

### Task 3: Test Snippet in VSCode (Manual)

**Manual testing steps:**

1. Open any `.tsx` file in VSCode
2. Type `pageheader` and press Tab
3. Verify the snippet template appears
4. Press Tab to navigate through the fields
5. Verify the @requires dropdown shows the 4 options

**Validation:**

- [ ] Snippet triggers with `pageheader` + Tab
- [ ] All tab stops work correctly
- [ ] @requires dropdown shows 4 options
- [ ] Template format matches the standard

---

### Task 4: Update .gitignore (if needed)

Check if `.vscode/` is already in `.gitignore`:

```bash
grep "\.vscode" .gitignore
```

**If `.vscode/` is in .gitignore:**

- We need to create `.vscode/.gitkeep` or explicitly add the snippet file
- Or update `.gitignore` to allow `page-header.code-snippets`

**Recommended approach:**

Add this to `.gitignore` (if not already present):

```
# VSCode settings - ignore user-specific settings but keep shared snippets
.vscode/*
!.vscode/page-header.code-snippets
```

**Implementation:**

Check and update `.gitignore` as needed.

**Validation:**

- [ ] Snippet file will be tracked by git
- [ ] User-specific VSCode settings still ignored

---

## Validation

Run validation commands:

```bash
# Verify file structure
ls -la .vscode/page-header.code-snippets

# Verify git will track the snippet
git status

# Type checking (should pass - no code changes)
pnpm type-check

# Linting (should pass - no code changes)
pnpm lint
```

**Checklist:**

- [ ] `.vscode/page-header.code-snippets` exists and has correct content
- [ ] `.gitignore` configured correctly (if needed)
- [ ] Git status shows snippet file as untracked or staged
- [ ] `pnpm type-check` passes
- [ ] `pnpm lint` passes
- [ ] Manual snippet test successful in VSCode

---

## Checkpoint: COMMIT

```bash
# Stage the new files
git add .vscode/page-header.code-snippets
git add .gitignore  # Only if you modified it

# Commit with descriptive message
git commit -m "feat(vscode): add page header comment snippet

- Create VSCode snippet for standardized page headers
- Snippet triggered by 'pageheader' keyword
- Includes standard fields: title, description, route, requires, features
- Dropdown menu for @requires field with 4 common options"

# Verify commit
git log --oneline -1
git show --stat
```

**Verification:**

- [ ] Commit created successfully
- [ ] Commit includes snippet file (and .gitignore if modified)
- [ ] Commit message follows conventional format

---

## 🛑 STOP HERE

**Phase 1 Complete!**

**What we accomplished:**

- ✅ Created VSCode snippet for `pageheader` shortcut
- ✅ Configured git to track the snippet file
- ✅ Tested snippet manually in VSCode
- ✅ Committed changes

**Before continuing:**

1. ✅ Code committed
2. ✅ Snippet tested in VSCode
3. ✅ Validation commands pass

**💰 Cost Optimization:** Safe to clear conversation now

- Phase 1 is committed and validated
- Next phase (updating pages) is independent
- Can start fresh with just the execution plan

**Next Steps:**

- Clear conversation if desired
- User: "Start Phase 2" or open [phase-2-checklist.md](phase-2-checklist.md)

**DO NOT PROCEED** to Phase 2 without user confirmation.
