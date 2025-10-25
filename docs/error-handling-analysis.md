# Mailchimp Error Handling Patterns Analysis

## Executive Summary

This analysis covers error handling across all 20 Mailchimp pages in the application. The codebase shows **significant inconsistencies** in error handling approaches, with two fundamentally different patterns being used that create confusion and potential bugs.

**Key Finding:** There are **TWO conflicting error handling approaches** in use:

1. **Pattern A (Preferred)**: Uses `handleApiError()` to trigger 404 pages + guard component for connection errors
2. **Pattern B (Legacy)**: Uses `notFound()` directly with conditional logic
3. **Pattern C (Inconsistent)**: Mixes `handleApiError()` return value with inline error display

---

## Part 1: Pages Using handleApiError() (Preferred Pattern)

### Pattern A: handleApiError() + MailchimpConnectionGuard

**Approach:** Call `handleApiError()` which auto-triggers `notFound()` for 404s, then pass `errorCode` to guard component for connection errors.

**Pages Using This Pattern (11 pages):**

1. **Reports Detail** - `/mailchimp/reports/[id]/page.tsx` (lines 66-69)
   - Calls `handleApiError()` to handle 404s
   - Passes `errorCode` to guard component
   - Uses guard for connection errors
2. **List Detail** - `/mailchimp/lists/[id]/page.tsx` (lines 84-88)
   - Clear separation: `handleApiError()` for 404s, guard for connection
   - Well-documented comments
3. **Abuse Reports** - `/mailchimp/reports/[id]/abuse-reports/page.tsx` (lines 62-71)
   - Validates parent campaign with `handleApiError()`
   - Then fetches abuse reports with same pattern
   - Inline error display with `DashboardInlineError` when `abuseReportsData` is null
4. **Campaign Opens** - `/mailchimp/reports/[id]/opens/page.tsx` (lines 71-89)
   - Validates parent campaign first
   - Validates page params with redirect
   - Inline error display
5. **Campaign Clicks** - `/mailchimp/reports/[id]/clicks/page.tsx` (lines 41-59)
   - Validates campaign with `handleApiError()`
   - Validates page params
   - **NOTE:** Does NOT use MailchimpConnectionGuard - passes errorCode to content component
6. **Email Activity** - `/mailchimp/reports/[id]/email-activity/page.tsx` (lines 72-90)
   - Validates campaign
   - Validates page params
   - Uses inline error display
7. **Unsubscribes** - `/mailchimp/reports/[id]/unsubscribes/page.tsx` (lines 61-68)
   - Validates campaign with `handleApiError()`
   - No page params validation
   - Uses inline error display
8. **Locations** - `/mailchimp/reports/[id]/locations/page.tsx` (lines 72-90)
   - Validates campaign with `handleApiError()`
   - Validates page params
   - Uses inline error display
9. **Sent To** - `/mailchimp/reports/[id]/sent-to/page.tsx` (lines 71-89)
   - Validates campaign with `handleApiError()`
   - Validates page params
   - Uses inline error display
10. **List Members** - `/mailchimp/lists/[id]/members/page.tsx` (lines 46-67)
    - **INCONSISTENT:** Uses `const error = handleApiError(response)` but returns custom layout with error display
    - Not using guard component for displayed errors
    - Still uses guard in success case
    - Lines 50-66: Returns early with `DashboardInlineError` if error
11. **Member Profile** - `/mailchimp/lists/[id]/members/[subscriber_hash]/page.tsx` (lines 33-54)
    - Same as List Members - checks error from `handleApiError()` and returns early
    - Uses guard for connection errors in both success and error paths
    - Consistent with List Members pattern but not with other pages

---

## Part 2: Pages Using notFound() Directly (Legacy Pattern)

### Pattern B: Direct notFound() with Error Checking

**Approach:** Manually check error and call `notFound()` without using `handleApiError()`.

**Pages Using This Pattern (5 pages):**

1. **Advice** - `/mailchimp/reports/[id]/advice/page.tsx` (lines 63-72)

   ```tsx
   const response = await mailchimpDAL.fetchCampaignAdvice(campaignId);
   const error = handleApiError(response);

   if (error || !response.data) {
     notFound(); // Manually calls notFound()
   }
   ```

   **Issue:** Calls `handleApiError()` AND `notFound()` - redundant since `handleApiError()` already calls `notFound()`

2. **Domain Performance** - `/mailchimp/reports/[id]/domain-performance/page.tsx` (lines 63-72)
   - Same pattern as Advice - redundant double-checking
3. **List Activity** - `/mailchimp/lists/[id]/activity/page.tsx` (lines 49-55)
   - Manual check: `if (error || !response.data) { notFound() }`
   - Does NOT use guard component at all
   - Does NOT render any error UI
4. **List Growth History** - `/mailchimp/lists/[id]/growth-history/page.tsx` (lines 49-55)
   - Same as List Activity
5. **List Segments** - `/mailchimp/lists/[id]/segments/page.tsx` (lines 87-103)
   - **Different approach:** Does NOT use `notFound()`
   - Uses inline error display: `<div className="text-center text-red-600">{error}</div>`
   - Does NOT use guard component
   - Uses `response.success` check instead of `handleApiError()`

---

## Part 3: List-Only Pages (List, Reports - top level)

### Top-Level Pages (2 pages):

1. **Reports List** - `/mailchimp/reports/page.tsx`
   - Uses guard component
   - No `handleApiError()` call
   - Handles pagination with validation
2. **Lists Page** - `/mailchimp/lists/page.tsx`
   - Uses guard component
   - No `handleApiError()` call
   - Handles pagination with validation

3. **General Info** - `/mailchimp/general-info/page.tsx`
   - Uses guard component
   - No specific error handling
   - Connection errors only

4. **Mailchimp Main** - `/mailchimp/page.tsx`
   - Uses guard component
   - Health check instead of full data fetch
   - Handles OAuth params

---

## Part 4: Error Boundary Files (error.tsx)

### Error Boundary Locations (5 files):

1. **Root Mailchimp Error** - `/mailchimp/error.tsx`
   - Catches ALL errors in mailchimp segment
   - Uses custom error message detection
   - Offers retry + link to settings
2. **Reports [id] Error** - `/mailchimp/reports/[id]/error.tsx`
   - Catches errors in campaign detail and all nested pages
   - Generic error UI
3. **Reports [id]/Opens Error** - `/mailchimp/reports/[id]/opens/error.tsx`
   - **OVERRIDE:** Specific error boundary for opens page
   - Different UI than parent
   - Links back to campaigns (broken link?)
4. **Reports Error** - `/mailchimp/reports/error.tsx`
   - Catches errors in reports list
   - Generic error UI
5. **Member Profile Error** - `/mailchimp/lists/[id]/members/[subscriber_hash]/error.tsx`
   - **OVERRIDE:** Specific error boundary
   - More detailed error handling
   - Shows error details in dev mode

---

## Part 5: 404 Handling (not-found.tsx)

### Not-Found Pages (15 files):

**All detail pages have corresponding not-found.tsx files:**

- Reports: [id], [id]/opens, [id]/clicks, [id]/email-activity, [id]/unsubscribes, [id]/advice, [id]/domain-performance, [id]/locations, [id]/sent-to
- Lists: [id], [id]/members, [id]/members/[subscriber_hash], [id]/activity, [id]/growth-history, [id]/segments

These are likely generated files from the page generator and all trigger 404 responses.

---

## Analysis: Inconsistencies Identified

### CRITICAL ISSUES

#### 1. Redundant Error Handling (Advice + Domain Performance)

**Pages:** advice, domain-performance
**Problem:**

```tsx
const response = await mailchimpDAL.fetchCampaignAdvice(campaignId);
const error = handleApiError(response); // Already calls notFound() for 404s

if (error || !response.data) {
  notFound(); // Redundant - handleApiError() already called it
}
```

**Impact:** If a 404 occurs, `notFound()` is called twice (once inside `handleApiError()`, once explicitly). While not breaking, it's inefficient and suggests misunderstanding of the API.

#### 2. MailchimpConnectionGuard Misuse (List Members + Member Profile)

**Pages:** lists/[id]/members, lists/[id]/members/[subscriber_hash]
**Problem:**

```tsx
const response = await mailchimpDAL.fetchListMembers(id, apiParams);
const error = handleApiError(response);
if (error) {
  return (
    <PageLayout>
      <MailchimpConnectionGuard errorCode={response.errorCode}>
        <DashboardInlineError error={error} />
      </MailchimpConnectionGuard>
    </PageLayout>
  );
}
```

**Issues:**

1. `handleApiError()` already triggers `notFound()` for 404s, but we're checking `if (error)` afterward - contradictory logic
2. Guard component expects `errorCode` (from DAL layer validation like "not connected"), but we're displaying generic API errors inside it
3. Mixing two error types: connection errors (guard) + API errors (inline display)
4. Success case ALSO uses guard with `response.errorCode`, so connection errors show in both paths

**Better Pattern:** Should be either:

- Option A: Let `handleApiError()` handle 404s, use guard for connection errors only
- Option B: Don't use guard, just show inline error

#### 3. Missing Guard Component (List Activity + List Growth History)

**Pages:** lists/[id]/activity, lists/[id]/growth-history
**Problem:**

```tsx
const response = await mailchimpDAL.fetchListActivity(listId, apiParams);
const error = handleApiError(response);
if (error || !response.data) {
  notFound();
}
// ... render content
```

**Issues:**

1. No `MailchimpConnectionGuard` wrapping content
2. If DAL returns connection error (errorCode), it will fail with "notFound()" instead of showing connection message
3. Connection errors should show "connect your Mailchimp account" message, not 404
4. Inconsistent with other list detail pages

#### 4. No Error Handling (List Segments)

**Pages:** lists/[id]/segments
**Problem:**

```tsx
const response = await mailchimpDAL.fetchListSegments(listId, {...});
const error = handleApiError(response);
if (error) {
  return (
    <PageLayout>
      <div className="text-center text-red-600">{error}</div>
    </PageLayout>
  );
}
```

**Issues:**

1. Uses custom error display instead of `DashboardInlineError` (inconsistent component usage)
2. Doesn't use `MailchimpConnectionGuard` - connection errors won't show appropriate message
3. Only shows error in red text - no retry button or helpful guidance
4. Inconsistent styling and UX vs other pages

#### 5. Missing Guard Component in Breadcrumbs (Several Pages)

**Pages:** Advice, Domain Performance, List Activity, List Growth History
**Problem:** Breadcrumb content components call DAL methods but don't pass errorCode to any component. If breadcrumb fetch fails due to connection error, nothing warns the user.

**Example from Advice (lines 32-61):**

```tsx
async function BreadcrumbContent({ campaignId }: { campaignId: string }) {
  const response = await mailchimpDAL.fetchCampaignReport(campaignId);
  const error = handleApiError(response);

  if (error) {
    return (
      <BreadcrumbNavigation items={[...]} />  // Shows breadcrumbs even on error
    );
  }
  // ...
}
```

#### 6. Error Boundary Inconsistency (Opens vs Default)

**Problem:** `opens/error.tsx` has a completely different UI than `/reports/[id]/error.tsx`

- Parent error boundary: Card with AlertCircle + generic message
- Opens error boundary: Full screen card with different styling + link back to campaigns

**Impact:** Users see different error UIs depending on which page errored. Confusing.

#### 7. Inconsistent Error Component Usage

**Pages using error display:**

- `DashboardInlineError` - abuse-reports, opens, email-activity, unsubscribes, locations, sent-to, list-members, member-profile
- Custom `<div className="text-center text-red-600">` - list-segments
- MailchimpConnectionGuard with inline display - list-members (mixed)

**Issue:** No consistency. Some use proper component with icon, some use raw div.

#### 8. No Errors Shown in Success Pages (Reports List, Lists Page)

**Pages:** reports/page.tsx, lists/page.tsx
**Problem:**

- These pages fetch data but don't call `handleApiError()`
- No inline error display if API fails
- Only guard component, which shows "not connected" message
- If API fails for OTHER reasons (rate limit, server error), user sees blank page

---

## Part 6: 404 vs Connection Error Distinction

### How Pages SHOULD Handle Errors

| Error Type                                       | Trigger                                   | Should Use                 | Behavior                          |
| ------------------------------------------------ | ----------------------------------------- | -------------------------- | --------------------------------- |
| 404 (resource not found)                         | `statusCode === 404`                      | `notFound()`               | Renders not-found.tsx             |
| 400 (bad request indicating missing resource)    | Specific error messages                   | `notFound()`               | Renders not-found.tsx             |
| Connection Error                                 | `errorCode === 'MAILCHIMP_NOT_CONNECTED'` | `MailchimpConnectionGuard` | Shows "connect account" message   |
| Token Expired                                    | `errorCode === 'MAILCHIMP_TOKEN_EXPIRED'` | `MailchimpConnectionGuard` | Shows "reconnect account" message |
| Other API Error (rate limit, server error, etc.) | `response.error`                          | Inline display             | Shows message to user             |

### Current Confusion

**Pages not distinguishing these:**

- List Activity: Treats all errors as 404
- List Growth History: Treats all errors as 404
- List Segments: Treats all errors as generic errors (no 404)

**Correct Pattern Example:** Campaign Report Detail (lines 65-88)

```tsx
// 1. Validate params (route validation)
const { validatedParams } = await processRouteParams({...});

// 2. Fetch data
const response = await mailchimpDAL.fetchCampaignReport(validatedParams.id);

// 3. Handle 404s automatically
handleApiError(response);  // Calls notFound() for 404s

// 4. Pass to page content (errorCode is for connection errors)
<CampaignReportPageContent
  report={response.success ? (response.data as CampaignReport) : null}
  activeTab={activeTab}
  errorCode={response.errorCode}  // For MailchimpConnectionGuard
/>
```

---

## Part 7: Summary of Each Page

| Page                | Route                                           | Pattern            | 404 Handling         | Connection Guard | Error Display        | Status                   |
| ------------------- | ----------------------------------------------- | ------------------ | -------------------- | ---------------- | -------------------- | ------------------------ |
| General Info        | /mailchimp/general-info                         | Pure Guard         | No                   | Yes              | No                   | OK                       |
| Reports List        | /mailchimp/reports                              | Pure Guard         | No                   | Yes              | No                   | ⚠️ Missing error display |
| Lists List          | /mailchimp/lists                                | Pure Guard         | No                   | Yes              | No                   | ⚠️ Missing error display |
| Reports Detail      | /mailchimp/reports/[id]                         | A + Guard          | Yes (handleApiError) | Yes              | Via guard            | OK                       |
| List Detail         | /mailchimp/lists/[id]                           | A + Guard          | Yes (handleApiError) | Yes              | Via guard            | OK                       |
| Abuse Reports       | /mailchimp/reports/[id]/abuse-reports           | A + Inline         | Yes (handleApiError) | Yes              | DashboardInlineError | OK                       |
| Opens               | /mailchimp/reports/[id]/opens                   | A + Inline         | Yes (handleApiError) | Yes              | DashboardInlineError | OK                       |
| Clicks              | /mailchimp/reports/[id]/clicks                  | A + Inline         | Yes (handleApiError) | No               | Via errorCode only   | ⚠️ No guard visual       |
| Email Activity      | /mailchimp/reports/[id]/email-activity          | A + Inline         | Yes (handleApiError) | Yes              | DashboardInlineError | OK                       |
| Unsubscribes        | /mailchimp/reports/[id]/unsubscribes            | A + Inline         | Yes (handleApiError) | Yes              | DashboardInlineError | OK                       |
| Locations           | /mailchimp/reports/[id]/locations               | A + Inline         | Yes (handleApiError) | Yes              | DashboardInlineError | OK                       |
| Sent To             | /mailchimp/reports/[id]/sent-to                 | A + Inline         | Yes (handleApiError) | Yes              | DashboardInlineError | OK                       |
| Advice              | /mailchimp/reports/[id]/advice                  | B (Redundant)      | Yes (double)         | No               | No                   | ⚠️ Redundant, no guard   |
| Domain Performance  | /mailchimp/reports/[id]/domain-performance      | B (Redundant)      | Yes (double)         | No               | No                   | ⚠️ Redundant, no guard   |
| List Members        | /mailchimp/lists/[id]/members                   | A + Inline (Mixed) | Yes (handleApiError) | Yes              | DashboardInlineError | ⚠️ Confusing mix         |
| Member Profile      | /mailchimp/lists/[id]/members/[subscriber_hash] | A + Inline (Mixed) | Yes (handleApiError) | Yes              | DashboardInlineError | ⚠️ Confusing mix         |
| List Activity       | /mailchimp/lists/[id]/activity                  | B (No guard)       | Yes (notFound)       | No               | No                   | ✗ Missing guard          |
| List Growth History | /mailchimp/lists/[id]/growth-history            | B (No guard)       | Yes (notFound)       | No               | No                   | ✗ Missing guard          |
| List Segments       | /mailchimp/lists/[id]/segments                  | C (Custom)         | No                   | No               | Custom div           | ✗ No 404 handling        |

---

## Key Recommendations

### Priority 1: Fix Broken Patterns

1. **List Activity** - Add MailchimpConnectionGuard
2. **List Growth History** - Add MailchimpConnectionGuard
3. **List Segments** - Add `handleApiError()` to trigger `notFound()` for 404s
4. **Advice** - Remove redundant `notFound()` call (handleApiError does it)
5. **Domain Performance** - Remove redundant `notFound()` call

### Priority 2: Standardize Error Display

1. Use `DashboardInlineError` consistently instead of custom divs
2. All pages with inline errors should use it

### Priority 3: Error Boundary Consistency

1. Consider using single error boundary for all reports/[id]/\* pages
2. Remove opens/error.tsx override if not necessary

### Priority 4: Missing Error Display

1. Add error display to Reports List page (reports/page.tsx)
2. Add error display to Lists List page (lists/page.tsx)
3. Currently silently fail if API errors

---

## Code Pattern Reference

### CORRECT Pattern (Campaign Opens):

```tsx
// 1. Validate route params
const { id: campaignId } = reportOpensPageParamsSchema.parse(rawRouteParams);

// 2. Validate parent resource exists
const campaignResponse = await mailchimpDAL.fetchCampaignReport(campaignId);
handleApiError(campaignResponse);  // Triggers notFound() for 404s

// 3. Validate page params
const { apiParams, currentPage, pageSize } = await validatePageParams({...});

// 4. Fetch data
const response = await mailchimpDAL.fetchCampaignOpenList(campaignId, apiParams);

// 5. Handle errors (404s already handled above)
handleApiError(response);

// 6. Extract data
const opensData = response.success ? (response.data as ReportOpenListSuccess) : null;

// 7. Render with guard
<MailchimpConnectionGuard errorCode={response.errorCode}>
  {opensData ? (
    <CampaignOpensTable {...} />
  ) : (
    <DashboardInlineError error="Failed to load campaign opens" />
  )}
</MailchimpConnectionGuard>
```

### WRONG Pattern (Advice):

```tsx
// Multiple issues:
const response = await mailchimpDAL.fetchCampaignAdvice(campaignId);
const error = handleApiError(response); // Already calls notFound()

if (error || !response.data) {
  notFound(); // Redundant!
}

// Also: No MailchimpConnectionGuard for connection errors
```

### WRONG Pattern (List Activity):

```tsx
// Missing guard!
const response = await mailchimpDAL.fetchListActivity(listId, apiParams);
const error = handleApiError(response);
if (error || !response.data) {
  notFound();  // Treats connection error as 404
}

// Should have:
<MailchimpConnectionGuard errorCode={response.errorCode}>
  <ListActivityContent {...} />
</MailchimpConnectionGuard>
```
