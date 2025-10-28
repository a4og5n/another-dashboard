"use client";

/**
 * Field Selector Component
 * Multi-select interface for choosing which API fields to include/exclude
 *
 * Supports both server and client component patterns:
 * - Server: Use createFieldUrl for URL-based navigation
 * - Client: Use onChange for state-based updates
 *
 * @example Server Component
 * ```tsx
 * <FieldSelector
 *   selectedFields={fields?.split(',')}
 *   createFieldUrl={(fields) => `/endpoint?fields=${fields}`}
 *   availableFields={['id', 'name', 'email']}
 * />
 * ```
 *
 * @example Client Component
 * ```tsx
 * <FieldSelector
 *   selectedFields={fields}
 *   onChange={({ selected }) => setFields(selected)}
 *   availableFields={['id', 'name', 'email']}
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { FieldSelectorProps } from "@/types/components/mailchimp/filters";

export function FieldSelector({
  selectedFields = [],
  excludedFields = [],
  availableFields,
  onChange,
  createFieldUrl,
  label = "Fields",
  allowExclude = true,
}: FieldSelectorProps) {
  const [mode, setMode] = useState<"include" | "exclude">("include");
  const [customField, setCustomField] = useState("");

  const activeFields = mode === "include" ? selectedFields : excludedFields;
  const isServerComponent = !!createFieldUrl;

  const handleAddField = (field: string) => {
    if (!field || activeFields.includes(field)) return;

    const newFields = [...activeFields, field];

    if (onChange) {
      onChange(
        mode === "include"
          ? { selected: newFields, excluded: excludedFields }
          : { selected: selectedFields, excluded: newFields },
      );
    }

    setCustomField("");
  };

  const handleRemoveField = (field: string) => {
    const newFields = activeFields.filter((f) => f !== field);

    if (onChange) {
      onChange(
        mode === "include"
          ? { selected: newFields, excluded: excludedFields }
          : { selected: selectedFields, excluded: newFields },
      );
    }
  };

  const handleApply = () => {
    if (createFieldUrl) {
      const url = createFieldUrl(
        selectedFields.length > 0 ? selectedFields.join(",") : undefined,
        excludedFields.length > 0 ? excludedFields.join(",") : undefined,
      );
      window.location.href = url;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        {allowExclude && (
          <div className="flex gap-1">
            <Button
              type="button"
              variant={mode === "include" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("include")}
            >
              Include
            </Button>
            <Button
              type="button"
              variant={mode === "exclude" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("exclude")}
            >
              Exclude
            </Button>
          </div>
        )}
      </div>

      {/* Field selection */}
      <div className="flex gap-2">
        {availableFields ? (
          <Select onValueChange={handleAddField}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a field..." />
            </SelectTrigger>
            <SelectContent>
              {availableFields
                .filter((f) => !activeFields.includes(f))
                .map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            placeholder="Enter field name..."
            value={customField}
            onChange={(e) => setCustomField(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddField(customField);
              }
            }}
            className="flex-1"
          />
        )}
        {!availableFields && (
          <Button
            type="button"
            onClick={() => handleAddField(customField)}
            disabled={!customField}
          >
            Add
          </Button>
        )}
      </div>

      {/* Selected fields */}
      {activeFields.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFields.map((field) => (
            <div
              key={field}
              className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm"
            >
              {field}
              <button
                type="button"
                onClick={() => handleRemoveField(field)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Apply button for server components */}
      {isServerComponent &&
        (selectedFields.length > 0 || excludedFields.length > 0) && (
          <Button
            type="button"
            onClick={handleApply}
            size="sm"
            className="w-full"
          >
            Apply Filters
          </Button>
        )}

      {activeFields.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {mode === "include"
            ? "No fields selected. All fields will be included."
            : "No fields excluded. All fields will be shown."}
        </p>
      )}
    </div>
  );
}
