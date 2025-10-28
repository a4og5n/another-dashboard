"use client";

/**
 * Date Range Filter Component
 * Date picker pair for filtering by date ranges (since/before)
 *
 * Supports both server and client component patterns:
 * - Server: Use createDateUrl for URL-based navigation
 * - Client: Use onChange for state-based updates
 *
 * @example Server Component
 * ```tsx
 * <DateRangeFilter
 *   sinceValue={since}
 *   beforeValue={before}
 *   createDateUrl={(since, before) => `/endpoint?since=${since}&before=${before}`}
 *   label="Created"
 * />
 * ```
 *
 * @example Client Component
 * ```tsx
 * <DateRangeFilter
 *   sinceValue={since}
 *   beforeValue={before}
 *   onChange={({ since, before }) => setDateRange({ since, before })}
 *   label="Created"
 * />
 * ```
 */

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { DateRangeFilterProps } from "@/types/components/mailchimp/filters";

export function DateRangeFilter({
  sinceValue,
  beforeValue,
  onChange,
  createDateUrl,
  label = "Date Range",
  includeTime = false,
  fieldNames = { since: "since", before: "before" },
}: DateRangeFilterProps) {
  const [since, setSince] = useState(sinceValue || "");
  const [before, setBefore] = useState(beforeValue || "");
  const isServerComponent = !!createDateUrl;

  const handleSinceChange = (value: string) => {
    setSince(value);
    if (onChange && !isServerComponent) {
      onChange({ since: value || undefined, before: before || undefined });
    }
  };

  const handleBeforeChange = (value: string) => {
    setBefore(value);
    if (onChange && !isServerComponent) {
      onChange({ since: since || undefined, before: value || undefined });
    }
  };

  const handleApply = () => {
    if (createDateUrl) {
      const url = createDateUrl(since || undefined, before || undefined);
      window.location.href = url;
    }
  };

  const handleClear = () => {
    setSince("");
    setBefore("");
    if (onChange) {
      onChange({ since: undefined, before: undefined });
    }
  };

  const inputType = includeTime ? "datetime-local" : "date";

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        {label}
      </Label>

      <div className="grid grid-cols-2 gap-2">
        {/* Since date */}
        <div className="space-y-1">
          <Label
            htmlFor={`${fieldNames.since}-input`}
            className="text-xs text-muted-foreground"
          >
            From
          </Label>
          <Input
            id={`${fieldNames.since}-input`}
            type={inputType}
            value={since ? (includeTime ? since : since.split("T")[0]) : ""}
            onChange={(e) => handleSinceChange(e.target.value)}
            placeholder={includeTime ? "Start date & time" : "Start date"}
          />
        </div>

        {/* Before date */}
        <div className="space-y-1">
          <Label
            htmlFor={`${fieldNames.before}-input`}
            className="text-xs text-muted-foreground"
          >
            To
          </Label>
          <Input
            id={`${fieldNames.before}-input`}
            type={inputType}
            value={before ? (includeTime ? before : before.split("T")[0]) : ""}
            onChange={(e) => handleBeforeChange(e.target.value)}
            placeholder={includeTime ? "End date & time" : "End date"}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {(since || before) && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="flex-1"
          >
            Clear
          </Button>
        )}
        {isServerComponent && (since || before) && (
          <Button
            type="button"
            size="sm"
            onClick={handleApply}
            className="flex-1"
          >
            Apply
          </Button>
        )}
      </div>

      {!since && !before && (
        <p className="text-xs text-muted-foreground">
          No date range selected. All dates will be included.
        </p>
      )}
    </div>
  );
}
