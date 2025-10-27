/**
 * Member Goals Not Found Page
 * 404 UI for member goals route
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BreadcrumbNavigation } from "@/components/layout";
import { Target } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNavigation
        items={[
          { label: "Dashboard", href: "/mailchimp" },
          { label: "Lists", href: "/mailchimp/lists" },
          { label: "List", href: "#" },
          { label: "Member", href: "#" },
          { label: "Goals", isCurrent: true },
        ]}
      />

      {/* Main Content */}
      <div className="container mx-auto pb-8 px-6 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Target className="h-12 w-12 text-muted-foreground" />
            </div>
            <CardTitle>Member Goals Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              The member goals data you&apos;re looking for doesn&apos;t exist
              or may have been removed. This could happen if the list ID or
              subscriber hash is invalid.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button asChild>
                <Link href="/mailchimp/lists">View All Lists</Link>
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
