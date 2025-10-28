"use client";

/**
 * Member Status Toggles Component
 * Checkbox toggles for including members with special statuses
 *
 * Supports both server and client component patterns:
 * - Server: Use createStatusUrl for URL-based navigation
 * - Client: Use onChange for state-based updates
 *
 * @example Server Component
 * ```tsx
 * <MemberStatusToggles
 *   includeCleaned={includeCleaned}
 *   includeTransactional={includeTransactional}
 *   includeUnsubscribed={includeUnsubscribed}
 *   createStatusUrl={(cleaned, transactional, unsubscribed) =>
 *     `/endpoint?include_cleaned=${cleaned}&include_transactional=${transactional}&include_unsubscribed=${unsubscribed}`
 *   }
 * />
 * ```
 *
 * @example Client Component
 * ```tsx
 * <MemberStatusToggles
 *   includeCleaned={includeCleaned}
 *   includeTransactional={includeTransactional}
 *   includeUnsubscribed={includeUnsubscribed}
 *   onChange={({ includeCleaned, includeTransactional, includeUnsubscribed }) =>
 *     setStatus({ includeCleaned, includeTransactional, includeUnsubscribed })
 *   }
 * />
 * ```
 */

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { MemberStatusTogglesProps } from "@/types/components/mailchimp/filters";

export function MemberStatusToggles({
  includeCleaned = false,
  includeTransactional = false,
  includeUnsubscribed = false,
  onChange,
  createStatusUrl,
  label = "Member Status Filters",
  showHelp = true,
}: MemberStatusTogglesProps) {
  const [cleaned, setCleaned] = useState(includeCleaned);
  const [transactional, setTransactional] = useState(includeTransactional);
  const [unsubscribed, setUnsubscribed] = useState(includeUnsubscribed);
  const isServerComponent = !!createStatusUrl;

  const handleToggle = (
    type: "cleaned" | "transactional" | "unsubscribed",
    value: boolean,
  ) => {
    let newCleaned = cleaned;
    let newTransactional = transactional;
    let newUnsubscribed = unsubscribed;

    if (type === "cleaned") {
      setCleaned(value);
      newCleaned = value;
    } else if (type === "transactional") {
      setTransactional(value);
      newTransactional = value;
    } else {
      setUnsubscribed(value);
      newUnsubscribed = value;
    }

    if (onChange && !isServerComponent) {
      onChange({
        includeCleaned: newCleaned,
        includeTransactional: newTransactional,
        includeUnsubscribed: newUnsubscribed,
      });
    }
  };

  const handleApply = () => {
    if (createStatusUrl) {
      const url = createStatusUrl(
        cleaned || undefined,
        transactional || undefined,
        unsubscribed || undefined,
      );
      window.location.href = url;
    }
  };

  const hasAnyToggled = cleaned || transactional || unsubscribed;

  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        {label}
      </Label>

      {/* Cleaned members toggle */}
      <div className="flex items-start justify-between space-x-3">
        <div className="space-y-1 flex-1">
          <Label
            htmlFor="include-cleaned"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Include Cleaned Members
          </Label>
          {showHelp && (
            <p className="text-xs text-muted-foreground">
              Members whose email addresses have been identified as invalid or
              non-existent
            </p>
          )}
        </div>
        <Switch
          id="include-cleaned"
          checked={cleaned}
          onCheckedChange={(value) => handleToggle("cleaned", value)}
        />
      </div>

      {/* Transactional members toggle */}
      <div className="flex items-start justify-between space-x-3">
        <div className="space-y-1 flex-1">
          <Label
            htmlFor="include-transactional"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Include Transactional Members
          </Label>
          {showHelp && (
            <p className="text-xs text-muted-foreground">
              Members who only receive transactional emails (e.g., order
              confirmations)
            </p>
          )}
        </div>
        <Switch
          id="include-transactional"
          checked={transactional}
          onCheckedChange={(value) => handleToggle("transactional", value)}
        />
      </div>

      {/* Unsubscribed members toggle */}
      <div className="flex items-start justify-between space-x-3">
        <div className="space-y-1 flex-1">
          <Label
            htmlFor="include-unsubscribed"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Include Unsubscribed Members
          </Label>
          {showHelp && (
            <p className="text-xs text-muted-foreground">
              Members who have opted out of receiving marketing emails
            </p>
          )}
        </div>
        <Switch
          id="include-unsubscribed"
          checked={unsubscribed}
          onCheckedChange={(value) => handleToggle("unsubscribed", value)}
        />
      </div>

      {/* Apply button for server components */}
      {isServerComponent && hasAnyToggled && (
        <Button
          type="button"
          onClick={handleApply}
          size="sm"
          className="w-full"
        >
          Apply Filters
        </Button>
      )}

      {!hasAnyToggled && (
        <p className="text-sm text-muted-foreground rounded-md bg-secondary px-3 py-2">
          Only subscribed members will be shown by default.
        </p>
      )}
    </div>
  );
}
