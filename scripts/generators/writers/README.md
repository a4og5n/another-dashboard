# Page Generator Writers

This directory contains file generator modules for the page generator CLI.

## Completed Writers

- ✅ **page-writer.ts** - Generates page.tsx, not-found.tsx, loading.tsx with full implementation

## Writers Pending Implementation

The following writers need to be implemented in a follow-up session:

- ⏳ **schema-writer.ts** - Transform API schema to UI schema (e.g., remove API-only fields)
- ⏳ **component-writer.ts** - Generate placeholder component with Construction card
- ⏳ **dal-writer.ts** - Add new method to existing DAL file
- ⏳ **breadcrumb-writer.ts** - Add breadcrumb function to breadcrumb-builder.ts
- ⏳ **metadata-writer.ts** - Add metadata helper to utils/metadata.ts

## Implementation Notes

### Schema Writer

- Read API params schema
- Strip API-only fields (fields, exclude_fields, sort_field, sort_dir)
- Keep pagination fields (count, offset) transformed to UI format (page, perPage)
- Write to `src/schemas/components/mailchimp/[name]-page-params.ts`

### Component Writer

- Generate placeholder component with Construction card (from lucide-react)
- Show available data structure in card
- Include TODO comments for implementation
- Write to `src/components/mailchimp/[category]/[name].tsx`

### DAL Writer

- Read existing `src/dal/mailchimp.dal.ts`
- Add new method based on API config
- Use mailchimpApiCall wrapper
- Return typed response
- Append to class (don't overwrite existing methods)

### Breadcrumb Writer

- Read existing `src/utils/breadcrumbs/breadcrumb-builder.ts`
- Add static or dynamic breadcrumb function
- Follow existing patterns (bc.report, bc.reports, etc.)
- Insert alphabetically in the object

### Metadata Writer

- Read existing `src/utils/mailchimp/metadata.ts` or create if needed
- Generate metadata helper function
- Follow pattern from generateCampaignOpensMetadata
- Export from `src/utils/metadata.ts`

## Current Status

**Phase 4 Status:** Partially Complete (1/6 writers done)

The page writer provides the foundation. The remaining writers are simpler and can be implemented quickly in a follow-up session once we have more context/tokens available.

**Next Steps:**

1. Complete remaining writer implementations
2. Integrate all writers in main CLI (Phase 5)
3. Add safety checks and validation (Phase 5)
4. Test end-to-end (Phase 6)
