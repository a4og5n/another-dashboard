# Phase 2: Enhance JSDoc Comments

**Prerequisites:**

- [ ] Phase 1 complete (verify: `src/utils/params/README.md` exists)
- [ ] On feature branch: `feature/params-docs`
- [ ] README committed

**Goal:** Add references to README in JSDoc comments of both utilities

**Estimated Time:** 15 minutes

---

## Tasks

### Task 1: Update page-params.ts JSDoc

Edit `src/utils/mailchimp/page-params.ts`:

**Location to update:** Top of file JSDoc comment (lines 1-8)

**Add this section after the existing JSDoc:**

```typescript
/**
 * Page Parameter Processing Utilities
 *
 * Handles the common pattern of validating URL search params,
 * checking for redirects, and converting to API format.
 *
 * Flow: rawParams → validatedParams → convertedParams → apiParams
 *
 * @see {@link file://./../../params/README.md} For detailed guide on when to use this utility
 */
```

**Also update the main `validatePageParams()` function JSDoc:**

Add to the end of the existing JSDoc:

```typescript
 * @see {@link file://./../../params/README.md} For usage decision guide
```

- [ ] Top-level JSDoc updated with README reference
- [ ] `validatePageParams()` function JSDoc updated with README reference

### Task 2: Update route-params.ts JSDoc

Edit `src/utils/mailchimp/route-params.ts`:

**Add file-level JSDoc at the top (currently missing):**

```typescript
/**
 * Route Parameter Processing Utilities
 *
 * Handles validation of dynamic route parameters (e.g., [id], [slug]).
 * Triggers 404 for invalid route parameters.
 *
 * @see {@link file://./../../params/README.md} For detailed guide on when to use this utility
 */

import { notFound } from "next/navigation";
import { z } from "zod";
```

**Update the `processRouteParams()` function JSDoc:**

Add after the existing parameter documentation:

```typescript
 * @see {@link file://./../../params/README.md} For usage decision guide
```

- [ ] File-level JSDoc added with README reference
- [ ] `processRouteParams()` function JSDoc updated with README reference

---

## Validation

```bash
# Type check still passes
pnpm type-check

# Lint check still passes
pnpm lint

# Preview changes
git diff src/utils/mailchimp/page-params.ts
git diff src/utils/mailchimp/route-params.ts
```

**Manual Review:**

- [ ] Open both files in editor
- [ ] Verify JSDoc comments are properly formatted
- [ ] Check that `@see` links are correct
- [ ] Ensure no existing documentation was removed

---

## Checkpoint: COMMIT

```bash
git add src/utils/mailchimp/page-params.ts src/utils/mailchimp/route-params.ts
git commit -m "docs(utils): add README references to params utilities JSDoc

- Add @see links to params/README.md in page-params.ts
- Add @see links to params/README.md in route-params.ts
- Add file-level JSDoc to route-params.ts
- Improve discoverability of decision guide"
```

Verify commit:

```bash
git log --oneline -1
# Should show your commit message

git show --stat
# Should show both files modified
```

---

## 🛑 STOP HERE

**Phase 2 Complete!**

**Before continuing:**

1. ✅ JSDoc comments updated in both utilities
2. ✅ README references added
3. ✅ Code committed
4. ✅ Type checking and linting pass

**💰 Cost Optimization:** Safe to clear conversation now

- Phase 2 is committed and validated
- JSDoc enhancements are complete
- Next phase (CLAUDE.md update) is independent

**Next Steps:**

- Clear conversation if desired
- User: "Start Phase 3" or open `phase-3-checklist.md`

**DO NOT PROCEED** to Phase 3 without user confirmation.

---

**✅ Phase 2 Complete - Ready to begin Phase 3**
