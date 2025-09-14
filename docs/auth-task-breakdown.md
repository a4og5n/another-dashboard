# Kinde Authentication Task Breakdown

## Agent Execution Guide

**Companion to:** `auth-implementation-optimized.md`  
**Purpose:** Step-by-step execution commands and validation  
**Target:** Zero-error implementation following PRD patterns

---

## Pre-Implementation Setup

### Repository State Check

```bash
git status
git branch
pnpm type-check
pnpm lint
```

### Create Feature Branch

```bash
git checkout -b feature/kinde-authentication
```

---

## Section 1: Foundation (30 min)

### 1.1 Package Installation

```bash
pnpm add @kinde-oss/kinde-auth-nextjs
```

### 1.2 Environment Setup

**Action:** Update `env.example` with Kinde variables  
**Validation:** Verify all required variables documented

### 1.3 Kinde Configuration

- Create Kinde tenant
- Configure OAuth providers
- Set callback URLs
- Copy credentials to `.env.local`

**Validation Command:**

```bash
curl http://localhost:3000/api/auth/health
```

---

## Section 2: Schema & Types (45 min)

### File Creation Order:

1. `src/schemas/auth/user.ts`
2. `src/schemas/auth/index.ts`
3. `src/types/auth/user.ts`
4. `src/types/auth/index.ts`
5. Update `src/types/index.ts`

### Validation:

```bash
pnpm type-check
```

**Expected:** No TypeScript errors, clean import resolution

---

## Section 3: Authentication Service (30 min)

### File Creation:

- `src/services/auth.service.ts`

### Validation:

```bash
pnpm type-check
```

**Critical:** Verify Zod schema validation works correctly

---

## Section 4: Middleware (30 min)

### File Creation:

- `src/middleware.ts`

### Validation:

- Check middleware intercepts `/mailchimp` routes
- Verify public paths remain accessible
- Test redirect to `/login` for protected routes

---

## Section 5: Authentication Pages (45 min)

### File Creation Order:

1. `src/app/api/auth/[kindeAuth]/route.ts`
2. `src/app/api/auth/health/route.ts`
3. `src/app/login/page.tsx`

### Validation:

```bash
# Start dev server
pnpm dev

# Test endpoints
curl http://localhost:3000/api/auth/health
```

**Manual Test:**

- Visit `/login` - should show login form
- Visit `/mailchimp` while logged out - should redirect to `/login`

---

## Section 6: UI Components (30 min)

### File Creation Order:

1. `src/components/auth/user-menu.tsx`
2. `src/components/auth/auth-loading.tsx`
3. `src/components/auth/index.ts`

### Validation:

```bash
pnpm type-check
```

**Manual Test:** Components render without errors in Storybook/dev

---

## Section 7: Layout Integration (20 min)

### Files to Update:

- Main layout component
- Navigation header

### Validation:

- User menu appears when authenticated
- Loading state shows during auth check
- Clean state transitions

---

## Section 8: Route Protection (20 min)

### File Creation:

1. `src/components/auth/auth-wrapper.tsx`
2. `src/app/mailchimp/layout.tsx` (if needed)

### Validation:

```bash
# Test protected routes
curl -I http://localhost:3000/mailchimp
# Should redirect to login when unauthenticated
```

---

## Section 9: Testing (30 min)

### File Creation Order:

1. `src/test/auth-schemas.test.ts`
2. `src/test/user-menu.test.tsx`

### Validation:

```bash
pnpm test auth
```

**Expected:** All tests pass, good coverage

---

## Section 10: Documentation (20 min)

### File Creation:

- `docs/auth-setup.md`
- Update `env.example`

### Final Validation:

```bash
pnpm pre-commit
```

**Expected:** All checks pass (lint, type, format, test)

---

## Integration Testing Checklist

### Authentication Flow

- [ ] `/login` renders correctly
- [ ] Google login button works
- [ ] Email/password login works
- [ ] User menu displays authenticated user
- [ ] Logout functionality works
- [ ] Redirect to intended destination after login

### Route Protection

- [ ] `/` (root) remains public
- [ ] `/mailchimp/*` requires authentication
- [ ] Unauthenticated users redirect to `/login`
- [ ] Authenticated users can access protected routes

### Error Handling

- [ ] Clear error messages for auth failures
- [ ] Loading states during auth checks
- [ ] Graceful handling of network errors

### Performance

- [ ] Fast authentication state resolution
- [ ] Minimal layout shift during auth checks
- [ ] Efficient re-renders

---

## Common Issues & Solutions

### TypeScript Errors

**Issue:** Import resolution errors  
**Solution:** Verify path aliases, check tsconfig.json

### Authentication Not Working

**Issue:** Infinite redirect loops  
**Solution:** Check middleware configuration, verify environment variables

### UI Components Not Rendering

**Issue:** Missing dependencies  
**Solution:** Verify shadcn/ui components installed, check import paths

### Tests Failing

**Issue:** Mock setup problems  
**Solution:** Update test-utils, verify MSW configuration

---

## Commit Strategy

### Commit Messages:

```bash
git commit -m "feat: add Kinde authentication schemas and types"
git commit -m "feat: implement authentication service and middleware"
git commit -m "feat: create login page and auth UI components"
git commit -m "feat: integrate authentication into layout and routing"
git commit -m "test: add authentication tests and documentation"
```

### PR Preparation:

```bash
pnpm pre-commit
git push origin feature/kinde-authentication
# Create PR with auth-implementation-optimized.md as description template
```

---

## Success Criteria

✅ **Zero refactoring needed**  
✅ **Follows PRD patterns exactly**  
✅ **All tests pass**  
✅ **No TypeScript/ESLint errors**  
✅ **Complete authentication flow works**  
✅ **Route protection implemented**  
✅ **Documentation complete**

---

## Time Tracking

| Section           | Estimated     | Actual | Notes |
| ----------------- | ------------- | ------ | ----- |
| 1. Foundation     | 30 min        |        |       |
| 2. Schema/Types   | 45 min        |        |       |
| 3. Service        | 30 min        |        |       |
| 4. Middleware     | 30 min        |        |       |
| 5. Pages          | 45 min        |        |       |
| 6. Components     | 30 min        |        |       |
| 7. Integration    | 20 min        |        |       |
| 8. Protection     | 20 min        |        |       |
| 9. Testing        | 30 min        |        |       |
| 10. Documentation | 20 min        |        |       |
| **Total**         | **3.5 hours** |        |       |
