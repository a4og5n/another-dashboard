/**
 * Interest Category Info Content Component
 * Displays detailed information for a specific interest category
 *
 * Server Component - no client-side interactivity needed
 */

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { InterestCategoryInfo } from "@/types/mailchimp/interest-category-info";

interface InterestCategoryInfoContentProps {
  category: InterestCategoryInfo;
  listId: string;
}

/**
 * Formats category type for display
 */
function formatCategoryType(type: string): {
  label: string;
  variant: "default" | "secondary" | "outline";
} {
  switch (type) {
    case "checkboxes":
      return { label: "Checkboxes", variant: "default" };
    case "dropdown":
      return { label: "Dropdown", variant: "secondary" };
    case "radio":
      return { label: "Radio Buttons", variant: "outline" };
    case "hidden":
      return { label: "Hidden", variant: "secondary" };
    default:
      return { label: type, variant: "secondary" };
  }
}

export function InterestCategoryInfoContent({
  category,
  listId,
}: InterestCategoryInfoContentProps) {
  const typeInfo = formatCategoryType(category.type);

  return (
    <div className="space-y-6">
      {/* Category Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Interest Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Category Title */}
            <div>
              <div className="text-sm text-muted-foreground mb-2">
                Category Title
              </div>
              <div className="text-2xl font-semibold">{category.title}</div>
            </div>

            {/* Category Type */}
            <div>
              <div className="text-sm text-muted-foreground mb-2">Type</div>
              <Badge variant={typeInfo.variant} className="text-base px-3 py-1">
                {typeInfo.label}
              </Badge>
            </div>

            {/* Display Order */}
            <div>
              <div className="text-sm text-muted-foreground mb-2">
                Display Order
              </div>
              <div className="text-lg font-medium">
                {category.display_order}
              </div>
            </div>

            {/* IDs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <div className="text-sm text-muted-foreground mb-2">
                  List ID
                </div>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {category.list_id}
                </code>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-2">
                  Interest Category ID
                </div>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {category.id}
                </code>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link
              href={`/mailchimp/lists/${listId}/interest-categories/${category.id}/interests`}
            >
              View Interests in this Category
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Quick Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <Link href={`/mailchimp/lists/${listId}/interest-categories`}>
              ← Back to Interest Categories
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <Link href={`/mailchimp/lists/${listId}`}>
              ← Back to List Details
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
