import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from "@/components/not-found";

/**
 * Campaign Advice Not Found Page
 * Displayed when campaign advice cannot be found (404)
 */
export default function CampaignAdviceNotFound() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Advice Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The campaign advice you&apos;re looking for could not be found. This
            may be because:
          </p>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>The campaign ID is invalid</li>
            <li>The campaign has been deleted</li>
            <li>You don&apos;t have permission to access this campaign</li>
            <li>Advice data is not available for this campaign</li>
          </ul>
          <BackButton />
        </CardContent>
      </Card>
    </div>
  );
}
