/**
 * Emails Sent Card Component
 * Displays the total number of emails sent in a campaign
 * with optional link to email activity details
 *
 * Issue #135: Campaign report detail UI components - Emails Sent Card
 * Migrated to use standardized StatCard component with custom footer
 */

"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Activity } from "lucide-react";
import type { EmailsSentCardProps } from "@/types/components/dashboard/reports";

export function EmailsSentCard({
  emailsSent,
  campaignId,
  className,
}: EmailsSentCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
        <Mail className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{emailsSent.toLocaleString()}</div>

        {/* Email Activity Link */}
        {campaignId && (
          <div className="pt-4 mt-2 border-t">
            <Link href={`/mailchimp/reports/${campaignId}/email-activity`}>
              <Button variant="outline" className="w-full" size="sm">
                <Activity className="h-3 w-3 mr-2" />
                View Email Activity
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
