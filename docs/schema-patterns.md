# Schema & API Patterns

Complete guide to Zod schema creation and validation patterns for Mailchimp API endpoints.

## Table of Contents

- [Overview](#overview)
- [Comment Standards](#comment-standards)
- [Common Schemas](#common-schemas)
- [Schema Creation Checklist](#schema-creation-checklist)
- [Advanced Validation Patterns](#advanced-validation-patterns)
- [Schema File Structure Standards](#schema-file-structure-standards)

---

## Overview

**IMPORTANT: Schema refactoring in progress** (Issues #222, #223)

- Folder reorganization: Moving to hierarchical structure
- DRY refactoring: Extracting common patterns
- Comment standardization: Enforcing consistent style
- Branch: `refactor/schema-organization`

**Until refactoring is complete, follow these standards for new schemas.**

---

## Comment Standards

### File Header - Always Include

```typescript
/**
 * [Resource Name] [Params|Success|Error] Schema
 * Schema for [description]
 *
 * Endpoint: [METHOD] /[full/path]
 * Documentation: [Mailchimp API URL]
 * Follows PRD guideline: "Always use the same object/property names as the API"
 */
```

### Property Comments - Inline Only (NOT JSDoc @property)

```typescript
export const schema = z.object({
  field_name: z.string(), // Brief description without period
  count: z.number().int().min(0), // Integer count of items
  rate: z.number().min(0).max(1), // Decimal rate (0-1)
  timestamp: z.iso.datetime({ offset: true }), // ISO 8601 with timezone
  _links: z.array(linkSchema), // HATEOAS navigation links
});
```

### Strict Mode - Always Comment

```typescript
export const schema = z
  .object({
    // properties...
  })
  .strict(); // Reject unknown properties for input validation
```

### Common Field Comments (Standardized)

- `fields` → `// Comma-separated fields to include`
- `exclude_fields` → `// Comma-separated fields to exclude`
- `count` → `// Number of records (1-1000)`
- `offset` → `// Records to skip for pagination`
- `total_items` → `// Total count`
- `_links` → `// HATEOAS navigation links`
- IDs → `// [Resource] ID`
- Rates → `// Decimal rate (0-1)`
- Dates → `// ISO 8601 with timezone`

---

## Common Schemas

### Path Parameters

```typescript
// For campaign endpoints
import { campaignIdPathParamsSchema } from "@/schemas/mailchimp/common/path-params.schema";
export const pathParamsSchema = campaignIdPathParamsSchema;

// For list endpoints
import { listIdPathParamsSchema } from "@/schemas/mailchimp/common/path-params.schema";
export const pathParamsSchema = listIdPathParamsSchema;
```

### Query Parameters

```typescript
// Standard pagination + field filtering (most common)
import { standardQueryParamsSchema } from "@/schemas/mailchimp/common/pagination-params.schema";
export const queryParamsSchema = standardQueryParamsSchema;

// With additional parameters
export const queryParamsSchema = standardQueryParamsSchema.extend({
  since: z.iso.datetime({ offset: true }).optional(), // ISO 8601 filter
});
```

### Paginated Response

```typescript
// ⚠️ DO NOT use factory function - it breaks TypeScript type inference
// TypeScript cannot infer specific property names from computed object keys
// See docs/development-patterns.md#schema-refactoring for details

// Instead, define the schema explicitly:
export const responseSchema = z.object({
  resource_name: z.array(itemSchema), // Array of items
  campaign_id: z.string().min(1), // Parent resource ID (optional)
  total_items: z.number().min(0), // Total count
  _links: z.array(linkSchema), // HATEOAS navigation links
});
```

### Error Schemas

```typescript
// Always use common error schema
import { errorSchema } from "@/schemas/mailchimp/common/error.schema";
export const endpointErrorSchema = errorSchema;
```

---

## Schema Creation Checklist

### Before creating new schemas, always check existing patterns

```bash
# Check parameter schema patterns
grep -r "ParamsSchema" src/schemas/mailchimp/*-params.schema.ts

# Check for reusable common schemas
grep -r "schemaName" src/schemas/mailchimp/common/

# Find similar endpoint schemas (for pattern reference)
ls src/schemas/mailchimp/*-success.schema.ts
```

### Parameter Schemas (`*-params.schema.ts`)

#### 1. Export path and query schemas separately (do NOT use `.merge()`)

```typescript
// ✅ Good
export const pathParamsSchema = z.object({ id: z.string().min(1) }).strict();
export const queryParamsSchema = z
  .object({ count: z.coerce.number() })
  .strict();

// ❌ Bad - DO NOT merge
export const paramsSchema = pathParamsSchema.merge(queryParamsSchema);
```

#### 2. Always add `.strict()` with comment

```typescript
.strict(); // Reject unknown properties for input validation
```

#### 3. ID fields MUST use `.min(1)` to prevent empty strings

```typescript
campaign_id: z.string().min(1), // Campaign ID
list_id: z.string().min(1), // List ID
```

#### 4. Use const arrays for enums

```typescript
export const SORT_FIELD = "month" as const;
export const SORT_DIRECTIONS = ["ASC", "DESC"] as const;

sort_field: z.literal(SORT_FIELD).optional(),
sort_dir: z.enum(SORT_DIRECTIONS).optional(),
```

### Zod 4 Best Practices

- ✅ **Optional with default:** Use `.default(value)` alone
  ```typescript
  count: z.coerce.number().min(1).max(1000).default(10), // NOT .default(10).optional()
  ```
- ✅ **Optional without default:** Use `.optional()` alone
  ```typescript
  fields: z.string().optional(),
  ```
- ❌ **NEVER use `.default().optional()`** (redundant - `.default()` makes it optional automatically)

### Success Schemas (`*-success.schema.ts`)

#### 1. All ID fields MUST use `.min(1)`

```typescript
list_id: z.string().min(1), // List ID
campaign_id: z.string().min(1), // Campaign ID
email_id: z.string().min(1), // Email ID
```

#### 2. Compare with similar endpoints

Check if other endpoints for same resource use nested objects or flat structure

#### 3. Check `common/` directory

Look for reusable schemas before inlining:

- `linkSchema`
- `errorSchema`
- `campaignIdPathParamsSchema`
- etc.

#### 4. If duplicating schemas

Create GitHub issue for future refactoring and add TODO comment with issue number

---

## Advanced Validation Patterns

From List Members implementation (October 2025):

```typescript
// ISO 8601 datetime with timezone offset
since_timestamp_opt: z.iso.datetime({ offset: true }).optional();

// IP address (IPv4 or IPv6)
ip_signup: z.union([z.ipv4(), z.ipv6()]).optional();

// ISO 4217 currency code (3 uppercase letters)
currency_code: z.string().length(3).toUpperCase();

// Boolean from query param (requires coercion)
vip_only: z.coerce.boolean().optional();

// Extracted enum constants (reusable)
export const MEMBER_STATUS_FILTER = [
  "subscribed",
  "unsubscribed",
  "cleaned",
  "pending",
  "transactional",
  "archived",
] as const;
status: z.enum(MEMBER_STATUS_FILTER).optional();
```

### Schema Validation Checklist

- ✅ Use `z.iso.datetime({ offset: true })` for timestamps with timezone
- ✅ Use `z.union([z.ipv4(), z.ipv6()])` for IP addresses
- ✅ Use `.length(3).toUpperCase()` for ISO 4217 currency codes
- ✅ Use `z.coerce.boolean()` for boolean query parameters
- ✅ Extract enums to constants for reusability and type safety

### Deprecated Fields

Use inline comments (not TypeScript `@deprecated` JSDoc):

```typescript
existing: z.number().int().min(0), // @deprecated - Always returns 0, do not use
imports: z.number().int().min(0), // @deprecated - Always returns 0, do not use
```

---

## Schema File Structure Standards

### File Header Format (JSDoc)

```typescript
/**
 * {Endpoint Name} {Params|Success|Error} Schema
 * {1-line description of what this validates}
 *
 * Endpoint: {METHOD} {/api/path}
 * Source: {URL to Mailchimp API docs or "User-provided actual structure"}
 */
```

### Property Comments (inline, NOT JSDoc blocks)

```typescript
export const listActivityItemSchema = z.object({
  day: z.iso.datetime({ offset: true }), // ISO 8601 date
  emails_sent: z.number().int().min(0), // Integer count of emails sent
  unique_opens: z.number().int().min(0), // Integer count of unique opens
});
```

### Schema Files Should Contain

- ✅ Import statements
- ✅ Constant arrays (enums): `export const STATUS = ["active", "inactive"] as const;`
- ✅ Schema definitions with inline comments
- ✅ Schema exports
- ❌ NO type exports (use `z.infer` in `/src/types` instead)
- ❌ NO helper functions (put in `/src/utils`)
- ❌ NO JSDoc blocks on individual properties (use inline comments)

### Error Schema Pattern (Minimal)

```typescript
/**
 * {Endpoint Name} Error Response Schema
 * Validates error responses from {endpoint description}
 *
 * Endpoint: {METHOD} {/path}
 */

import { errorSchema } from "@/schemas/mailchimp/common/error.schema";

export const {endpoint}ErrorSchema = errorSchema;
```

**Reference**: `src/schemas/mailchimp/domain-performance-error.schema.ts`

---

## Quick Reference

### When creating a new schema:

1. ✅ Check for existing patterns (use grep commands above)
2. ✅ Reuse common schemas from `common/` directory
3. ✅ Add file header with JSDoc
4. ✅ Use inline comments for all properties
5. ✅ Add `.strict()` with comment
6. ✅ Use `.min(1)` for all ID fields
7. ✅ Extract enums to constants
8. ✅ Follow Zod 4 best practices (no `.default().optional()`)

### When validating API responses:

1. ✅ Match API structure exactly (PRD guideline)
2. ✅ Check similar endpoints for consistency
3. ✅ Use advanced patterns (ISO dates, IPs, currency codes)
4. ✅ Mark deprecated fields with inline comments
5. ✅ Create GitHub issue if duplicating schemas
