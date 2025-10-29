# Documentation Structure Template

This template shows the recommended structure for extracting verbose documentation from CLAUDE.md.

## Good Documentation Structure

```markdown
## Feature X

**Quick Reference:** See [docs/feature-x-guide.md](docs/feature-x-guide.md)

### Essential Info (keep in CLAUDE.md)

- Critical rules (2-3 bullet points)
- Common command: `command --flags`
- Link to detailed guide

### Detailed Guide (extract to docs/)

- Step-by-step instructions
- All edge cases
- Verbose examples
- Troubleshooting
```

## Extraction Guidelines

**✅ Keep in CLAUDE.md:**

- Critical 2-3 line rules
- Quick reference commands
- Links to detailed docs
- Essential patterns

**❌ Extract to docs/ subdirectories:**

- Step-by-step walkthroughs (>50 lines)
- Verbose examples
- Edge case documentation
- Troubleshooting guides
- Historical context

## Token Cost Awareness

- Every 1,000 lines ≈ 3,000 tokens
- CLAUDE.md should stay <2,500 lines (<7,500 tokens)
- Target: 60-70% of 40k char limit (24-28k chars)
- Aim for: "Can AI read entire file in one context window"

## Extraction Thresholds

- **Workflows >200 lines** → Extract to `docs/workflows/`
- **Patterns >300 lines** → Extract to `docs/development-patterns.md`
- **Templates >100 lines** → Extract to `docs/templates/`
- **Any section >500 lines** → Consider extracting to sub-docs
