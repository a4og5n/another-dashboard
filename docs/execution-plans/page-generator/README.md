# Mailchimp Page Generator - Execution Plan

**GitHub Issue:** #206
**Status:** Ready for Implementation
**Estimated Effort:** 8-12 hours
**Created:** 2025-01-20

## Overview

This execution plan guides the implementation of an interactive CLI tool that generates fully functional Mailchimp pages from API schemas, eliminating 100-150 lines of boilerplate per page.

## Plan Structure

This plan uses a **split structure** due to its complexity (would exceed 800 lines as a single file):

### Phase Files

Work through these phases sequentially:

1. **[phase-0-setup.md](phase-0-setup.md)** (10 min)
   - Git setup and pre-implementation validation
   - **Start here!**

2. **[phase-1-config-structure.md](phase-1-config-structure.md)** (1-2h)
   - Create PageConfig interface
   - Create central registry with type safety
   - Document config structure

3. **[phase-2-cli-prompts.md](phase-2-cli-prompts.md)** (2-3h)
   - Install Clack library
   - Create interactive CLI with prompts
   - Implement validation at each step

4. **[phase-3-analyzers.md](phase-3-analyzers.md)** (1-2h)
   - Schema analyzer for smart defaults
   - Project analyzer for existing pages
   - Integration with CLI prompts

5. **[phase-4-generators.md](phase-4-generators.md)** (3-4h)
   - Page writer (page.tsx, not-found.tsx, loading.tsx)
   - Schema writer (UI schema from API schema)
   - Component writer (placeholder with TODO)
   - DAL, breadcrumb, metadata writers

6. **[phase-5-integration.md](phase-5-integration.md)** (1-2h)
   - Safety checker (overwrite protection)
   - Main CLI integration
   - Automatic quality checks
   - End-to-end testing

7. **[phase-6-validation.md](phase-6-validation.md)** (1h)
   - Generate test page
   - Documentation updates
   - Final validation
   - PR preparation

### Reference Files

- **[reference-checklists.md](reference-checklists.md)**
  - Manual review checklist
  - PR template
  - Rollback procedures
  - Common issues and solutions

## Key Features

### Schema-First Approach
- Developer creates pure Zod schemas manually (high-value work)
- Metadata stored in separate registry (used only during generation)
- Schemas remain clean and runtime-usable

### Interactive CLI
- Beautiful prompts using Clack library
- Smart defaults based on schema analysis
- Validation at every step
- Clear error messages and guidance

### Smart Defaults
- Auto-detect pagination from schema (count/offset fields)
- Infer route structure from param names (campaign_id → [id])
- Suggest HTTP method based on schema structure
- Auto-generate DAL method names from endpoints
- Detect parent pages from route hierarchy

### Complete Code Generation
- Full working page infrastructure
- Placeholder components with TODO cards
- UI schema auto-generated from API schema
- DAL methods with proper typing
- Breadcrumb configuration
- Metadata helpers
- All exports and imports

### Safety Features
- Pre-flight check for existing files
- Overwrite protection with options (skip/backup/overwrite)
- Conflict detection in DAL methods
- Smart merging for index files
- Automatic quality checks (type/lint/test)
- Detailed generation log

## Usage After Implementation

Once complete, generating a new page will be:

```bash
pnpm generate:page

# CLI guides you through:
# 1. Schema selection (with validation)
# 2. Route configuration (with smart defaults)
# 3. API setup (auto-suggested)
# 4. UI options (auto-detected)
# 5. Review and confirm

# Result: Complete working page + infrastructure
# Time: 2-3 minutes vs 30-60 minutes manual
```

## Dependencies

- **Clack** - Interactive CLI prompts
- **Existing patterns** - Uses current page/component patterns
- **Project conventions** - Follows CLAUDE.md guidelines

## Success Criteria

- ✅ CLI generates complete working pages from schemas
- ✅ Generated code passes type-check, lint, and test
- ✅ Smart defaults reduce manual input by 70%+
- ✅ Overwrite protection prevents data loss
- ✅ Documentation clear and comprehensive
- ✅ Team can use generator independently

## Getting Started

**Ready to begin?** Start with [Phase 0: Git Setup](phase-0-setup.md)

---

**Related:**
- GitHub Issue: #206
- Parent Doc: [docs/page-pattern-improvements.md](../../page-pattern-improvements.md)
- Template: [docs/execution-plan-template.md](../../execution-plan-template.md)
