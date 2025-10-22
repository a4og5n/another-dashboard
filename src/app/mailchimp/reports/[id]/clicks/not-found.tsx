/**
 * Campaign Click Details Not Found Page
 * 404 UI for campaign click details route
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout";
import { MousePointerClick } from "lucide-react";

export default function NotFound() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-12 px-6 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <MousePointerClick className="h-12 w-12 text-muted-foreground" />
            </div>
            <CardTitle>Click Details Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              The click details for this campaign could not be found. The
              campaign may not exist or the click tracking endpoint may not be
              available.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button asChild>
                <Link href="/mailchimp/reports">View All Reports</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/mailchimp">Back to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
