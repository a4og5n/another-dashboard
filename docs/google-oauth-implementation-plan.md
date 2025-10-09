# Google OAuth Custom UI Implementation Plan

**Feature Branch:** `feature/google-oauth-custom-ui`

**Goal:** Implement Google OAuth with custom UI that keeps users on our domain (no redirect to `lanoticia.kinde.com`)

---

## Prerequisites ✅ COMPLETED

- [x] Kinde credentials configured
- [x] Google Connection ID obtained: `conn_019946068ca72115b2d84422226dec5b`
- [x] Environment variable added: `KINDE_GOOGLE_CONNECTION_ID`
- [x] "Use your own sign-up and sign-in screens" enabled in Kinde dashboard

---

## Implementation Phases

### Phase 1: Foundation & Configuration ⏱️ 15 min

**Commit Point 1: "feat: update environment config for Google OAuth"**

Files to modify:

- `src/lib/config.ts` - Make `KINDE_GOOGLE_CONNECTION_ID` required in production
- `src/schemas/auth/google-oauth.ts` - NEW: Zod schemas for Google OAuth
- `src/schemas/auth/index.ts` - Export new schemas
- `src/types/auth/google-oauth.ts` - NEW: TypeScript types
- `src/types/auth/index.ts` - Export new types

Changes:

```typescript
// src/lib/config.ts
KINDE_GOOGLE_CONNECTION_ID: z.string().min(
  1,
  "Google Connection ID required for OAuth",
);
```

**Test:** `pnpm type-check` should pass

---

### Phase 2: Google OAuth Button Component ⏱️ 30 min

**Commit Point 2: "feat: add Google sign-in button component"**

Files to create:

- `src/components/auth/google-sign-in-button.tsx` - NEW
- `src/components/auth/google-sign-in-button.test.tsx` - NEW
- `src/components/auth/index.ts` - Export new component

Component features:

- Google branding (logo, colors per Google's brand guidelines)
- Uses `@kinde-oss/kinde-auth-nextjs` `login()` with `connectionId`
- Loading states
- Error handling
- Accessibility (ARIA labels, keyboard navigation)

**Key implementation:**

```typescript
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { env } from "@/lib/config";

const { login } = useKindeAuth();

const handleGoogleSignIn = () => {
  login({
    authUrlParams: {
      connection_id: env.KINDE_GOOGLE_CONNECTION_ID,
    },
  });
};
```

**Test:** `pnpm test google-sign-in-button` should pass

---

### Phase 3: Update Login Page ⏱️ 15 min

**Commit Point 3: "feat: add Google OAuth to login page"**

Files to modify:

- `src/app/login/page.tsx` - Add Google sign-in button

Changes:

- Add `GoogleSignInButton` at top of card
- Add separator with "OR"
- Keep existing email/password options below
- Remove "powered by Kinde" footer

Visual structure:

```
┌─────────────────────────┐
│  [Continue with Google] │  ← New
│         ──OR──          │
│      [Sign In]          │  ← Existing (email/password)
│    [Create Account]     │  ← Existing
└─────────────────────────┘
```

**Test:** Manual - Visit `/login`, see Google button

---

### Phase 4: Create Register Page ⏱️ 15 min

**Commit Point 4: "feat: add register page with Google OAuth"**

Files to create:

- `src/app/register/page.tsx` - NEW

Structure mirrors login page:

- Google sign-in button
- Separator
- Email/password registration form
- Link to login page

**Test:** Manual - Visit `/register`, see Google button

---

### Phase 5: Server Actions ⏱️ 20 min

**Commit Point 5: "feat: add Google OAuth server actions"**

Files to create:

- `src/actions/auth-google.ts` - NEW

Files to modify:

- `src/actions/index.ts` - Export Google OAuth actions

Actions:

```typescript
export async function initiateGoogleLogin() {
  // Returns Kinde auth URL with connection_id
}

export async function initiateGoogleRegister() {
  // Returns Kinde auth URL with connection_id for registration
}
```

**Test:** `pnpm test auth-google` should pass

---

### Phase 6: Auth Layout (Optional Enhancement) ⏱️ 15 min

**Commit Point 6: "refactor: create shared auth layout component"**

Files to create:

- `src/components/auth/auth-layout.tsx` - NEW

Extracts common layout for login/register pages:

- Centered card
- Responsive design
- Consistent branding

**Test:** Visual - Both login and register use same layout

---

### Phase 7: Testing & Documentation ⏱️ 20 min

**Commit Point 7: "docs: add Google OAuth setup guide"**

Files to create:

- `docs/google-oauth-setup.md` - NEW

Files to modify:

- `docs/auth-setup.md` - Add Google OAuth section
- `README.md` - Update authentication section (if needed)

Documentation includes:

- Prerequisites checklist
- Step-by-step setup
- Environment variables
- Troubleshooting
- User flow diagram

**Test:** Follow docs from scratch to verify completeness

---

## Commit Strategy (Safe Points to Commit)

Each phase above is a safe commit point. After each commit:

1. Run validation:

   ```bash
   pnpm quick-check  # type-check + lint
   pnpm test         # Run tests
   ```

2. Commit if passing:

   ```bash
   git add .
   git commit -m "feat: [commit message from plan]"
   ```

3. Continue to next phase

---

## Final Integration Testing

**Commit Point 8: "test: add integration tests for Google OAuth flow"**

Manual test checklist:

- [ ] Visit `/login`
- [ ] Click "Continue with Google"
- [ ] Redirects to Google consent screen
- [ ] Approve access
- [ ] Returns to app (redirects to `/mailchimp`)
- [ ] User is authenticated
- [ ] User menu shows Google profile info
- [ ] Can access protected routes
- [ ] Logout works
- [ ] Can sign up with Google from `/register`
- [ ] Browser back button doesn't break flow

Automated tests:

- [ ] All component tests pass
- [ ] All action tests pass
- [ ] Accessibility tests pass
- [ ] Type checking passes
- [ ] Linting passes

---

## Final Steps

1. Run full validation:

   ```bash
   pnpm validate  # Runs everything including build
   ```

2. Create pull request:

   ```bash
   git push -u origin feature/google-oauth-custom-ui
   gh pr create --title "feat: implement Google OAuth with custom UI" --body "$(cat <<'EOF'
   ## Summary
   - Implements Google OAuth login/register with custom UI
   - Users stay on our domain (no redirect to kinde.com)
   - Seamless authentication experience

   ## Changes
   - Added Google sign-in button component
   - Updated login page with Google OAuth
   - Created register page with Google OAuth
   - Added server actions for OAuth flow
   - Updated environment configuration
   - Added comprehensive documentation

   ## Testing
   - All automated tests pass
   - Manual testing completed per checklist
   - Accessibility verified

   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   EOF
   )"
   ```

---

## Rollback Strategy

If something goes wrong:

```bash
# Discard all changes and return to main
git checkout main
git branch -D feature/google-oauth-custom-ui

# Or rollback to specific commit
git reset --hard <commit-hash>
```

Each commit point is a safe rollback point.

---

## User Experience Flow

### Before:

```
[Your Login Page] → [lanoticia.kinde.com] → [Google] → [Your App]
                     ❌ Kinde branding visible
```

### After:

```
[Your Login Page] → [Google OAuth] → [Your App]
✅ Seamless experience, no Kinde branding
```

---

## Time Estimate

- Phase 1: 15 min
- Phase 2: 30 min
- Phase 3: 15 min
- Phase 4: 15 min
- Phase 5: 20 min
- Phase 6: 15 min (optional)
- Phase 7: 20 min
- Testing: 20 min

**Total: ~2.5 hours (including testing)**

---

## Success Criteria

✅ Users can sign in with Google from custom UI on our domain
✅ Users can register with Google from custom UI
✅ No redirect to `lanoticia.kinde.com` visible to users
✅ All tests pass (`pnpm validate`)
✅ Documentation complete
✅ No breaking changes to existing auth

---

## Environment Variables Reference

Required in `.env.local` and Vercel:

```bash
# Already configured ✅
KINDE_CLIENT_ID=cc79597f05494da5821261d4a0dfe078
KINDE_CLIENT_SECRET=2d3lvTeFu9YxF7Hd0jpJOY8CIQanqrMMWeJCYAIoq1BYInx9PZG
KINDE_ISSUER_URL=https://lanoticia.kinde.com
KINDE_SITE_URL=https://127.0.0.1:3000
KINDE_POST_LOGOUT_REDIRECT_URL=https://127.0.0.1:3000
KINDE_POST_LOGIN_REDIRECT_URL=https://127.0.0.1:3000/mailchimp

# New for Google OAuth ✅
KINDE_GOOGLE_CONNECTION_ID=conn_019946068ca72115b2d84422226dec5b
```

---

## Next Steps After Implementation

Once this feature is complete and merged:

1. **Deploy to Production:**
   - Push environment variables to Vercel
   - Update Kinde production redirect URIs
   - Test in production

2. **Monitor:**
   - Track Google OAuth success rates
   - Monitor error logs
   - Gather user feedback

3. **Future Enhancements:**
   - Add more OAuth providers (GitHub, Microsoft)
   - Implement "Remember me" functionality
   - Add 2FA support

---

**Status:** Ready to implement
**Branch:** `feature/google-oauth-custom-ui`
**Last Updated:** 2025-10-09
