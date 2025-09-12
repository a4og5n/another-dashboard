"use client";

/**
 * AB Split Testing Card Component
 * Displays the A/B test results comparison from campaign reports
 *
 * Issue #135: Campaign report detail UI components - A/B Testing Results
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
  Tabs,
  // TabsContent, // Removed unused import
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { type AbSplitCardProps } from "@/types/components";
import { LuSplit } from "react-icons/lu";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDateTimeSafe } from "@/utils";

export function AbSplitCard({ abSplit, className }: AbSplitCardProps) {
  const [metricType, setMetricType] = useState<string>("opens");

  // Calculate percentage differences between A and B variants
  const getPercentDiff = (metricA: number, metricB: number) => {
    if (metricA === 0) return { diff: 0, winner: null };

    const diff = ((metricB - metricA) / metricA) * 100;
    const winner = diff > 0 ? "B" : diff < 0 ? "A" : null;

    return { diff: Math.abs(diff), winner };
  };

  // Prepare data for the bar chart comparison
  const getComparisonData = () => {
    if (metricType === "opens") {
      return [
        { name: "Total Opens", A: abSplit.a.opens, B: abSplit.b.opens },
        {
          name: "Unique Opens",
          A: abSplit.a.unique_opens,
          B: abSplit.b.unique_opens,
        },
      ];
    } else if (metricType === "clicks") {
      return [
        {
          name: "Recipient Clicks",
          A: abSplit.a.recipient_clicks,
          B: abSplit.b.recipient_clicks,
        },
      ];
    } else if (metricType === "forwards") {
      return [
        { name: "Forwards", A: abSplit.a.forwards, B: abSplit.b.forwards },
        {
          name: "Forward Opens",
          A: abSplit.a.forwards_opens,
          B: abSplit.b.forwards_opens,
        },
      ];
    } else if (metricType === "negative") {
      return [
        { name: "Bounces", A: abSplit.a.bounces, B: abSplit.b.bounces },
        {
          name: "Abuse Reports",
          A: abSplit.a.abuse_reports,
          B: abSplit.b.abuse_reports,
        },
        { name: "Unsubscribes", A: abSplit.a.unsubs, B: abSplit.b.unsubs },
      ];
    }

    // Default to opens
    return [
      { name: "Total Opens", A: abSplit.a.opens, B: abSplit.b.opens },
      {
        name: "Unique Opens",
        A: abSplit.a.unique_opens,
        B: abSplit.b.unique_opens,
      },
    ];
  };

  // Calculate important metrics differences
  const opensDiff = getPercentDiff(abSplit.a.opens, abSplit.b.opens);
  const uniqueOpensDiff = getPercentDiff(
    abSplit.a.unique_opens,
    abSplit.b.unique_opens,
  );
  const clicksDiff = getPercentDiff(
    abSplit.a.recipient_clicks,
    abSplit.b.recipient_clicks,
  );
  // const bouncesDiff = getPercentDiff(abSplit.a.bounces, abSplit.b.bounces); // Removed unused variable
  const unsubsDiff = getPercentDiff(abSplit.a.unsubs, abSplit.b.unsubs);

  // Determine overall winner based on opens and clicks
  const determineWinner = () => {
    // Score system: opens (2 points), unique opens (2 points), clicks (3 points)
    // negative impact: bounces (-1), unsubs (-2)
    let scoreA = 0;
    let scoreB = 0;

    // Opens
    if (abSplit.a.opens > abSplit.b.opens) scoreA += 2;
    else if (abSplit.b.opens > abSplit.a.opens) scoreB += 2;

    // Unique opens
    if (abSplit.a.unique_opens > abSplit.b.unique_opens) scoreA += 2;
    else if (abSplit.b.unique_opens > abSplit.a.unique_opens) scoreB += 2;

    // Clicks (higher weight)
    if (abSplit.a.recipient_clicks > abSplit.b.recipient_clicks) scoreA += 3;
    else if (abSplit.b.recipient_clicks > abSplit.a.recipient_clicks)
      scoreB += 3;

    // Bounces (negative)
    if (abSplit.a.bounces > abSplit.b.bounces) scoreA -= 1;
    else if (abSplit.b.bounces > abSplit.a.bounces) scoreB -= 1;

    // Unsubscribes (more negative)
    if (abSplit.a.unsubs > abSplit.b.unsubs) scoreA -= 2;
    else if (abSplit.b.unsubs > abSplit.a.unsubs) scoreB -= 2;

    if (scoreA > scoreB) return "A";
    if (scoreB > scoreA) return "B";
    return "Tie";
  };

  const winner = determineWinner();

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LuSplit className="h-5 w-5 text-primary" />
            <CardTitle>A/B Testing Results</CardTitle>
          </div>
          <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Winner: {winner === "Tie" ? "Tie" : `Version ${winner}`}
          </div>
        </div>
        <CardDescription>
          Comparison of performance between A/B test variants
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Key Metrics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-lg bg-muted p-3">
            <div className="text-muted-foreground text-sm">Opens</div>
            <div className="flex items-end justify-between">
              <div className="text-xl font-bold mt-1">
                {opensDiff.diff.toFixed(1)}%
              </div>
              <div className="text-sm font-medium">
                {opensDiff.winner ? `Version ${opensDiff.winner} wins` : "Tie"}
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3">
            <div className="text-muted-foreground text-sm">Unique Opens</div>
            <div className="flex items-end justify-between">
              <div className="text-xl font-bold mt-1">
                {uniqueOpensDiff.diff.toFixed(1)}%
              </div>
              <div className="text-sm font-medium">
                {uniqueOpensDiff.winner
                  ? `Version ${uniqueOpensDiff.winner} wins`
                  : "Tie"}
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3">
            <div className="text-muted-foreground text-sm">Clicks</div>
            <div className="flex items-end justify-between">
              <div className="text-xl font-bold mt-1">
                {clicksDiff.diff.toFixed(1)}%
              </div>
              <div className="text-sm font-medium">
                {clicksDiff.winner
                  ? `Version ${clicksDiff.winner} wins`
                  : "Tie"}
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3">
            <div className="text-muted-foreground text-sm">Unsubscribes</div>
            <div className="flex items-end justify-between">
              <div className="text-xl font-bold mt-1">
                {unsubsDiff.diff.toFixed(1)}%
              </div>
              <div className="text-sm font-medium">
                {unsubsDiff.winner === "B"
                  ? "Version A wins"
                  : unsubsDiff.winner === "A"
                    ? "Version B wins"
                    : "Tie"}
                {/* For unsubscribes, lower is better so we invert the winner */}
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Comparison Chart */}
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <Tabs
              value={metricType}
              onValueChange={setMetricType}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="opens">Opens</TabsTrigger>
                <TabsTrigger value="clicks">Clicks</TabsTrigger>
                <TabsTrigger value="forwards">Forwards</TabsTrigger>
                <TabsTrigger value="negative">Negative</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getComparisonData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="A" fill="#8884d8" name="Version A" />
                <Bar dataKey="B" fill="#82ca9d" name="Version B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Last Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-1">Version A Last Activity</h4>
            <p className="text-muted-foreground">
              Last opened: {formatDateTimeSafe(abSplit.a.last_open)}
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Version B Last Activity</h4>
            <p className="text-muted-foreground">
              Last opened: {formatDateTimeSafe(abSplit.b.last_open)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
