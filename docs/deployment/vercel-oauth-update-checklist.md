# Vercel Deployment OAuth Update Checklist

## Status: Pending Production Deployment

This checklist covers the OAuth redirect URI updates needed when deploying the rebranded "Fichaz" application to Vercel production.

## Current Status (Phase 6 Complete)

### Completed:
- ✅ Vercel project renamed from "another-dashboard" to "fichaz"
- ✅ Local development OAuth working with 127.0.0.1
- ✅ GitHub repository renamed to "fichaz"

### Pending Deployment:
- ⏳ Production deployment (intentionally paused during development)
- ⏳ OAuth redirect URI updates for Vercel URLs

---

## When Ready to Deploy: OAuth Update Steps

### Expected New Vercel URLs

After deploying, your Vercel URLs will change:

**Old Production URL:**
- `another-dashboard-eight.vercel.app`

**New Production URL (Expected):**
- `fichaz.vercel.app` (if available)
- OR `fichaz-[hash].vercel.app`
- OR `fichaz-[hash]-alvaros-projects-b3e953f8.vercel.app`

**Preview URLs:**
- `fichaz-[branch]-[hash].vercel.app`

---

## Step 1: Deploy and Confirm New URLs

1. **Merge rebrand branch to main:**
   ```bash
   git checkout main
   git merge feature/rebrand-fichaz
   git push origin main
   ```

2. **Wait for Vercel deployment to complete**

3. **Note the new production URL** from Vercel dashboard

---

## Step 2: Update Kinde OAuth Redirect URIs

### Access Kinde Settings:
1. Go to: https://app.kinde.com/
2. Settings → Applications → Fichaz
3. Find "Allowed callback URLs"

### Add New Vercel URL:
**Current URLs:**
- `https://127.0.0.1:3000/api/auth/kinde_callback` ✅ Keep
- `https://another-dashboard-eight.vercel.app/api/auth/kinde_callback` ⏳ Keep temporarily

**Add New URL:**
- `https://[NEW-VERCEL-URL]/api/auth/kinde_callback`

### Strategy:
1. **ADD** new Vercel URL (don't remove old one yet)
2. **Test** authentication on new URL
3. **Remove** old URL once confirmed working

---

## Step 3: Update Mailchimp OAuth Redirect URIs

### Access Mailchimp Settings:
1. Go to: https://admin.mailchimp.com/account/api/
2. Registered Apps → Fichaz, Inc
3. Find "Redirect URI"

### Add New Vercel URL:
**Current URLs:**
- `https://127.0.0.1:3000/api/auth/mailchimp/callback` ✅ Keep

**Add New URL (if using Vercel for OAuth):**
- `https://[NEW-VERCEL-URL]/api/auth/mailchimp/callback`

**Note:** If you only use local development for Mailchimp OAuth, no Vercel URL update needed.

---

## Step 4: Test Authentication Flows

### Test on New Vercel URL:

1. **Visit:** `https://[NEW-VERCEL-URL]`
2. **Test Kinde Login:**
   - Click login
   - Sign in with Google
   - Verify redirect back to dashboard
3. **Test Mailchimp OAuth:**
   - Go to Settings → Integrations
   - Connect Mailchimp
   - Verify successful connection

### Expected Results:
- ✅ Kinde login works without errors
- ✅ Mailchimp connection works
- ✅ No OAuth redirect errors in console
- ✅ No "redirect_uri_mismatch" errors

---

## Step 5: Clean Up Old URLs (After Testing)

Once new Vercel URLs are confirmed working:

### Kinde:
- ✅ Keep: `https://127.0.0.1:3000/api/auth/kinde_callback`
- ✅ Keep: `https://[NEW-VERCEL-URL]/api/auth/kinde_callback`
- ❌ Remove: `https://another-dashboard-eight.vercel.app/api/auth/kinde_callback`

### Mailchimp:
- ✅ Keep: `https://127.0.0.1:3000/api/auth/mailchimp/callback`
- ✅ Keep: `https://[NEW-VERCEL-URL]/api/auth/mailchimp/callback` (if added)
- ❌ Remove: Old Vercel URLs (if any)

---

## Troubleshooting

### "redirect_uri_mismatch" Error

**Cause:** OAuth provider doesn't recognize the redirect URI

**Fix:**
1. Verify the exact URL in the error message
2. Add that exact URL to OAuth provider settings
3. Make sure URL includes `https://` and exact path
4. No trailing slashes

### "State not found" Error

**Cause:** Cookie domain mismatch or state validation failure

**Fix:**
1. Clear browser cookies
2. Check that `NEXT_PUBLIC_APP_URL` environment variable is set correctly in Vercel
3. Verify cookie domain settings in Kinde

---

## Environment Variables Check

Before deploying, verify these environment variables are set in Vercel:

### Required for Kinde:
- `KINDE_CLIENT_ID`
- `KINDE_CLIENT_SECRET`
- `KINDE_ISSUER_URL`
- `KINDE_SITE_URL` (should be your Vercel URL)
- `KINDE_POST_LOGIN_REDIRECT_URL`
- `KINDE_POST_LOGOUT_REDIRECT_URL`
- `KINDE_COOKIE_DOMAIN` (set to your Vercel domain, not 127.0.0.1)

### Required for Mailchimp:
- `MAILCHIMP_CLIENT_ID`
- `MAILCHIMP_CLIENT_SECRET`
- `MAILCHIMP_REDIRECT_URI` (should be your Vercel URL)
- `ENCRYPTION_KEY`

### General:
- `NEXT_PUBLIC_APP_URL` (should be your Vercel URL)
- `DATABASE_URL`

---

## Completion Checklist

When deploying to production, check off each item:

- [ ] Deployed to Vercel production
- [ ] Noted new production URL
- [ ] Added new Vercel URL to Kinde allowed callbacks
- [ ] Added new Vercel URL to Mailchimp redirect URI (if needed)
- [ ] Updated Vercel environment variables
- [ ] Tested Kinde login on production
- [ ] Tested Mailchimp OAuth on production
- [ ] No console errors
- [ ] Removed old OAuth URLs from providers
- [ ] Updated documentation with final URLs

---

## Related Documentation

- [Kinde Next.js SDK Docs](https://docs.kinde.com/developer-tools/sdks/backend/nextjs-sdk/)
- [Mailchimp OAuth 2.0 Docs](https://mailchimp.com/developer/marketing/guides/access-user-data-oauth-2/)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
