import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateFilterPopoverProps {
  dateRange?: DateRange;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onPresetSelect?: (range: DateRange | undefined) => void;
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

export function DateFilterPopover({
  dateRange,
  onDateRangeChange,
  onPresetSelect,
  className,
}: DateFilterPopoverProps) {
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

  const handleSubmit = () => {
    onDateRangeChange(pendingRange); // Execute the pending selection
    setIsOpen(false);
  };

  // Show active state if there's a current filter
  const hasActiveFilter = dateRange?.from || dateRange?.to;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 w-8 p-0",
            hasActiveFilter && "text-blue-600 bg-blue-50 hover:bg-blue-100",
            className,
          )}
          title="Filter by date range (start date, end date, or both)"
        >
          <CalendarIcon className="h-4 w-4" />
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
          {/* Two separate calendars - one for start date, one for end date */}
          <div className="flex">
            {/* Start Date Calendar */}
            <div className="flex flex-col border-r">
              <div className="px-3 py-2 border-b bg-muted/30">
                <h4 className="text-sm font-medium text-center">Start Date</h4>
              </div>
              <Calendar
                mode="single"
                selected={pendingRange?.from}
                onSelect={(date) =>
                  setPendingRange({ from: date, to: pendingRange?.to })
                }
                defaultMonth={pendingRange?.from || new Date()}
                initialFocus
              />
            </div>
            {/* End Date Calendar */}
            <div className="flex flex-col">
              <div className="px-3 py-2 border-b bg-muted/30">
                <h4 className="text-sm font-medium text-center">End Date</h4>
              </div>
              <Calendar
                mode="single"
                selected={pendingRange?.to}
                onSelect={(date) =>
                  setPendingRange({ from: pendingRange?.from, to: date })
                }
                defaultMonth={
                  pendingRange?.to ||
                  (pendingRange?.from
                    ? new Date(
                        pendingRange.from.getFullYear(),
                        pendingRange.from.getMonth() + 1,
                        1,
                      )
                    : new Date())
                }
              />
            </div>
          </div>
          {/* Apply button */}
          <div className="border-t p-3 flex justify-center">
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!pendingRange?.from && !pendingRange?.to}
            >
              Apply Filter
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
