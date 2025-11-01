#!/bin/bash
# PR Merge and Cleanup Script
# Automates Phase 3/4 of AI-First Development Workflow
#
# Usage: ./scripts/merge-pr.sh <pr_number>
#
# This script:
# 1. Merges PR with squash and deletes remote branch
# 2. Switches to main and pulls latest changes
# 3. Automatically deletes the local feature branch
# 4. Provides status feedback

set -e  # Exit on error

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if PR number provided
if [ -z "$1" ]; then
  echo -e "${RED}❌ Error: PR number required${NC}"
  echo "Usage: ./scripts/merge-pr.sh <pr_number>"
  exit 1
fi

PR_NUMBER=$1

# Get current branch before merging
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${YELLOW}📍 Current branch: $CURRENT_BRANCH${NC}"

# Merge PR with squash and delete remote branch
echo -e "${YELLOW}🔀 Merging PR #$PR_NUMBER...${NC}"
if gh pr merge "$PR_NUMBER" --squash --delete-branch; then
  echo -e "${GREEN}✅ PR #$PR_NUMBER merged successfully${NC}"
else
  echo -e "${RED}❌ Failed to merge PR #$PR_NUMBER${NC}"
  exit 1
fi

# Switch to main and pull
echo -e "${YELLOW}🔄 Switching to main branch...${NC}"
git checkout main
git pull origin main
echo -e "${GREEN}✅ Switched to main and pulled latest changes${NC}"

# Delete local branch if it exists and we're not on it
if [ "$CURRENT_BRANCH" != "main" ]; then
  BRANCH_EXISTS=$(git branch --list "$CURRENT_BRANCH")
  if [ -n "$BRANCH_EXISTS" ]; then
    if git branch -d "$CURRENT_BRANCH" 2>/dev/null; then
      echo -e "${GREEN}✅ Deleted local branch: $CURRENT_BRANCH${NC}"
    else
      echo -e "${YELLOW}⚠️  Could not delete branch $CURRENT_BRANCH (may have unmerged changes)${NC}"
      echo -e "${YELLOW}   Use 'git branch -D $CURRENT_BRANCH' to force delete${NC}"
    fi
  else
    echo -e "${GREEN}✅ Local branch already deleted: $CURRENT_BRANCH${NC}"
  fi
else
  echo -e "${GREEN}✅ Was already on main branch${NC}"
fi

echo -e "${GREEN}✅ Remote branch deleted by merge${NC}"
echo ""
echo -e "${GREEN}🎉 Cleanup complete! Ready for next feature.${NC}"
