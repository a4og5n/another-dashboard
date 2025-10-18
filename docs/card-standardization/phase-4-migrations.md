# Phase 4: Migrate Example Components

**Estimated Time:** 45 minutes

**Goal:** Migrate 3 existing components to use the new Card patterns as proof of concept

---

## Pre-Phase Checklist

- [ ] Phase 3 completed
- [ ] Check git log to verify Phase 4 isn't already done
- [ ] All new Card components exist and tests pass

---

## Files to Modify

- `src/components/dashboard/reports/EmailsSentCard.tsx` - Migrate to StatCard
- `src/components/dashboard/reports/OpensCard.tsx` - Document potential StatsGridCard usage
- `src/components/dashboard/reports/DeliveryStatusCard.tsx` - Document potential StatusCard usage

---

## Implementation Steps

### Step 1: Read Current Implementation

Before modifying, review the current implementations:

```bash
# Review EmailsSentCard
cat src/components/dashboard/reports/EmailsSentCard.tsx

# Review OpensCard (for documentation purposes)
cat src/components/dashboard/reports/OpensCard.tsx

# Review DeliveryStatusCard (for documentation purposes)
cat src/components/dashboard/reports/DeliveryStatusCard.tsx
```

### Step 2: Migrate EmailsSentCard to StatCard

Update `src/components/dashboard/reports/EmailsSentCard.tsx`:

```tsx
/**
 * Emails Sent Card Component
 * Displays the total number of emails sent in a campaign
 *
 * Issue #135: Campaign report detail UI components - Emails Sent Card
 * Migrated to use standardized StatCard component
 */

"use client";

import { StatCard } from "@/components/ui/stat-card";
import { Mail } from "lucide-react";
import type { EmailsSentCardProps } from "@/types/components/dashboard/reports";

export function EmailsSentCard({ emailsSent, className }: EmailsSentCardProps) {
  return (
    <StatCard
      icon={Mail}
      value={emailsSent}
      label="Emails Sent"
      iconColor="var(--muted-foreground)"
      className={className}
    />
  );
}
```

**Before/After Comparison:**

- **Before:** ~29 lines using BaseMetricCard
- **After:** ~17 lines using StatCard
- **Savings:** 12 lines (41% reduction)
- **Benefits:** Simpler, more declarative, same functionality

### Step 3: Document OpensCard Migration Potential

OpensCard has complex interactive features (toggle switch for proxy-excluded metrics). This is a good example of when **NOT** to use the standard components.

Add a comment at the top of `src/components/dashboard/reports/OpensCard.tsx`:

```tsx
/**
 * Campaign Report Opens Card Component
 * Displays email open statistics with a toggle between regular and proxy-excluded metrics
 *
 * NOTE: This component uses custom Card implementation due to complex interactive features
 * (toggle switch, conditional data display). Standard StatsGridCard would not provide
 * sufficient flexibility for this use case.
 *
 * For simpler multi-stat displays without interactive features, consider using StatsGridCard.
 */
```

### Step 4: Document DeliveryStatusCard Migration Potential

DeliveryStatusCard could potentially use StatusCard, but has custom progress bar logic and conditional rendering.

Add a comment at the top of `src/components/dashboard/reports/DeliveryStatusCard.tsx`:

```tsx
/**
 * Delivery Status Card Component
 * Displays the campaign delivery status information in a card format
 *
 * Issue #135: Campaign report detail UI components - Delivery Status
 *
 * NOTE: This component could potentially be refactored to use StatusCard component,
 * but would require adapting the custom progress bar logic and conditional rendering.
 * Consider migration in future refactoring pass.
 *
 * Example StatusCard usage for simpler status displays:
 * <StatusCard
 *   title="Delivery Status"
 *   status={deliveryStatus.status}
 *   statusVariant={getBadgeVariant(deliveryStatus.status)}
 *   metrics={[
 *     { label: "Emails Sent", value: deliveryStatus.emails_sent },
 *     { label: "Emails Canceled", value: deliveryStatus.emails_canceled }
 *   ]}
 * />
 */
```

---

## Validation Steps

### Run Tests

```bash
# Run tests for EmailsSentCard (if they exist)
pnpm test src/components/dashboard/reports/EmailsSentCard

# Run type checking
pnpm type-check

# Run linting
pnpm lint
```

### Manual Testing

```bash
# Start dev server
pnpm dev

# Navigate to a campaign report page
# Example: http://localhost:3000/mailchimp/reports/[some-campaign-id]

# Verify:
# 1. EmailsSentCard renders correctly
# 2. Shows the correct number format
# 3. No console errors
# 4. Visual appearance unchanged
```

### Manual Testing Checklist

- [ ] EmailsSentCard displays correctly on campaign report page
- [ ] Number formatting works (commas for thousands)
- [ ] Icon displays correctly
- [ ] No visual regressions
- [ ] No console errors

---

## Checkpoint: COMMIT

```bash
git add src/components/dashboard/reports/EmailsSentCard.tsx src/components/dashboard/reports/OpensCard.tsx src/components/dashboard/reports/DeliveryStatusCard.tsx
git commit -m "refactor(dashboard): migrate EmailsSentCard to use StatCard

- Replace BaseMetricCard usage with new StatCard component
- Reduces component code by 12 lines (41% reduction)
- Maintains all existing functionality
- Add migration notes to OpensCard and DeliveryStatusCard
- No breaking changes"
```

---

## ✅ Phase 4 Complete

**Next Step:** Proceed to [Phase 5: Documentation and Final Validation](./phase-5-documentation.md)

---

## Migration Analysis Summary

### Successfully Migrated

1. **EmailsSentCard** → StatCard
   - Simple use case, perfect fit
   - 41% code reduction
   - Zero breaking changes

### Not Suitable for Migration (Documented)

2. **OpensCard**
   - Too complex (toggle switch, conditional data)
   - Custom implementation justified
   - Added documentation about when to use StatsGridCard

3. **DeliveryStatusCard**
   - Could be migrated but requires significant refactoring
   - Marked for future consideration
   - Added example of how StatusCard could be used

### Future Migration Candidates

The following components are good candidates for future migration:

**StatCard candidates:**

- `ForwardsCard` - Simple metric display
- `EcommerceCard` - Simple metric display (if simple version)

**StatsGridCard candidates:**

- `ClicksCard` - Has grid of stats without complex interactions
- `ListStatsCard` - Multiple stats in grid layout

**StatusCard candidates:**

- (None identified yet - would need new status-based components)

**Estimated future savings:** ~300 additional lines of code

---

## Troubleshooting

### "EmailsSentCard tests fail after migration"

```bash
# Check if tests were checking for BaseMetricCard specifics
cat src/components/dashboard/reports/EmailsSentCard.test.tsx

# Update tests to check for StatCard behavior instead
# Look for assertions about component structure that may have changed
```

### "Visual regression in EmailsSentCard"

```bash
# Revert the migration
git checkout HEAD -- src/components/dashboard/reports/EmailsSentCard.tsx

# Compare with StatCard props
# Ensure all styling props are passed correctly (className, iconColor)
```

### "Type errors after migration"

```bash
# Verify EmailsSentCardProps hasn't changed
cat src/types/components/dashboard/reports.ts

# StatCard should accept the same data format
# Check that value type matches (number vs string)
```
