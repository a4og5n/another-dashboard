"use client";

/**
 * Sorting Controls Component
 * Dropdown interface for selecting sort field and direction
 *
 * Supports both server and client component patterns:
 * - Server: Use createSortUrl for URL-based navigation
 * - Client: Use onChange for state-based updates
 *
 * @example Server Component
 * ```tsx
 * <SortingControls
 *   sortField={sortField}
 *   sortDirection={sortDir}
 *   availableFields={['name', 'date_created', 'member_count']}
 *   createSortUrl={(field, dir) => `/endpoint?sort_field=${field}&sort_dir=${dir}`}
 * />
 * ```
 *
 * @example Client Component
 * ```tsx
 * <SortingControls
 *   sortField={sortField}
 *   sortDirection={sortDir}
 *   availableFields={['name', 'date_created']}
 *   onChange={({ field, direction }) => setSort({ field, direction })}
 * />
 * ```
 */

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowUp, ArrowDown } from "lucide-react";
import { SortingControlsProps } from "@/types/components/mailchimp/filters";

export function SortingControls({
  sortField,
  sortDirection = "ASC",
  availableFields,
  onChange,
  createSortUrl,
  label = "Sort By",
  fieldLabels = {},
}: SortingControlsProps) {
  const [field, setField] = useState(sortField || "");
  const [direction, setDirection] = useState<"ASC" | "DESC">(sortDirection);
  const isServerComponent = !!createSortUrl;

  const handleFieldChange = (newField: string) => {
    setField(newField);
    if (onChange && !isServerComponent) {
      onChange({ field: newField, direction });
    }
  };

  const handleDirectionToggle = () => {
    const newDirection = direction === "ASC" ? "DESC" : "ASC";
    setDirection(newDirection);
    if (onChange && !isServerComponent) {
      onChange({ field, direction: newDirection });
    }
  };

  const handleApply = () => {
    if (createSortUrl) {
      const url = createSortUrl(field || undefined, direction);
      window.location.href = url;
    }
  };

  const handleClear = () => {
    setField("");
    if (onChange) {
      onChange({ field: undefined, direction: "ASC" });
    }
  };

  const getFieldLabel = (fieldName: string) => {
    return fieldLabels[fieldName] || fieldName;
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      <div className="flex gap-2">
        {/* Field selector */}
        <Select value={field} onValueChange={handleFieldChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select field..." />
          </SelectTrigger>
          <SelectContent>
            {availableFields.map((fieldName) => (
              <SelectItem key={fieldName} value={fieldName}>
                {getFieldLabel(fieldName)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Direction toggle */}
        {field && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleDirectionToggle}
            title={direction === "ASC" ? "Ascending" : "Descending"}
          >
            {direction === "ASC" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Current sort display */}
      {field && (
        <div className="flex items-center justify-between rounded-md bg-secondary px-3 py-2 text-sm">
          <span>
            Sorted by <strong>{getFieldLabel(field)}</strong> (
            {direction === "ASC" ? "ascending" : "descending"})
          </span>
          <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
            Clear
          </Button>
        </div>
      )}

      {/* Apply button for server components */}
      {isServerComponent && field && (
        <Button
          type="button"
          onClick={handleApply}
          size="sm"
          className="w-full"
        >
          Apply Sort
        </Button>
      )}

      {!field && (
        <p className="text-sm text-muted-foreground">
          No sorting applied. Default order will be used.
        </p>
      )}
    </div>
  );
}
