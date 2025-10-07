# Mailchimp OAuth2 Migration - Manual Testing Checklist

**Branch:** `feature/mailchimp-oauth2-migration`
**Date:** 2025-10-05
**Tester:** **\*\***\_**\*\***

---

## Testing Strategy: Hybrid Approach

This checklist is designed for a **two-phase testing approach**:

1. **Phase 7.3a: Critical Path Testing (Pre-Deployment)** - 30 minutes
   - Test locally before deploying
   - Verify core functionality works
   - Catch showstoppers early
   - See "Critical Path Tests" section below

2. **Phase 7.3b: Comprehensive Testing (Post-Deployment)** - 90 minutes
   - Test in production after deploying
   - Validate real environment
   - Discover edge cases
   - See all test suites below

**Why Hybrid?**

- Balances speed with safety
- Minimizes production risk
- Gets realistic testing in production
- Allows iterative improvements

---

## Prerequisites

### For Critical Path Testing (Local - Phase 7.3a)

- [x] Local development environment running (`pnpm dev`)
- [x] Database connection verified (Neon Postgres)
- [x] Mailchimp OAuth app registered with redirect URI: `https://127.0.0.1:3000/api/auth/mailchimp/callback`
- [x] Environment variables configured (`.env.local`)

### For Comprehensive Testing (Production - Phase 7.3b)

- [ ] Application deployed to production
- [ ] Production redirect URI added to Mailchimp OAuth app
- [ ] Production environment variables configured in Vercel
- [ ] Two test user accounts available (for multi-user testing)

---

## 🚨 Critical Path Tests (Pre-Deployment) - Phase 7.3a

**Time:** 30 minutes
**Environment:** Local (`https://127.0.0.1:3000`)
**Goal:** Verify core functionality before deploying

### Critical Test 1: OAuth Authorization Flow (Happy Path)

- [x] Navigate to `/mailchimp` (logged out)
- [x] Redirected to Kinde login
- [x] After login, redirected back to `/mailchimp`
- [x] See empty state with "Connect Your Mailchimp Account" message
- [x] "Connect Mailchimp" button visible
- [x] Click "Connect Mailchimp" button
- [x] Button shows "Connecting..." loading state
- [x] Redirected to Mailchimp authorization page (`login.mailchimp.com`)
- [x] Enter Mailchimp credentials and approve access
- [x] Redirected back to `/mailchimp?connected=true`
- [x] Green success banner appears: "Mailchimp connected successfully!"
- [x] Dashboard loads with user's Mailchimp data
- [x] Campaign reports visible
- [x] No console errors

**✅ Pass Criteria:** OAuth flow completes end-to-end without errors

### Critical Test 2: Token Encryption Verification

- [x] Open Neon Console (https://console.neon.tech) OR Vercel Dashboard → Storage
- [x] Navigate to database → Tables → `mailchimp_connections`
- [x] Open the connection record just created
- [x] Verify `access_token` field is encrypted
- [x] Token format looks like: `[base64]:[base64]:[base64]` (long encrypted string)
- [x] Should NOT see readable Mailchimp API key
- [x] Verify `kinde_user_id` matches your test user

**✅ Pass Criteria:** Tokens are properly encrypted in database

### Critical Test 3: Settings & Disconnect/Reconnect

- [x] Navigate to `/settings/integrations`
- [x] See Mailchimp integration card
- [x] "Connected" badge visible with green checkmark
- [x] Account email displayed correctly
- [x] Server prefix displayed (e.g., "us1", "us19")
- [x] Click "Disconnect" button
- [x] Confirmation dialog appears
- [x] Click "OK/Confirm"
- [x] Toast notification: "Mailchimp disconnected successfully"
- [x] Page reloads, shows "Not Connected" state
- [x] Click "Connect Mailchimp" again
- [x] OAuth flow completes successfully
- [x] Connection restored
- [x] Navigate to `/mailchimp` → Dashboard loads

**✅ Pass Criteria:** Can disconnect and reconnect successfully

---

### Critical Path Decision Point

**All 3 Critical Tests Passed?**

- ✅ **YES** → Proceed to Phase 9 (Deployment)
- ❌ **NO** → Fix issues before deploying

**Time saved:** Deploy with confidence knowing core functionality works!

---

## 📋 Comprehensive Test Suites (Post-Deployment) - Phase 7.3b

**Time:** 90 minutes
**Environment:** Production (deployed application)
**Goal:** Validate production environment and edge cases

---

## Test Suite 1: OAuth Authorization Flow (Complete)

### 1.1 Initial Connection (Not Connected)

- [ ] Navigate to `/mailchimp` (logged out)
- [ ] Redirected to Kinde login
- [ ] After login, redirected back to `/mailchimp`
- [ ] See empty state with "Connect Your Mailchimp Account" message
- [ ] "Connect Mailchimp" button visible
- [ ] Security information displayed (OAuth 2.0 badge)

### 1.2 OAuth Flow Execution

- [ ] Click "Connect Mailchimp" button
- [ ] Button shows "Connecting..." loading state
- [ ] Redirected to Mailchimp authorization page (`login.mailchimp.com`)
- [ ] Mailchimp login page displays correctly
- [ ] Enter Mailchimp credentials
- [ ] See permission approval screen
- [ ] Click "Allow" to approve access

### 1.3 OAuth Callback Success

- [ ] Redirected back to `/mailchimp?connected=true`
- [ ] Green success banner appears: "Mailchimp connected successfully!"
- [ ] Banner auto-dismisses after 5 seconds
- [ ] Dashboard loads with user's Mailchimp data
- [ ] Campaign reports visible
- [ ] Audience lists visible

### 1.4 Verify Connection Persistence

- [ ] Refresh page
- [ ] Dashboard still loads (no re-authentication needed)
- [ ] Navigate away and back to `/mailchimp`
- [ ] Dashboard still accessible
- [ ] Close browser and reopen
- [ ] Dashboard still accessible

---

## Test Suite 2: Settings/Integrations Page

### 2.1 View Connection Status

- [ ] Navigate to `/settings/integrations`
- [ ] See Mailchimp integration card
- [ ] "Connected" badge visible with green checkmark
- [ ] Account email displayed correctly
- [ ] Account ID displayed (or "N/A")
- [ ] Server prefix displayed (e.g., "us1", "us19")
- [ ] Connection timestamp shown (e.g., "2 hours ago")
- [ ] Last validation timestamp shown

### 2.2 Refresh Connection

- [ ] Click "Refresh Connection" button
- [ ] Redirected to Mailchimp authorization
- [ ] Approve access (if prompted)
- [ ] Redirected back to settings page
- [ ] Connection details updated
- [ ] Last validation timestamp updated

### 2.3 Disconnect Account

- [ ] Click "Disconnect" button
- [ ] Confirmation dialog appears: "Are you sure you want to disconnect..."
- [ ] Click "Cancel" → No action taken, dialog closes
- [ ] Click "Disconnect" again
- [ ] Click "OK/Confirm"
- [ ] Toast notification: "Mailchimp disconnected successfully"
- [ ] Page reloads
- [ ] Integration card shows "Not Connected" state
- [ ] "Connect Mailchimp" button visible

### 2.4 Reconnect After Disconnect

- [ ] Click "Connect Mailchimp" from settings page
- [ ] OAuth flow completes successfully
- [ ] Connection restored
- [ ] Navigate to `/mailchimp`
- [ ] Dashboard loads correctly

---

## Test Suite 3: Error Handling

### 3.1 User Denies Access

- [ ] Start OAuth flow from `/mailchimp`
- [ ] On Mailchimp authorization page, click "Deny" or "Cancel"
- [ ] Redirected to `/mailchimp?error=access_denied`
- [ ] Error banner displays: "You denied access to Mailchimp..."
- [ ] Empty state still visible
- [ ] Can retry connection

### 3.2 Invalid State (CSRF Protection)

**Note:** This requires intercepting and modifying the callback URL.

- [ ] Start OAuth flow
- [ ] Before completing, manually navigate to: `/api/auth/mailchimp/callback?code=fake&state=invalid`
- [ ] Redirected to `/mailchimp?error=invalid_state`
- [ ] Error message: "Security validation failed..."

### 3.3 Missing Parameters

- [ ] Manually navigate to `/api/auth/mailchimp/callback` (no parameters)
- [ ] Redirected to `/mailchimp?error=missing_parameters`
- [ ] Error message displayed

### 3.4 Connection Failure

- [ ] Temporarily disable database connection (if possible)
- [ ] OR set invalid encryption key in environment
- [ ] Attempt OAuth connection
- [ ] See error: "Failed to establish connection"

### 3.5 Token Invalid/Expired

**Note:** This requires manually invalidating the token or revoking access from Mailchimp.

- [ ] Connect Mailchimp successfully
- [ ] Go to Mailchimp dashboard → Account → Connected Sites
- [ ] Revoke access for "Another Dashboard"
- [ ] Return to application at `/mailchimp`
- [ ] Page should detect invalid token
- [ ] Show reconnection prompt

---

## Test Suite 4: Multi-User Isolation

### 4.1 User A Connection

- [ ] Log in as User A
- [ ] Connect User A's Mailchimp account
- [ ] Dashboard shows User A's campaigns
- [ ] Note one specific campaign name/ID visible to User A

### 4.2 User B Isolation

- [ ] Log out User A
- [ ] Log in as User B (different account)
- [ ] Navigate to `/mailchimp`
- [ ] See empty state (not connected)
- [ ] User A's data NOT visible
- [ ] Connect User B's Mailchimp account (different Mailchimp)
- [ ] Dashboard shows User B's campaigns
- [ ] User A's campaigns NOT visible

### 4.3 Verify User A Unchanged

- [ ] Log out User B
- [ ] Log in as User A again
- [ ] Navigate to `/mailchimp`
- [ ] Dashboard loads immediately (still connected)
- [ ] User A's campaigns visible
- [ ] Same campaign from step 4.1 still visible

---

## Test Suite 5: Navigation & UI/UX

### 5.1 Empty States Across Pages

**When NOT connected:**

- [ ] `/mailchimp` → Shows empty state
- [ ] `/mailchimp/lists` → Shows empty state
- [ ] `/mailchimp/reports` → Shows empty state
- [ ] All pages show "Connect Mailchimp" button

**After connecting:**

- [ ] All pages load with data
- [ ] No empty states visible

### 5.2 Banner Behavior

- [ ] After successful connection, success banner appears
- [ ] Banner auto-dismisses after 5 seconds
- [ ] Can manually dismiss by clicking X button
- [ ] After error, error banner appears
- [ ] Error banner also dismissible

### 5.3 Loading States

- [ ] "Connect Mailchimp" button shows loading state
- [ ] Dashboard shows skeleton/loading state while fetching data
- [ ] Settings page shows loading during connect/disconnect

---

## Test Suite 6: Security & Encryption

### 6.1 Token Encryption Verification

**Via Neon Console or Vercel Dashboard:**

- [ ] Open Neon Console (https://console.neon.tech)
- [ ] Navigate to database → Tables → `mailchimp_connections`
- [ ] Open a connection record
- [ ] Verify `access_token` field is encrypted (long string, not plaintext)
- [ ] Token format: `[base64]:[base64]:[base64]` (IV:authTag:ciphertext)
- [ ] Should NOT see readable Mailchimp API key

### 6.2 Cookie Security

**Via Browser DevTools:**

- [ ] Open DevTools → Application/Storage → Cookies
- [ ] During OAuth flow, verify `mailchimp_oauth_state` cookie:
  - [ ] HttpOnly flag enabled
  - [ ] Secure flag (if production/HTTPS)
  - [ ] SameSite = Lax
  - [ ] Max-Age = 600 (10 minutes)
- [ ] After callback completes, cookie is deleted

### 6.3 No Secret Leakage

- [ ] Check browser console logs
- [ ] Should NOT see any access tokens logged
- [ ] Check network tab
- [ ] Tokens only in encrypted database writes
- [ ] Authorization URL contains no secrets (only client_id)

---

## Test Suite 7: Performance & Reliability

### 7.1 Token Validation Caching

- [ ] Connect Mailchimp
- [ ] Navigate to `/mailchimp`
- [ ] Check logs for token validation call
- [ ] Navigate away and back within 1 hour
- [ ] Token should NOT be re-validated (cached)
- [ ] Wait >1 hour (or manually update timestamp)
- [ ] Navigate back
- [ ] Token should be validated again

### 7.2 Database Connection Handling

- [ ] Verify multiple rapid page loads
- [ ] No database connection errors
- [ ] Connection pooling working correctly

### 7.3 Concurrent Users

- [ ] Open 2+ browser sessions (different users)
- [ ] Connect Mailchimp simultaneously
- [ ] Both should complete successfully
- [ ] No race conditions or conflicts

---

## Test Suite 8: Edge Cases

### 8.1 Session Expiration

- [ ] Connect Mailchimp
- [ ] Let Kinde session expire (or manually log out in another tab)
- [ ] Try to access `/mailchimp`
- [ ] Should redirect to Kinde login
- [ ] After login, Mailchimp connection still active

### 8.2 Browser Back Button

- [ ] Start OAuth flow
- [ ] During Mailchimp authorization, click browser back
- [ ] Should return to application
- [ ] Can restart OAuth flow
- [ ] No errors or broken states

### 8.3 Multiple Redirect URIs

- [ ] Verify OAuth app has multiple redirect URIs registered
- [ ] Test with localhost (`127.0.0.1:3000`)
- [ ] Test with preview deployment (if available)
- [ ] Test with production domain (if available)

---

## Test Suite 9: Accessibility

### 9.1 Keyboard Navigation

- [ ] Tab through empty state form
- [ ] Can focus "Connect Mailchimp" button
- [ ] Press Enter to activate button
- [ ] Tab through settings page
- [ ] Can access all buttons via keyboard

### 9.2 Screen Reader

- [ ] Use VoiceOver (Mac) or NVDA (Windows)
- [ ] Navigate to empty state
- [ ] All text is read correctly
- [ ] Button announces "Connect Mailchimp, button"
- [ ] Error messages are announced

### 9.3 Color Contrast

- [ ] Success banner has sufficient contrast
- [ ] Error banner has sufficient contrast
- [ ] Empty state text readable
- [ ] "Connected" badge readable

---

## Test Suite 10: Cross-Browser Testing

### 10.1 Chrome

- [ ] OAuth flow completes
- [ ] Dashboard loads
- [ ] Settings page functional

### 10.2 Firefox

- [ ] OAuth flow completes
- [ ] Dashboard loads
- [ ] Settings page functional

### 10.3 Safari

- [ ] OAuth flow completes
- [ ] Dashboard loads
- [ ] Settings page functional

### 10.4 Mobile Browsers (Optional)

- [ ] Test on iOS Safari
- [ ] Test on Android Chrome

---

## Success Criteria

**Phase 7.3a (Critical Path) - Must Pass Before Deployment:**

- ✅ OAuth flow completes successfully locally
- ✅ Tokens encrypted in database
- ✅ Disconnect/reconnect works

**Phase 7.3b (Comprehensive) - Must Pass in Production:**

- ✅ All 10 test suites pass in production
- ✅ Multi-user isolation verified
- ✅ Error handling works correctly
- ✅ CSRF protection functional
- ✅ No secrets logged or exposed
- ✅ All pages show appropriate empty states
- ✅ Settings page manages connections
- ✅ Accessibility standards met
- ✅ Cross-browser compatible

---

## Issues Found

| Issue # | Description | Severity | Phase     | Status |
| ------- | ----------- | -------- | --------- | ------ |
| 1       |             |          | 7.3a/7.3b |        |
| 2       |             |          | 7.3a/7.3b |        |
| 3       |             |          | 7.3a/7.3b |        |

**Severity Levels:**

- **Critical:** Blocks core functionality
- **High:** Major feature broken
- **Medium:** Minor issue, workaround exists
- **Low:** Cosmetic or nice-to-have

---

## Test Summary

### Phase 7.3a (Critical Path - Pre-Deployment)

**Date Completed:** \***\*\_\_\*\***
**Environment:** Local
**Critical Tests Passed:** **\_** / 3
**Status:** ⬜ PASS | ⬜ FAIL
**Deploy Decision:** ⬜ GO | ⬜ NO-GO

### Phase 7.3b (Comprehensive - Post-Deployment)

**Date Completed:** \***\*\_\_\*\***
**Environment:** Production
**Total Tests:** 100+
**Tests Passed:** **\_** / **\_**
**Tests Failed:** **\_** / **\_**
**Issues Found:** **\_**
**Overall Status:** ⬜ PASS | ⬜ FAIL

**Tester Signature:** \***\*\*\*\*\***\_\***\*\*\*\*\***

---

## Notes

### Phase 7.3a Notes (Pre-Deployment)

(Add observations from local testing)

### Phase 7.3b Notes (Post-Deployment)

(Add observations from production testing, performance notes, etc.)
