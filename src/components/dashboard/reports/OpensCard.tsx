"use client";

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

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MailOpen, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { OpensCardProps } from "@/types/components/dashboard/reports";

export function OpensCard({ opens, campaignId }: OpensCardProps) {
  const [showProxyExcluded, setShowProxyExcluded] = useState(false);

  // Format last open date as a relative time (e.g., "2 days ago")
  const lastOpenDate = new Date(opens.last_open);
  const lastOpenRelative = formatDistanceToNow(lastOpenDate, {
    addSuffix: true,
  });

  // Calculate the values to display based on the toggle state
  const totalOpens =
    showProxyExcluded && opens.proxy_excluded_opens !== undefined
      ? opens.proxy_excluded_opens
      : opens.opens_total;

  const uniqueOpens =
    showProxyExcluded && opens.proxy_excluded_unique_opens !== undefined
      ? opens.proxy_excluded_unique_opens
      : opens.unique_opens;

  const openRate =
    showProxyExcluded && opens.proxy_excluded_open_rate !== undefined
      ? opens.proxy_excluded_open_rate
      : opens.open_rate;

  // Calculate percentage of unique opens vs total opens
  const uniquePercentage =
    totalOpens > 0 ? ((uniqueOpens / totalOpens) * 100).toFixed(1) : "0.0";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-base">
            <MailOpen className="h-4 w-4 text-blue-500" />
            <span>Email Opens</span>
          </CardTitle>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground cursor-pointer">
              Exclude Proxies
            </span>
            <Switch
              id="proxy-toggle"
              checked={showProxyExcluded}
              onCheckedChange={setShowProxyExcluded}
              disabled={opens.proxy_excluded_opens === undefined}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-2xl font-bold">{totalOpens.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Opens</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{uniqueOpens.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Unique Opens</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{(openRate * 100).toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">Open Rate</p>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              {uniquePercentage}% of opens were from unique subscribers
            </span>
            <span className="text-xs text-muted-foreground">
              Last opened {lastOpenRelative}
            </span>
          </div>
        </div>

        {/* View Details Button */}
        <div className="pt-2 border-t">
          <Link href={`/mailchimp/reports/${campaignId}/opens`}>
            <Button variant="outline" className="w-full" size="sm">
              <ExternalLink className="h-3 w-3 mr-2" />
              View Opens Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
