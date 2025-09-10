/**
 * Campaign Report Header Component
 * Displays campaign title, status, and key performance metrics at the top of report detail
 *
 * Issue #135: Agent 3 - Campaign report detail UI components
 * Following established patterns from existing dashboard components
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Mail, Users, CheckCircle, XCircle } from "lucide-react";
import type { ReportHeaderProps } from "@/types/components";
import Link from "next/link";

/**
 * Formats date for display in header
 */
function formatHeaderDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Gets campaign type badge variant
 */
function getTypeVariant(type: string): "default" | "secondary" | "outline" {
  switch (type.toLowerCase()) {
    case "regular":
      return "default";
    case "ab_split":
      return "secondary";
    default:
      return "outline";
  }
}

export function ReportHeader({ report }: ReportHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Campaign Title and Basic Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-2xl">
                  {report.campaign_title}
                </CardTitle>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Badge variant={getTypeVariant(report.type)}>
                    {report.type.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <Link
                    href={`/mailchimp/lists/${report.list_id}`}
                    className="hover:underline flex items-center"
                  >
                    {report.list_name}
                    {report.list_is_active ? (
                      <CheckCircle className="h-3 w-3 ml-1 text-green-600" />
                    ) : (
                      <XCircle className="h-3 w-3 ml-1 text-red-600" />
                    )}
                  </Link>
                </div>
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>Sent {formatHeaderDate(report.send_time)}</span>
                </div>
              </div>
            </div>
            <Badge variant="default" className="bg-green-600">
              Sent
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Subject Line */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Subject Line
              </h4>
              <p className="text-sm">{report.subject_line}</p>
            </div>

            {/* Preview Text */}
            {report.preview_text && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Preview Text
                </h4>
                <p className="text-sm text-muted-foreground">
                  {report.preview_text}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
