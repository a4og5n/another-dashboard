# AI Workflow Learnings & Best Practices

This document captures key learnings from implementing Mailchimp dashboard features using the AI-first workflow.

## Table of Contents

- [Component Architecture](#component-architecture)
- [Table Implementation Patterns](#table-implementation-patterns)
- [Navigation & UX Patterns](#navigation--ux-patterns)
- [Number & Data Formatting](#number--data-formatting)
- [Pre-commit Hook Setup](#pre-commit-hook-setup)
- [Commit Strategy](#commit-strategy)

---

## Component Architecture

### Default to Server Components ⭐⭐⭐

**Learning:** Server components should be the default choice for all pages and components unless interactive features are required.

**Pattern:**

```typescript
// ✅ Good: Server Component (default)
export function CampaignEmailActivityTable({
  emailActivityData,
  currentPage,
  pageSize,
  baseUrl,
}: Props) {
  // URL-based pagination
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("perPage", pageSize.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <Card>
      {/* ... */}
      <Pagination createPageUrl={createPageUrl} {...paginationProps} />
    </Card>
  );
}
```

```typescript
// ❌ Avoid: Client Component (unless necessary)
"use client";

export function CampaignEmailActivityTable() {
  const { createPageUrl } = useTablePagination({ baseUrl, pageSize });
  // Client-side JavaScript increases bundle size
}
```

**When to use Client Components:**

- ✅ Interactive features: `useState`, `useEffect`, browser APIs
- ✅ TanStack Table with sorting/filtering
- ✅ Real-time data updates
- ❌ Simple pagination (use URL params instead)
- ❌ Display-only content

**Benefits of Server Components:**

- Smaller client bundle
- Better performance (no hydration cost)
- SEO-friendly (fully rendered HTML)
- Simpler code (no hooks for URL generation)

---

## Table Implementation Patterns

### Choosing the Right Table Component

**Decision Tree:**

```
Do you need client-side sorting/filtering?
├─ YES → Use TanStack Table + Client Component
│         Example: Complex data grids with user interaction
│
└─ NO → Use shadcn/ui Table + Server Component
          Example: Simple lists, paginated data
```

### Pattern 1: Simple Table (Recommended Default)

**Use for:** Lists, paginated data, read-only displays

```typescript
// Server Component
export function CampaignUnsubscribesTable({
  data,
  currentPage,
  pageSize,
  baseUrl,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Unsubscribes ({data.total_items.toLocaleString()})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email Address</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.members.map((member) => (
              <TableRow key={member.email_id}>
                <TableCell>{member.email_address}</TableCell>
                <TableCell>{formatDate(member.timestamp)}</TableCell>
                <TableCell>{member.reason || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* URL-based pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(data.total_items / pageSize)}
          createPageUrl={(page) => `${baseUrl}?page=${page}&perPage=${pageSize}`}
        />
      </CardContent>
    </Card>
  );
}
```

**Key characteristics:**

- ✅ Server Component (no `"use client"`)
- ✅ shadcn/ui `Table` component
- ✅ URL-based pagination with `createPageUrl`
- ✅ No hooks needed

### Pattern 2: Interactive Table with TanStack

**Use for:** Sortable columns, filterable data, complex interactions

```typescript
"use client";

import { useReactTable, getCoreRowModel } from "@tanstack/react-table";

export function CampaignOpensTable({ data, currentPage, pageSize }: Props) {
  const columns = useMemo<ColumnDef<ReportOpenListMember>[]>(() => [
    {
      accessorKey: "email_address",
      header: "Email Address",
      // ... column config
    },
  ], []);

  const table = useReactTable({
    data: data.members,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        {/* ... */}
      </Table>
    </Card>
  );
}
```

**When TanStack is overkill:**

If you're only using TanStack for:

- ❌ Column definitions (use plain JSX instead)
- ❌ Row rendering (map over data directly)
- ❌ Pagination (use URL params instead)

Then **use Pattern 1** (simple table) instead.

### ⚠️ Known Issue: TanStack Table Overuse

**Problem:** Several existing tables use TanStack Table but don't actually need it.

**Examples:**

- `CampaignOpensTable` - No sorting/filtering, only pagination
- `CampaignAbuseReportsTable` - No sorting/filtering, only pagination
- `ClickDetailsContent` - No sorting/filtering, only pagination

**Action:** See Issue #214 for refactoring these to server components.

---

## Navigation & UX Patterns

### Adding Navigation Links to Feature Pages

**Learning:** Think about semantic relationships when deciding where to add navigation.

**Example from Email Activity:**

```
Email Activity = opens + clicks + bounces from sent emails

Question: Where should we link to the Email Activity page?
Options:
  A) Opens Card (shows open metrics)
  B) List Health Card (shows unsubscribes/abuse)
  C) Emails Sent Card (shows total sent)

Answer: C) Emails Sent Card
Reason: Email Activity tracks activity FROM the sent emails
```

**Pattern for analyzing navigation placement:**

1. **Identify the data relationship**
   - What is the parent entity?
   - What is the child entity?

2. **Find the semantic match**
   - Email Activity tracks activity from sent emails → Emails Sent card
   - Unsubscribes are list health issues → List Health card
   - Opens are engagement metrics → Opens card

3. **Implement the link**

   ```typescript
   <Card>
     <CardHeader>
       <CardTitle>Emails Sent</CardTitle>
     </CardHeader>
     <CardContent>
       <div className="text-2xl font-bold">{emailsSent.toLocaleString()}</div>

       {/* Add navigation link */}
       <div className="pt-4 mt-2 border-t">
         <Link href={`/mailchimp/reports/${campaignId}/email-activity`}>
           <Button variant="outline" size="sm" className="w-full">
             <Activity className="h-3 w-3 mr-2" />
             View Email Activity
           </Button>
         </Link>
       </div>
     </CardContent>
   </Card>
   ```

### Navigation Link Patterns

**Button placement in cards:**

```typescript
// ✅ Pattern 1: Footer button (recommended)
<Card>
  <CardHeader>...</CardHeader>
  <CardContent>
    {/* Main content */}

    {/* Navigation at bottom, separated by border */}
    <div className="pt-4 mt-2 border-t">
      <Link href={linkUrl}>
        <Button variant="outline" className="w-full" size="sm">
          <Icon className="h-3 w-3 mr-2" />
          View Details
        </Button>
      </Link>
    </div>
  </CardContent>
</Card>
```

```typescript
// ✅ Pattern 2: Multiple related links
<Card>
  <CardContent>
    {/* Clickable rows */}
    <Link href={unsubscribesUrl} className="flex items-center justify-between hover:underline">
      <span>Unsubscribes</span>
      <span>{count}</span>
    </Link>

    <Link href={abuseReportsUrl} className="flex items-center justify-between hover:underline">
      <span>Abuse Reports</span>
      <span>{count}</span>
    </Link>
  </CardContent>
</Card>
```

### Table Column Design: Summary vs Detail Views

**Learning:** Summary tables should be scannable, not verbose. Details belong on drill-down pages.

**❌ Before: Verbose summary table**

```typescript
<TableRow>
  <TableCell>{email}</TableCell>
  <TableCell>
    {/* Too much detail for summary view */}
    <div className="space-y-2">
      <Badge>Open: 3 times</Badge>
      <Badge>Click: 2 times</Badge>
      <Badge>Bounce: 0 times</Badge>
      <div className="text-xs">Last: 2024-10-22 15:30:45</div>
    </div>
  </TableCell>
  <TableCell>{totalEvents}</TableCell>
</TableRow>
```

**✅ After: Clean summary with drill-down link**

```typescript
<TableRow>
  <TableCell>
    <Link href={`/reports/${id}/email-activity/${emailId}`} className="hover:underline">
      {email}
    </Link>
    {/* Compact icon summary */}
    <div className="flex gap-2 text-xs text-muted-foreground">
      {opens > 0 && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {opens}</span>}
      {clicks > 0 && <span className="flex items-center gap-1"><MousePointer className="h-3 w-3" /> {clicks}</span>}
      {bounces > 0 && <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {bounces}</span>}
    </div>
  </TableCell>
  <TableCell>{totalEvents}</TableCell>
</TableRow>
```

**Guidelines:**

- **Summary tables:** Show key info + action counts, link to details
- **Detail pages:** Show full timestamps, complete event history, filters
- **Icons over badges:** More compact, better for multiple items
- **Hover states:** Indicate interactivity without being intrusive

---

## Number & Data Formatting

### Number Formatting Pattern

**Always format numbers with thousand separators for display:**

```typescript
// ✅ Good: Readable numbers
<CardTitle>Email Activity ({total_items.toLocaleString()})</CardTitle>
// Output: "Email Activity (7,816)"

<div className="text-2xl font-bold">{emailsSent.toLocaleString()}</div>
// Output: "12,543"
```

```typescript
// ❌ Bad: Hard to read large numbers
<CardTitle>Email Activity ({total_items})</CardTitle>
// Output: "Email Activity (7816)"
```

### Formatting Utilities Reference

```typescript
// Numbers
total_items
  .toLocaleString()(
    // "7,816"
    percentage * 100,
  )
  .toFixed(1); // "42.5"
formatPercentageValue(rate); // "3.2%"

// Dates
formatDateShort(date); // "Oct 22, 2024"
formatDateTime(date); // "Oct 22, 2024 3:45 PM"
formatDateTimeSafe(date); // Safe version with fallback
formatDistanceToNow(date); // "2 hours ago"

// Currency
amount.toLocaleString("en-US", {
  style: "currency",
  currency: "USD",
}); // "$1,234.56"
```

### Data Display Priorities

**Order of importance in UI:**

1. **Primary metric:** Large, bold (2xl font)
2. **Supporting metrics:** Medium size (base/sm font)
3. **Context/meta:** Small, muted (xs font, text-muted-foreground)

```typescript
<Card>
  <CardContent>
    {/* 1. Primary metric */}
    <div className="text-2xl font-bold">{total.toLocaleString()}</div>

    {/* 2. Supporting metrics */}
    <div className="grid grid-cols-3 gap-4 mt-4">
      <div>
        <div className="text-sm font-medium">{opens}</div>
        <div className="text-xs text-muted-foreground">Opens</div>
      </div>
      {/* ... */}
    </div>

    {/* 3. Context */}
    <div className="text-xs text-muted-foreground mt-2">
      Last updated {formatDistanceToNow(lastUpdate)}
    </div>
  </CardContent>
</Card>
```

---

## Pre-commit Hook Setup

### Ensuring Hooks Work Locally

**Problem:** Hooks exist but don't run because Git isn't configured to use them.

**Solution:**

1. **Configure Git to use .husky directory:**

   ```bash
   git config core.hooksPath .husky
   ```

2. **Add prepare script to package.json:**

   ```json
   {
     "scripts": {
       "prepare": "husky"
     }
   }
   ```

3. **Verify hooks are active:**

   ```bash
   # Check hooks path
   git config --get core.hooksPath
   # Should output: .husky

   # Test a commit (should run validation)
   git commit -m "test" --allow-empty
   # Should see: 🔍 Running pre-commit validation...
   ```

### Pre-commit Hook Contents

**Current `.husky/pre-commit` runs:**

```bash
echo "🔍 Running pre-commit validation..."
echo "📝 Formatting and linting staged files..."
pnpm lint-staged  # Formats staged files
echo "✅ Verifying code formatting..."
pnpm format:check  # Catches formatting issues
echo "🧪 Running full validation suite..."
pnpm check:no-secrets-logged && pnpm type-check && pnpm test && pnpm test:a11y
```

**What this catches:**

- ✅ Prettier formatting issues
- ✅ ESLint errors
- ✅ TypeScript type errors
- ✅ Test failures
- ✅ Accessibility violations
- ✅ Accidentally logged secrets

### Troubleshooting Pre-commit Hooks

**Hooks not running?**

```bash
# 1. Check hooks path
git config --get core.hooksPath
# Expected: .husky
# If empty or wrong: git config core.hooksPath .husky

# 2. Check hook is executable
ls -la .husky/pre-commit
# Should start with: -rwxr-xr-x
# If not: chmod +x .husky/pre-commit

# 3. Test hook manually
.husky/pre-commit
# Should run all validation steps

# 4. Reinstall Husky
pnpm install
# Runs "prepare" script which sets up hooks
```

**Bypassing hooks (when necessary):**

```bash
# Skip pre-commit hooks (use sparingly!)
git commit --no-verify -m "message"

# Note: CI/CD will still catch issues
```

### First-Time Setup for New Developers

**Add to README.md or CONTRIBUTING.md:**

```markdown
## Setup

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Configure Git hooks: `git config core.hooksPath .husky`
4. Test hooks work: `git commit --allow-empty -m "test"`

You should see pre-commit validation run. If not, see troubleshooting in docs/.
```

---

## Commit Strategy

### When to Make Multiple Commits

**✅ Good: Logical, reviewable commits**

```bash
git commit -m "feat: add pagination to email activity page"
git commit -m "refactor: convert email activity table to server component"
git commit -m "feat: add email activity link to emails sent card"
git commit -m "style: fix prettier formatting"
git commit -m "chore: configure Husky pre-commit hooks"
```

**Benefits:**

- Clear history of what changed when
- Easy to revert specific changes
- Better for code review (reviewers can see evolution)
- Valuable for debugging (git bisect)

**❌ Avoid: Squashing everything**

```bash
git commit -m "feat: campaign email activity"
# Loses context of refactoring, formatting fixes, config changes
```

### Commit Message Patterns

**Use conventional commits:**

```
feat: Add new feature
fix: Bug fix
refactor: Code restructuring (no behavior change)
style: Formatting, missing semicolons, etc.
chore: Tooling, dependencies, config
docs: Documentation only
test: Adding or fixing tests
perf: Performance improvement
```

**Good commit messages:**

```bash
# ✅ Specific and clear
feat: add pagination to Campaign Email Activity page
refactor: convert email activity table to server component
feat: add Email Activity link to Emails Sent card

# ❌ Too vague
feat: updates
fix: stuff
chore: changes
```

### PR Description Template

**Improved template based on learnings:**

```markdown
## Summary

[1-2 sentence overview]

## Features

### Page Implementation

- ✅ Route
- ✅ Component
- ✅ Error handling
- ✅ Metadata

### Table/Display Component

- ✅ [Component type: Server/Client]
- ✅ [Pagination strategy: URL-based/Client-side]
- ✅ [Key features]

### Navigation Integration

- ✅ [Where added and why]

### Infrastructure

- ✅ Schemas, types, DAL
- ✅ Metadata, breadcrumbs
- ✅ Skeletons, error handling

## Technical Highlights

### [Pattern/Decision]

- [Why this approach]
- [Benefits]
- [Trade-offs if any]

## Testing

- ✅ TypeScript type-check passes
- ✅ ESLint passes
- ✅ All tests passing (X tests)
- ✅ Manual testing with live API

## Commits

1. `hash` - [description]
2. `hash` - [description]

## Related Issues

- Closes #X
- Related to #Y
- Created #Z for future work

## Screenshots

[If applicable]
```

---

## Action Items for CLAUDE.md

Based on these learnings, update CLAUDE.md with:

1. **Add "Component Architecture" section**
   - Default to server components
   - When to use client components
   - URL-based pagination pattern

2. **Expand "Table Implementation" guidance**
   - Decision tree for choosing table type
   - Pattern examples for both approaches
   - Reference Issue #214 for known issues

3. **Add "Navigation Patterns" section**
   - How to analyze where links belong
   - Button placement in cards
   - Summary vs detail view guidelines

4. **Add "Number Formatting" section**
   - `.toLocaleString()` pattern
   - Other formatting utilities
   - Display priority guidelines

5. **Add "Pre-commit Hook Setup" section**
   - Initial setup instructions
   - Verification steps
   - Troubleshooting guide

6. **Improve "Commit Strategy" section**
   - When to make multiple commits
   - Conventional commit format
   - PR description template

---

## Next Steps

- [ ] Update CLAUDE.md with these learnings
- [ ] Create PR template with improved structure
- [ ] Add pre-commit verification to onboarding docs
- [ ] Refactor existing tables (Issue #214)
- [ ] Consider adding automated checks for server/client component usage
