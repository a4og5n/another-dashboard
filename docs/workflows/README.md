# AI-First Development Workflow

This directory contains the complete AI-assisted workflow for implementing new Mailchimp dashboard pages.

## 📚 Workflow Documentation

| File                                                             | Description                                                | Lines |
| ---------------------------------------------------------------- | ---------------------------------------------------------- | ----- |
| [user-intent-classification.md](./user-intent-classification.md) | How to classify user requests (research vs implementation) | ~100  |
| [phase-0-git-setup.md](./phase-0-git-setup.md)                   | Issue creation & feature branch setup (MANDATORY)          | ~210  |
| [phase-1-schemas.md](./phase-1-schemas.md)                       | Schema creation, review, and approval                      | ~200  |
| [phase-2-implementation.md](./phase-2-implementation.md)         | Page generation, components, validation                    | ~400  |
| [phase-2-commit-strategy.md](./phase-2-commit-strategy.md)       | Atomic vs granular commit strategies                       | ~100  |
| [phase-3-pr-creation.md](./phase-3-pr-creation.md)               | Push to remote and create PR                               | ~150  |
| [phase-4-post-merge.md](./phase-4-post-merge.md)                 | Documentation updates, cleanup, session review             | ~250  |

## 🎯 Quick Start

### For AI Assistants

1. **Read:** [user-intent-classification.md](./user-intent-classification.md) - Classify user request first
2. **If "implement":** Follow phases in order (0 → 1 → 2 → 3 → 4)
3. **If "research":** Analyze and present findings, then ASK before implementing

### For Developers

1. All implementation work MUST start with Phase 0 (create issue + branch)
2. Never commit directly to `main` - always use feature branches
3. PR review happens at Phase 3, after local testing is complete

## 🔄 Workflow Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Phase 0: Issue Creation & Git Setup (MANDATORY)            │
│  - Create GitHub issue                                       │
│  - Create feature branch: feature/description-issue-123     │
│  - Initialize TodoWrite tracker                              │
│  ⏸️  STOP: Wait for user approval                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Phase 1: Schema Creation & Review                          │
│  - Fetch Mailchimp API docs                                  │
│  - Create Zod schemas (params, success, error)               │
│  - Present schemas for review                                │
│  ⏸️  STOP: Wait for user approval ("approved")              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Phase 2: Page Generation & Implementation                  │
│  - Add PageConfig to registry                                │
│  - Run page generator                                        │
│  - Implement components, types, skeletons                    │
│  - Run validation suite                                      │
│  - Add navigation links                                      │
│  ⏸️  STOP: Smoke test (user tests in browser)               │
│  - Create local commit                                       │
│  ⏸️  STOP: User testing loop (amend commits)                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Phase 3: Push & Create PR                                  │
│  ⏸️  STOP: Wait for explicit "ready to push"                │
│  - Push branch to origin                                     │
│  - Create PR with gh CLI                                     │
│  - Monitor CI/CD (auto-fix failures)                         │
│  - Auto-merge when all checks pass                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Phase 4: Post-Merge Cleanup & Documentation                │
│  - Checkout main, pull changes                               │
│  - Delete local/remote branches                              │
│  - Close GitHub issue                                        │
│  - Update docs/api-coverage.md                               │
│  - Add session review to ai-workflow-learnings.md            │
│  - Present completion summary                                │
└─────────────────────────────────────────────────────────────┘
```

## ⚠️ Critical Rules

1. **Never commit directly to main** - Always use feature branches
2. **Phase 0 is MANDATORY** - Issue + branch before ANY code
3. **Wait for user approval** at each checkpoint (⏸️)
4. **Use `git commit --amend`** during Phase 2.75 iteration
5. **Do NOT update docs** during implementation - wait for Phase 4

## 🎯 User Checkpoints

| Phase     | Checkpoint       | User Action Required               |
| --------- | ---------------- | ---------------------------------- |
| 0 → 1     | Issue created    | Say "yes" or "proceed"             |
| 1 → 2     | Schemas reviewed | Say "approved" or "looks good"     |
| 2.4 → 2.5 | Smoke test       | Say "smoke test passed"            |
| 2.75 → 3  | Testing complete | Say "ready to push" or "create PR" |
| 3 → 4     | PR merged        | Automatic (no user action)         |

## 📖 Related Documentation

- [Error Handling Quick Reference](../error-handling-quick-reference.md)
- [API Coverage](../api-coverage.md)
- [AI Workflow Learnings](../ai-workflow-learnings.md)
- [Development Patterns](../development-patterns.md)
