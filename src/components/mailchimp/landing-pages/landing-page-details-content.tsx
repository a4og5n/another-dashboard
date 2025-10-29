/**
 * Landing Page Details Component
 * View detailed information about this landing page
 *
 * @route /mailchimp/landing-pages/[page_id]
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Calendar,
  Link as LinkIcon,
  Eye,
  Settings,
  Globe,
} from "lucide-react";
import type { LandingPage } from "@/types/mailchimp/landing-pages";
import { formatDateTimeSafe } from "@/utils";
import { MailchimpConnectionGuard } from "@/components/mailchimp";

interface LandingPageDetailsContentProps {
  data: LandingPage;
  errorCode?: string;
}

/**
 * Landing Page Details Content Component
 * Displays complete landing page information including status, publication details, and tracking settings
 */
export function LandingPageDetailsContent({
  data,
  errorCode,
}: LandingPageDetailsContentProps) {
  const statusColorMap: Record<string, string> = {
    published: "bg-green-500",
    unpublished: "bg-gray-500",
    draft: "bg-yellow-500",
  };

  return (
    <MailchimpConnectionGuard errorCode={errorCode}>
      <div className="space-y-6">
        {/* Header Card - Landing Page Overview */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {data.name}
                </CardTitle>
                {data.title && (
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span>{data.title}</span>
                  </div>
                )}
                {data.description && (
                  <div className="text-sm text-muted-foreground">
                    {data.description}
                  </div>
                )}
              </div>
              <Badge
                variant="secondary"
                className={statusColorMap[data.status] || "bg-gray-500"}
              >
                {data.status}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Publication Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Publication Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Page ID</div>
                <div className="font-medium">{data.id}</div>
              </div>
              {data.web_id && (
                <div>
                  <div className="text-sm text-muted-foreground">Web ID</div>
                  <div className="font-medium">{data.web_id}</div>
                </div>
              )}
              <div>
                <div className="text-sm text-muted-foreground">Created</div>
                <div className="font-medium">
                  {data.created_at
                    ? formatDateTimeSafe(data.created_at)
                    : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Last Updated
                </div>
                <div className="font-medium">
                  {data.updated_at
                    ? formatDateTimeSafe(data.updated_at)
                    : "N/A"}
                </div>
              </div>
              {data.published_at && (
                <div>
                  <div className="text-sm text-muted-foreground">Published</div>
                  <div className="font-medium">
                    {formatDateTimeSafe(data.published_at)}
                  </div>
                </div>
              )}
              {data.unpublished_at && (
                <div>
                  <div className="text-sm text-muted-foreground">
                    Unpublished
                  </div>
                  <div className="font-medium">
                    {formatDateTimeSafe(data.unpublished_at)}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Technical Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.template_id && (
                <div>
                  <div className="text-sm text-muted-foreground">
                    Template ID
                  </div>
                  <div className="font-medium">{data.template_id}</div>
                </div>
              )}
              {data.list_id && (
                <div>
                  <div className="text-sm text-muted-foreground">
                    Associated List
                  </div>
                  <div className="font-medium">{data.list_id}</div>
                </div>
              )}
              {data.store_id && (
                <div>
                  <div className="text-sm text-muted-foreground">Store ID</div>
                  <div className="font-medium">{data.store_id}</div>
                </div>
              )}
              {data.created_by_source && (
                <div>
                  <div className="text-sm text-muted-foreground">
                    Created By
                  </div>
                  <div className="font-medium">{data.created_by_source}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Published URL */}
        {data.url && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Published URL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-2"
              >
                <LinkIcon className="h-4 w-4" />
                {data.url}
              </a>
            </CardContent>
          </Card>
        )}

        {/* Tracking Settings */}
        {data.tracking && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Tracking Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Track with Mailchimp</span>
                  <Badge variant="secondary">
                    {data.tracking.track_with_mailchimp
                      ? "Enabled"
                      : "Disabled"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Restricted Data Processing</span>
                  <Badge variant="secondary">
                    {data.tracking.enable_restricted_data_processing
                      ? "Enabled"
                      : "Disabled"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MailchimpConnectionGuard>
  );
}
