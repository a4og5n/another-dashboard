/**
 * Campaign Send Checklist Content Component
 * Displays pre-send validation checklist to ensure campaign is ready
 *
 * @route /mailchimp/campaigns/[campaign_id]/send-checklist
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  CheckCircle,
  XCircleIcon,
} from "lucide-react";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import type { CampaignSendChecklist } from "@/types/mailchimp/campaigns/send-checklist.types";

interface SendChecklistContentProps {
  data: CampaignSendChecklist;
  errorCode?: string;
}

export function SendChecklistContent({
  data,
  errorCode,
}: SendChecklistContentProps) {
  const { is_ready, items } = data;

  // Count items by type
  const errorCount = items.filter((item) => item.type === "error").length;
  const warningCount = items.filter((item) => item.type === "warning").length;
  const successCount = items.filter((item) => item.type === "success").length;

  return (
    <MailchimpConnectionGuard errorCode={errorCode}>
      <div className="space-y-6">
        {/* Campaign Readiness Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {is_ready ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-500" />
              )}
              Campaign Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant={is_ready ? "default" : "destructive"}>
              <AlertDescription>
                <p className="text-lg font-semibold mb-2">
                  {is_ready ? "Ready to Send" : "Not Ready to Send"}
                </p>
                {is_ready ? (
                  <p>
                    All validation checks have passed. Your campaign is ready to
                    be sent.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p>
                      Your campaign has issues that must be resolved before
                      sending.
                    </p>
                    <div className="flex gap-4 mt-3">
                      {errorCount > 0 && (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          {errorCount} {errorCount === 1 ? "Error" : "Errors"}
                        </Badge>
                      )}
                      {warningCount > 0 && (
                        <Badge variant="secondary" className="gap-1">
                          <AlertTriangle className="h-3 w-3 text-yellow-600" />
                          {warningCount}{" "}
                          {warningCount === 1 ? "Warning" : "Warnings"}
                        </Badge>
                      )}
                      {successCount > 0 && (
                        <Badge
                          variant="outline"
                          className="gap-1 border-green-200 bg-green-50 text-green-700"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          {successCount} Passed
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Checklist Items */}
        <Card>
          <CardHeader>
            <CardTitle>Validation Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No checklist items available
              </p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  const isError = item.type === "error";
                  const isWarning = item.type === "warning";
                  const isSuccess = item.type === "success";

                  return (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 border-b pb-4 last:border-b-0 ${
                        isError
                          ? "border-red-100"
                          : isWarning
                            ? "border-yellow-100"
                            : "border-green-100"
                      }`}
                    >
                      {/* Status Icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        {isError && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        {isWarning && (
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        )}
                        {isSuccess && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`font-medium ${
                              isError
                                ? "text-red-900 dark:text-red-300"
                                : isWarning
                                  ? "text-yellow-900 dark:text-yellow-300"
                                  : "text-green-900 dark:text-green-300"
                            }`}
                          >
                            {item.heading}
                          </h4>
                          <Badge
                            variant={
                              isError
                                ? "destructive"
                                : isWarning
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {item.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.details}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MailchimpConnectionGuard>
  );
}
