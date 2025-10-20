# Phase 7: Domain Configuration Guide

## Status: Pending Production Deployment

This guide covers configuring the `fichaz.app` custom domain for the Fichaz application when ready to deploy to production.

⚠️ **Do not execute these steps until ready to deploy to production.**

---

## Prerequisites

Before starting Phase 7:

- [ ] Domain `fichaz.app` registered (or ready to register)
- [ ] Access to domain registrar DNS settings
- [ ] Vercel project "fichaz" ready for production
- [ ] All rebrand phases 0-6 complete
- [ ] Ready to deploy rebrand changes to production

---

## Step 1: Register Domain (If Not Done)

### Option A: Register with Vercel Domains

- **Pros:** Automatic DNS configuration, managed by Vercel
- **Cons:** Vercel pricing, tied to Vercel platform
- **Link:** https://vercel.com/domains

### Option B: Register with Third-Party Registrar

- **Options:** Namecheap, GoDaddy, Google Domains, Cloudflare
- **Pros:** More control, potentially cheaper
- **Cons:** Manual DNS configuration required
- **Recommended:** Namecheap or Cloudflare

### Cost Estimate:

- `.app` domain: ~$15-20/year
- Vercel hosting: Free tier (Hobby) or $20/month (Pro)

---

## Step 2: Add Custom Domain to Vercel

### In Vercel Dashboard:

1. **Go to:** https://vercel.com/dashboard
2. **Click:** "fichaz" project
3. **Click:** "Settings" tab
4. **Click:** "Domains" in left sidebar
5. **Enter domain:** `fichaz.app`
6. **Click:** "Add"

### Vercel Will Show Required DNS Records:

**A Record (for root domain):**

```
Type: A
Name: @
Value: 76.76.21.21 (Vercel's IP)
TTL: 3600
```

**CNAME Record (for www subdomain):**

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Note:** Exact values may differ - use what Vercel displays.

---

## Step 3: Configure DNS Records

### If Using Vercel Domains:

✅ **Skip this step** - DNS is configured automatically

### If Using Third-Party Registrar:

#### Access Your DNS Settings:

1. Log in to your domain registrar
2. Find DNS management section
3. Locate DNS records or nameserver settings

#### Add DNS Records (as shown by Vercel):

**Root Domain (fichaz.app):**

```
Type: A
Host/Name: @ (or leave blank)
Value: [IP from Vercel]
TTL: 3600 or Auto
```

**WWW Subdomain (www.fichaz.app):**

```
Type: CNAME
Host/Name: www
Value: cname.vercel-dns.com
TTL: 3600 or Auto
```

#### DNS Propagation:

- **Time:** Can take 24-48 hours (usually much faster)
- **Check status:** https://dnschecker.org/
- **Vercel will show:** "Pending" → "Valid" when ready

---

## Step 4: Configure Vercel Domain Settings

### In Vercel Domain Settings:

**Redirect www to root:**

- Enable: "Redirect www.fichaz.app to fichaz.app"
- Or vice versa based on preference

**SSL Certificate:**

- ✅ Automatic via Vercel (Let's Encrypt)
- ✅ No action needed - Vercel handles it

**Git Branch:**

- Production Branch: `main`
- Preview Branches: Automatic for all branches

---

## Step 5: Update Environment Variables

### In Vercel Project Settings → Environment Variables:

Update these to use custom domain:

**For Production Environment:**

```
NEXT_PUBLIC_APP_URL=https://fichaz.app
KINDE_SITE_URL=https://fichaz.app
KINDE_POST_LOGIN_REDIRECT_URL=https://fichaz.app/mailchimp
KINDE_POST_LOGOUT_REDIRECT_URL=https://fichaz.app
MAILCHIMP_REDIRECT_URI=https://fichaz.app/api/auth/mailchimp/callback
```

**Important:**

- Set these for **Production** environment only
- Keep different values for Preview/Development if needed
- Don't use `127.0.0.1` or `.vercel.app` domains in production

---

## Step 6: Update OAuth Redirect URIs

### Kinde Configuration:

1. **Go to:** https://app.kinde.com/
2. **Settings → Applications → Fichaz**
3. **Allowed callback URLs - Add:**
   ```
   https://fichaz.app/api/auth/kinde_callback
   ```
4. **Allowed logout redirect URLs - Add:**
   ```
   https://fichaz.app
   ```

**Keep existing URLs during transition:**

- ✅ `https://127.0.0.1:3000/api/auth/kinde_callback` (local dev)
- ✅ `https://fichaz.vercel.app/api/auth/kinde_callback` (if using Vercel preview)
- ✅ `https://fichaz.app/api/auth/kinde_callback` (production)

### Mailchimp Configuration:

1. **Go to:** https://admin.mailchimp.com/account/api/
2. **Registered Apps → Fichaz, Inc**
3. **Update fields:**
   - **App Website:** `https://fichaz.app`
   - **Redirect URI:** Add `https://fichaz.app/api/auth/mailchimp/callback`

**Keep existing URL during transition:**

- ✅ `https://127.0.0.1:3000/api/auth/mailchimp/callback` (local dev)
- ✅ `https://fichaz.app/api/auth/mailchimp/callback` (production)

---

## Step 7: Deploy to Production

### Merge Rebrand Branch:

```bash
# Switch to main branch
git checkout main

# Pull latest changes
git pull origin main

# Merge rebrand branch
git merge feature/rebrand-fichaz

# Push to production
git push origin main
```

### Vercel Will Automatically:

1. Detect the push to `main`
2. Build the application
3. Deploy to `fichaz.app`
4. Issue SSL certificate
5. Configure redirects

### Monitor Deployment:

- Watch Vercel dashboard for deployment status
- Deployment typically takes 2-5 minutes
- Check for any build errors

---

## Step 8: Verify Production Deployment

### Check Domain Access:

1. **Visit:** https://fichaz.app
2. **Verify:** Site loads with new branding
3. **Check:** SSL certificate is valid (🔒 in browser)
4. **Test:** All pages load correctly

### Test Authentication:

**Kinde Login:**

1. Click login button
2. Sign in with Google
3. Verify successful authentication
4. Check redirect works correctly
5. No console errors

**Mailchimp OAuth:**

1. Go to Settings → Integrations
2. Connect Mailchimp account
3. Verify OAuth flow completes
4. Check data loads from Mailchimp
5. No redirect errors

### Verify All Pages:

- [ ] `/` - Home/Dashboard
- [ ] `/mailchimp` - Mailchimp Dashboard
- [ ] `/mailchimp/reports` - Reports list
- [ ] `/mailchimp/lists` - Audience lists
- [ ] `/mailchimp/general-info` - Account info
- [ ] `/settings/integrations` - Integration settings

---

## Step 9: Update Documentation

### Update These Files:

**README.md:**

- Update live demo link to `https://fichaz.app`
- Update project name references

**Environment Variable Examples:**

- `.env.example` - Show production domain examples
- Documentation - Update all URL references

**CLAUDE.md:**

- Update any production URL references
- Update OAuth configuration examples

---

## Step 10: Cleanup Old URLs (Optional)

**After verifying production works for 1-2 weeks:**

### Remove Old OAuth URLs:

**Kinde:**

- Remove: Old Vercel preview URLs
- Keep: `https://127.0.0.1:3000/api/auth/kinde_callback` (local dev)
- Keep: `https://fichaz.app/api/auth/kinde_callback` (production)

**Mailchimp:**

- Remove: Old Vercel preview URLs
- Keep: `https://127.0.0.1:3000/api/auth/mailchimp/callback` (local dev)
- Keep: `https://fichaz.app/api/auth/mailchimp/callback` (production)

---

## Troubleshooting

### Domain Not Resolving

**Symptoms:** `fichaz.app` doesn't load or shows DNS error

**Solutions:**

1. Check DNS propagation: https://dnschecker.org/
2. Verify A record points to correct Vercel IP
3. Wait 24-48 hours for full propagation
4. Clear browser DNS cache: Chrome → `chrome://net-internals/#dns` → Clear

### SSL Certificate Issues

**Symptoms:** Browser shows "Not Secure" or certificate error

**Solutions:**

1. Wait for Vercel to issue certificate (can take 10-15 minutes)
2. Check Vercel dashboard for certificate status
3. Try accessing via https:// explicitly
4. Contact Vercel support if persists

### OAuth Redirect Errors

**Symptoms:** "redirect_uri_mismatch" after login

**Solutions:**

1. Verify exact URL in error message
2. Add that URL to OAuth provider settings
3. Ensure URL matches exactly (including https://)
4. Clear browser cookies and try again

### "State Not Found" Errors

**Symptoms:** Kinde returns "state not found" error

**Solutions:**

1. Check `KINDE_COOKIE_DOMAIN` in Vercel env vars
2. Should be `fichaz.app` (not 127.0.0.1)
3. Clear browser cookies
4. Verify `KINDE_SITE_URL` is correct

---

## Rollback Plan

If issues occur in production:

### Option 1: Revert Deployment

```bash
# In Vercel dashboard
1. Go to Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"
```

### Option 2: Revert Code

```bash
# Revert merge commit
git revert -m 1 <merge-commit-hash>
git push origin main
```

### Option 3: Restore Old Domain

1. Revert Vercel domain to old URL
2. Restore old OAuth redirect URIs
3. Redeploy with old branding

---

## Completion Checklist

Mark each item when complete:

### Domain Setup:

- [ ] Domain registered (`fichaz.app`)
- [ ] DNS records configured
- [ ] Domain verified in Vercel
- [ ] SSL certificate issued

### Configuration:

- [ ] Environment variables updated
- [ ] Kinde OAuth redirect URIs updated
- [ ] Mailchimp OAuth redirect URIs updated
- [ ] All URLs using `fichaz.app`

### Deployment:

- [ ] Code merged to main
- [ ] Production deployment successful
- [ ] Site accessible at `fichaz.app`
- [ ] SSL working (HTTPS)

### Testing:

- [ ] All pages load correctly
- [ ] Kinde login working
- [ ] Mailchimp OAuth working
- [ ] Data loading from APIs
- [ ] No console errors
- [ ] Mobile responsive working

### Documentation:

- [ ] README updated with new domain
- [ ] Documentation URLs updated
- [ ] Monitoring/analytics updated
- [ ] Team notified of new domain

---

## Post-Deployment Monitoring

### First 24 Hours:

- Monitor Vercel dashboard for errors
- Check analytics for traffic/errors
- Monitor OAuth success rates
- Watch for user-reported issues

### First Week:

- Monitor performance metrics
- Check error logs daily
- Verify all integrations stable
- Gather user feedback

### After Stability (1-2 weeks):

- Remove old OAuth URLs
- Update all external references
- Close rebrand GitHub issue (#204)
- Celebrate successful rebrand! 🎉

---

## Related Resources

- [Vercel Custom Domains Docs](https://vercel.com/docs/projects/domains)
- [Vercel DNS Configuration](https://vercel.com/docs/projects/domains/dns-records)
- [SSL Certificates on Vercel](https://vercel.com/docs/security/encryption)
- [Kinde Production Setup](https://docs.kinde.com/build/environments/production-setup/)
- [Mailchimp OAuth Docs](https://mailchimp.com/developer/marketing/guides/access-user-data-oauth-2/)

---

## Support Contacts

**Domain Issues:**

- Registrar support (Namecheap, GoDaddy, etc.)

**Hosting Issues:**

- Vercel Support: support@vercel.com
- Vercel Community: https://github.com/vercel/vercel/discussions

**OAuth Issues:**

- Kinde Support: https://kinde.com/contact
- Mailchimp Support: https://mailchimp.com/contact/support/

---

**Status:** Ready to execute when production deployment begins
**Last Updated:** Phase 6 completion
**Next Review:** When ready to deploy to production
