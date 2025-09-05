/**
 * Campaign Report Detail Not Found Page
 * 404 page for campaign report detail pages
 *
 * Issue #135: Agent 4 - Campaign report detail routing and pages
 * Following Next.js 15 App Router patterns and established not-found patterns
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileX, Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-muted rounded-full w-fit">
            <FileX className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">Campaign Report Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-muted-foreground">
            <p>
              The campaign report you&apos;re looking for doesn&apos;t exist.
            </p>
            <p className="text-sm mt-2">
              It may have been deleted, or the campaign ID is incorrect.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button className="w-full" asChild>
              <Link href="/mailchimp/reports">
                <Search className="h-4 w-4 mr-2" />
                Browse All Reports
              </Link>
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/mailchimp">
                <Home className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
