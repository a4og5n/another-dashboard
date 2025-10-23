/**
 * Geographic Locations Card Component
 * Provides a link to view detailed geographic engagement data
 *
 * Shows campaign reach across different geographic locations with
 * a call-to-action button to view the detailed locations page.
 */

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LocationsCardProps {
  campaignId: string;
}

export function LocationsCard({ campaignId }: LocationsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Geographic Locations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          View engagement metrics by geographic location, including opens and
          clicks from different countries and regions.
        </p>

        {/* View Locations Button */}
        <div className="pt-2 border-t">
          <Link href={`/mailchimp/reports/${campaignId}/locations`}>
            <Button variant="outline" className="w-full" size="sm">
              <MapPin className="h-3 w-3 mr-2" />
              View Location Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
