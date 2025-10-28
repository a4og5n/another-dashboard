# Development Patterns

This document contains detailed development patterns, architectural decisions, and learnings from past implementations.

---

## Schema Refactoring {#schema-refactoring}

**Context:** During Issues #222 and #223 refactoring work (October 2025), we attempted to eliminate code duplication across schema files using factory functions and common patterns.

### When to Refactor Schemas

#### Good Reasons to Refactor

- 10+ files with identical 5+ line patterns (e.g., pagination, path params)
- Schema patterns change frequently and need single source of truth
- New endpoint needs pattern that exists in 5+ places
- Adding validation that should apply to all similar schemas

#### Bad Reasons to Refactor

- "Just because" DRY principle without concrete pain point
- Duplication is only 2-3 lines
- Pattern is stable and unlikely to change
- Refactoring would break type inference

#### Red Flags That Suggest NOT to Refactor

- Success schemas with unique resource keys (e.g., `abuse_reports`, `clicks`, `opens`)
- Patterns that are self-documenting when inline
- Duplication that aids readability
- Cases where abstraction would require complex generics

---

### ✅ What Works: Parameter Schema Patterns

#### Path Parameters - Successfully Refactored

Using re-exports preserves types:

```typescript
// ✅ WORKS: Direct re-export preserves types
import { campaignIdPathParamsSchema } from "@/schemas/mailchimp/common/path-params.schema";
export const myEndpointPathParamsSchema = campaignIdPathParamsSchema;

// Type inference: { campaign_id: string }
```

#### Query Parameters - Successfully Refactored

Using composition extends schemas while maintaining type safety:

```typescript
// ✅ WORKS: Extends standard schema
import { standardQueryParamsSchema } from "@/schemas/mailchimp/common/pagination-params.schema";
export const myQueryParamsSchema = standardQueryParamsSchema.extend({
  since: z.iso.datetime({ offset: true }).optional(),
});

// Type inference: { fields?: string, exclude_fields?: string, count: number, offset: number, since?: string }
```

#### Results

- 8 parameter schema files successfully refactored
- 110 lines of code eliminated (39% reduction)
- Full type safety maintained
- All 801 tests passing

---

### ❌ What Doesn't Work: Success Schema Factories

#### Attempted: Paginated Response Factory

```typescript
// ❌ BREAKS TYPE INFERENCE: Computed property names lose specificity
export function createPaginatedResponse<T extends ZodType>(
  itemSchema: T,
  resourceKey: string, // ← Dynamic key
  idKey?: string, // ← Dynamic key
) {
  const baseShape = {
    [resourceKey]: z.array(itemSchema), // ← TypeScript can't track this
    total_items: z.number().min(0),
    _links: z.array(linkSchema),
  };

  if (idKey) {
    return z.object({
      ...baseShape,
      [idKey]: z.string().min(1), // ← TypeScript can't track this
    });
  }

  return z.object(baseShape);
}

// Usage:
export const responseSchema = createPaginatedResponse(
  abuseReportSchema,
  "abuse_reports",
  "campaign_id",
);

// ❌ Type inference becomes: Record<string, unknown>
// ✅ Expected type: { abuse_reports: AbuseReport[], campaign_id: string, total_items: number, _links: Link[] }
```

#### The Problem

1. **TypeScript limitation:** Cannot infer specific property names from computed object keys `[resourceKey]` or `[idKey]`
2. **Type loss:** Inferred type becomes `Record<string, ...>` instead of having named properties
3. **Cascading errors:** Breaks type safety for all consuming code:
   - Page components can't access `data.abuse_reports` (property doesn't exist on `Record<string, ...>`)
   - Table components lose autocomplete
   - DAL methods have incorrect return types
4. **Widespread impact:** Results in 27+ TypeScript errors across pages, components, and DAL

#### Why This Is a TypeScript Limitation

TypeScript's structural type system cannot track dynamic object keys at compile time:

```typescript
const key = "abuse_reports";
const obj = { [key]: value };

// TypeScript only knows obj has *some* property,
// but not which specific property
```

This is fundamental to how TypeScript works and cannot be worked around without losing type information.

#### Attempted Solutions (All Failed)

1. ❌ **Generic type parameters:** `createPaginatedResponse<T, K extends string>(itemSchema: T, resourceKey: K)` - Still loses specificity
2. ❌ **Const assertions:** `as const` doesn't help with computed properties
3. ❌ **Template literal types:** Can't be used to construct object types dynamically
4. ❌ **Type predicates:** Would require manual type assertions everywhere

---

### 📊 Final Decision

#### Code Duplication Is Acceptable When

- The duplicated code is simple (4-5 lines)
- It's stable and unlikely to change
- Eliminating it breaks type safety
- The pattern is self-documenting

#### Preferred Pattern for Success Schemas

```typescript
// ✅ PREFERRED: Explicit schema with full type inference
export const abuseReportListSuccessSchema = z.object({
  abuse_reports: z.array(abuseReportSchema),
  campaign_id: z.string().min(1),
  total_items: z.number().min(0),
  _links: z.array(linkSchema),
});

// Type inference:
// {
//   abuse_reports: AbuseReport[],
//   campaign_id: string,
//   total_items: number,
//   _links: Link[]
// }
```

#### Trade-offs

- ❌ ~95 lines of duplication across 8 success schema files (~12 lines per file)
- ✅ Full type safety with autocomplete
- ✅ Clear, readable schemas
- ✅ No TypeScript errors
- ✅ Self-documenting structure

---

### 🎓 Key Takeaway

**Type safety > code deduplication**

When refactoring creates type inference issues that ripple through the codebase, the duplication is worth keeping. TypeScript's primary value is catching errors at compile time - sacrificing that for DRY principles defeats the purpose.

---

### Testing Strategy for Schema Refactoring

#### When Creating Common Schema Patterns

Write comprehensive tests (70+ recommended) covering:

- **Valid inputs:** Basic cases
- **Edge cases:** Empty strings, max values, boundary conditions
- **Invalid inputs:** Wrong types, missing required fields, unknown properties
- **Schema composition:** `.extend()`, `.merge()`, `.pick()`, `.omit()`
- **Type inference:** Verify `z.infer<typeof schema>` works correctly

#### Example Test Structure

```typescript
describe("Common Schema Pattern", () => {
  describe("Valid Cases", () => {
    it("should validate basic input", () => {});
    it("should apply defaults", () => {});
    it("should handle optional fields", () => {});
  });

  describe("Edge Cases", () => {
    it("should accept minimum values", () => {});
    it("should accept maximum values", () => {});
    it("should handle empty arrays", () => {});
  });

  describe("Invalid Cases", () => {
    it("should reject unknown properties (.strict())", () => {});
    it("should reject wrong types", () => {});
    it("should reject missing required fields", () => {});
  });

  describe("Composition", () => {
    it("should extend with additional fields", () => {});
    it("should override defaults when extended", () => {});
  });
});
```

#### After Refactoring Existing Schemas

- **Run full test suite:** `pnpm test` (must show same pass count)
- **Type-check:** `pnpm type-check` (zero errors)
- **Lint:** `pnpm lint` (no new warnings)
- **Manual verification:** Import refactored schema in consuming code, verify autocomplete works

---

### Related Documentation

- [Large-Scale Refactoring Workflow](workflows/refactoring.md) - Complete refactoring guide
- Issues #222 (folder reorganization), #223 (DRY refactoring)

---

## Future Patterns

This document will be expanded with additional development patterns as they emerge from implementation sessions.
