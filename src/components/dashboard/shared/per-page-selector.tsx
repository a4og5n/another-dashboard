import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Link from "next/link";
import React from "react";
import { PerPageSelectorProps, PER_PAGE_OPTIONS } from "@/types/components/ui";

export function PerPageSelector({
  value,
  options = [...PER_PAGE_OPTIONS],
  onChange,
  createPerPageUrl,
  itemName = "campaigns per page",
}: PerPageSelectorProps) {
  // URL-based navigation (for server components)
  if (createPerPageUrl) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">Show</span>
        <div className="flex space-x-1">
          {options.map((option) => (
            <Link
              key={option}
              href={createPerPageUrl(option)}
              className={`px-2 py-1 text-sm rounded ${
                value === option
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              {option}
            </Link>
          ))}
        </div>
        <span className="text-sm text-muted-foreground">{itemName}</span>
      </div>
    );
  }

  // Callback-based navigation (for client components)
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Show</span>
      <Select
        value={value.toString()}
        onValueChange={(val) => onChange?.(Number(val))}
      >
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-sm text-muted-foreground">{itemName}</span>
    </div>
  );
}
