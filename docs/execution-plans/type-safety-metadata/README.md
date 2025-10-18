# Type Safety for Metadata Functions - Execution Plan

**Feature:** Improvement #6 from [page-pattern-improvements.md](../../page-pattern-improvements.md)
**Branch:** `feature/type-safety-metadata`
**Estimated Effort:** 2 hours
**Status:** Ready to Start

---

## Quick Start

**This execution plan uses the multi-file format with explicit phase boundaries.**

### Execution Order

1. **Read:** [execution-plan.md](execution-plan.md) - Full context and overview
2. **Start:** [phase-0-setup.md](phase-0-setup.md) - Git setup (REQUIRED FIRST)
3. **Phase 1:** [phase-1-checklist.md](phase-1-checklist.md) - Create type helper
4. **Phase 2:** [phase-2-checklist.md](phase-2-checklist.md) - Update first page
5. **Complete:** [completion-checklist.md](completion-checklist.md) - Phase 3, 4, and PR

---

## What This Plan Builds

**Goal:** Create type-safe helpers for Next.js `generateMetadata` functions to eliminate repetitive type annotations.

**Problem:**

Every dynamic page currently requires manual type annotations:

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  // ... metadata logic
}
```

**Solution:**

Type-safe helper that provides inference:

```tsx
export const generateMetadata = createMetadataFunction(async ({ params }) => {
  const { id } = await params;
  // ... metadata logic (types inferred automatically)
});
```

---

## Deliverables

### Type Helpers (Phase 1)

- `src/types/components/metadata.ts` - Three exports:
  - `MetadataProps<TParams>` - Props type
  - `GenerateMetadata<TParams>` - Function type
  - `createMetadataFunction<TParams>()` - Helper function with inference

### Page Updates (Phases 2-3)

- `/mailchimp/reports/[id]/opens` - Proof of concept
- `/mailchimp/reports/[id]/abuse-reports` - Second example

### Documentation (Phase 4)

- CLAUDE.md updated with pattern and examples
- Comprehensive JSDoc in type files

---

## Phase Breakdown

### Phase 0: Git Setup (5-10 minutes) - REQUIRED FIRST

**File:** [phase-0-setup.md](phase-0-setup.md)

- Verify/create feature branch
- Check for existing work
- Review prerequisites
- Confirm environment

**Checkpoint:** Empty commit to mark branch creation

**🛑 STOP after Phase 0** - Do not proceed without user confirmation

---

### Phase 1: Create Type Helper (30-40 minutes)

**File:** [phase-1-checklist.md](phase-1-checklist.md)

- Create `src/types/components/metadata.ts`
- Add three exports with JSDoc
- Update barrel exports
- Validate types work

**Checkpoint:** Commit type helper

**🛑 STOP after Phase 1** - Safe to clear conversation

---

### Phase 2: Update First Page (15-20 minutes)

**File:** [phase-2-checklist.md](phase-2-checklist.md)

- Update campaign opens page
- Add import for helper
- Replace manual type annotations
- Manual testing in browser

**Checkpoint:** Commit first page update

**🛑 STOP after Phase 2** - Safe to clear conversation

---

### Phase 3 & 4: Complete Implementation (30-40 minutes)

**File:** [completion-checklist.md](completion-checklist.md)

**Phase 3:**

- Update abuse reports page
- Apply same pattern

**Phase 4:**

- Update CLAUDE.md with pattern
- Run full validation suite
- Review all changes
- Push to origin and create PR

**Checkpoints:**

- Commit second page update (Phase 3)
- Commit documentation (Phase 4)

---

## Key Features of This Plan

### ✅ Multi-File Format

- Each phase in separate file
- Explicit STOP checkpoints
- User must open next phase manually

### ✅ Existing Work Detection

- Every phase checks if already complete
- Avoids duplicate work
- Provides status updates

### ✅ Cost Optimization

- Clear conversation points marked
- Safe checkpoints with commits
- Independent phases

### ✅ Comprehensive Validation

- Type checking at each phase
- Manual testing included
- Full validation before PR

---

## How to Use This Plan

### For Users

1. **Start with Phase 0** - Always read and complete git setup first
2. **One phase at a time** - Complete each phase fully before continuing
3. **Explicit continuation** - Say "Start Phase N" to continue
4. **Clear when suggested** - Save costs by clearing at checkpoints

### For AI Assistants

1. **Always start with Phase 0** - Never skip git setup
2. **Check for existing work** - Before each phase, verify not already done
3. **Stop at checkpoints** - Wait for user confirmation between phases
4. **Follow validation steps** - Run all validation commands
5. **Commit frequently** - After each phase completion

---

## Success Criteria

- ✅ Type helper created with generic support
- ✅ Helper provides type inference
- ✅ No manual type annotations needed
- ✅ 2 pages updated as proof of concept
- ✅ Documentation complete
- ✅ All validation passes

---

## Expected Timeline

| Phase                  | Duration     | Cumulative  |
| ---------------------- | ------------ | ----------- |
| Phase 0: Git Setup     | 5-10 min     | 10 min      |
| Phase 1: Type Helper   | 30-40 min    | 50 min      |
| Phase 2: First Page    | 15-20 min    | 70 min      |
| Phase 3: Second Page   | 10-15 min    | 85 min      |
| Phase 4: Documentation | 20-25 min    | 110 min     |
| **Total**              | **~2 hours** | **110 min** |

---

## Files in This Directory

- `README.md` (this file) - Overview and navigation
- `execution-plan.md` - Full detailed plan (reference)
- `phase-0-setup.md` - Git setup (START HERE)
- `phase-1-checklist.md` - Create type helper
- `phase-2-checklist.md` - Update first page
- `completion-checklist.md` - Phases 3, 4, and PR creation

---

## Related Documentation

- [page-pattern-improvements.md](../../page-pattern-improvements.md) - Improvement #6
- [execution-plan-template.md](../../execution-plan-template.md) - Template used
- [CLAUDE.md](../../../CLAUDE.md) - Project guidelines

---

## Getting Started

**To begin implementation:**

1. Read [execution-plan.md](execution-plan.md) for full context
2. Open [phase-0-setup.md](phase-0-setup.md) and say "Start Phase 0"
3. Follow phases sequentially
4. Stop at checkpoints and clear conversation when suggested

**Questions?**

Refer to the full [execution-plan.md](execution-plan.md) for detailed information on any step.

---

**Ready to start? Open [phase-0-setup.md](phase-0-setup.md)**
