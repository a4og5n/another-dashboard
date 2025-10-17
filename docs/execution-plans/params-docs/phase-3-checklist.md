# Phase 3: Update CLAUDE.md with Params Pattern

**Prerequisites:**

- [ ] Phase 2 complete (verify: JSDoc comments updated)
- [ ] On feature branch: `feature/params-docs`
- [ ] All previous phases committed

**Goal:** Add params pattern section to CLAUDE.md development guidelines

**Estimated Time:** 15 minutes

---

## Tasks

### Task 1: Find Insertion Point in CLAUDE.md

Read CLAUDE.md to find the best location:

```bash
# Look for development guidelines section
grep -n "Development Guidelines\|Code Organization\|Component Development" CLAUDE.md

# View table of contents or major sections
head -100 CLAUDE.md
```

**Recommended insertion point:** After the "Breadcrumb Pattern" section (around line 230-270)

- [ ] Located appropriate section in CLAUDE.md

### Task 2: Add URL Params Processing Pattern Section

Add this section to CLAUDE.md after the Breadcrumb Pattern section:

````markdown
### URL Params Processing Pattern

The project provides two utilities for processing URL parameters, each serving a distinct purpose.

**Quick Decision Guide:**

```
Does your page have pagination? (?page=N&perPage=M)
├─ YES → Use validatePageParams()
│         Location: src/utils/mailchimp/page-params.ts
│         Example: /mailchimp/lists?page=2&perPage=10
│
└─ NO → Does your page have route params? ([id], [slug])
         ├─ YES → Use processRouteParams()
         │         Location: src/utils/mailchimp/route-params.ts
         │         Example: /mailchimp/lists/[id]
         │
         └─ NO → No utility needed
                  Example: /mailchimp/general-info
```

**validatePageParams() - For List/Table Pages:**

Used for pages with pagination (page, perPage in URL):

- Validates URL search parameters
- Checks for redirects to clean default values from URL
- Transforms UI params to API format
- Returns both API params and UI display values

```tsx
import { validatePageParams } from "@/utils/mailchimp/page-params";

// In your page.tsx
const result = await validatePageParams({
  searchParams,
  uiSchema: listsPageSearchParamsSchema,
  apiSchema: listsParamsSchema,
  basePath: "/mailchimp/lists",
});

const response = await mailchimpDAL.fetchLists(result.apiParams);
// Use result.currentPage and result.pageSize for UI
```

**processRouteParams() - For Detail Pages:**

Used for pages with dynamic route segments ([id], [slug]):

- Validates route parameters
- Triggers 404 for invalid route params
- Validates search params if present
- Returns validated data only

```tsx
import { processRouteParams } from "@/utils/mailchimp/route-params";

// In your page.tsx with [id] route
const { validatedParams, validatedSearchParams } = await processRouteParams({
  params,
  searchParams,
  paramsSchema: reportPageParamsSchema,
  searchParamsSchema: z.object({}), // Empty if no search params
});

const { id } = validatedParams;
const response = await mailchimpDAL.fetchCampaignReport(id);
```

**Schema Naming Conventions:**

- Page search params: `listsPageSearchParamsSchema` (used with validatePageParams)
- Route params: `reportPageParamsSchema` (used with processRouteParams)
- API params: `listsParamsSchema` (Mailchimp API format)

**Detailed Documentation:** See [src/utils/params/README.md](src/utils/params/README.md) for comprehensive guide with examples.
````

- [ ] Section added to CLAUDE.md
- [ ] Code examples are accurate
- [ ] Links are correct
- [ ] Formatting is consistent with rest of CLAUDE.md

### Task 3: Update Table of Contents (if exists)

If CLAUDE.md has a table of contents, add entry for the new section:

```markdown
- [URL Params Processing Pattern](#url-params-processing-pattern)
```

- [ ] Table of contents updated (or N/A if no TOC)

---

## Validation

```bash
# Check formatting
pnpm format:check CLAUDE.md

# Format if needed
pnpm format --write CLAUDE.md

# Preview the changes
git diff CLAUDE.md
```

**Manual Review:**

- [ ] Open CLAUDE.md in editor
- [ ] Verify section is well-placed
- [ ] Check that code examples render correctly
- [ ] Ensure decision tree is clear
- [ ] Verify link to README works

---

## Checkpoint: COMMIT

```bash
git add CLAUDE.md
git commit -m "docs: add URL params processing pattern to development guidelines

- Add decision guide for validatePageParams vs processRouteParams
- Include code examples for both utilities
- Document schema naming conventions
- Link to detailed params/README.md documentation"
```

Verify commit:

```bash
git log --oneline -1
# Should show your commit message

git show --stat
# Should show: CLAUDE.md | XX ++++++++++++
```

---

## 🛑 STOP HERE

**Phase 3 Complete!**

**Before continuing:**

1. ✅ CLAUDE.md updated with params pattern
2. ✅ Decision guide added
3. ✅ Code committed
4. ✅ All documentation is consistent

**💰 Cost Optimization:** Safe to clear conversation now

- Phase 3 is committed and validated
- All documentation is complete
- Final phase (completion checklist) just validates everything

**Next Steps:**

- Clear conversation if desired
- User: "Start Completion" or open `completion-checklist.md`

**DO NOT PROCEED** to completion phase without user confirmation.

---

**✅ Phase 3 Complete - Ready for final validation**
