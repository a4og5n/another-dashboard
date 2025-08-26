import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  dateRange?: DateRange;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onPresetSelect?: (range: DateRange | undefined) => void; // Immediate execution for presets
  className?: string;
}

const presetRanges = {
  last_7_days: {
    label: "Last 7 days",
    range: () => ({
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      to: new Date(),
    }),
  },
  last_30_days: {
    label: "Last 30 days",
    range: () => ({
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date(),
    }),
  },
  last_3_months: {
    label: "Last 3 months",
    range: () => {
      const to = new Date();
      const from = new Date();
      from.setMonth(from.getMonth() - 3);
      return { from, to };
    },
  },
  last_6_months: {
    label: "Last 6 months",
    range: () => {
      const to = new Date();
      const from = new Date();
      from.setMonth(from.getMonth() - 6);
      return { from, to };
    },
  },
  last_year: {
    label: "Last year",
    range: () => {
      const to = new Date();
      const from = new Date();
      from.setFullYear(from.getFullYear() - 1);
      return { from, to };
    },
  },
};

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  onPresetSelect,
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [pendingRange, setPendingRange] = React.useState<DateRange | undefined>(
    dateRange,
  );

  // Update pending range when external dateRange changes
  React.useEffect(() => {
    setPendingRange(dateRange);
  }, [dateRange]);

  const handlePresetSelect = (preset: keyof typeof presetRanges) => {
    const range = presetRanges[preset].range();
    setPendingRange(range);
    if (onPresetSelect) {
      onPresetSelect(range); // Immediate execution for presets
    } else {
      onDateRangeChange(range); // Fallback to regular callback
    }
    setIsOpen(false);
  };

  const handleManualSelection = (range: DateRange | undefined) => {
    setPendingRange(range); // Just update pending state, don't execute yet
  };

  const handleSubmit = () => {
    onDateRangeChange(pendingRange); // Execute the pending selection
    setIsOpen(false);
  };

  const handleClear = () => {
    setPendingRange(undefined);
    onDateRangeChange(undefined);
    setIsOpen(false);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-range-picker"
            variant="outline"
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !dateRange && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {pendingRange?.from ? (
              pendingRange.to ? (
                <>
                  {format(pendingRange.from, "LLL dd, y")} -{" "}
                  {format(pendingRange.to, "LLL dd, y")}
                </>
              ) : (
                format(pendingRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {/* Preset ranges sidebar */}
            <div className="w-40 border-r p-3">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Presets</h4>
                <div className="space-y-1">
                  {Object.entries(presetRanges).map(([key, preset]) => (
                    <Button
                      key={key}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start p-2 h-8"
                      onClick={() => {
                        handlePresetSelect(key as keyof typeof presetRanges);
                      }}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            {/* Calendar */}
            <div className="flex flex-col">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={pendingRange?.from}
                selected={pendingRange}
                onSelect={handleManualSelection}
                numberOfMonths={2}
              />
              {/* Submit button for manual selections */}
              <div className="border-t p-3 flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!pendingRange?.from}
                >
                  Apply Filter
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {pendingRange && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
