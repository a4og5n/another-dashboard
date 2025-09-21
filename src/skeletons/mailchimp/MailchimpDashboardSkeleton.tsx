import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/skeletons/components/Skeleton";
import { TableSkeleton } from "@/skeletons/components/TableSkeleton";
import { ListSkeleton } from "@/skeletons/components/ListSkeleton";

interface MailchimpDashboardSkeletonProps {
  activeTab?: "campaigns" | "audiences";
}

function MailchimpDashboardSkeleton({
  activeTab = "campaigns",
}: MailchimpDashboardSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" /> {/* "Mailchimp Dashboard" */}
          <Skeleton className="h-4 w-80" /> {/* Description */}
        </div>
        <Skeleton className="h-10 w-24" /> {/* Refresh button */}
      </div>

      {/* Tabs Navigation */}
      <div className="space-y-4">
        <div className="flex space-x-1 p-1 bg-muted rounded-lg w-fit">
          <Skeleton
            className={`h-8 w-20 ${activeTab === "campaigns" ? "bg-background" : ""}`}
          />
          <Skeleton
            className={`h-8 w-20 ${activeTab === "audiences" ? "bg-background" : ""}`}
          />
          <Skeleton className="h-8 w-20 opacity-50" />{" "}
          {/* Disabled Analytics tab */}
        </div>

        {/* Tab Content */}
        {activeTab === "campaigns" ? (
          <Card>
            <CardContent className="pt-6">
              <TableSkeleton rows={5} columns={6} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <ListSkeleton items={3} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Skeleton className="h-8 w-16 mx-auto mb-2" />
                      <Skeleton className="h-3 w-20 mx-auto" />
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Skeleton className="h-8 w-12 mx-auto mb-2" />
                      <Skeleton className="h-3 w-16 mx-auto" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export { MailchimpDashboardSkeleton };