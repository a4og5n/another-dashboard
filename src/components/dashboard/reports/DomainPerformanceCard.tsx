"use client";

/**
 * Domain Performance Card Component
 * Displays a link to view email provider performance breakdown
 */

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink } from "lucide-react";

interface DomainPerformanceCardProps {
  campaignId: string;
}

export function DomainPerformanceCard({
  campaignId,
}: DomainPerformanceCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base">
          <Globe className="h-4 w-4 text-blue-500" />
          <span>Domain Performance</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          View performance breakdown by email provider (Gmail, Outlook, Yahoo,
          etc.)
        </p>

        {/* View Domain Performance Button */}
        <div className="pt-2 border-t">
          <Link href={`/mailchimp/reports/${campaignId}/domain-performance`}>
            <Button variant="outline" className="w-full" size="sm">
              <ExternalLink className="h-3 w-3 mr-2" />
              View Domain Performance
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
