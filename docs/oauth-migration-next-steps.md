# Mailchimp OAuth2 Migration - Next Steps

**Current Status:** Phases 1-8 Complete ✅ | Phase 7.3b Pending (Post-Deployment)
**Branch:** `feature/mailchimp-oauth2-migration`
**Updated:** 2025-10-05

---

## Quick Status Check

### ✅ What's Done

- Database setup with Neon Postgres + Drizzle ORM
- Token encryption (AES-256-GCM)
- OAuth2 flow with CSRF protection
- User-scoped Mailchimp service layer
- Empty states and connection UI
- Settings/Integrations page
- Comprehensive testing (380 tests passing)
- **Phase 7.3a**: Critical path testing (pre-deployment) - COMPLETE ✅
- **Phase 8**: Cleanup & Documentation - COMPLETE ✅

### 🚀 What's Next

- **Phase 9**: Deployment to Production (1 hour)
- **Phase 7.3b**: Comprehensive Testing (90 minutes) - ⏳ PENDING - Execute AFTER deployment in production environment

---

## Phase 8: Cleanup & Documentation Checklist

### 8.1: Remove Old API Key Code (30 minutes)

**Search for these patterns:**

```bash
# Find old API key references
grep -r "MAILCHIMP_API_KEY" .
grep -r "MAILCHIMP_SERVER_PREFIX" .
```

**Files to update:**

- [x] `.env.local.template` - Remove API key variables
- [x] `README.md` - Update authentication section
- [x] Any remaining documentation with API key setup

### 8.2: Update CLAUDE.md (45 minutes)

**Section to update:** Mailchimp Integration

Replace API key instructions with OAuth setup:

```markdown
### Mailchimp Integration (OAuth2)

**Authentication Method:** OAuth 2.0 (user-scoped tokens)

**Setup:**

1. Register OAuth app at Mailchimp
2. Add credentials to .env.local
3. Users connect via /mailchimp or /settings/integrations

**Database:**

- Neon Postgres stores encrypted OAuth tokens
- Table: mailchimp_connections

**Security:**

- AES-256-GCM encryption at rest
- CSRF protection via state parameter
```

### 8.3: Update README.md (30 minutes)

**Add sections:**

- OAuth authentication flow
- Database setup instructions
- Environment variables for OAuth
- User connection process

### 8.4: Update .env.local.template (15 minutes)

```bash
# Remove (deprecated):
# MAILCHIMP_API_KEY=
# MAILCHIMP_SERVER_PREFIX=

# Add:
MAILCHIMP_CLIENT_ID=your_client_id
MAILCHIMP_CLIENT_SECRET=your_client_secret
MAILCHIMP_REDIRECT_URI=https://127.0.0.1:3000/api/auth/mailchimp/callback
ENCRYPTION_KEY=your_base64_encryption_key

# Database (from Vercel/Neon)
DATABASE_URL=postgres://...
POSTGRES_PRISMA_URL=postgres://...
```

---

## Phase 9: Deployment Checklist

### 9.1: Vercel Environment Setup (30 minutes)

**In Vercel Dashboard:**

1. Navigate to Project → Settings → Environment Variables
2. Verify database variables (should exist from Neon integration):
   - [ ] `DATABASE_URL`
   - [ ] `POSTGRES_PRISMA_URL`
   - [ ] `POSTGRES_URL`
3. Add new OAuth variables:
   - [ ] `MAILCHIMP_CLIENT_ID`
   - [ ] `MAILCHIMP_CLIENT_SECRET`
   - [ ] `MAILCHIMP_REDIRECT_URI` (production URL)
   - [ ] `ENCRYPTION_KEY`
4. Set for: Production, Preview, Development

### 9.2: Mailchimp OAuth App Configuration (15 minutes)

**In Mailchimp Dashboard:**

1. Go to Account → Extras → API Keys → Your Apps
2. Select "Another Dashboard" app
3. Add redirect URIs:
   - [ ] Production: `https://your-domain.vercel.app/api/auth/mailchimp/callback`
   - [ ] Preview: `https://*-your-project.vercel.app/api/auth/mailchimp/callback`
   - [ ] Keep existing: `https://127.0.0.1:3000/api/auth/mailchimp/callback`

### 9.3: Deploy & Verify (15 minutes)

**Deploy:**

```bash
git add .
git commit -m "feat: complete Phase 7 - testing and validation"
git push origin feature/mailchimp-oauth2-migration

# Create PR and merge (or push directly if main)
# Vercel auto-deploys
```

**Smoke Test (Production):**

- [ ] Visit production URL
- [ ] Navigate to `/mailchimp`
- [ ] See empty state with "Connect Mailchimp"
- [ ] Click connect → OAuth flow
- [ ] Approve on Mailchimp
- [ ] Redirect back with success
- [ ] Dashboard loads with data
- [ ] Check database for encrypted token
- [ ] Visit `/settings/integrations`
- [ ] See connection details
- [ ] Test disconnect and reconnect

---

## Testing Strategy (Post-Deployment)

### Priority 1: Core Flow

1. OAuth authorization and callback
2. Token encryption verification
3. Dashboard data loading
4. Settings page functionality

### Priority 2: Error Scenarios

1. User denies access
2. Invalid state (CSRF)
3. Expired/invalid tokens
4. Network failures

### Priority 3: Multi-User

1. Two different users
2. Verify data isolation
3. Concurrent connections

---

## Rollback Plan

If issues occur in production:

```bash
# Revert deployment
vercel rollback <deployment-id>

# Or revert commit
git revert HEAD
git push origin main
```

**Critical Issues to Watch:**

- Database connection failures
- Encryption key issues
- OAuth redirect mismatches
- Token validation failures
- Rate limiting from Mailchimp

---

## Success Criteria

**Phase 8 Complete When:**

- [x] All documentation updated
- [x] No references to old API key auth
- [x] Environment templates current
- [x] README reflects OAuth flow

**Phase 8 Status:** ✅ COMPLETE

**Phase 9 Complete When:**

- [ ] Deployed to production
- [ ] OAuth flow works end-to-end
- [ ] No console errors
- [ ] Database tokens encrypted
- [ ] Settings page functional

**Phase 7.3b Complete When (Post-Deployment):**

- [ ] Multi-user isolation tested (2+ users)
- [ ] All error scenarios validated
- [ ] Security features verified (encryption, CSRF, HTTPS)
- [ ] Performance acceptable under real conditions
- [ ] Edge cases tested (session expiration, browser back button, etc.)
- [ ] Accessibility compliance verified (WCAG 2.1 AA)

See [docs/oauth-manual-testing-checklist.md](oauth-manual-testing-checklist.md) for complete test suite.

---

## Helpful Commands

```bash
# Run all tests
pnpm test

# Run validation
pnpm validate

# Check for old API key references
grep -r "MAILCHIMP_API_KEY" src/ docs/

# Generate encryption key
openssl rand -base64 32

# Deploy to Vercel (if not auto)
vercel --prod

# Check deployment logs
vercel logs <deployment-url>
```

---

## Reference Documents

- **Complete Plan:** `docs/mailchimp-oauth2-migration-plan.md`
- **Progress:** `docs/oauth-migration-progress.md`
- **Manual Tests:** `docs/oauth-manual-testing-checklist.md`
- **Error Handling:** `docs/oauth-error-handling-updates.md`

---

## Estimated Time Remaining

- **Phase 8**: 2 hours (documentation and cleanup)
- **Phase 9**: 1 hour (deployment and verification)
- **Total**: 3 hours

**Target Completion:** Within 1 day of focused work

---

## Questions to Answer Before Proceeding

1. ✅ Are all automated tests passing? (Yes - 380/380)
2. ✅ Is the database schema deployed? (Yes - mailchimp_connections table)
3. ✅ Do we have OAuth credentials? (Check with team)
4. ⚠️ Is production Vercel environment configured? (To be verified)
5. ⚠️ Are redirect URIs registered in Mailchimp? (To be added)

---

**Ready to Continue?**

Start with Phase 8.1 - search for and remove old API key references. Then update documentation systematically before moving to deployment.

Good luck! 🚀
