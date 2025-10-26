/**
 * Member Notes Not Found Page
 * Displayed when the requested member or notes cannot be found
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Notes Not Found</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          The requested member or their notes could not be found.
        </p>
        <p className="text-sm text-muted-foreground">This could happen if:</p>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>The member has been removed from the list</li>
          <li>The member ID is incorrect</li>
          <li>You don&apos;t have permission to view this member</li>
        </ul>
        <Button asChild>
          <Link href="/mailchimp/lists">Return to Lists</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
