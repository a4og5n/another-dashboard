/**
 * Campaign Detail Not Found Page
 * 404 page for campaign that doesn't exist
 */

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileX, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CampaignNotFound() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <FileX className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <CardTitle>Campaign Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            The requested campaign could not be found. It may have been deleted
            or the ID is incorrect.
          </p>
          <Button asChild className="w-full">
            <Link href="/mailchimp/campaigns">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaigns
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
