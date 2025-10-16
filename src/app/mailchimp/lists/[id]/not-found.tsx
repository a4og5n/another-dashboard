/**
 * List Not Found Page
 * 404 page for list that doesn't exist
 */

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ListNotFound() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <Users className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <CardTitle>List Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            The requested list could not be found. It may have been deleted or
            the ID is incorrect.
          </p>
          <Button asChild className="w-full">
            <Link href="/mailchimp/lists">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lists
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
