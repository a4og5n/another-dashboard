# Execution Plan: Fix 404 HTTP Status Code Issue

**Status:** PLANNING PHASE
**Created:** 2025-10-15
**Priority:** HIGH (SEO, Standards Compliance, User Experience)
**Estimated Effort:** 3-4 hours

---

## Overview

### Task Summary

When users visit non-existent pages (e.g., `/mailchimp/lists/483a0ba84ass`), the application correctly renders a "Not Found" page but returns HTTP status **200** instead of **404**.

**Why this matters:**

- **SEO:** Search engines index error pages as valid content
- **Browser behavior:** Incorrect caching and history management
- **API standards:** REST conventions require 404 for missing resources
- **Client detection:** Applications cannot programmatically detect errors

**Success Criteria:**

- [ ] All not-found pages return HTTP 404 status code
- [ ] All existing functionality preserved (sidebar, auth, UI)
- [ ] No breaking changes for users or developers
- [ ] All tests pass
- [ ] Documentation updated

### Prerequisites

**Required Knowledge:**

- Next.js App Router and Server Components
- React Context API for state management
- Kinde authentication (server-side sessions)
- Understanding of client vs server component boundaries

**Documentation to Reference:**

- [Next.js Error Handling](https://nextjs.org/docs/app/getting-started/error-handling)
- [Next.js not-found.tsx](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
- [Kinde Server Session](https://kinde.com/docs/developer-tools/nextjs-sdk/#getkinde-server-session)

**Files to Review Before Starting:**

- [src/app/not-found.tsx](src/app/not-found.tsx) - Root not-found page with `"use client"`
- [src/components/layout/dashboard-shell.tsx](src/components/layout/dashboard-shell.tsx) - Client component wrapper
- [src/components/auth/auth-wrapper.tsx](src/components/auth/auth-wrapper.tsx) - Client auth wrapper
- [src/app/layout.tsx](src/app/layout.tsx) - Root layout
- [src/app/mailchimp/layout.tsx](src/app/mailchimp/layout.tsx) - Mailchimp layout

### Files Affected

**Files to Create:**

**Types (following project architectural standards):**

- `src/types/components/not-found/back-button.ts` - BackButton type definitions
- `src/types/components/not-found/index.ts` - Not-found types barrel export
- `src/types/components/layout/sidebar-provider.ts` - Sidebar context type definitions

**Components:**

- `src/components/not-found/back-button.tsx` - Client component for history.back()
- `src/components/not-found/index.ts` - Not-found components barrel export
- `src/components/layout/sidebar-provider.tsx` - Context provider for sidebar state

**Files to Modify:**

- `src/types/components/index.ts` - Export not-found types
- `src/types/components/layout/index.ts` - Export sidebar provider types
- `src/app/not-found.tsx` - Remove `"use client"`, use BackButton component
- `src/components/layout/dashboard-shell.tsx` - Remove `"use client"`, use context
- `src/components/layout/dashboard-header.tsx` - Use sidebar context instead of props
- `src/components/layout/dashboard-sidebar.tsx` - Use sidebar context instead of props
- `src/components/layout/index.ts` - Export SidebarProvider
- `src/app/mailchimp/layout.tsx` - Use server-side auth check
- `src/app/layout.tsx` - Remove props passing (handled by context)

---

## Pre-Implementation Checklist

Before writing any code:

- [ ] **Review this execution plan** completely
- [ ] **Verify current branch** is `main` and up to date: `git branch --show-current`
- [ ] **Pull latest changes** from origin: `git pull origin main`
- [ ] **⚠️ CREATE FEATURE BRANCH** (see Phase 0 below - DO NOT skip this step!)
- [ ] **Understand the problem:** Test current behavior by visiting `/fake-page`
- [ ] **Read Next.js docs** on not-found.tsx and error handling
- [ ] **Review sidebar implementation** in dashboard-header.tsx and dashboard-sidebar.tsx
- [ ] **Check Kinde docs** for server-side authentication
- [ ] **Verify development environment** works: `pnpm dev`
- [ ] **Run current tests** to establish baseline: `pnpm test`

---

## Phase 0: Create Feature Branch (REQUIRED FIRST STEP)

**⚠️ IMPORTANT: Complete this phase BEFORE starting Phase 1!**

**Goal:** Set up a dedicated feature branch for all implementation work

**Why this is critical:**

- Keeps implementation separate from main branch
- Allows easy rollback if needed
- Follows git best practices
- Prevents accidental commits to main

### Commands:

```bash
# Verify you're on main
git branch --show-current
# Expected output: main

# Ensure main is up to date
git pull origin main

# Create and switch to feature branch
git checkout -b feature/fix-404-status-codes

# Verify you're on the new branch
git branch --show-current
# Expected output: feature/fix-404-status-codes
```

### Validation:

- [ ] Running `git branch --show-current` shows `feature/fix-404-status-codes`
- [ ] Running `git status` shows "On branch feature/fix-404-status-codes"
- [ ] You are NOT on main branch

**✅ Checkpoint: Branch Created**

Now proceed to Phase 1.

---

## Root Cause Analysis

### Issue #1: `"use client"` in Root not-found.tsx (CRITICAL)

**Location:** [src/app/not-found.tsx:1](src/app/not-found.tsx#L1)

**Problem:**

```tsx
"use client"; // ← Prevents 404 status code

export default function NotFound() {
  const handleGoBack = () => {
    window.history.back(); // ← Only client-side feature used
  };
  // ...
}
```

**Why it breaks 404:**

- Next.js requires `not-found.tsx` to be a Server Component to set HTTP status codes during SSR
- Client components render in the browser **after** HTTP response is sent (status already 200)
- `"use client"` is only needed for the `window.history.back()` button handler

**Impact:** ALL 404 pages across the entire application

---

### Issue #2: DashboardShell Client Component Wrapping (HIGH)

**Location:** [src/app/layout.tsx:151](src/app/layout.tsx#L151)

**Problem:**

```tsx
<DashboardShell authData={authData}>{children}</DashboardShell>
```

**DashboardShell component:**

```tsx
"use client"; // ← Wraps all pages including not-found.tsx

export function DashboardShell({ children, authData }) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // ← Needs client state
  // ...
}
```

**Why it breaks 404:**

- DashboardShell is a client component that wraps ALL pages via root layout
- Even if `not-found.tsx` becomes a server component, it's rendered inside this client boundary
- Client component boundaries prevent Next.js from setting proper HTTP status codes

**Requirements for DashboardShell:**

- `useState` for sidebar toggle state (client-only)
- Header and Sidebar components that may have interactive features

**Impact:** ALL pages including 404 pages

---

### Issue #3: AuthWrapper Client Component in Mailchimp Layout (HIGH)

**Location:** [src/app/mailchimp/layout.tsx:15](src/app/mailchimp/layout.tsx#L15)

**Problem:**

```tsx
<AuthWrapper redirectTo="/login">{children}</AuthWrapper>
```

**AuthWrapper component:**

```tsx
"use client"; // ← Protects mailchimp routes

export function AuthWrapper({ children, redirectTo }) {
  const { isAuthenticated, isLoading } = useKindeBrowserClient(); // ← Client-only hook
  const router = useRouter(); // ← Client-only navigation
  // ...
}
```

**Why it breaks 404:**

- AuthWrapper wraps all `/mailchimp/*` routes including not-found pages
- Uses Kinde client-side hooks and router for authentication/redirect
- Creates another client boundary preventing 404 status propagation

**Impact:** All `/mailchimp/*` 404 pages

---

## Git Workflow

### Branch Strategy

**Branch Naming:**

```bash
feature/fix-404-status-codes
```

**Branch Creation:** See **Phase 0** above - this must be completed BEFORE starting Phase 1.

### Commit Strategy

**Commit after each phase** to create safe rollback points:

0. After creating feature branch (Phase 0) - No commit needed
1. After fixing root not-found.tsx (Phase 1)
2. After creating sidebar context provider (Phase 2)
3. After refactoring DashboardShell (Phase 2)
4. After updating header and sidebar (Phase 2)
5. After refactoring mailchimp auth (Phase 3)
6. After all manual testing and validation (Phase 4)

---

## Implementation Phases

**⚠️ REMINDER: You must complete Phase 0 (Create Feature Branch) before starting Phase 1!**

### Phase 1: Fix Root not-found.tsx (QUICK WIN)

**Goal:** Convert root not-found.tsx to server component by extracting client-only button

**Estimated Time:** 30 minutes
**Risk:** LOW
**Impact:** HIGH (fixes most 404 pages)

#### Files to Create:

- `src/types/components/not-found/back-button.ts` - Type definitions
- `src/types/components/not-found/index.ts` - Type barrel export
- `src/components/not-found/back-button.tsx` - Client component
- `src/components/not-found/index.ts` - Component barrel export

#### Files to Modify:

- `src/app/not-found.tsx` - Convert to server component
- `src/types/components/index.ts` - Export not-found types

#### Implementation Steps:

1. **Create not-found directories**

   ```bash
   mkdir -p src/types/components/not-found
   mkdir -p src/components/not-found
   ```

2. **Create BackButton type definitions**

   Create `src/types/components/not-found/back-button.ts`:

   ```tsx
   /**
    * Types for BackButton component
    *
    * Follows project guidelines for centralized type definitions
    */

   /**
    * Props for the BackButton component
    */
   export interface BackButtonProps {
     /**
      * Optional additional CSS class names
      */
     className?: string;
   }
   ```

   Create `src/types/components/not-found/index.ts`:

   ```tsx
   export * from "@/types/components/not-found/back-button";
   ```

3. **Create BackButton client component**

   Create `src/components/not-found/back-button.tsx`:

   ```tsx
   "use client";

   import type { BackButtonProps } from "@/types/components/not-found";

   export function BackButton({ className }: BackButtonProps) {
     const handleGoBack = () => {
       window.history.back();
     };

     return (
       <button
         onClick={handleGoBack}
         className={
           className ||
           "w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
         }
       >
         Go back
       </button>
     );
   }
   ```

4. **Create component barrel export**

   Create `src/components/not-found/index.ts`:

   ```tsx
   export * from "./back-button";
   ```

5. **Export not-found types from main types index**

   Update `src/types/components/index.ts` to include:

   ```tsx
   export * from "@/types/components/not-found";
   ```

6. **Update root not-found.tsx to remove "use client"**

   Modify `src/app/not-found.tsx`:
   - Remove `"use client"` directive
   - Import `BackButton` from `@/components/not-found`
   - Replace inline button with `<BackButton />`
   - Keep all other UI exactly the same

#### Validation:

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Start dev server
pnpm dev
```

**Manual Testing:**

- Visit `https://127.0.0.1:3000/fake-page`
- Open DevTools → Network tab
- Verify HTTP status is 404 (not 200)
- Verify UI renders correctly
- Test "Go back" button functionality

#### Checkpoint: COMMIT

```bash
git add src/types/components/not-found/ src/components/not-found/ src/app/not-found.tsx src/types/components/index.ts
git commit -m "feat(404): convert root not-found.tsx to server component

- Create BackButtonProps type in src/types/components/not-found/
- Export not-found types from main types index
- Extract BackButton into separate client component
- Remove 'use client' from not-found.tsx
- Enables proper 404 HTTP status code for most pages
- Preserves all existing functionality
- Follows project architectural standards for type definitions"
```

#### 💰 Cost Optimization: CLEAR CONVERSATION

✅ Safe to clear because:

- Phase 1 is complete and committed
- Changes are isolated to not-found page
- Next phase is independent (sidebar refactor)

📋 What to keep:

- This execution plan document
- Current progress: "Phase 1 complete, starting Phase 2"

---

### Phase 2: Refactor DashboardShell to Server Component

**Goal:** Remove client wrapper from all pages by using context for sidebar state

**Estimated Time:** 1-2 hours
**Risk:** MEDIUM
**Impact:** HIGH (fixes all application 404 pages)

#### Files to Create:

- `src/types/components/layout/sidebar-provider.ts` - Type definitions
- `src/components/layout/sidebar-provider.tsx` - Context provider

#### Files to Modify:

- `src/types/components/layout/index.ts` - Export sidebar types
- `src/components/layout/dashboard-shell.tsx` - Convert to server component
- `src/components/layout/dashboard-header.tsx` - Use context hook
- `src/components/layout/dashboard-sidebar.tsx` - Use context hook
- `src/components/layout/index.ts` - Export SidebarProvider
- `src/app/layout.tsx` - Remove prop passing

#### Implementation Steps:

**Step 1: Create Sidebar Context Provider**

First, create the type definitions in `src/types/components/layout/sidebar-provider.ts`:

```tsx
/**
 * Types for Sidebar Context Provider
 *
 * Follows project guidelines for centralized type definitions
 */
import type { ReactNode } from "react";

/**
 * Value shape for SidebarContext
 */
export interface SidebarContextValue {
  /**
   * Whether the sidebar is currently open
   */
  sidebarOpen: boolean;

  /**
   * Function to set sidebar open state
   */
  setSidebarOpen: (open: boolean) => void;
}

/**
 * Props for SidebarProvider component
 */
export interface SidebarProviderProps {
  /**
   * Child components to wrap with sidebar context
   */
  children: ReactNode;
}
```

Update `src/types/components/layout/index.ts` to export the new types:

```tsx
export * from "@/types/components/layout/breadcrumb";
export * from "@/types/components/layout/sidebar-provider";
```

Then, create the provider component in `src/components/layout/sidebar-provider.tsx`:

```tsx
"use client";

import { createContext, useContext, useState } from "react";
import type {
  SidebarContextValue,
  SidebarProviderProps,
} from "@/types/components/layout";

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}
```

**Validation after Step 1:**

```bash
pnpm type-check
pnpm lint
```

**Checkpoint: COMMIT**

```bash
git add src/types/components/layout/ src/components/layout/sidebar-provider.tsx
git commit -m "feat(layout): add sidebar context provider

- Create SidebarContextValue and SidebarProviderProps types
- Create SidebarProvider with context for sidebar state
- Export types from layout index
- Isolates client-side state management
- Preparation for converting DashboardShell to server component"
```

---

**Step 2: Convert DashboardShell to Server Component**

Modify `src/components/layout/dashboard-shell.tsx`:

```tsx
// Remove "use client" directive
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { SidebarProvider } from "@/components/layout/sidebar-provider";
import type { AuthSession } from "@/types/auth";

interface DashboardShellProps {
  children: React.ReactNode;
  authData: {
    session: AuthSession | null;
    displayName?: string;
    initials?: string;
  };
}

export function DashboardShell({ children, authData }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <DashboardHeader
        session={authData.session}
        displayName={authData.displayName}
        initials={authData.initials}
      />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}
```

**Note:** Remove `sidebarOpen` and `setSidebarOpen` props - they'll use context

**Validation after Step 2:**

```bash
pnpm type-check  # Will show errors in header/sidebar - expected
```

**Checkpoint: COMMIT**

```bash
git add src/components/layout/dashboard-shell.tsx
git commit -m "refactor(layout): convert DashboardShell to server component

- Remove 'use client' directive
- Wrap children in SidebarProvider
- Remove sidebar state props (will use context)
- Note: Header and sidebar still need context updates"
```

---

**Step 3: Update DashboardHeader to Use Context**

Modify `src/components/layout/dashboard-header.tsx`:

1. Add import: `import { useSidebar } from "@/components/layout";`
2. Remove `sidebarOpen` and `setSidebarOpen` from props interface
3. Add at start of component: `const { sidebarOpen, setSidebarOpen } = useSidebar();`
4. Keep everything else the same

**Step 4: Update DashboardSidebar to Use Context**

Modify `src/components/layout/dashboard-sidebar.tsx`:

1. Add import: `import { useSidebar } from "@/components/layout";`
2. Remove `visible` prop from props interface (if it exists)
3. Add at start of component: `const { sidebarOpen } = useSidebar();`
4. Replace any usage of `visible` prop with `sidebarOpen`

**Step 5: Update Layout Barrel Export**

Modify `src/components/layout/index.ts`:

```tsx
export * from "./sidebar-provider";
export * from "./dashboard-shell";
export * from "./dashboard-header";
export * from "./dashboard-sidebar";
// ... other exports
```

**Validation after Steps 3-5:**

```bash
# Type checking should pass now
pnpm type-check

# Linting
pnpm lint

# Start dev server
pnpm dev
```

**Manual Testing:**

- Visit `https://127.0.0.1:3000/`
- Test sidebar toggle (hamburger button)
- Verify sidebar opens/closes correctly
- Test navigation between pages
- Verify sidebar state persists across navigation

#### Checkpoint: COMMIT

```bash
git add src/components/layout/
git commit -m "refactor(layout): update header and sidebar to use context

- DashboardHeader now uses useSidebar() hook
- DashboardSidebar now uses useSidebar() hook
- Removed sidebar state props from component interfaces
- Export SidebarProvider from layout barrel export
- Sidebar toggle functionality preserved"
```

#### 💰 Cost Optimization: CLEAR CONVERSATION

✅ Safe to clear because:

- Phase 2 is complete and committed
- Sidebar refactor is working and tested
- Next phase is independent (auth refactor)

📋 What to keep:

- This execution plan document
- Current progress: "Phase 2 complete, starting Phase 3"

---

### Phase 3: Refactor Mailchimp Layout Authentication

**Goal:** Replace client-side AuthWrapper with server-side authentication check

**Estimated Time:** 30 minutes
**Risk:** LOW
**Impact:** MEDIUM (fixes mailchimp route 404 pages)

#### Files to Modify:

- `src/app/mailchimp/layout.tsx`

#### Implementation Steps:

1. **Read current implementation** to understand fallback UI

2. **Update mailchimp layout to use server-side auth**

Modify `src/app/mailchimp/layout.tsx`:

```tsx
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function MailchimpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication check
  const { isAuthenticated } = await getKindeServerSession();

  // Redirect unauthenticated users (server-side)
  if (!isAuthenticated) {
    redirect("/api/auth/login?post_login_redirect_url=/mailchimp");
  }

  // Render children for authenticated users
  return <>{children}</>;
}
```

**Benefits of this approach:**

- Server-side authentication (more secure)
- No loading state flicker (faster)
- Removes client boundary (enables 404 status)
- Simpler code

#### Validation:

```bash
# Type checking
pnpm type-check

# Start dev server
pnpm dev
```

**Manual Testing:**

**Test 1: Authenticated User**

- Ensure you're logged in
- Visit `https://127.0.0.1:3000/mailchimp`
- Should load normally
- Visit `https://127.0.0.1:3000/mailchimp/lists/invalid-id`
- Should show 404 page with 404 status

**Test 2: Unauthenticated User**

- Log out or use incognito window
- Visit `https://127.0.0.1:3000/mailchimp`
- Should redirect to login
- After login, should redirect back to mailchimp

#### Checkpoint: COMMIT

```bash
git add src/app/mailchimp/layout.tsx
git commit -m "refactor(auth): use server-side authentication for mailchimp routes

- Replace AuthWrapper with getKindeServerSession()
- Server-side redirect for unauthenticated users
- Removes client component boundary
- Enables proper 404 status for mailchimp routes
- More secure and faster authentication"
```

---

### Phase 4: Comprehensive Testing and Validation

**Goal:** Verify all 404 scenarios return proper status codes and all functionality works

**Estimated Time:** 1 hour
**Risk:** N/A (testing only)

#### Test Matrix:

| Route                           | Expected Behavior                | Expected Status | Test Auth     |
| ------------------------------- | -------------------------------- | --------------- | ------------- |
| `/fake-page`                    | Root not-found.tsx               | 404             | N/A           |
| `/mailchimp/fake`               | Mailchimp/root not-found.tsx     | 404             | Auth required |
| `/mailchimp/lists/invalid-id`   | Lists not-found.tsx              | 404             | Auth required |
| `/mailchimp/reports/invalid-id` | Reports not-found.tsx            | 404             | Auth required |
| `/mailchimp/reports/123/opens`  | Opens not-found.tsx (if invalid) | 404             | Auth required |

#### Validation Steps:

**1. HTTP Status Code Testing**

For each route above:

```bash
# Start dev server
pnpm dev

# Open browser DevTools → Network tab
# Visit the route
# Verify HTTP status code is 404
```

**2. Functional Testing**

- [ ] **Sidebar Toggle**
  - Click hamburger menu
  - Verify sidebar opens/closes
  - Verify state persists across page navigation

- [ ] **Authentication Flow**
  - Log out
  - Try to access `/mailchimp`
  - Verify redirect to login
  - Log in
  - Verify redirect back to `/mailchimp`

- [ ] **404 Pages**
  - Verify correct not-found.tsx renders for each route
  - Test "Go back" button on root not-found page
  - Test "Back to [Section]" links on nested not-found pages

- [ ] **Navigation**
  - Test all sidebar navigation links
  - Verify active states work correctly
  - Test breadcrumb navigation

**3. Automated Testing**

```bash
# Run all tests (includes architectural enforcement tests)
pnpm test

# Run architectural enforcement tests specifically
pnpm test src/test/architectural-enforcement/

# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Run full validation (recommended)
pnpm validate
```

**4. Cross-Browser Testing** (if possible)

- Chrome/Edge (Chromium)
- Firefox
- Safari (if on Mac)

**5. Responsive Testing**

- Mobile view (sidebar should work)
- Tablet view
- Desktop view

#### Issues to Watch For:

- Sidebar state not persisting
- Authentication loops
- 404 pages still showing 200 status
- Console errors in browser
- TypeScript errors
- Test failures

#### Checkpoint: COMMIT (if any issues fixed)

```bash
git add [any-fixed-files]
git commit -m "fix(404): resolve [specific-issue] found during testing"
```

---

## Manual Review Checklist

Before pushing to origin:

- [ ] **Code Quality**
  - [ ] No `"use client"` in not-found.tsx
  - [ ] DashboardShell is a server component
  - [ ] Sidebar context provider is properly typed
  - [ ] All components follow project conventions
  - [ ] No console.logs or debug statements

- [ ] **Type Safety & Architecture**
  - [ ] All TypeScript errors resolved
  - [ ] No `any` types introduced
  - [ ] All imports use path aliases (`@/types`, `@/components`)
  - [ ] All type definitions in `src/types/` folder (not inline)
  - [ ] Context is properly typed
  - [ ] Types exported through barrel exports (index.ts)

- [ ] **Testing**
  - [ ] All routes return 404 status correctly
  - [ ] Sidebar toggle works on all pages
  - [ ] Authentication flow works correctly
  - [ ] All automated tests pass
  - [ ] No console errors in browser

- [ ] **Functionality**
  - [ ] All existing features work (no regressions)
  - [ ] Sidebar state persists across navigation
  - [ ] Auth redirects work properly
  - [ ] UI looks identical to before

- [ ] **Git Hygiene**
  - [ ] All changes committed
  - [ ] Commit messages follow conventions
  - [ ] On correct branch: `git branch --show-current`
  - [ ] Review all changes: `git diff main`

---

## Push and PR Strategy

### Before Pushing

```bash
# Final validation
pnpm validate

# Review commit history
git log --oneline main..HEAD

# Review all changes one more time
git diff main

# Ensure you're on the correct branch
git branch --show-current
```

### Expected Commit History:

```
feat(404): convert root not-found.tsx to server component
feat(layout): add sidebar context provider
refactor(layout): convert DashboardShell to server component
refactor(layout): update header and sidebar to use context
refactor(auth): use server-side authentication for mailchimp routes
[optional] fix(404): resolve [any-issues] found during testing
```

### Pushing to Origin

```bash
# First push of new branch
git push -u origin feature/fix-404-status-codes
```

### Creating Pull Request

**Title:**

```
feat: fix 404 HTTP status codes for not-found pages
```

**Description:**

```markdown
## Summary

Fixes HTTP status code issue where not-found pages were returning 200 instead of 404. This improves SEO, browser behavior, and REST API standards compliance.

## Problem

When users visited non-existent pages, the app correctly rendered "Not Found" pages but returned HTTP 200 status instead of 404. This affected:

- SEO (search engines indexing error pages)
- Browser caching behavior
- Client-side error detection

## Solution

Converted client components to server components to enable proper 404 status:

1. **Root not-found.tsx**: Extracted client button into separate component
2. **DashboardShell**: Converted to server component using context for sidebar state
3. **Mailchimp auth**: Replaced client-side AuthWrapper with server-side check

## Changes

### New Files:

**Type Definitions (following project architectural standards):**

- `src/types/components/not-found/back-button.ts` - BackButton component types
- `src/types/components/not-found/index.ts` - Not-found types barrel export
- `src/types/components/layout/sidebar-provider.ts` - Sidebar context types

**Components:**

- `src/components/not-found/back-button.tsx` - Client component for history.back()
- `src/components/not-found/index.ts` - Not-found components barrel export
- `src/components/layout/sidebar-provider.tsx` - Context provider for sidebar state

### Modified Files:

- `src/types/components/index.ts` - Exports not-found types
- `src/types/components/layout/index.ts` - Exports sidebar provider types
- `src/app/not-found.tsx` - Removed "use client", uses BackButton component
- `src/components/layout/dashboard-shell.tsx` - Converted to server component
- `src/components/layout/dashboard-header.tsx` - Uses sidebar context via hook
- `src/components/layout/dashboard-sidebar.tsx` - Uses sidebar context via hook
- `src/components/layout/index.ts` - Exports SidebarProvider
- `src/app/mailchimp/layout.tsx` - Server-side auth check

## Testing

- [x] All not-found pages return 404 status
- [x] Sidebar toggle works correctly
- [x] Authentication flow preserved
- [x] No UI changes (visually identical)
- [x] All automated tests pass
- [x] Type checking passes
- [x] Manual testing complete

## Breaking Changes

**None.** All changes are internal refactoring. Users see identical UI/UX.

**Developer Notes:**

- DashboardHeader and DashboardSidebar now use `useSidebar()` hook instead of props for sidebar state
- All new type definitions follow project architectural standards (centralized in `src/types/` folder)
- All imports use path aliases (`@/types`, `@/components`) as enforced by project guidelines

## Checklist

- [x] Follows Next.js best practices
- [x] No breaking changes for users
- [x] All tests pass
- [x] Documentation reviewed
- [x] Manual testing complete
- [x] Type definitions centralized in `src/types/` (project architectural standard)
- [x] All imports use path aliases (enforced by architectural tests)

## References

- [Next.js Error Handling Docs](https://nextjs.org/docs/app/getting-started/error-handling)
- [Next.js not-found.tsx](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
```

---

## Rollback Strategy

### If Issues Found After Pushing

**Rollback entire feature branch:**

```bash
# Create revert commit
git revert HEAD~[number-of-commits] --no-edit

# Push revert
git push
```

**Rollback specific phase:**

```bash
# Revert specific commit
git revert <commit-hash>
git push
```

### If Issues Found Before Pushing

**Rollback to main:**

```bash
git reset --hard main
```

**Rollback to specific commit:**

```bash
git reset --hard <commit-hash>
```

### Emergency Rollback in Production

If the PR is merged and issues are found:

1. Immediately create new PR reverting the changes
2. Use `git revert` to preserve history
3. Create issue to fix properly
4. Re-implement with fixes

---

## Risk Assessment

| Phase                       | Risk Level | Impact | Mitigation                                             |
| --------------------------- | ---------- | ------ | ------------------------------------------------------ |
| Phase 1: Root not-found.tsx | LOW        | HIGH   | Simple revert, isolated change, easy to test           |
| Phase 2: DashboardShell     | MEDIUM     | HIGH   | Thorough testing of sidebar, context pattern is proven |
| Phase 3: AuthWrapper        | LOW        | MEDIUM | Server-side auth is more reliable, test thoroughly     |
| Phase 4: Verification       | N/A        | N/A    | Testing only, no code changes                          |

**Overall Risk:** LOW-MEDIUM

**Why risk is acceptable:**

- Changes are internal refactoring
- Preserves all existing functionality
- Improves standards compliance
- Follows Next.js best practices
- Can be rolled back easily

---

## Common Pitfalls to Avoid

1. **Forgetting to remove "use client"** from DashboardShell
2. **Not testing sidebar toggle** after context refactor
3. **Missing context provider import** in components
4. **Not wrapping in SidebarProvider** in DashboardShell
5. **Forgetting to update layout barrel export** to include SidebarProvider
6. **Not testing authentication flow** thoroughly
7. **Pushing before running full validation** (pnpm validate)
8. **Not verifying 404 status in DevTools** Network tab

---

## Success Criteria Verification

After completing all phases, verify:

### Must Have (Phase 1)

- [x] Root not-found.tsx returns HTTP 404 status
- [x] "Go back" button still works
- [x] All existing UI preserved

### Should Have (Phase 2)

- [x] All not-found pages return HTTP 404 status
- [x] Sidebar toggle functionality works correctly
- [x] Auth data flows correctly to header/sidebar

### Nice to Have (Phase 3)

- [x] Mailchimp routes use server-side auth
- [x] Faster authentication (no loading flicker)
- [x] More secure (server-side checks)

### Quality Gates (Phase 4)

- [x] All automated tests pass
- [x] Manual testing complete for all 404 scenarios
- [x] No regression in authentication flow
- [x] No regression in sidebar behavior
- [x] DevTools Network tab shows 404 status for all not-found pages

---

## Post-Merge Tasks

After PR is merged:

- [ ] Delete feature branch locally: `git branch -d feature/fix-404-status-codes`
- [ ] Delete feature branch remotely: `git push origin --delete feature/fix-404-status-codes`
- [ ] Update main branch: `git checkout main && git pull origin main`
- [ ] Verify in production (if auto-deployed)
- [ ] Monitor for any reported issues
- [ ] Update project documentation if needed
- [ ] Consider adding automated E2E tests for 404 status codes

---

## Questions Resolved

1. **Do we have a staging environment?** → Test thoroughly in local dev environment
2. **Are there monitoring systems expecting 200 for errors?** → No known dependencies
3. **Should we implement feature flags?** → No, changes are low-risk and easily reversible
4. **Should we add 404 status monitoring?** → Consider post-implementation
5. **Any SEO concerns with changing status codes?** → Positive impact - proper 404s are better for SEO

---

## Additional Notes

### Why This Approach?

**Context Pattern for Sidebar:**

- Standard React pattern for sharing state
- Keeps DashboardShell as server component
- Minimal client-side code
- Easy to test and maintain

**Server-Side Auth:**

- More secure (no client-side bypass)
- Faster (no loading flicker)
- Follows Kinde recommendations
- Enables proper 404 status

**Phased Approach:**

- Each phase is independently testable
- Safe rollback points at each commit
- Can pause between phases if needed

### Developer Experience

**No breaking changes for developers:**

- Components still work the same way
- Only internal implementation changed
- TypeScript ensures correctness
- Context API is familiar pattern

**Architectural Standards Compliance:**

- All type definitions follow project guidelines (centralized in `src/types/`)
- All imports use path aliases (`@/types`, `@/components`)
- Barrel exports (index.ts) for clean imports
- Types exported separately from components
- Automated tests enforce these standards

**If extending in the future:**

- To add more sidebar state, update SidebarProvider
- To add sidebar actions, add to context value
- Pattern can be reused for other shared state
- Always define types in `src/types/components/` first
- Use path aliases for all imports

---

**End of Execution Plan**
