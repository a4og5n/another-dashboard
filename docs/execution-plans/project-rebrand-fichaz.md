# Execution Plan: Rebrand Another Dashboard to Fichaz

**Status:** Ready for Implementation
**Created:** 2025-10-19
**Approach:** Incremental phased implementation
**Target:** Rebrand project from "Another Dashboard" to "Fichaz" across code, UI, infrastructure, and OAuth providers

## Problem Statement

The project is currently named "Another Dashboard" throughout the codebase, UI, documentation, OAuth provider registrations, and infrastructure. We need to rebrand to "Fichaz" with the custom domain `fichaz.app`.

**Current State:**

- Project name: "another-dashboard" (package.json)
- GitHub repository: Current repo name (needs verification)
- UI displays: "Another Dashboard" in sidebar, header, empty states
- OAuth apps registered with Kinde, Mailchimp (potentially Google) using "Another Dashboard"
- Vercel project: `another-dashboard` with preview URLs `another-dashboard-*.vercel.app`
- Custom domain available: `fichaz.app` (not yet configured)
- Documentation: 20+ files reference "Another Dashboard"
- Production status: Development only, no live users

**Why This Matters:**

- Brand consistency across all touchpoints
- Professional appearance with custom domain
- Clear project identity for future users
- Eliminates placeholder naming

## Solution Overview

Implement incremental rebrand in 8 phases:

1. **Phase 0:** Git Setup and Pre-Implementation Validation
2. **Phase 1:** Update Code/UI Strings (Low Risk)
3. **Phase 2:** Update PWA Manifest and Metadata (Low Risk)
4. **Phase 3:** Update Documentation Files (Zero Risk)
5. **Phase 4:** OAuth Provider Updates (Medium Risk - Requires Testing)
6. **Phase 5:** GitHub Repository Rename (Medium Risk - Affects Git Remotes)
7. **Phase 6:** Vercel Project Rename (High Risk - Affects Deployments)
8. **Phase 7:** Domain Configuration (Medium Risk - DNS Changes)

Each phase includes validation steps and can be rolled back independently.

## Phase 0: Git Setup and Pre-Implementation Validation

**Objective:** Set up tracking and validate environment before starting implementation.

### 0.1 Create GitHub Issue

```bash
# Generate issue from this plan
gh issue create \
  --title "Rebrand: Another Dashboard → Fichaz" \
  --body-file <(cat <<'EOF'
# Rebrand Project from Another Dashboard to Fichaz

## Overview
Incremental rebrand across code, UI, infrastructure, and OAuth providers.

## Phases
- [ ] Phase 0: Git Setup ✅
- [ ] Phase 1: Update Code/UI Strings
- [ ] Phase 2: Update PWA Manifest and Metadata
- [ ] Phase 3: Update Documentation Files
- [ ] Phase 4: OAuth Provider Updates
- [ ] Phase 5: GitHub Repository Rename
- [ ] Phase 6: Vercel Project Rename
- [ ] Phase 7: Domain Configuration

## Success Criteria
- All code references updated to "Fichaz"
- All UI displays show "Fichaz"
- OAuth providers configured with new name
- GitHub repository renamed
- Vercel project renamed
- Custom domain (fichaz.app) configured and working
- All tests passing
- Authentication flows working

## Execution Plan
See: docs/execution-plans/project-rebrand-fichaz.md
EOF
) \
  --label "enhancement" \
  --label "infrastructure"
```

**Checkpoint:** Issue created successfully with issue number.

### 0.2 Create Feature Branch

```bash
# Ensure we're on latest main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/rebrand-fichaz

# Verify branch
git branch --show-current
```

**Checkpoint:** On `feature/rebrand-fichaz` branch.

### 0.3 Pre-Implementation Validation

```bash
# Run full validation suite
pnpm pre-commit

# Verify no uncommitted changes
git status

# Verify OAuth apps are accessible
# Manual: Check Kinde dashboard (https://app.kinde.com/)
# Manual: Check Mailchimp developer portal (https://admin.mailchimp.com/account/api/)
```

**Validation Checklist:**

- [ ] All tests passing
- [ ] No type errors
- [ ] No uncommitted changes
- [ ] Kinde dashboard accessible
- [ ] Mailchimp developer portal accessible

**Checkpoint:** Environment validated and ready.

---

## Phase 1: Update Code/UI Strings

**Objective:** Update all code and UI component strings from "Another Dashboard" to "Fichaz".

**Risk Level:** Low (no external dependencies)

### 1.1 Update package.json

**File:** `package.json`

```bash
# Read current content
cat package.json | grep '"name"'
```

**Changes:**

- Line ~2: `"name": "another-dashboard"` → `"name": "fichaz"`

```json
{
  "name": "fichaz",
  "version": "0.1.0",
  ...
}
```

### 1.2 Update Dashboard Sidebar

**File:** `src/components/layout/dashboard-sidebar.tsx`

**Expected Changes:**

- Search for "Another Dashboard v1.0" string
- Replace with "Fichaz v1.0"

### 1.3 Update Dashboard Header

**File:** `src/components/layout/dashboard-header.tsx`

**Expected Changes:**

- Search for "Another Dashboard" string
- Replace with "Fichaz"

### 1.4 Update Mailchimp Empty State

**File:** `src/components/mailchimp/mailchimp-empty-state.tsx`

**Expected Changes:**

- Search for "Another Dashboard" in OAuth message
- Replace with "Fichaz"

### 1.5 Validate Changes

```bash
# Search for remaining "Another Dashboard" references in code
grep -r "Another Dashboard" src/ --exclude-dir=node_modules

# Run type check
pnpm type-check

# Run tests
pnpm test

# Run lint
pnpm lint
```

**Validation Checklist:**

- [ ] No "Another Dashboard" strings found in `src/` directory
- [ ] Type check passes
- [ ] All tests pass
- [ ] Lint passes

### 1.6 Commit Phase 1

```bash
git add package.json src/components/layout/dashboard-sidebar.tsx src/components/layout/dashboard-header.tsx src/components/mailchimp/mailchimp-empty-state.tsx

git commit -m "chore: rebrand UI strings from Another Dashboard to Fichaz

- Update package.json name field
- Update dashboard sidebar branding
- Update dashboard header branding
- Update Mailchimp empty state OAuth message

Related to #[ISSUE_NUMBER]"
```

**Checkpoint:** Phase 1 committed successfully.

---

## Phase 2: Update PWA Manifest and Metadata

**Objective:** Update PWA manifest and Next.js metadata for SEO and installation.

**Risk Level:** Low (affects branding only)

### 2.1 Update PWA Manifest

**File:** `public/manifest.json`

```bash
# Read current manifest
cat public/manifest.json
```

**Expected Changes:**

- `"name": "Another Dashboard"` → `"name": "Fichaz"`
- `"short_name": "Dashboard"` → `"short_name": "Fichaz"`
- `"description": "..."` → Update to include "Fichaz"
- Keep all other properties (icons, theme_color, etc.) unchanged

### 2.2 Update Root Layout Metadata

**File:** `src/app/layout.tsx`

```bash
# Read current metadata
grep -A 10 "export const metadata" src/app/layout.tsx
```

**Expected Changes:**

- `title: "Another Dashboard"` → `title: "Fichaz"`
- `description: "..."` → Update to include "Fichaz"
- OpenGraph metadata updates if present

### 2.3 Check for Other Metadata Files

```bash
# Search for metadata exports
grep -r "export const metadata" src/app/ --include="*.tsx" --include="*.ts"
```

**Update any found metadata exports:**

- Replace "Another Dashboard" with "Fichaz" in titles
- Update descriptions to reference "Fichaz"

### 2.4 Validate Changes

```bash
# Search for remaining "Another Dashboard" in metadata files
grep -r "Another Dashboard" src/app/ public/ --include="*.json" --include="*.tsx" --include="*.ts"

# Run type check
pnpm type-check

# Run tests
pnpm test

# Test PWA manifest is valid JSON
cat public/manifest.json | jq .
```

**Validation Checklist:**

- [ ] No "Another Dashboard" in metadata files
- [ ] manifest.json is valid JSON
- [ ] Type check passes
- [ ] All tests pass

### 2.5 Commit Phase 2

```bash
git add public/manifest.json src/app/layout.tsx

# Add any other metadata files found
# git add src/app/.../metadata.ts

git commit -m "chore: rebrand PWA manifest and metadata to Fichaz

- Update PWA manifest name and description
- Update root layout metadata
- Update OpenGraph metadata

Related to #[ISSUE_NUMBER]"
```

**Checkpoint:** Phase 2 committed successfully.

---

## Phase 3: Update Documentation Files

**Objective:** Update all documentation references from "Another Dashboard" to "Fichaz".

**Risk Level:** Zero (documentation only)

### 3.1 Identify Documentation Files

```bash
# Find all markdown files with "Another Dashboard"
grep -rl "Another Dashboard" docs/ README.md CLAUDE.md --include="*.md"
```

### 3.2 Update Documentation Files

**Strategy:** Update files in batches by directory.

**Expected Files:**

- `README.md`
- `CLAUDE.md`
- `docs/PRD.md`
- `docs/project-management/*.md`
- `docs/refactoring/*.md`
- Other docs files as identified

**Changes:**

- Replace "Another Dashboard" with "Fichaz"
- Update any URLs containing "another-dashboard"
- Update screenshots/images if they show old branding (note for future)

```bash
# Option 1: Manual updates with editor
# Open each file and replace strings

# Option 2: Automated with sed (review carefully)
# sed -i '' 's/Another Dashboard/Fichaz/g' file.md
```

### 3.3 Validate Changes

```bash
# Verify no "Another Dashboard" remains in docs
grep -r "Another Dashboard" docs/ README.md CLAUDE.md --include="*.md"

# Check for broken links (if any internal doc links)
# Manual review of changed files
```

**Validation Checklist:**

- [ ] No "Another Dashboard" found in documentation files
- [ ] README.md updated
- [ ] CLAUDE.md updated
- [ ] All markdown files still valid

### 3.4 Commit Phase 3

```bash
git add README.md CLAUDE.md docs/

git commit -m "docs: rebrand documentation from Another Dashboard to Fichaz

- Update README.md
- Update CLAUDE.md
- Update all docs/ markdown files

Related to #[ISSUE_NUMBER]"
```

**Checkpoint:** Phase 3 committed successfully.

---

## Phase 4: OAuth Provider Updates

**Objective:** Update OAuth app registrations in Kinde and Mailchimp to reflect new branding.

**Risk Level:** Medium (requires testing authentication flows)

**⚠️ IMPORTANT:** Test authentication after EACH provider update before proceeding to next provider.

### 4.1 Update Kinde Application

**Prerequisites:**

- [ ] Kinde dashboard access: https://app.kinde.com/
- [ ] Current Kinde application ID noted

**Steps:**

1. **Log in to Kinde Dashboard:**
   - Navigate to https://app.kinde.com/
   - Access your business/workspace

2. **Locate Application:**
   - Go to Settings → Applications
   - Find your current application (likely named "Another Dashboard")

3. **Update Application Settings:**
   - **Name:** Change to "Fichaz"
   - **Home page URL:** Update to `https://fichaz.app` (will configure DNS later)
   - **Allowed callback URLs:** Keep existing URLs for now:
     - `https://127.0.0.1:3000/api/auth/kinde_callback`
     - `https://another-dashboard-*.vercel.app/api/auth/kinde_callback`
   - **Allowed logout redirect URLs:** Keep existing for now
   - Save changes

4. **Verify Environment Variables (No Changes Needed):**
   ```bash
   # Verify these are still correct in .env.local
   grep KINDE .env.local
   # Should show:
   # KINDE_CLIENT_ID=...
   # KINDE_CLIENT_SECRET=...
   # KINDE_ISSUER_URL=...
   # KINDE_SITE_URL=https://127.0.0.1:3000
   # KINDE_POST_LOGOUT_REDIRECT_URL=https://127.0.0.1:3000
   # KINDE_POST_LOGIN_REDIRECT_URL=https://127.0.0.1:3000
   # KINDE_COOKIE_DOMAIN=127.0.0.1
   ```

**Note:** Environment variables stay the same; only the display name in Kinde dashboard changes.

### 4.2 Test Kinde Authentication

```bash
# Start development server
pnpm dev

# Manual testing steps:
# 1. Open https://127.0.0.1:3000
# 2. Log out if already logged in
# 3. Click login button
# 4. Verify Kinde login screen shows "Fichaz" (or still shows old name - acceptable)
# 5. Complete login flow
# 6. Verify successful authentication and redirect
# 7. Verify user dashboard loads correctly
```

**Validation Checklist:**

- [ ] Kinde app name updated to "Fichaz"
- [ ] Login flow works successfully
- [ ] User can access dashboard after login
- [ ] No authentication errors in console

**Checkpoint:** Kinde authentication working with updated branding.

### 4.3 Update Mailchimp OAuth Application

**Prerequisites:**

- [ ] Mailchimp developer access: https://admin.mailchimp.com/account/api/
- [ ] Current Mailchimp OAuth client ID noted

**Steps:**

1. **Log in to Mailchimp:**
   - Navigate to https://admin.mailchimp.com/account/api/
   - Click "Registered Apps" or "OAuth Apps" section

2. **Locate OAuth Application:**
   - Find application currently named "Another Dashboard"

3. **Update Application Settings:**
   - **App Name:** Change to "Fichaz"
   - **App Website:** Update to `https://fichaz.app`
   - **Redirect URI:** Keep existing URIs for now:
     - `https://127.0.0.1:3000/api/auth/mailchimp/callback`
     - `https://another-dashboard-*.vercel.app/api/auth/mailchimp/callback`
   - Save changes

4. **Verify Environment Variables (No Changes Needed):**
   ```bash
   # Verify these are still correct in .env.local
   grep MAILCHIMP .env.local
   # Should show:
   # MAILCHIMP_CLIENT_ID=...
   # MAILCHIMP_CLIENT_SECRET=...
   # MAILCHIMP_REDIRECT_URI=https://127.0.0.1:3000/api/auth/mailchimp/callback
   ```

**Note:** Client ID and secret remain the same; only display name changes.

### 4.4 Test Mailchimp OAuth Flow

```bash
# Ensure dev server is running
pnpm dev

# Manual testing steps:
# 1. Open https://127.0.0.1:3000/settings/integrations
# 2. If already connected, disconnect Mailchimp first
# 3. Click "Connect Mailchimp" button
# 4. Verify Mailchimp authorization screen shows "Fichaz" requesting access
# 5. Authorize the application
# 6. Verify successful redirect and connection
# 7. Navigate to /mailchimp and verify data loads
# 8. Test a few Mailchimp pages to ensure API calls work
```

**Validation Checklist:**

- [ ] Mailchimp app name updated to "Fichaz"
- [ ] OAuth authorization screen shows updated branding
- [ ] Connection successful after authorization
- [ ] Mailchimp data loads correctly in dashboard
- [ ] No API errors in console

**Checkpoint:** Mailchimp OAuth working with updated branding.

### 4.5 Check for Google OAuth (If Applicable)

```bash
# Check if Google OAuth is configured
grep GOOGLE .env.local

# Check code for Google OAuth usage
grep -r "google" src/ --include="*.ts" --include="*.tsx" -i | grep -i oauth
```

**If Google OAuth found:**

- Follow similar process as Kinde/Mailchimp
- Update app name in Google Cloud Console
- Test authentication flow
- Add to validation checklist

**If not found:**

- Skip this step
- Note in commit message that Google OAuth not configured

### 4.6 Commit Phase 4

```bash
# No code changes in this phase, but document the updates
git commit --allow-empty -m "chore: update OAuth provider branding to Fichaz

Updated OAuth application names in external providers:
- Kinde: Updated app name to 'Fichaz'
- Mailchimp: Updated app name and website to 'Fichaz'

Tested and verified:
- Kinde authentication flow working
- Mailchimp OAuth flow working
- All API integrations functioning correctly

No code changes required (client IDs/secrets unchanged)

Related to #[ISSUE_NUMBER]"
```

**Checkpoint:** Phase 4 completed with OAuth providers updated and tested.

---

## Phase 5: GitHub Repository Rename

**Objective:** Rename GitHub repository to reflect new branding.

**Risk Level:** Medium (affects git remotes, clone URLs, and external references)

**⚠️ IMPORTANT:** GitHub automatically sets up redirects from old repo name to new name, so existing clones will continue to work.

### 5.1 Verify Current Repository Name

```bash
# Check current remote URL
git remote -v

# Expected output shows current repo name
# origin  https://github.com/[username]/[current-repo-name].git
```

**Document Current State:**

- Current repository name: ******\_\_\_******
- Repository owner: ******\_\_\_******
- Current clone URLs documented

### 5.2 Pre-Rename Checklist

**Verify Repository Access:**

- [ ] GitHub repository owner or admin access
- [ ] No open pull requests that need the old URL
- [ ] All local work is pushed to remote
- [ ] Team members notified (if applicable)

```bash
# Push all current work
git push origin feature/rebrand-fichaz

# Verify everything pushed
git status
```

**Checkpoint:** All work pushed, ready to rename.

### 5.3 Rename GitHub Repository

**Steps:**

1. **Navigate to Repository Settings:**
   - Open repository in browser: `https://github.com/[owner]/[current-repo-name]`
   - Click "Settings" tab
   - Scroll to "Repository name" section

2. **Rename Repository:**
   - Current name: `[current-repo-name]`
   - New name: `fichaz`
   - Click "Rename" button
   - Confirm the rename

3. **Note New URLs:**
   - New HTTPS URL: `https://github.com/[owner]/fichaz.git`
   - New SSH URL: `git@github.com:[owner]/fichaz.git`
   - Old URLs will redirect automatically

**GitHub Automatic Features:**

- Redirects set up from old repo name to new name
- Existing clones continue to work (redirects are transparent)
- Issues, PRs, and other references updated automatically

### 5.4 Update Local Git Remote (Optional but Recommended)

While redirects work, it's best practice to update local remotes:

```bash
# Get current remote URL
git remote get-url origin

# Update remote URL to new repository name
git remote set-url origin https://github.com/[owner]/fichaz.git

# Or for SSH:
# git remote set-url origin git@github.com:[owner]/fichaz.git

# Verify update
git remote -v
# Should show: origin  https://github.com/[owner]/fichaz.git (fetch)
#              origin  https://github.com/[owner]/fichaz.git (push)
```

### 5.5 Test Git Operations

```bash
# Test fetch
git fetch origin

# Test pull
git pull origin main

# Test push (if there are any new commits)
git push origin feature/rebrand-fichaz

# All operations should work with new URL
```

**Validation Checklist:**

- [ ] Repository renamed successfully
- [ ] New URL accessible in browser
- [ ] Old URL redirects to new URL
- [ ] Local remote updated
- [ ] Git fetch works
- [ ] Git pull works
- [ ] Git push works

### 5.6 Update Vercel Git Integration

**Check Vercel Integration:**

1. **Navigate to Vercel Project:**
   - Go to Vercel dashboard
   - Open "fichaz" project (or "another-dashboard" if not yet renamed)
   - Click "Settings" → "Git"

2. **Verify Git Repository Connection:**
   - GitHub redirects should keep integration working
   - Repository should show as: `[owner]/fichaz`
   - If it shows old name, reconnect:
     - Click "Disconnect"
     - Click "Connect Git Repository"
     - Select the renamed repository

3. **Test Integration:**
   - Make a small commit and push
   - Verify Vercel triggers deployment automatically

```bash
# Test commit to trigger Vercel deployment
git commit --allow-empty -m "test: verify Vercel integration after repo rename"
git push origin feature/rebrand-fichaz

# Check Vercel dashboard for new deployment
```

**Validation Checklist:**

- [ ] Vercel shows correct repository name
- [ ] Test commit triggers deployment
- [ ] Deployment successful

### 5.7 Update Documentation with New Repository URLs

**Files to Update:**

- `README.md` - Update clone URLs, shields.io badges, repository links
- `CLAUDE.md` - Update any repository references
- `.github/` - Check if any workflow files reference repo URLs

```bash
# Search for old repository name in docs
grep -r "[old-repo-name]" README.md CLAUDE.md .github/ docs/

# Update found references manually
```

### 5.8 Commit Phase 5

```bash
git add README.md CLAUDE.md .github/ docs/

git commit -m "chore: update repository references after GitHub rename

- Updated repository URLs in README.md
- Updated repository references in CLAUDE.md
- Updated any GitHub workflow references
- Repository renamed from [old-name] to 'fichaz'

GitHub redirects in place for backward compatibility.

Related to #[ISSUE_NUMBER]"

git push origin feature/rebrand-fichaz
```

**Checkpoint:** Phase 5 completed with GitHub repository renamed and references updated.

### 5.9 Notify Team (If Applicable)

If working with a team, notify them:

**Notification Message Template:**

```
📢 Repository Renamed: [old-name] → fichaz

The GitHub repository has been renamed to better reflect our branding.

What you need to know:
✅ Your existing clones will continue to work (GitHub redirects are in place)
✅ No action required if using HTTPS
✅ Optional: Update your remote URL for best practices

To update your remote URL:
git remote set-url origin https://github.com/[owner]/fichaz.git

New repository: https://github.com/[owner]/fichaz
```

---

## Phase 6: Vercel Project Rename

**Objective:** Rename Vercel project from "another-dashboard" to "fichaz".

**Risk Level:** High (affects deployment URLs and may require environment variable updates)

**⚠️ CRITICAL:** This phase affects all preview deployments. Test thoroughly after rename.

### 6.1 Pre-Rename Checklist

**Verify Current State:**

```bash
# Check current Vercel project
vercel ls

# Check current environment variables
vercel env ls
```

**Document Current Configuration:**

- Current project name: `another-dashboard`
- Current preview URLs: `another-dashboard-*.vercel.app`
- Current environment variables (list them)

**Backup Plan:**

- Vercel project renames are reversible
- Environment variables are preserved during rename
- Git repository connection is maintained

### 5.2 Push Current Branch to Remote

```bash
# Push current work to remote
git push origin feature/rebrand-fichaz

# Verify push successful
git status
```

**Checkpoint:** All commits pushed to remote before Vercel changes.

### 5.3 Rename Vercel Project

**Steps:**

1. **Open Vercel Dashboard:**
   - Navigate to https://vercel.com/dashboard
   - Select your project (`another-dashboard`)

2. **Navigate to Settings:**
   - Click "Settings" tab
   - Scroll to "Project Name" section

3. **Rename Project:**
   - Current name: `another-dashboard`
   - New name: `fichaz`
   - Click "Save"
   - Confirm the rename

4. **Note New URLs:**
   - Production: `fichaz.vercel.app` (if deployed)
   - Preview: `fichaz-*.vercel.app`

### 5.4 Update Environment Variables for New URLs

**Check if any environment variables reference old URLs:**

```bash
# In Vercel dashboard, review environment variables
# Look for any that reference "another-dashboard"

# Common variables to check:
# - KINDE_SITE_URL (if set for production)
# - MAILCHIMP_REDIRECT_URI (if set for production)
# - Any callback URLs
```

**Update if needed:**

- `KINDE_SITE_URL`: Update to `https://fichaz.vercel.app` (if set)
- `MAILCHIMP_REDIRECT_URI`: Update to `https://fichaz.vercel.app/api/auth/mailchimp/callback` (if set)

### 5.5 Update OAuth Provider Redirect URIs

**Update Kinde Allowed Callback URLs:**

1. Go to Kinde dashboard → Applications
2. Find "Fichaz" application
3. Add new callback URL: `https://fichaz-*.vercel.app/api/auth/kinde_callback`
4. Keep old URL temporarily: `https://another-dashboard-*.vercel.app/api/auth/kinde_callback`
5. Update allowed logout redirects similarly
6. Save changes

**Update Mailchimp Redirect URIs:**

1. Go to Mailchimp developer portal
2. Find "Fichaz" OAuth app
3. Add new redirect URI: `https://fichaz-*.vercel.app/api/auth/mailchimp/callback`
4. Keep old URI temporarily: `https://another-dashboard-*.vercel.app/api/auth/mailchimp/callback`
5. Save changes

**Note:** Keep both old and new URLs temporarily until we verify new URLs work.

### 5.6 Trigger Preview Deployment

```bash
# Trigger new preview deployment with renamed project
git commit --allow-empty -m "chore: trigger preview deployment after Vercel rename"
git push origin feature/rebrand-fichaz

# Wait for Vercel deployment
# Check Vercel dashboard for new deployment URL
```

**New Preview URL Format:** `fichaz-[git-branch-slug]-[vercel-team].vercel.app`

### 5.7 Test Preview Deployment

**Manual Testing:**

1. **Access Preview Deployment:**
   - Find preview URL in Vercel dashboard or GitHub PR checks
   - Open URL in browser (should be `fichaz-feature-rebrand-*.vercel.app`)

2. **Test Kinde Authentication:**
   - Click login button
   - Complete Kinde login flow
   - Verify successful authentication and redirect
   - Check browser console for errors

3. **Test Mailchimp Integration:**
   - Navigate to `/settings/integrations`
   - Disconnect Mailchimp (if connected)
   - Click "Connect Mailchimp"
   - Complete OAuth flow
   - Verify successful connection
   - Navigate to `/mailchimp` and verify data loads

4. **Test Core Functionality:**
   - Navigate to `/mailchimp/reports`
   - Navigate to `/mailchimp/lists`
   - Verify all data loads correctly
   - Check browser console for API errors

**Validation Checklist:**

- [ ] Preview deployment successful at new URL
- [ ] Kinde authentication works on preview
- [ ] Mailchimp OAuth works on preview
- [ ] Dashboard data loads correctly
- [ ] No console errors
- [ ] All environment variables working

### 5.8 Update Documentation with New URLs

**File:** `CLAUDE.md`

Search for and update:

- Old: `another-dashboard-*.vercel.app`
- New: `fichaz-*.vercel.app`

**File:** `README.md`

Update any deployment URLs or instructions.

### 5.9 Commit Phase 5

```bash
git add CLAUDE.md README.md

git commit -m "chore: update documentation for Vercel project rename

- Update deployment URLs from another-dashboard to fichaz
- Document new preview URL format
- Update OAuth redirect URI documentation

Vercel project renamed successfully.
Preview deployments working at fichaz-*.vercel.app

Related to #[ISSUE_NUMBER]"

git push origin feature/rebrand-fichaz
```

**Checkpoint:** Phase 5 completed with Vercel project renamed and tested.

### 5.10 Remove Old OAuth Redirect URIs (After Testing)

**Once confident new URLs work:**

1. **Remove from Kinde:**
   - Remove: `https://another-dashboard-*.vercel.app/api/auth/kinde_callback`
   - Keep: `https://fichaz-*.vercel.app/api/auth/kinde_callback`

2. **Remove from Mailchimp:**
   - Remove: `https://another-dashboard-*.vercel.app/api/auth/mailchimp/callback`
   - Keep: `https://fichaz-*.vercel.app/api/auth/mailchimp/callback`

**Validation:** Test one more preview deployment after removing old URLs.

---

## Phase 7: Domain Configuration

**Objective:** Configure custom domain `fichaz.app` for production deployments.

**Risk Level:** Medium (DNS changes, SSL certificates)

### 7.1 Pre-Domain Configuration

**Prerequisites:**

- [ ] Domain registered: fichaz.app
- [ ] Access to domain registrar DNS settings
- [ ] Vercel project "fichaz" exists (from Phase 5)

### 7.2 Add Domain in Vercel

**Steps:**

1. **Open Vercel Project Settings:**
   - Navigate to https://vercel.com/dashboard
   - Select "fichaz" project
   - Click "Settings" → "Domains"

2. **Add Custom Domain:**
   - Click "Add Domain"
   - Enter: `fichaz.app`
   - Click "Add"

3. **Note DNS Configuration:**
   - Vercel will provide DNS records to configure:
     - Type: `A` or `CNAME`
     - Name: `@` (for root domain)
     - Value: Vercel's IP or domain
   - If using `www.fichaz.app` as well:
     - Type: `CNAME`
     - Name: `www`
     - Value: `cname.vercel-dns.com`

4. **Copy DNS Configuration:**
   - Save the DNS records provided by Vercel

### 7.3 Configure DNS Records

**At Domain Registrar:**

1. **Log in to Domain Registrar:**
   - Access DNS management panel
   - Navigate to DNS records for `fichaz.app`

2. **Add DNS Records:**
   - Add `A` record (or `CNAME`) as provided by Vercel:
     - Type: `A`
     - Name: `@`
     - Value: `76.76.21.21` (Vercel's IP, verify with Vercel's current value)
     - TTL: `3600` (or default)

   - If using `www` subdomain:
     - Type: `CNAME`
     - Name: `www`
     - Value: `cname.vercel-dns.com`
     - TTL: `3600`

3. **Save DNS Changes:**
   - Save all records
   - Note: DNS propagation can take 1-48 hours

### 7.4 Wait for DNS Propagation

```bash
# Check DNS propagation
dig fichaz.app

# Check with multiple DNS servers
dig @8.8.8.8 fichaz.app
dig @1.1.1.1 fichaz.app

# Expected output should show Vercel's IP address
```

**Monitor Vercel Dashboard:**

- Check "Domains" section in Vercel project
- Wait for "Valid Configuration" status
- Vercel will automatically provision SSL certificate

### 7.5 Update OAuth Redirect URIs for Production Domain

**Update Kinde:**

1. Go to Kinde dashboard → Applications → "Fichaz"
2. Add production callback URLs:
   - `https://fichaz.app/api/auth/kinde_callback`
   - `https://www.fichaz.app/api/auth/kinde_callback` (if using www)
3. Add production logout redirects:
   - `https://fichaz.app`
   - `https://www.fichaz.app` (if using www)
4. Save changes

**Update Mailchimp:**

1. Go to Mailchimp developer portal → "Fichaz" app
2. Update redirect URIs:
   - `https://fichaz.app/api/auth/mailchimp/callback`
   - `https://www.fichaz.app/api/auth/mailchimp/callback` (if using www)
3. Update app website:
   - `https://fichaz.app`
4. Save changes

### 7.6 Configure Production Environment Variables

**In Vercel Dashboard:**

1. **Go to Project Settings → Environment Variables**

2. **Update/Add Production Variables:**
   - `KINDE_SITE_URL=https://fichaz.app` (Production only)
   - `KINDE_POST_LOGOUT_REDIRECT_URL=https://fichaz.app` (Production only)
   - `KINDE_POST_LOGIN_REDIRECT_URL=https://fichaz.app` (Production only)
   - `MAILCHIMP_REDIRECT_URI=https://fichaz.app/api/auth/mailchimp/callback` (Production only)
   - Remove `KINDE_COOKIE_DOMAIN` for production (or set to `fichaz.app`)

3. **Verify All Required Variables Present:**
   - Check that all variables from `.env.local` are set for Production environment
   - Ensure no secrets are missing

4. **Redeploy if Needed:**
   - If variables were added/updated, trigger redeploy

### 7.7 Test Production Domain

**Once DNS propagates and SSL is active:**

1. **Access Production Site:**
   - Open `https://fichaz.app` in browser
   - Verify SSL certificate is valid (lock icon in address bar)
   - Verify no mixed content warnings

2. **Test Kinde Authentication:**
   - Click login button
   - Complete Kinde login flow
   - Verify successful authentication
   - Verify redirect to `https://fichaz.app` after login

3. **Test Mailchimp Integration:**
   - Navigate to `/settings/integrations`
   - Connect Mailchimp
   - Complete OAuth flow
   - Verify connection successful
   - Navigate to `/mailchimp` and verify data loads

4. **Test Core Functionality:**
   - Test all main pages
   - Verify API calls work
   - Check browser console for errors

**Validation Checklist:**

- [ ] DNS records configured correctly
- [ ] DNS propagated (dig shows Vercel IP)
- [ ] SSL certificate active and valid
- [ ] fichaz.app loads successfully
- [ ] Kinde authentication works on production domain
- [ ] Mailchimp OAuth works on production domain
- [ ] All dashboard functionality working
- [ ] No console errors

### 7.8 Commit Phase 7 Documentation

```bash
git commit --allow-empty -m "chore: configure fichaz.app custom domain

- Added custom domain in Vercel
- Configured DNS records at registrar
- Updated OAuth redirect URIs for production domain
- Configured production environment variables
- Tested and verified SSL certificate
- Tested authentication flows on production domain

Production domain active: https://fichaz.app

Related to #[ISSUE_NUMBER]"

git push origin feature/rebrand-fichaz
```

**Checkpoint:** Phase 7 completed with custom domain configured and tested.

---

## Final Validation and Pull Request

### 7.1 Final Comprehensive Testing

**Test All Environments:**

1. **Local Development (127.0.0.1:3000):**

   ```bash
   pnpm dev
   ```

   - [ ] Kinde login works
   - [ ] Mailchimp OAuth works
   - [ ] UI shows "Fichaz" branding
   - [ ] All pages load correctly

2. **Preview Deployment (fichaz-\*.vercel.app):**
   - [ ] Kinde login works
   - [ ] Mailchimp OAuth works
   - [ ] UI shows "Fichaz" branding
   - [ ] All pages load correctly

3. **Production Domain (fichaz.app):**
   - [ ] Kinde login works
   - [ ] Mailchimp OAuth works
   - [ ] UI shows "Fichaz" branding
   - [ ] All pages load correctly
   - [ ] SSL certificate valid

### 7.2 Code Quality Checks

```bash
# Run full validation suite
pnpm pre-commit

# Verify no "Another Dashboard" strings remain in code
grep -r "Another Dashboard" src/ public/ --exclude-dir=node_modules

# Verify no "another-dashboard" in URLs (except old OAuth URIs being kept)
grep -r "another-dashboard" src/ public/ docs/ CLAUDE.md README.md --exclude-dir=node_modules
```

**Expected Results:**

- [ ] All tests pass
- [ ] No type errors
- [ ] No lint errors
- [ ] No formatting issues
- [ ] No "Another Dashboard" in code/UI
- [ ] No "another-dashboard" URLs (except documented legacy OAuth URIs)

### 7.3 Update GitHub Issue

```bash
# Update issue with completion status
gh issue comment [ISSUE_NUMBER] --body "## Rebrand Complete ✅

All phases completed successfully:

- ✅ Phase 0: Git Setup
- ✅ Phase 1: Update Code/UI Strings
- ✅ Phase 2: Update PWA Manifest and Metadata
- ✅ Phase 3: Update Documentation Files
- ✅ Phase 4: OAuth Provider Updates
- ✅ Phase 5: GitHub Repository Rename
- ✅ Phase 6: Vercel Project Rename
- ✅ Phase 7: Domain Configuration

**Testing Results:**
- Local development: Working ✅
- Preview deployments: Working ✅
- Production domain (fichaz.app): Working ✅

**Authentication Flows:**
- Kinde: Working on all environments ✅
- Mailchimp: Working on all environments ✅

Ready for PR review."
```

### 7.4 Create Pull Request

```bash
# Ensure all commits pushed
git push origin feature/rebrand-fichaz

# Create PR
gh pr create \
  --title "Rebrand: Another Dashboard → Fichaz" \
  --body "## Overview

Complete rebrand from 'Another Dashboard' to 'Fichaz' across code, UI, infrastructure, and OAuth providers.

## Changes

### Code/UI (Phase 1)
- Updated package.json name field
- Updated dashboard sidebar branding
- Updated dashboard header branding
- Updated Mailchimp empty state messaging

### PWA/Metadata (Phase 2)
- Updated PWA manifest (name, short_name, description)
- Updated Next.js root layout metadata
- Updated OpenGraph metadata

### Documentation (Phase 3)
- Updated README.md
- Updated CLAUDE.md
- Updated all docs/ markdown files

### OAuth Providers (Phase 4)
- Updated Kinde application name to 'Fichaz'
- Updated Mailchimp OAuth app name to 'Fichaz'
- Tested authentication flows on all environments

### GitHub Repository (Phase 5)
- Renamed GitHub repository to 'fichaz'
- Updated local git remotes
- Updated repository references in documentation
- Verified Vercel integration
- GitHub redirects configured for backward compatibility

### Vercel Project (Phase 6)
- Renamed Vercel project from 'another-dashboard' to 'fichaz'
- Updated preview deployment URLs
- Updated OAuth redirect URIs for new URLs
- Tested preview deployments

### Domain Configuration (Phase 7)
- Configured custom domain: fichaz.app
- Updated DNS records
- Provisioned SSL certificate
- Updated OAuth redirect URIs for production
- Configured production environment variables
- Tested production domain

## Testing

All environments tested and verified:
- ✅ Local development (127.0.0.1:3000)
- ✅ Preview deployments (fichaz-*.vercel.app)
- ✅ Production domain (https://fichaz.app)

Authentication flows verified:
- ✅ Kinde authentication working on all environments
- ✅ Mailchimp OAuth working on all environments

Code quality:
- ✅ All tests passing
- ✅ No type errors
- ✅ No lint errors
- ✅ No 'Another Dashboard' strings remaining in code

## Related Issue

Closes #[ISSUE_NUMBER]

## Execution Plan

See: docs/execution-plans/project-rebrand-fichaz.md" \
  --label "enhancement" \
  --label "infrastructure"
```

### 7.5 Post-Merge Cleanup

**After PR is merged and production deployed:**

1. **Remove Old OAuth Redirect URIs:**
   - Remove `https://127.0.0.1:3000` URIs if not needed for local dev
   - Remove old `another-dashboard-*.vercel.app` URIs (already done in Phase 5.10)

2. **Update Local Environment:**

   ```bash
   git checkout main
   git pull origin main
   git branch -d feature/rebrand-fichaz
   ```

3. **Archive Execution Plan:**
   - Move plan to `docs/execution-plans/completed/`
   - Update project-management/development-roadmap.md with completion

4. **Close GitHub Issue:**
   ```bash
   gh issue close [ISSUE_NUMBER] --comment "Rebrand completed and merged in PR #[PR_NUMBER]. Production domain live at https://fichaz.app"
   ```

---

## Success Criteria

✅ **Code/UI:**

- All "Another Dashboard" strings replaced with "Fichaz"
- package.json name updated
- PWA manifest updated
- Next.js metadata updated

✅ **OAuth Providers:**

- Kinde application updated to "Fichaz"
- Mailchimp OAuth app updated to "Fichaz"
- All authentication flows working

✅ **Infrastructure:**

- GitHub repository renamed to "fichaz"
- Vercel project renamed to "fichaz"
- Preview deployments working at fichaz-\*.vercel.app
- Custom domain fichaz.app configured and working
- SSL certificate active

✅ **Documentation:**

- README.md updated
- CLAUDE.md updated
- All docs/ files updated

✅ **Testing:**

- All environments tested (local, preview, production)
- All tests passing
- No type errors
- No lint errors

✅ **User Experience:**

- Consistent "Fichaz" branding across all touchpoints
- Professional appearance with custom domain
- All functionality working identically

---

## Rollback Plan

**If issues arise during implementation:**

### Phase 1-3 Rollback (Code/Docs):

```bash
# Revert commits
git revert HEAD~N  # N = number of commits to revert

# Or reset to before feature branch
git checkout main
git branch -D feature/rebrand-fichaz
```

### Phase 4 Rollback (OAuth):

- Revert app names in Kinde/Mailchimp dashboards
- No code changes to revert

### Phase 5 Rollback (GitHub Repository):

- Rename repository back via GitHub settings
- Update local remotes
- GitHub redirects will automatically update
- No breaking changes to git operations

### Phase 6 Rollback (Vercel):

- Rename Vercel project back to "another-dashboard" via dashboard
- Revert OAuth redirect URIs in providers
- Update environment variables back

### Phase 7 Rollback (Domain):

- Remove custom domain from Vercel project
- Remove DNS records at registrar
- Revert OAuth redirect URIs for production

**Critical:** Each phase is independent and can be rolled back without affecting others.

---

## Notes and Considerations

**OAuth Provider Limitations:**

- Kinde: App names can be changed instantly, no downtime
- Mailchimp: App names can be changed instantly, client ID/secret unchanged
- Redirect URIs: Can have multiple URIs active simultaneously (useful during transition)

**GitHub Repository Rename:**

- Renames are instant and affect repository URLs
- GitHub automatically sets up permanent redirects from old name to new name
- Existing clones continue to work (redirects are transparent to git)
- Issues, PRs, stars, and watches are preserved
- External links redirect automatically
- Best practice: Update local remotes even though redirects work

**Vercel Project Rename:**

- Renames are instant but affect all preview URLs
- Environment variables preserved during rename
- Git integration maintained
- Previous deployment URLs (another-dashboard-\*.vercel.app) stop working

**DNS Propagation:**

- Can take 1-48 hours for full propagation
- Use low TTL values (3600) for faster updates
- Test with multiple DNS servers during propagation

**SSL Certificates:**

- Vercel provisions automatically after DNS verification
- Usually takes 5-10 minutes after DNS propagates
- Supports both root domain and www subdomain

**Testing Strategy:**

- Test each phase immediately after completion
- Keep old OAuth redirect URIs active temporarily
- Verify all environments before proceeding to next phase
- Have rollback plan ready for each phase

**Future Considerations:**

- Monitor for any hardcoded URLs in code
- Update any external documentation or links
- Notify any beta testers of domain change
- Set up redirects if needed (not applicable yet, no production users)

---

## Appendix: Command Reference

**Git Commands:**

```bash
# Create feature branch
git checkout -b feature/rebrand-fichaz

# Check status
git status

# Stage files
git add <files>

# Commit
git commit -m "message"

# Push
git push origin feature/rebrand-fichaz

# Create PR
gh pr create --title "..." --body "..."
```

**Search Commands:**

```bash
# Find string in codebase
grep -r "Another Dashboard" src/ --exclude-dir=node_modules

# Find string in markdown files
grep -r "Another Dashboard" docs/ README.md CLAUDE.md --include="*.md"

# Find URLs
grep -r "another-dashboard" . --exclude-dir=node_modules
```

**Validation Commands:**

```bash
# Type check
pnpm type-check

# Run tests
pnpm test

# Run lint
pnpm lint

# Format check
pnpm format:check

# Format fix
pnpm format

# Full validation
pnpm pre-commit
```

**DNS Commands:**

```bash
# Check DNS record
dig fichaz.app

# Check with specific DNS server
dig @8.8.8.8 fichaz.app
dig @1.1.1.1 fichaz.app

# Check with trace
dig +trace fichaz.app
```

**Vercel Commands:**

```bash
# List projects
vercel ls

# List environment variables
vercel env ls

# Pull environment variables
vercel env pull .env.local
```

---

## Timeline Estimate

- **Phase 0:** 15 minutes
- **Phase 1:** 30 minutes
- **Phase 2:** 20 minutes
- **Phase 3:** 45 minutes (depends on number of doc files)
- **Phase 4:** 60 minutes (includes OAuth testing)
- **Phase 5:** 30 minutes (GitHub repository rename and validation)
- **Phase 6:** 45 minutes (includes Vercel rename and testing)
- **Phase 7:** 2-48 hours (mostly DNS propagation wait time, actual work ~30 minutes)
- **Final Validation:** 30 minutes

**Total Active Work:** ~4.5 hours
**Total Calendar Time:** 4.5 hours to 2 days (depending on DNS propagation)

---

**Execution Plan Version:** 1.0
**Last Updated:** 2025-10-19
