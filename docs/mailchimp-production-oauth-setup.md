# Mailchimp Production OAuth App Setup

## Status: ⏸️ Pending (Waiting for Mailchimp Support)

**Issue:** Unable to register new OAuth app in Mailchimp due to service issues.

**Date Started:** October 7, 2025

---

## Background

Phase 9 (Production Deployment) is **95% complete**. All code is deployed and working in production except for the Mailchimp OAuth flow, which requires a separate production OAuth app.

### What's Already Complete ✅

1. **Environment Variables Configured in Vercel:**
   - ✅ All 10 required environment variables added to Vercel
   - ✅ Kinde authentication variables (6)
   - ✅ Mailchimp OAuth variables (3) - _currently using dev app credentials_
   - ✅ Production encryption key

2. **Code Deployed:**
   - ✅ PR #170 merged to main
   - ✅ Production deployment successful
   - ✅ All OAuth 2.0 code is live
   - ✅ Production URL: https://another-dashboard-caddwo3l8-alvaros-projects-b3e953f8.vercel.app

3. **What Works in Production:**
   - ✅ Kinde authentication (login/logout)
   - ✅ Database connection (Neon Postgres)
   - ✅ All UI pages and components
   - ✅ Dashboard data display
   - ⚠️ Mailchimp OAuth flow (redirect URI mismatch - points to localhost)

---

## Remaining Steps (5-10 minutes when Mailchimp is available)

### Step 1: Create Production Mailchimp OAuth App

**When Mailchimp support resolves the registration issue:**

1. Go to https://mailchimp.com → Account → Extras → API Keys
2. Click **"Register An App"** or **"Create New App"**
3. Fill in the form:
   - **App Name:** `Another Dashboard - Production`
   - **Company/Organization:** `La Noticia, Inc`
   - **App Website:** `https://another-dashboard-caddwo3l8-alvaros-projects-b3e953f8.vercel.app/`
   - **Redirect URI:** `https://another-dashboard-caddwo3l8-alvaros-projects-b3e953f8.vercel.app/api/auth/mailchimp/callback`
4. Click **Create** or **Register**
5. **Save the Client ID and Client Secret** (you'll need them in Step 2)

### Step 2: Update Vercel Environment Variables

1. Go to Vercel Dashboard → another-dashboard → Settings → Environment Variables
2. Find and **edit** these 2 variables:
   - `MAILCHIMP_CLIENT_ID` - Replace with production app Client ID
   - `MAILCHIMP_CLIENT_SECRET` - Replace with production app Client Secret
3. Keep these variables the same (don't change):
   - `MAILCHIMP_REDIRECT_URI` - Already set to production URL
   - `ENCRYPTION_KEY` - Already set to production key

### Step 3: Redeploy to Apply Changes

Run from project root:

```bash
pnpm vercel deploy --prod --yes
```

Or trigger a new deployment by pushing an empty commit:

```bash
git commit --allow-empty -m "chore: trigger deployment after Mailchimp production OAuth app setup"
git push origin main
```

### Step 4: Test OAuth Flow in Production

1. Visit: https://another-dashboard-caddwo3l8-alvaros-projects-b3e953f8.vercel.app
2. Log in with Kinde
3. Click "Connect Mailchimp" or go to `/settings/integrations`
4. Complete OAuth flow
5. Verify you can see your Mailchimp data

---

## Current Environment Configuration

### Local Development (.env.local)

- `MAILCHIMP_CLIENT_ID` → Dev app credentials
- `MAILCHIMP_CLIENT_SECRET` → Dev app credentials
- `MAILCHIMP_REDIRECT_URI` → `https://127.0.0.1:3000/api/auth/mailchimp/callback`
- `ENCRYPTION_KEY` → Dev encryption key

### Production (Vercel)

- `MAILCHIMP_CLIENT_ID` → **Currently dev app** (needs update)
- `MAILCHIMP_CLIENT_SECRET` → **Currently dev app** (needs update)
- `MAILCHIMP_REDIRECT_URI` → `https://another-dashboard-caddwo3l8-alvaros-projects-b3e953f8.vercel.app/api/auth/mailchimp/callback` ✅
- `ENCRYPTION_KEY` → Production encryption key ✅

---

## Why We Need Separate Apps

Mailchimp only allows **one redirect URI per OAuth app**. Therefore:

- **Dev App:** Redirect URI points to `https://127.0.0.1:3000/api/auth/mailchimp/callback`
- **Production App:** Redirect URI points to `https://another-dashboard-caddwo3l8-alvaros-projects-b3e953f8.vercel.app/api/auth/mailchimp/callback`

Having separate apps allows both environments to work simultaneously without constantly changing the redirect URI.

---

## Troubleshooting

### If OAuth flow fails in production after setup:

1. **Check redirect URI matches exactly:**
   - Mailchimp app: `https://another-dashboard-caddwo3l8-alvaros-projects-b3e953f8.vercel.app/api/auth/mailchimp/callback`
   - Vercel `MAILCHIMP_REDIRECT_URI`: `https://another-dashboard-caddwo3l8-alvaros-projects-b3e953f8.vercel.app/api/auth/mailchimp/callback`

2. **Verify credentials are correct:**
   - Double-check Client ID and Client Secret were copied correctly
   - Make sure you're using the **production app** credentials, not dev

3. **Check Vercel deployment logs:**
   - Go to Vercel Dashboard → Deployments → Click on latest deployment
   - Check for any build or runtime errors

4. **Test locally first:**
   - Update your local `.env.local` with production credentials temporarily
   - Test OAuth flow locally to verify credentials work
   - Change back to dev credentials when done

---

## References

- **Phase 9 Documentation:** `docs/mailchimp-oauth2-migration-plan.md` (Section: Phase 9 - Deployment)
- **OAuth Manual Testing Checklist:** `docs/oauth-manual-testing-checklist.md`
- **Environment Configuration:** `CLAUDE.md` (Section: Mailchimp OAuth Setup)
- **Production URL:** https://another-dashboard-caddwo3l8-alvaros-projects-b3e953f8.vercel.app

---

## Next Steps After Completion

Once the production OAuth app is configured and working:

1. Complete **Phase 7.3b: Comprehensive Testing (Production)**
   - See: `docs/oauth-manual-testing-checklist.md`
   - Test all OAuth flows in production
   - Test multi-user isolation
   - Test error scenarios

2. Update documentation:
   - Mark Phase 9 as 100% complete
   - Document any production-specific issues discovered
   - Update README.md with production URL

3. Monitor production:
   - Check Vercel logs for errors
   - Monitor database connections
   - Verify token encryption is working

---

**Last Updated:** October 7, 2025
**Blocked By:** Mailchimp service issues preventing OAuth app registration
**Estimated Time to Complete:** 5-10 minutes once Mailchimp is available
