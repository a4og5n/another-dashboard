/**
 * Campaign Opens Not Found Page
 * 404 UI for campaign opens route
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BreadcrumbNavigation } from "@/components/layout";
import { Eye } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNavigation
        items={[
          { label: "Dashboard", href: "/mailchimp" },
          { label: "Campaigns", href: "/mailchimp/campaigns" },
          { label: "Report", href: "#" },
          { label: "Opens", isCurrent: true },
        ]}
      />

      {/* Main Content */}
      <div className="container mx-auto pb-8 px-6 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Eye className="h-12 w-12 text-muted-foreground" />
            </div>
            <CardTitle>Campaign Opens Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              The campaign opens data you&apos;re looking for doesn&apos;t exist
              or may have been removed. This could happen if the campaign ID is
              invalid or the campaign doesn&apos;t have any opens data.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button asChild>
                <Link href="/mailchimp/campaigns">View All Campaigns</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/mailchimp">Back to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
