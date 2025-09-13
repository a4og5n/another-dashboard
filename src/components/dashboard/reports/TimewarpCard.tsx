"use client";

/**
 * Timewarp Card Component
 * Displays the campaign timewarp data showing performance across different time zones
 *
 * Issue #135: Campaign report detail UI components - Timewarp Analysis
 * Following established patterns from existing dashboard components
 */

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LuGlobe } from "react-icons/lu";
import type { TimewarpCardProps } from "@/types/components/dashboard/reports";
import { formatDateTimeSafe, formatTimezone } from "@/utils";

export function TimewarpCard({ timewarp, className }: TimewarpCardProps) {
  const [sortField, setSortField] = useState<string>("gmt_offset");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Sort timewarp data based on selected field and direction
  const sortedData = [...timewarp].sort((a, b) => {
    if (sortField === "gmt_offset") {
      return sortDirection === "asc"
        ? a.gmt_offset - b.gmt_offset
        : b.gmt_offset - a.gmt_offset;
    }

    if (sortField === "opens") {
      return sortDirection === "asc" ? a.opens - b.opens : b.opens - a.opens;
    }

    if (sortField === "unique_opens") {
      return sortDirection === "asc"
        ? a.unique_opens - b.unique_opens
        : b.unique_opens - a.unique_opens;
    }

    if (sortField === "clicks") {
      return sortDirection === "asc"
        ? a.clicks - b.clicks
        : b.clicks - a.clicks;
    }

    if (sortField === "unique_clicks") {
      return sortDirection === "asc"
        ? a.unique_clicks - b.unique_clicks
        : b.unique_clicks - a.unique_clicks;
    }

    if (sortField === "bounces") {
      return sortDirection === "asc"
        ? a.bounces - b.bounces
        : b.bounces - a.bounces;
    }

    // Default sort by GMT offset
    return sortDirection === "asc"
      ? a.gmt_offset - b.gmt_offset
      : b.gmt_offset - a.gmt_offset;
  });

  // Calculate totals for the metrics
  const totals = timewarp.reduce(
    (acc, item) => ({
      opens: acc.opens + item.opens,
      unique_opens: acc.unique_opens + item.unique_opens,
      clicks: acc.clicks + item.clicks,
      unique_clicks: acc.unique_clicks + item.unique_clicks,
      bounces: acc.bounces + item.bounces,
    }),
    { opens: 0, unique_opens: 0, clicks: 0, unique_clicks: 0, bounces: 0 },
  );

  // Toggle sort direction or change sort field
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LuGlobe className="h-5 w-5 text-primary" />
            <CardTitle>Timewarp Analysis</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortField} onValueChange={setSortField}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gmt_offset">Time Zone</SelectItem>
                <SelectItem value="opens">Opens</SelectItem>
                <SelectItem value="unique_opens">Unique Opens</SelectItem>
                <SelectItem value="clicks">Clicks</SelectItem>
                <SelectItem value="unique_clicks">Unique Clicks</SelectItem>
                <SelectItem value="bounces">Bounces</SelectItem>
              </SelectContent>
            </Select>
            <button
              onClick={() =>
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              }
              className="p-2 rounded-md hover:bg-accent text-sm"
              aria-label={`Sort ${sortDirection === "asc" ? "descending" : "ascending"}`}
            >
              {sortDirection === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>
        <CardDescription>
          Campaign performance metrics across different time zones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleSort("gmt_offset")}
                >
                  Time Zone{" "}
                  {sortField === "gmt_offset" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted text-right"
                  onClick={() => handleSort("opens")}
                >
                  Opens{" "}
                  {sortField === "opens" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted text-right"
                  onClick={() => handleSort("unique_opens")}
                >
                  Unique Opens{" "}
                  {sortField === "unique_opens" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted text-right"
                  onClick={() => handleSort("clicks")}
                >
                  Clicks{" "}
                  {sortField === "clicks" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted text-right"
                  onClick={() => handleSort("unique_clicks")}
                >
                  Unique Clicks{" "}
                  {sortField === "unique_clicks" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted text-right"
                  onClick={() => handleSort("bounces")}
                >
                  Bounces{" "}
                  {sortField === "bounces" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((zone, index) => (
                <TableRow key={index}>
                  <TableCell>{formatTimezone(zone.gmt_offset)}</TableCell>
                  <TableCell className="text-right">
                    {zone.opens.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {zone.unique_opens.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {zone.clicks.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {zone.unique_clicks.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {zone.bounces.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {/* Totals row */}
              <TableRow className="bg-muted/50 font-medium">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">
                  {totals.opens.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {totals.unique_opens.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {totals.clicks.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {totals.unique_clicks.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {totals.bounces.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Last Open Activity</h4>
            <div className="text-sm text-muted-foreground">
              {sortedData.length > 0 && sortedData[0].last_open
                ? formatDateTimeSafe(sortedData[0].last_open)
                : "No activity recorded"}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Last Click Activity</h4>
            <div className="text-sm text-muted-foreground">
              {sortedData.length > 0 && sortedData[0].last_click
                ? formatDateTimeSafe(sortedData[0].last_click)
                : "No activity recorded"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
