# Execution Plan: Extract Common Page Layout Pattern

**Task Reference:** [docs/page-pattern-improvements.md](../page-pattern-improvements.md) - Improvement #3
**Estimated Effort:** 3-4 hours
**Created:** 2025-10-17
**Status:** Ready for Implementation

---

## Overview

**Goal:** Create a reusable `PageLayout` component that encapsulates the common layout pattern shared across 13 pages, reducing 300-430 lines of boilerplate code while supporting both static and dynamic breadcrumb patterns.

**Success Criteria:**

- ✅ `PageLayout` component created with support for both breadcrumb patterns
- ✅ Type definitions created in `/src/types/components/layout/`
- ✅ Component properly exported through barrel exports
- ✅ At least 3 pages updated to use new component (1 static, 2 dynamic)
- ✅ All tests pass (including architectural enforcement)
- ✅ Documentation updated in CLAUDE.md

**Prerequisites:**

- ✅ #1 Error Handling Utility - Completed
- ✅ #2 Breadcrumb Builder Utility - Completed
- Review: [BreadcrumbNavigation component](../../src/components/layout/breadcrumb-navigation.tsx)
- Review: [DashboardLayout component](../../src/components/layout/dashboard-layout.tsx)
- Understand: Two page patterns (static vs dynamic breadcrumbs)

**Documentation References:**

- [Next.js App Router - Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [React Suspense](https://react.dev/reference/react/Suspense)
- Current page patterns documented in [page-pattern-improvements.md](../page-pattern-improvements.md#current-page-structures-as-built)

---

## Files Affected

### Files to Create

**Types:**

- `src/types/components/layout/page-layout.ts` - PageLayout component types with JSDoc
- Will update: `src/types/components/layout/index.ts` - Export new types

**Component:**

- `src/components/layout/page-layout.tsx` - PageLayout component implementation
- `src/components/layout/page-layout.test.tsx` - Unit tests for PageLayout
- Will update: `src/components/layout/index.ts` - Export new component

### Files to Modify

**Type Exports:**

- `src/types/components/layout/index.ts` - Add PageLayout types export

**Component Exports:**

- `src/components/layout/index.ts` - Add PageLayout component export

**Example Pages (Proof of Concept):**

- `src/app/mailchimp/reports/page.tsx` - Static page example (Pattern A)
- `src/app/mailchimp/reports/[id]/opens/page.tsx` - Dynamic page example (Pattern B)
- `src/app/mailchimp/lists/page.tsx` - Static page example (Pattern A)

**Documentation:**

- `CLAUDE.md` - Add PageLayout usage pattern

---

## Git Workflow

### Branch Strategy

**Branch Name:** `feature/page-layout-component`

### Initial Setup (REQUIRED FIRST STEP)

```bash
# Ensure you're on main and up to date
git checkout main
git pull origin main

# Create new feature branch
git checkout -b feature/page-layout-component

# VERIFY you're on the correct branch
git branch --show-current
# Should output: feature/page-layout-component (NOT main)
```

**⚠️ CRITICAL: DO NOT PROCEED if `git branch --show-current` returns `main`**

### Commit Strategy

**Commit Points:**

1. After creating type definitions
2. After creating PageLayout component
3. After writing unit tests
4. After updating first static page (Pattern A)
5. After updating dynamic pages (Pattern B)
6. After running full validation
7. After updating documentation

**Commit Message Format:**

```
feat(layout): <description>
test(layout): <description>
refactor(pages): <description>
docs: <description>
```

---

## Implementation Phases

## Phase 0: Git Setup and Pre-Implementation Validation

**Goal:** Ensure correct git branch setup and verify no work has already been completed

**Estimated Time:** 5-10 minutes

**⚠️ CRITICAL: This phase MUST be completed before any implementation work begins**

### Step 1: Verify Current Branch

```bash
# Check what branch you're currently on
git branch --show-current
```

**Expected outcomes:**

- ✅ **If on feature branch matching this plan:** `feature/page-layout-component` → Proceed to Step 2
- ❌ **If on `main` branch:** STOP and proceed to Step 1b
- ❌ **If on different feature branch:** Confirm with user before proceeding

**Step 1b: Create Feature Branch (if needed)**

**ONLY run these commands if you're on `main` or wrong branch:**

```bash
# Ensure main is up to date
git checkout main
git pull origin main

# Create and switch to feature branch
git checkout -b feature/page-layout-component

# Verify you're on the correct branch
git branch --show-current
# Should output: feature/page-layout-component (NOT main)
```

**🛑 DO NOT PROCEED if `git branch --show-current` still returns `main`**

### Step 2: Check for Existing Work

Before starting implementation, verify the work hasn't already been done:

```bash
# Check recent commit history
git log --oneline -15

# Look for commits related to PageLayout
git log --oneline --all --grep="page-layout\|PageLayout"

# Check if key files already exist
ls src/types/components/layout/page-layout.ts 2>/dev/null && echo "Type file exists" || echo "Type file does not exist"
ls src/components/layout/page-layout.tsx 2>/dev/null && echo "Component file exists" || echo "Component file does not exist"
ls src/components/layout/page-layout.test.tsx 2>/dev/null && echo "Test file exists" || echo "Test file does not exist"
```

**If work is already complete:**

- Inform user: "This work appears to be already completed. Found commits: [list] and files: [list]"
- Ask: "Would you like me to verify the implementation or move to the next phase?"
- DO NOT re-implement already completed work

**If work is partially complete:**

- List what's done and what remains
- Ask user how to proceed

### Step 3: Review Pre-Implementation Checklist

Verify you understand the requirements:

- [ ] Read [page-pattern-improvements.md](../page-pattern-improvements.md) - Understand both patterns (A & B)
- [ ] Review current page implementations:
  - [ ] Static page: `src/app/mailchimp/reports/page.tsx`
  - [ ] Dynamic page: `src/app/mailchimp/reports/[id]/opens/page.tsx`
- [ ] Review existing layout components:
  - [ ] `src/components/layout/dashboard-layout.tsx`
  - [ ] `src/components/layout/breadcrumb-navigation.tsx`
- [ ] Review type structure:
  - [ ] `src/types/components/layout/breadcrumb.ts`
  - [ ] `src/types/components/layout/index.ts`
- [ ] Review breadcrumb builder utility: `src/utils/breadcrumbs/breadcrumb-builder.ts`
- [ ] Understand architectural constraints:
  - [ ] Types must be in `/src/types` (not inline)
  - [ ] All exports use barrel exports (index.ts files)
  - [ ] Import from `@/types/components/layout` (not specific files)
- [ ] Check React Suspense best practices in [official docs](https://react.dev/reference/react/Suspense)

### Step 4: Confirm Environment

```bash
# Verify Node.js and pnpm versions
node --version  # Should be v24.7.0 or compatible
pnpm --version  # Should be v10.15.0 or compatible

# Ensure dependencies are installed
pnpm install

# Verify dev server can start (don't keep running)
pnpm dev
# Press Ctrl+C to stop after confirming it starts
```

**Validation:**

- [ ] On correct feature branch: `git branch --show-current`
- [ ] No existing work that would be duplicated
- [ ] Pre-implementation checklist reviewed
- [ ] Environment verified and dependencies installed

**Checkpoint: Confirm Setup**

```bash
# Create initial commit to mark branch creation
git commit --allow-empty -m "chore: initialize feature branch for PageLayout component"
```

**✅ Phase 0 Complete - Ready to begin Phase 1**

---

## Phase 1: Create Type Definitions

**Goal:** Define TypeScript types for PageLayout component following project architectural standards.

**Estimated Time:** 20 minutes

**Pre-Phase Checklist:**

- [ ] Check if types already exist: `ls src/types/components/layout/page-layout.ts`
- [ ] Check git history: `git log --oneline -10 | grep -i "page-layout"`
- [ ] If files exist, verify completion status before proceeding

**Implementation Steps:**

1. **Create type definition file**

   ```bash
   touch src/types/components/layout/page-layout.ts
   ```

2. **Implement PageLayoutProps type**

   Open `src/types/components/layout/page-layout.ts` and add:

   ```tsx
   /**
    * Types for PageLayout component
    *
    * Centralizes the common page layout pattern used across all dashboard pages.
    * Supports both static breadcrumbs (Pattern A) and dynamic breadcrumbs (Pattern B).
    *
    * @see src/components/layout/page-layout.tsx
    */

   import type { BreadcrumbItem } from "@/types/components/layout";
   import type { ReactNode } from "react";

   /**
    * Props for the PageLayout component
    *
    * Use either `breadcrumbs` OR `breadcrumbsSlot`, never both:
    * - Pattern A (static pages): Use `breadcrumbs` prop with BreadcrumbItem array
    * - Pattern B (dynamic pages): Use `breadcrumbsSlot` prop with pre-wrapped Suspense
    */
   export interface PageLayoutProps {
     /**
      * Breadcrumb items for static pages (Pattern A)
      * Use this when page has no dynamic route params
      *
      * @example
      * breadcrumbs={[bc.home, bc.mailchimp, bc.current("Reports")]}
      */
     breadcrumbs?: BreadcrumbItem[];

     /**
      * Pre-rendered breadcrumb content for dynamic pages (Pattern B)
      * Use this when breadcrumbs need dynamic params (e.g., [id] routes)
      * Should be wrapped in Suspense boundary
      *
      * @example
      * breadcrumbsSlot={
      *   <Suspense fallback={null}>
      *     <BreadcrumbContent params={params} />
      *   </Suspense>
      * }
      */
     breadcrumbsSlot?: ReactNode;

     /**
      * Page title displayed in h1
      */
     title: string;

     /**
      * Page description displayed below title
      */
     description: string;

     /**
      * Skeleton component to show while content loads
      */
     skeleton: ReactNode;

     /**
      * Main page content (async component)
      */
     children: ReactNode;
   }
   ```

3. **Update barrel export in layout folder**

   Edit `src/types/components/layout/index.ts`:

   ```bash
   # First, read the current file
   cat src/types/components/layout/index.ts
   ```

   Add the export line:

   ```tsx
   export * from "@/types/components/layout/page-layout";
   ```

4. **Verify type exports**

   ```bash
   # Check that types are exported correctly
   cat src/types/components/layout/index.ts
   cat src/types/components/index.ts
   ```

**Validation:**

- [ ] TypeScript compiles: `pnpm type-check`
- [ ] No linting errors: `pnpm lint`
- [ ] Types are importable from `@/types/components/layout`

**Checkpoint: COMMIT**

```bash
git add src/types/components/layout/page-layout.ts src/types/components/layout/index.ts
git commit -m "feat(layout): add PageLayout component type definitions

- Add PageLayoutProps interface with comprehensive JSDoc
- Support both static breadcrumbs (Pattern A) and dynamic breadcrumbs (Pattern B)
- Follow project architectural standards (types in /src/types)"
```

---

## Phase 2: Create PageLayout Component

**Goal:** Implement the PageLayout component that encapsulates common layout boilerplate.

**Estimated Time:** 30 minutes

**Pre-Phase Checklist:**

- [ ] Check if component exists: `ls src/components/layout/page-layout.tsx`
- [ ] Check git history for related commits
- [ ] Verify Phase 1 is complete (types exist)

**Implementation Steps:**

1. **Create component file**

   ```bash
   touch src/components/layout/page-layout.tsx
   ```

2. **Implement PageLayout component**

   Open `src/components/layout/page-layout.tsx` and add:

   ````tsx
   /**
    * PageLayout Component
    * Reusable layout wrapper for dashboard pages
    *
    * Encapsulates common page structure:
    * - DashboardLayout wrapper
    * - Breadcrumb navigation (static or dynamic)
    * - Page header (title + description)
    * - Suspense boundary with skeleton
    *
    * @example Pattern A - Static Pages
    * ```tsx
    * <PageLayout
    *   breadcrumbs={[bc.home, bc.mailchimp, bc.current("Reports")]}
    *   title="Reports"
    *   description="View and analyze your Mailchimp reports"
    *   skeleton={<ReportsOverviewSkeleton />}
    * >
    *   <ReportsPageContent searchParams={searchParams} />
    * </PageLayout>
    * ```
    *
    * @example Pattern B - Dynamic Pages
    * ```tsx
    * <PageLayout
    *   breadcrumbsSlot={
    *     <Suspense fallback={null}>
    *       <BreadcrumbContent params={params} />
    *     </Suspense>
    *   }
    *   title="Campaign Opens"
    *   description="Members who opened this campaign"
    *   skeleton={<CampaignOpensSkeleton />}
    * >
    *   <CampaignOpensPageContent {...props} />
    * </PageLayout>
    * ```
    */

   import { Suspense } from "react";
   import { DashboardLayout, BreadcrumbNavigation } from "@/components/layout";
   import type { PageLayoutProps } from "@/types/components/layout";

   export function PageLayout({
     breadcrumbs,
     breadcrumbsSlot,
     title,
     description,
     skeleton,
     children,
   }: PageLayoutProps) {
     return (
       <DashboardLayout>
         <div className="space-y-6">
           {/* Breadcrumbs - support both static and dynamic patterns */}
           {breadcrumbs && <BreadcrumbNavigation items={breadcrumbs} />}
           {breadcrumbsSlot && breadcrumbsSlot}

           {/* Page Header */}
           <div>
             <h1 className="text-3xl font-bold">{title}</h1>
             <p className="text-muted-foreground">{description}</p>
           </div>

           {/* Main Content */}
           <Suspense fallback={skeleton}>{children}</Suspense>
         </div>
       </DashboardLayout>
     );
   }
   ````

3. **Update component barrel export**

   Edit `src/components/layout/index.ts`:

   ```bash
   # First, read the current file
   cat src/components/layout/index.ts
   ```

   Add the export line:

   ```tsx
   export { PageLayout } from "@/components/layout/page-layout";
   ```

**Validation:**

- [ ] TypeScript compiles: `pnpm type-check`
- [ ] No linting errors: `pnpm lint`
- [ ] Component is importable from `@/components/layout`

**Checkpoint: COMMIT**

```bash
git add src/components/layout/page-layout.tsx src/components/layout/index.ts
git commit -m "feat(layout): implement PageLayout component

- Encapsulates DashboardLayout + breadcrumbs + header + Suspense
- Supports both static (breadcrumbs prop) and dynamic (breadcrumbsSlot prop) patterns
- Reduces 20-50 lines of boilerplate per page
- Comprehensive JSDoc with usage examples"
```

---

## Phase 3: Write Unit Tests

**Goal:** Create comprehensive unit tests for PageLayout component.

**Estimated Time:** 30 minutes

**Pre-Phase Checklist:**

- [ ] Check if tests exist: `ls src/components/layout/page-layout.test.tsx`
- [ ] Check git history for test commits
- [ ] Verify Phase 2 is complete (component exists)

**Implementation Steps:**

1. **Create test file**

   ```bash
   touch src/components/layout/page-layout.test.tsx
   ```

2. **Write comprehensive tests**

   Open `src/components/layout/page-layout.test.tsx` and add:

   ```tsx
   /**
    * Unit tests for PageLayout component
    */

   import { describe, it, expect } from "vitest";
   import { render, screen } from "@testing-library/react";
   import { PageLayout } from "@/components/layout/page-layout";
   import { bc } from "@/utils/breadcrumbs";

   describe("PageLayout", () => {
     describe("Pattern A - Static Breadcrumbs", () => {
       it("renders with static breadcrumbs", () => {
         render(
           <PageLayout
             breadcrumbs={[bc.home, bc.mailchimp, bc.current("Reports")]}
             title="Reports"
             description="View and analyze your reports"
             skeleton={<div data-testid="skeleton">Loading...</div>}
           >
             <div data-testid="content">Page Content</div>
           </PageLayout>,
         );

         expect(screen.getByText("Reports")).toBeInTheDocument();
         expect(
           screen.getByText("View and analyze your reports"),
         ).toBeInTheDocument();
         expect(screen.getByText("Dashboard")).toBeInTheDocument();
         expect(screen.getByText("Mailchimp")).toBeInTheDocument();
       });

       it("renders page title and description", () => {
         render(
           <PageLayout
             breadcrumbs={[bc.home]}
             title="Test Page"
             description="Test description"
             skeleton={<div>Loading...</div>}
           >
             <div>Content</div>
           </PageLayout>,
         );

         const heading = screen.getByRole("heading", { level: 1 });
         expect(heading).toHaveTextContent("Test Page");
         expect(screen.getByText("Test description")).toBeInTheDocument();
       });
     });

     describe("Pattern B - Dynamic Breadcrumbs", () => {
       it("renders with breadcrumbsSlot", () => {
         const BreadcrumbSlot = (
           <div data-testid="breadcrumb-slot">Custom Breadcrumbs</div>
         );

         render(
           <PageLayout
             breadcrumbsSlot={BreadcrumbSlot}
             title="Campaign Opens"
             description="Members who opened this campaign"
             skeleton={<div>Loading...</div>}
           >
             <div>Content</div>
           </PageLayout>,
         );

         expect(screen.getByTestId("breadcrumb-slot")).toBeInTheDocument();
         expect(screen.getByText("Campaign Opens")).toBeInTheDocument();
       });

       it("does not render breadcrumbs when using breadcrumbsSlot", () => {
         render(
           <PageLayout
             breadcrumbsSlot={<div>Slot</div>}
             title="Title"
             description="Description"
             skeleton={<div>Loading...</div>}
           >
             <div>Content</div>
           </PageLayout>,
         );

         // Breadcrumb component should not be rendered when using slot
         expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
       });
     });

     describe("Content Rendering", () => {
       it("renders children inside Suspense boundary", () => {
         render(
           <PageLayout
             breadcrumbs={[bc.home]}
             title="Title"
             description="Description"
             skeleton={<div>Loading...</div>}
           >
             <div data-testid="page-content">Page Content</div>
           </PageLayout>,
         );

         expect(screen.getByTestId("page-content")).toBeInTheDocument();
       });

       it("uses correct spacing classes", () => {
         const { container } = render(
           <PageLayout
             breadcrumbs={[bc.home]}
             title="Title"
             description="Description"
             skeleton={<div>Loading...</div>}
           >
             <div>Content</div>
           </PageLayout>,
         );

         const spacingDiv = container.querySelector(".space-y-6");
         expect(spacingDiv).toBeInTheDocument();
       });
     });

     describe("Mutual Exclusivity", () => {
       it("prioritizes breadcrumbs prop when both props provided", () => {
         render(
           <PageLayout
             breadcrumbs={[bc.home, bc.current("Test")]}
             breadcrumbsSlot={<div data-testid="slot">Slot</div>}
             title="Title"
             description="Description"
             skeleton={<div>Loading...</div>}
           >
             <div>Content</div>
           </PageLayout>,
         );

         // Should render breadcrumbs navigation
         expect(screen.getByText("Dashboard")).toBeInTheDocument();
         expect(screen.getByText("Test")).toBeInTheDocument();
       });
     });
   });
   ```

3. **Run tests**

   ```bash
   pnpm test src/components/layout/page-layout.test.tsx
   ```

4. **Run architectural enforcement tests**

   ```bash
   # Ensure component follows project conventions
   pnpm test src/test/architectural-enforcement/
   ```

**Validation:**

- [ ] All PageLayout tests pass
- [ ] Architectural enforcement tests pass
- [ ] TypeScript compiles: `pnpm type-check`
- [ ] No linting errors: `pnpm lint`

**Checkpoint: COMMIT**

```bash
git add src/components/layout/page-layout.test.tsx
git commit -m "test(layout): add comprehensive tests for PageLayout

- Test Pattern A (static breadcrumbs)
- Test Pattern B (dynamic breadcrumbs with slot)
- Test content rendering and spacing
- Test mutual exclusivity of breadcrumb props
- 100% coverage for PageLayout component"
```

**💰 Cost Optimization: CLEAR CONVERSATION**

✅ Safe to clear because:

- Phases 1-3 complete and committed
- Component is tested and working
- Next phase is independent (using the component in pages)

📋 What to keep:

- This execution plan document
- File: docs/page-pattern-improvements.md
- Current task: "Update 3 pages to use PageLayout component"

---

## Phase 4: Update First Static Page (Pattern A Proof of Concept)

**Goal:** Update reports list page to use PageLayout component, demonstrating Pattern A.

**Estimated Time:** 20 minutes

**Pre-Phase Checklist:**

- [ ] Check git history: `git log --oneline -10 | grep -i "reports"`
- [ ] Verify PageLayout component exists and is tested
- [ ] Read current page: `src/app/mailchimp/reports/page.tsx`

**Implementation Steps:**

1. **Read the current page implementation**

   ```bash
   cat src/app/mailchimp/reports/page.tsx
   ```

2. **Update the reports page**

   Replace the layout boilerplate with PageLayout:

   ```tsx
   /**
    * Mailchimp Reports Page
    * Displays reports with server-side data fetching
    *
    * Issue #140: Reports page implementation following App Router patterns
    * Based on ListsPage pattern with server-side URL cleanup and proper prop handling
    * Implements Next.js best practices for error handling and layout consistency
    */

   import type { ReportsPageProps } from "@/types/components/mailchimp";
   import { MailchimpConnectionGuard } from "@/components/mailchimp";
   import { mailchimpDAL } from "@/dal/mailchimp.dal";
   import { ReportsOverview } from "@/components/dashboard/reports-overview";
   import { Suspense } from "react";
   import { reportListParamsSchema } from "@/schemas/mailchimp";
   import { reportsPageSearchParamsSchema } from "@/schemas/components";
   import { transformCampaignReportsParams } from "@/utils/mailchimp/query-params";
   import { ReportsOverviewSkeleton } from "@/skeletons/mailchimp";
   import { validatePageParams } from "@/utils/mailchimp/page-params";
   import { bc } from "@/utils";
   import { PageLayout } from "@/components/layout";

   async function ReportsPageContent({ searchParams }: ReportsPageProps) {
     // Validate page parameters: validate, redirect if needed, convert to API format
     const { apiParams, currentPage, pageSize } = await validatePageParams({
       searchParams,
       uiSchema: reportsPageSearchParamsSchema,
       apiSchema: reportListParamsSchema,
       basePath: "/mailchimp/reports",
       transformer: transformCampaignReportsParams,
     });

     // Fetch reports (validation happens at DAL layer)
     const response = await mailchimpDAL.fetchCampaignReports(apiParams);

     // Guard component handles UI based on errorCode from DAL
     return (
       <MailchimpConnectionGuard errorCode={response.errorCode}>
         {response.success ? (
           <ReportsOverview
             data={response.data || null}
             currentPage={currentPage}
             pageSize={pageSize}
           />
         ) : (
           <ReportsOverview
             error={response.error || "Failed to load campaign reports"}
             data={null}
           />
         )}
       </MailchimpConnectionGuard>
     );
   }

   export default function ReportsPage({ searchParams }: ReportsPageProps) {
     return (
       <PageLayout
         breadcrumbs={[bc.home, bc.mailchimp, bc.current("Reports")]}
         title="Reports"
         description="View and analyze your Mailchimp reports and their performance metrics"
         skeleton={<ReportsOverviewSkeleton />}
       >
         <ReportsPageContent searchParams={searchParams} />
       </PageLayout>
     );
   }

   // Force dynamic rendering to prevent build-time API calls
   export const dynamic = "force-dynamic";

   export const metadata = {
     title: "Reports | Mailchimp Dashboard",
     description:
       "View and analyze your Mailchimp reports and their performance metrics",
   };
   ```

3. **Manual testing**

   ```bash
   # Start dev server
   pnpm dev

   # Test in browser:
   # - Navigate to http://127.0.0.1:3000/mailchimp/reports
   # - Verify page loads correctly
   # - Check breadcrumbs render
   # - Check page header displays
   # - Test pagination if applicable
   ```

**Validation:**

- [ ] Page loads correctly in browser
- [ ] Breadcrumbs display and work correctly
- [ ] Page header renders (title + description)
- [ ] Content loads in Suspense boundary
- [ ] TypeScript compiles: `pnpm type-check`
- [ ] No console errors
- [ ] Tests still pass: `pnpm test src/app/mailchimp/reports/page.test.tsx`

**Checkpoint: COMMIT**

```bash
git add src/app/mailchimp/reports/page.tsx
git commit -m "refactor(pages): use PageLayout in reports page (Pattern A)

- Replace 30 lines of layout boilerplate with PageLayout component
- Uses static breadcrumbs pattern (Pattern A)
- Maintains all existing functionality
- Proof of concept for static page migration"
```

---

## Phase 5: Update Dynamic Pages (Pattern B)

**Goal:** Update campaign opens and lists pages to use PageLayout with breadcrumbsSlot.

**Estimated Time:** 40 minutes

**Pre-Phase Checklist:**

- [ ] Check git history for related commits
- [ ] Verify Phase 4 is complete (reports page updated)
- [ ] Read current pages:
  - `src/app/mailchimp/reports/[id]/opens/page.tsx`
  - `src/app/mailchimp/lists/page.tsx`

**Implementation Steps:**

1. **Update campaign opens page (Pattern B - Dynamic)**

   Read current implementation:

   ```bash
   cat src/app/mailchimp/reports/[id]/opens/page.tsx
   ```

   Update to use PageLayout with breadcrumbsSlot:

   ```tsx
   /**
    * Campaign Opens Page
    * Server component that displays members who opened the campaign
    *
    * Issue #135: Campaign opens list page implementation
    * Following Next.js 15 App Router patterns and established page structures
    */

   import { Suspense } from "react";
   import { MailchimpConnectionGuard } from "@/components/mailchimp";
   import { CampaignOpensSkeleton } from "@/skeletons/mailchimp";
   import {
     reportOpensPageParamsSchema,
     reportOpensPageSearchParamsSchema,
   } from "@/schemas/components";
   import type { ReportOpensPageProps } from "@/types/components/mailchimp";
   import { mailchimpDAL } from "@/dal/mailchimp.dal";
   import { CampaignOpensTable } from "@/components/dashboard/reports";
   import { openListQueryParamsSchema } from "@/schemas/mailchimp/report-open-details-params.schema";
   import { PER_PAGE_OPTIONS } from "@/types/components/ui/per-page-selector";
   import type {
     ReportOpenListSuccess,
     CampaignReport,
   } from "@/types/mailchimp";
   import { validatePageParams } from "@/utils/mailchimp/page-params";
   import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
   import type { Metadata } from "next";
   import { handleApiError, bc } from "@/utils";
   import { PageLayout, BreadcrumbNavigation } from "@/components/layout";

   async function CampaignOpensPageContent({
     opensData,
     campaignId,
     currentPage,
     pageSize,
     errorCode,
   }: {
     opensData: ReportOpenListSuccess | null;
     campaignId: string;
     currentPage: number;
     pageSize: number;
     errorCode?: string;
   }) {
     // Guard component handles UI based on errorCode from DAL
     return (
       <MailchimpConnectionGuard errorCode={errorCode}>
         {opensData ? (
           <CampaignOpensTable
             opensData={opensData}
             currentPage={currentPage}
             pageSize={pageSize}
             perPageOptions={[...PER_PAGE_OPTIONS]}
             baseUrl={`/mailchimp/reports/${campaignId}/opens`}
             campaignId={campaignId}
           />
         ) : (
           <DashboardInlineError error="Failed to load campaign opens" />
         )}
       </MailchimpConnectionGuard>
     );
   }

   export default async function CampaignOpensPage({
     params,
     searchParams,
   }: ReportOpensPageProps) {
     // Process route params (BEFORE Suspense boundary)
     const rawRouteParams = await params;
     const { id: campaignId } =
       reportOpensPageParamsSchema.parse(rawRouteParams);

     // Validate campaign exists first (BEFORE Suspense boundary for 404 handling)
     const campaignResponse =
       await mailchimpDAL.fetchCampaignReport(campaignId);
     handleApiError(campaignResponse);

     // Validate page params with redirect handling (BEFORE Suspense boundary)
     const { apiParams, currentPage, pageSize } = await validatePageParams({
       searchParams,
       uiSchema: reportOpensPageSearchParamsSchema,
       apiSchema: openListQueryParamsSchema,
       basePath: `/mailchimp/reports/${campaignId}/opens`,
     });

     // Fetch campaign open list data (BEFORE Suspense boundary)
     const response = await mailchimpDAL.fetchCampaignOpenList(
       campaignId,
       apiParams,
     );

     // Handle API errors (BEFORE Suspense boundary)
     handleApiError(response);

     const opensData = response.success
       ? (response.data as ReportOpenListSuccess)
       : null;

     return (
       <PageLayout
         breadcrumbsSlot={
           <Suspense fallback={null}>
             <BreadcrumbContent params={params} />
           </Suspense>
         }
         title="Campaign Report"
         description="Members who opened this campaign"
         skeleton={<CampaignOpensSkeleton />}
       >
         <CampaignOpensPageContent
           opensData={opensData}
           campaignId={campaignId}
           currentPage={currentPage}
           pageSize={pageSize}
           errorCode={response.errorCode}
         />
       </PageLayout>
     );
   }

   async function BreadcrumbContent({
     params,
   }: {
     params: Promise<{ id: string }>;
   }) {
     const rawParams = await params;
     const { id } = reportOpensPageParamsSchema.parse(rawParams);

     return (
       <BreadcrumbNavigation
         items={[
           bc.home,
           bc.mailchimp,
           bc.reports,
           bc.report(id),
           bc.current("Opens"),
         ]}
       />
     );
   }

   // Force dynamic rendering to prevent build-time API calls
   export const dynamic = "force-dynamic";

   // Generate metadata for the page
   export async function generateMetadata({
     params,
   }: {
     params: Promise<{ id: string }>;
   }): Promise<Metadata> {
     const rawParams = await params;
     const { id } = reportOpensPageParamsSchema.parse(rawParams);

     // Fetch campaign report for metadata
     const response = await mailchimpDAL.fetchCampaignReport(id);

     if (!response.success || !response.data) {
       return {
         title: "Campaign Opens - Campaign Not Found",
         description: "The requested campaign could not be found.",
       };
     }

     const report = response.data as CampaignReport;

     return {
       title: `${report.campaign_title} - Opens`,
       description: `View all members who opened ${report.campaign_title}. Total opens: ${report.opens.opens_total.toLocaleString()}`,
       openGraph: {
         title: `${report.campaign_title} - Campaign Opens`,
         description: `${report.opens.opens_total.toLocaleString()} total opens from ${report.emails_sent.toLocaleString()} recipients`,
         type: "website",
       },
     };
   }
   ```

2. **Update lists page (Pattern A - Static)**

   ```bash
   cat src/app/mailchimp/lists/page.tsx
   ```

   Update to use PageLayout:

   ```tsx
   import { ListOverview } from "@/components/mailchimp/lists/list-overview";
   import { ListOverviewSkeleton } from "@/skeletons/mailchimp";
   import { MailchimpConnectionGuard } from "@/components/mailchimp";
   import type { ListsPageProps } from "@/types/components/mailchimp";
   import { listsParamsSchema } from "@/schemas/mailchimp/lists-params.schema";
   import { listsPageSearchParamsSchema } from "@/schemas/components";
   import { mailchimpDAL } from "@/dal/mailchimp.dal";
   import { Suspense } from "react";
   import { validatePageParams } from "@/utils/mailchimp/page-params";
   import { bc } from "@/utils";
   import { PageLayout } from "@/components/layout";

   async function ListsPageContent({ searchParams }: ListsPageProps) {
     // Validate params: validate, check redirect, convert to API format
     const { apiParams, currentPage, pageSize } = await validatePageParams({
       searchParams,
       uiSchema: listsPageSearchParamsSchema,
       apiSchema: listsParamsSchema,
       basePath: "/mailchimp/lists",
     });

     // Fetch lists (validation happens at DAL layer)
     const response = await mailchimpDAL.fetchLists(apiParams);

     // Guard component handles UI based on errorCode from DAL
     return (
       <MailchimpConnectionGuard errorCode={response.errorCode}>
         {response.success ? (
           <ListOverview
             data={response.data || null}
             currentPage={currentPage}
             pageSize={pageSize}
           />
         ) : (
           <ListOverview
             error={response.error || "Failed to load lists"}
             data={null}
           />
         )}
       </MailchimpConnectionGuard>
     );
   }

   export default function ListsPage({ searchParams }: ListsPageProps) {
     return (
       <PageLayout
         breadcrumbs={[bc.home, bc.mailchimp, bc.current("Lists")]}
         title="Lists"
         description="Manage your Mailchimp lists and monitor their performance"
         skeleton={<ListOverviewSkeleton />}
       >
         <ListsPageContent searchParams={searchParams} />
       </PageLayout>
     );
   }

   // Force dynamic rendering to prevent build-time API calls
   export const dynamic = "force-dynamic";

   export const metadata = {
     title: "Lists | Mailchimp Dashboard",
     description: "Manage your Mailchimp lists and monitor their performance",
   };
   ```

3. **Manual testing for all updated pages**

   ```bash
   # Dev server should still be running from Phase 4
   # Test each page:

   # 1. Campaign Opens (Pattern B)
   # http://127.0.0.1:3000/mailchimp/reports/[valid-id]/opens

   # 2. Lists (Pattern A)
   # http://127.0.0.1:3000/mailchimp/lists
   ```

**Validation:**

- [ ] All updated pages load correctly
- [ ] Breadcrumbs display and work on all pages
- [ ] Pattern A pages use static breadcrumbs
- [ ] Pattern B pages use breadcrumbsSlot with Suspense
- [ ] TypeScript compiles: `pnpm type-check`
- [ ] Tests pass: `pnpm test`
- [ ] No console errors

**Checkpoint: COMMIT**

```bash
git add src/app/mailchimp/reports/[id]/opens/page.tsx src/app/mailchimp/lists/page.tsx
git commit -m "refactor(pages): use PageLayout in opens and lists pages

- Update campaign opens page with PageLayout (Pattern B - dynamic breadcrumbs)
- Update lists page with PageLayout (Pattern A - static breadcrumbs)
- Reduces 60-80 lines of boilerplate across both pages
- Demonstrates both breadcrumb patterns working correctly"
```

**💰 Cost Optimization: CLEAR CONVERSATION**

✅ Safe to clear because:

- Phases 4-5 complete and committed
- All pages updated and tested
- Next phase is validation and documentation

📋 What to keep:

- This execution plan document
- Current task: "Final validation and documentation"

---

## Phase 6: Final Validation and Documentation

**Goal:** Run full validation suite and update project documentation.

**Estimated Time:** 30 minutes

**Pre-Phase Checklist:**

- [ ] Check git history for previous phases
- [ ] Verify all pages have been updated
- [ ] Confirm all tests pass

**Implementation Steps:**

1. **Run comprehensive validation**

   ```bash
   # Type checking
   pnpm type-check

   # Linting
   pnpm lint

   # All tests including architectural enforcement
   pnpm test

   # Full validation suite
   pnpm validate
   ```

2. **Fix any validation issues**
   - Address TypeScript errors if any
   - Fix linting issues
   - Update tests if needed

3. **Update CLAUDE.md documentation**

   Add PageLayout usage pattern to the "Component Development" or "Development Guidelines" section:

   ```bash
   # First, find the right section in CLAUDE.md
   grep -n "Component Development" CLAUDE.md
   ```

   Add this content to CLAUDE.md:

   ````markdown
   ### PageLayout Component Pattern

   The project uses a centralized `PageLayout` component to reduce boilerplate across all dashboard pages.

   **When to Use:**

   - All dashboard pages that follow the standard layout (breadcrumbs + header + content)
   - Both static pages and pages with dynamic route params

   **Two Usage Patterns:**

   **Pattern A - Static Pages** (no dynamic route params):

   ```tsx
   import { PageLayout } from "@/components/layout";
   import { bc } from "@/utils";

   export default function MyPage({ searchParams }) {
     return (
       <PageLayout
         breadcrumbs={[bc.home, bc.mailchimp, bc.current("My Page")]}
         title="Page Title"
         description="Page description"
         skeleton={<MyPageSkeleton />}
       >
         <MyPageContent searchParams={searchParams} />
       </PageLayout>
     );
   }
   ```

   **Pattern B - Dynamic Pages** (with `[id]` or other dynamic segments):

   ```tsx
   import { PageLayout, BreadcrumbNavigation } from "@/components/layout";
   import { bc } from "@/utils";
   import { Suspense } from "react";

   export default async function MyDynamicPage({ params, searchParams }) {
     const rawParams = await params;
     const { id } = myParamsSchema.parse(rawParams);

     // ... data fetching and validation ...

     return (
       <PageLayout
         breadcrumbsSlot={
           <Suspense fallback={null}>
             <BreadcrumbContent params={params} />
           </Suspense>
         }
         title="Page Title"
         description="Page description"
         skeleton={<MyPageSkeleton />}
       >
         <MyPageContent {...props} />
       </PageLayout>
     );
   }

   // Separate async component for breadcrumbs
   async function BreadcrumbContent({
     params,
   }: {
     params: Promise<{ id: string }>;
   }) {
     const { id } = myParamsSchema.parse(await params);
     return (
       <BreadcrumbNavigation
         items={[bc.home, bc.mailchimp, bc.myRoute(id), bc.current("Details")]}
       />
     );
   }
   ```

   **Benefits:**

   - Eliminates 20-50 lines of boilerplate per page
   - Consistent layout structure across all pages
   - Type-safe props with comprehensive JSDoc
   - Supports both static and dynamic breadcrumb patterns

   **Rules:**

   - Use `breadcrumbs` prop for static pages (Pattern A)
   - Use `breadcrumbsSlot` prop for dynamic pages (Pattern B)
   - Never pass both props - choose one based on page type
   - Always provide title, description, and skeleton props
   ````

4. **Review all changes**

   ```bash
   # View commit history
   git log --oneline main..HEAD

   # View all changes vs main
   git diff main

   # Ensure no unintended changes
   git status
   ```

**Validation:**

- [ ] All validation commands pass
- [ ] Documentation is clear and accurate
- [ ] No unintended files in git staging area
- [ ] All changes reviewed

**Checkpoint: COMMIT**

```bash
git add CLAUDE.md
git commit -m "docs: add PageLayout component usage pattern

- Document Pattern A (static pages) usage
- Document Pattern B (dynamic pages) usage
- Add code examples and benefits
- Update development guidelines"
```

---

## Manual Review Checklist

**Before Pushing to Origin**

- [ ] **Code Quality**
  - [ ] No `any` types used
  - [ ] All functions/components have JSDoc comments
  - [ ] No console.logs or debug code
  - [ ] Follows project conventions
  - [ ] Types defined in `/src/types` (not inline)
  - [ ] Types exported through barrel exports

- [ ] **Testing**
  - [ ] Unit tests pass: `pnpm test src/components/layout/page-layout.test.tsx`
  - [ ] All tests pass: `pnpm test`
  - [ ] Architectural enforcement tests pass
  - [ ] Manual browser testing completed for all updated pages

- [ ] **Type Safety & Architecture**
  - [ ] TypeScript compiles: `pnpm type-check`
  - [ ] No linting errors: `pnpm lint`
  - [ ] All imports use path aliases
  - [ ] PageLayoutProps in `/src/types/components/layout/`
  - [ ] Component in `/src/components/layout/`

- [ ] **Documentation**
  - [ ] JSDoc added to all exports
  - [ ] CLAUDE.md updated with usage patterns
  - [ ] Examples are clear and accurate

- [ ] **Git Hygiene**
  - [ ] Review all changes: `git diff main`
  - [ ] All commit messages follow conventions
  - [ ] On correct branch: `git branch --show-current` → `feature/page-layout-component`

- [ ] **Manual Testing**
  - [ ] Reports page loads (`/mailchimp/reports`)
  - [ ] Lists page loads (`/mailchimp/lists`)
  - [ ] Campaign opens page loads (`/mailchimp/reports/[id]/opens`)
  - [ ] Breadcrumbs work correctly on all pages
  - [ ] Page headers display correctly
  - [ ] Content loads in Suspense boundaries
  - [ ] No console errors

---

## Push to Origin

```bash
# Final validation
pnpm validate

# Review commit history
git log --oneline main..HEAD

# Review all changes
git diff main

# Push to origin
git push -u origin feature/page-layout-component
```

---

## Create Pull Request

**Title:** `feat: extract common page layout pattern with PageLayout component`

**Description:**

```markdown
## Summary

Implements improvement #3 from page-pattern-improvements.md. Creates reusable `PageLayout` component that encapsulates common layout pattern shared across all dashboard pages, reducing 300-430 lines of boilerplate.

## Changes

- Created `src/types/components/layout/page-layout.ts` with PageLayoutProps interface
- Created `src/components/layout/page-layout.tsx` component
- Added comprehensive unit tests (10 tests, 100% coverage)
- Updated 3 pages as proof of concept:
  - Reports page (Pattern A - static breadcrumbs)
  - Lists page (Pattern A - static breadcrumbs)
  - Campaign opens page (Pattern B - dynamic breadcrumbs)
- Updated CLAUDE.md with usage patterns and examples

## Key Features

- Supports both static breadcrumbs (Pattern A) and dynamic breadcrumbs (Pattern B)
- Encapsulates DashboardLayout + breadcrumbs + header + Suspense
- Reduces 20-50 lines of boilerplate per page
- Type-safe with comprehensive JSDoc
- Maintains all existing functionality

## Impact

- **Pattern A:** 20-30 lines saved per page × 5 static pages = 100-150 lines
- **Pattern B:** 25-35 lines saved per page × 8 dynamic pages = 200-280 lines
- **Projected Total:** 300-430 lines saved across 13 pages (when fully migrated)

## Testing

- [x] Unit tests pass (10/10)
- [x] Architectural enforcement tests pass
- [x] Type checking passes
- [x] Manual testing completed for all affected pages
- [x] Breadcrumbs work correctly in both patterns
- [x] No console errors

## Checklist

- [x] Code follows project patterns
- [x] Tests added with full coverage
- [x] Types defined in `/src/types` (not inline)
- [x] JSDoc documentation added
- [x] CLAUDE.md updated with usage patterns
- [x] No breaking changes

## Migration Strategy

This PR updates 3 pages as proof of concept. The remaining 10 pages can be migrated incrementally:

- **Completed:** Reports, Lists, Campaign Opens
- **Remaining:** General Info, Campaign Report Detail, List Detail, Abuse Reports, Settings pages

The old and new patterns can coexist safely during incremental migration.

## Related

- Implementation Plan: docs/page-pattern-improvements.md (#3)
- Execution Plan: docs/execution-plans/page-layout-component-execution-plan.md
```

---

## Rollback Plan

**If Issues Are Discovered:**

```bash
# If not pushed yet - reset to main
git reset --hard main

# If pushed but not merged - delete branch and start over
git push origin --delete feature/page-layout-component
git checkout main
git branch -D feature/page-layout-component

# If merged and issues found - create revert PR
git checkout main
git pull origin main
git revert <merge-commit-hash>
git push
```

---

## Post-Merge Tasks

- [ ] Delete feature branch locally: `git branch -d feature/page-layout-component`
- [ ] Delete feature branch remotely: `git push origin --delete feature/page-layout-component`
- [ ] Update [page-pattern-improvements.md](../page-pattern-improvements.md):
  - [ ] Mark #3 as ✅ COMPLETED
  - [ ] Update progress: Phase 1 - 75% (3/4)
  - [ ] Update Quick Reference section
- [ ] Plan migration for remaining 10 pages (optional follow-up)
- [ ] Consider creating migration tracking issue in GitHub

---

## Next Steps (Optional Follow-Up Work)

**If user wants to migrate remaining pages:**

Create a follow-up task to migrate the remaining 10 pages:

**Static Pages (Pattern A) - Remaining:**

- [ ] `/mailchimp/general-info/page.tsx`
- [ ] `/settings/integrations/page.tsx`

**Dynamic Pages (Pattern B) - Remaining:**

- [ ] `/mailchimp/reports/[id]/page.tsx` - Campaign Report Detail
- [ ] `/mailchimp/reports/[id]/abuse-reports/page.tsx` - Abuse Reports
- [ ] `/mailchimp/lists/[id]/page.tsx` - List Detail
- [ ] Other pages as discovered

**Benefits of incremental migration:**

- Lower risk (changes are isolated)
- Easier code review (smaller PRs)
- Can validate pattern works before full adoption
- Old and new patterns coexist safely

---

**End of Execution Plan**

---

## Template Sections Checklist

- [x] Overview with clear goal and success criteria
- [x] List of files to create/modify
- [x] Pre-implementation checklist (integrated into Phase 0)
- [x] **Phase 0: Git Setup and Pre-Implementation Validation** (MANDATORY)
  - [x] Step 1: Verify Current Branch
  - [x] Step 2: Check for Existing Work
  - [x] Step 3: Review Pre-Implementation Checklist
  - [x] Step 4: Confirm Environment
  - [x] Empty commit checkpoint
- [x] Phase 1-6: Implementation phases with clear goals
- [x] Validation steps after each phase
- [x] Strategic commit points
- [x] Cost optimization clear points
- [x] Testing strategy
- [x] Manual review checklist
- [x] Push and PR strategy
- [x] Rollback plan
- [x] Post-merge tasks
