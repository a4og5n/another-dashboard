"use client";

/**
 * Campaign Report Advice Card Component
 * Displays a link to view campaign advice and recommendations
 */

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, ExternalLink } from "lucide-react";

interface AdviceCardProps {
  campaignId: string;
}

export function AdviceCard({ campaignId }: AdviceCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base">
          <Lightbulb className="h-4 w-4 text-yellow-500" />
          <span>Campaign Advice</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Get personalized recommendations and feedback to improve your campaign
          performance
        </p>

        {/* View Advice Button */}
        <div className="pt-2 border-t">
          <Link href={`/mailchimp/reports/${campaignId}/advice`}>
            <Button variant="outline" className="w-full" size="sm">
              <ExternalLink className="h-3 w-3 mr-2" />
              View Campaign Advice
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
