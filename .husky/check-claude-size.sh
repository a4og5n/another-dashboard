#!/bin/sh

# Check CLAUDE.md size against threshold
CLAUDE_FILE="CLAUDE.md"
CLAUDE_SIZE=$(wc -c < "$CLAUDE_FILE" 2>/dev/null || echo 0)
THRESHOLD=32000  # 80% of 40k recommended max
MAX_SIZE=40000   # Recommended maximum

if [ "$CLAUDE_SIZE" -eq 0 ]; then
  echo "⚠️  Warning: CLAUDE.md not found"
  exit 0
fi

PERCENT=$((CLAUDE_SIZE * 100 / MAX_SIZE))

if [ "$CLAUDE_SIZE" -gt "$THRESHOLD" ]; then
  echo ""
  echo "⚠️  CLAUDE.md Size Warning"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Current size: ${CLAUDE_SIZE} chars (${PERCENT}% of ${MAX_SIZE} limit)"
  echo "Threshold:    ${THRESHOLD} chars (80%)"
  echo ""
  echo "Consider extracting content to docs/ subdirectories:"
  echo "  • Workflows >200 lines → docs/workflows/"
  echo "  • Patterns >300 lines → docs/development-patterns.md"
  echo "  • Templates >100 lines → docs/templates/"
  echo ""
  echo "See: docs/templates/documentation-template.md"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
fi
