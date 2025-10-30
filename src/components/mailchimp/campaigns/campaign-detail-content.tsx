/**
 * Campaign Detail Content Component
 * View detailed information about a campaign
 *
 * @route /mailchimp/campaigns/[campaign_id]
 */

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Mail,
  Users,
  BarChart3,
  Settings,
  Eye,
  Globe,
  Target,
  Split,
  RefreshCw,
  CheckCircle,
  XCircle,
  ArrowRight,
  Image as ImageIcon,
} from "lucide-react";
import type { Campaign } from "@/types/mailchimp/campaigns";
import { formatDateTimeSafe } from "@/utils";
import { MailchimpConnectionGuard } from "@/components/mailchimp";

interface CampaignDetailContentProps {
  data: Campaign;
  errorCode?: string;
}

/**
 * Campaign Detail Content Component
 * Displays complete campaign information including settings, recipients, and performance metrics
 */
export function CampaignDetailContent({
  data,
  errorCode,
}: CampaignDetailContentProps) {
  const statusColorMap: Record<string, string> = {
    save: "bg-gray-500",
    paused: "bg-yellow-500",
    schedule: "bg-blue-500",
    sending: "bg-orange-500",
    sent: "bg-green-500",
  };

  const typeLabels: Record<string, string> = {
    regular: "Regular",
    plaintext: "Plain Text",
    absplit: "A/B Split Test",
    rss: "RSS",
    variate: "Multivariate",
  };

  return (
    <MailchimpConnectionGuard errorCode={errorCode}>
      <div className="space-y-6">
        {/* Campaign Overview */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  {data.settings?.title || "Untitled Campaign"}
                </CardTitle>
                {data.settings?.subject_line && (
                  <div className="text-sm font-medium">
                    Subject: {data.settings.subject_line}
                  </div>
                )}
                {data.settings?.preview_text && (
                  <div className="text-sm text-muted-foreground">
                    Preview: {data.settings.preview_text}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 items-end">
                <Badge
                  variant="secondary"
                  className={statusColorMap[data.status] || "bg-gray-500"}
                >
                  {data.status}
                </Badge>
                <Badge variant="outline">
                  {typeLabels[data.type] || data.type}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Campaign ID</div>
                <div className="font-medium">{data.id}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Web ID</div>
                <div className="font-medium">{data.web_id}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Created</div>
                <div className="font-medium">
                  {formatDateTimeSafe(data.create_time)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Sent</div>
                <div className="font-medium">
                  {data.send_time ? (
                    formatDateTimeSafe(data.send_time)
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Emails Sent</div>
                <div className="font-medium">
                  {data.emails_sent.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Content Type
                </div>
                <div className="font-medium">
                  {data.content_type || (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Resendable</div>
                <Badge variant="secondary">
                  {data.resendable !== undefined ? (
                    data.resendable ? (
                      "Yes"
                    ) : (
                      "No"
                    )
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Needs Block Refresh
                </div>
                <Badge variant="secondary">
                  {data.needs_block_refresh !== undefined ? (
                    data.needs_block_refresh ? (
                      "Yes"
                    ) : (
                      "No"
                    )
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Campaign Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Text Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Title</div>
                  <div className="font-medium">
                    {data.settings?.title || (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">From Name</div>
                  <div className="font-medium">
                    {data.settings?.from_name || (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Reply To</div>
                  <div className="font-medium">
                    {data.settings?.reply_to || (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">To Name</div>
                  <div className="font-medium">
                    {data.settings?.to_name || (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Folder ID</div>
                  <div className="font-medium">
                    {data.settings?.folder_id || (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Template ID
                  </div>
                  <div className="font-medium">
                    {data.settings?.template_id !== undefined ? (
                      data.settings.template_id
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Auto Facebook Post */}
              <div>
                <div className="text-sm text-muted-foreground">
                  Auto Facebook Post
                </div>
                <div className="font-medium">
                  {data.settings?.auto_fb_post?.length ? (
                    <div className="text-sm space-y-1">
                      {data.settings.auto_fb_post.map((pageId, idx) => (
                        <div key={idx}>
                          {idx + 1}. {pageId}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </div>
              </div>

              {/* Boolean Options */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Use Conversation</span>
                  <Badge variant="secondary">
                    {data.settings?.use_conversation !== undefined ? (
                      data.settings.use_conversation ? (
                        "Yes"
                      ) : (
                        "No"
                      )
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Authenticate</span>
                  <Badge variant="secondary">
                    {data.settings?.authenticate !== undefined ? (
                      data.settings.authenticate ? (
                        "Yes"
                      ) : (
                        "No"
                      )
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Auto Footer</span>
                  <Badge variant="secondary">
                    {data.settings?.auto_footer !== undefined ? (
                      data.settings.auto_footer ? (
                        "Yes"
                      ) : (
                        "No"
                      )
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Inline CSS</span>
                  <Badge variant="secondary">
                    {data.settings?.inline_css !== undefined ? (
                      data.settings.inline_css ? (
                        "Yes"
                      ) : (
                        "No"
                      )
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Auto Tweet</span>
                  <Badge variant="secondary">
                    {data.settings?.auto_tweet !== undefined ? (
                      data.settings.auto_tweet ? (
                        "Yes"
                      ) : (
                        "No"
                      )
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">FB Comments</span>
                  <Badge variant="secondary">
                    {data.settings?.fb_comments !== undefined ? (
                      data.settings.fb_comments ? (
                        "Yes"
                      ) : (
                        "No"
                      )
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Timewarp</span>
                  <Badge variant="secondary">
                    {data.settings?.timewarp !== undefined ? (
                      data.settings.timewarp ? (
                        "Yes"
                      ) : (
                        "No"
                      )
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Drag & Drop</span>
                  <Badge variant="secondary">
                    {data.settings?.drag_and_drop !== undefined ? (
                      data.settings.drag_and_drop ? (
                        "Yes"
                      ) : (
                        "No"
                      )
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recipients */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Recipients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">List Name</div>
                  <div className="font-medium">{data.recipients.list_name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">List ID</div>
                  <div className="font-medium">{data.recipients.list_id}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Recipient Count
                  </div>
                  <div className="font-medium">
                    {data.recipients.recipient_count.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    List Active
                  </div>
                  <Badge variant="secondary">
                    {data.recipients.list_is_active ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>

              {/* Segment Text with HTML rendering */}
              {data.recipients.segment_text && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Segment Info
                  </div>
                  <div
                    className="text-sm prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{
                      __html: data.recipients.segment_text,
                    }}
                  />
                </div>
              )}

              {/* Segment Options */}
              {data.recipients.segment_opts && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Segment Options</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Saved Segment ID
                      </div>
                      <div className="font-medium">
                        {data.recipients.segment_opts.saved_segment_id !==
                        undefined ? (
                          data.recipients.segment_opts.saved_segment_id
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Prebuilt Segment ID
                      </div>
                      <div className="font-medium">
                        {data.recipients.segment_opts.prebuilt_segment_id || (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Match Type
                      </div>
                      <div className="font-medium">
                        {data.recipients.segment_opts.match || (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Segment Conditions */}
                  {data.recipients.segment_opts.conditions?.length ? (
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Conditions (
                        {data.recipients.segment_opts.conditions.length})
                      </div>
                      <div className="space-y-2">
                        {data.recipients.segment_opts.conditions.map(
                          (condition, idx) => (
                            <div
                              key={idx}
                              className="text-sm border rounded p-2 bg-muted/30"
                            >
                              <div className="font-medium mb-1">
                                Condition {idx + 1}
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {condition.condition_type && (
                                  <div>
                                    <span className="text-muted-foreground">
                                      Type:
                                    </span>{" "}
                                    {condition.condition_type}
                                  </div>
                                )}
                                {condition.field && (
                                  <div>
                                    <span className="text-muted-foreground">
                                      Field:
                                    </span>{" "}
                                    {condition.field}
                                  </div>
                                )}
                                {condition.op && (
                                  <div>
                                    <span className="text-muted-foreground">
                                      Operator:
                                    </span>{" "}
                                    {condition.op}
                                  </div>
                                )}
                                {condition.value && (
                                  <div>
                                    <span className="text-muted-foreground">
                                      Value:
                                    </span>{" "}
                                    {condition.value}
                                  </div>
                                )}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Report Summary */}
        {data.report_summary && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Report Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.report_summary.opens !== undefined && (
                  <div>
                    <div className="text-sm text-muted-foreground">Opens</div>
                    <div className="text-2xl font-bold">
                      {data.report_summary.opens.toLocaleString()}
                    </div>
                  </div>
                )}
                {data.report_summary.unique_opens !== undefined && (
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Unique Opens
                    </div>
                    <div className="text-2xl font-bold">
                      {data.report_summary.unique_opens.toLocaleString()}
                    </div>
                  </div>
                )}
                {data.report_summary.open_rate !== undefined && (
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Open Rate
                    </div>
                    <div className="text-2xl font-bold">
                      {data.report_summary.open_rate.toFixed(2)}%
                    </div>
                  </div>
                )}
                {data.report_summary.clicks !== undefined && (
                  <div>
                    <div className="text-sm text-muted-foreground">Clicks</div>
                    <div className="text-2xl font-bold">
                      {data.report_summary.clicks.toLocaleString()}
                    </div>
                  </div>
                )}
                {data.report_summary.subscriber_clicks !== undefined && (
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Unique Clicks
                    </div>
                    <div className="text-2xl font-bold">
                      {data.report_summary.subscriber_clicks.toLocaleString()}
                    </div>
                  </div>
                )}
                {data.report_summary.click_rate !== undefined && (
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Click Rate
                    </div>
                    <div className="text-2xl font-bold">
                      {data.report_summary.click_rate.toFixed(2)}%
                    </div>
                  </div>
                )}
              </div>
              {data.report_summary.ecommerce && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm font-medium mb-3">
                    E-commerce Metrics
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {data.report_summary.ecommerce.total_orders !==
                      undefined && (
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Total Orders
                        </div>
                        <div className="text-xl font-bold">
                          {data.report_summary.ecommerce.total_orders.toLocaleString()}
                        </div>
                      </div>
                    )}
                    {data.report_summary.ecommerce.total_spent !==
                      undefined && (
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Total Spent
                        </div>
                        <div className="text-xl font-bold">
                          $
                          {data.report_summary.ecommerce.total_spent.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}
                        </div>
                      </div>
                    )}
                    {data.report_summary.ecommerce.total_revenue !==
                      undefined && (
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Total Revenue
                        </div>
                        <div className="text-xl font-bold">
                          $
                          {data.report_summary.ecommerce.total_revenue.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/mailchimp/reports/${data.id}`}>
                  View Full Report
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Tracking Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Tracking Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Opens</span>
                  <Badge variant="secondary">
                    {data.tracking.opens ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">HTML Clicks</span>
                  <Badge variant="secondary">
                    {data.tracking.html_clicks ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Text Clicks</span>
                  <Badge variant="secondary">
                    {data.tracking.text_clicks ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                {data.tracking.ecomm360 !== undefined && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">E-commerce 360</span>
                    <Badge variant="secondary">
                      {data.tracking.ecomm360 ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.tracking.google_analytics !== undefined && (
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Google Analytics
                    </div>
                    <div className="font-medium">
                      {data.tracking.google_analytics || (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </div>
                  </div>
                )}
                {data.tracking.clicktale !== undefined && (
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Clicktale
                    </div>
                    <div className="font-medium">
                      {data.tracking.clicktale || (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Status */}
        {data.delivery_status && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                Delivery Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Delivery Enabled
                  </div>
                  <Badge variant="secondary">
                    {data.delivery_status.enabled ? "Yes" : "No"}
                  </Badge>
                </div>
                {data.delivery_status.can_cancel !== undefined && (
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Can Cancel
                    </div>
                    <Badge variant="secondary">
                      {data.delivery_status.can_cancel ? "Yes" : "No"}
                    </Badge>
                  </div>
                )}
                {data.delivery_status.status && (
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div className="font-medium">
                      {data.delivery_status.status}
                    </div>
                  </div>
                )}
                {data.delivery_status.emails_sent !== undefined && (
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Emails Sent
                    </div>
                    <div className="font-medium">
                      {data.delivery_status.emails_sent.toLocaleString()}
                    </div>
                  </div>
                )}
                {data.delivery_status.emails_canceled !== undefined && (
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Emails Canceled
                    </div>
                    <div className="font-medium">
                      {data.delivery_status.emails_canceled.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Archive URLs */}
        {(data.archive_url || data.long_archive_url) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Archive Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.archive_url && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Short Archive URL
                  </div>
                  <a
                    href={data.archive_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm break-all"
                  >
                    {data.archive_url}
                  </a>
                </div>
              )}
              {data.long_archive_url && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Long Archive URL
                  </div>
                  <a
                    href={data.long_archive_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm break-all"
                  >
                    {data.long_archive_url}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Social Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Social Card
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!data.social_card ? (
              <p className="text-sm text-muted-foreground">
                Social card information not available for this campaign.
              </p>
            ) : (
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Title</div>
                  <div className="font-medium">
                    {data.social_card.title || (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Description
                  </div>
                  <div className="font-medium">
                    {data.social_card.description || (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Image URL</div>
                  {data.social_card.image_url ? (
                    <a
                      href={data.social_card.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm break-all"
                    >
                      {data.social_card.image_url}
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">N/A</span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* A/B Split Test Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Split className="h-4 w-4" />
              A/B Split Test Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!data.ab_split_opts ? (
              <p className="text-sm text-muted-foreground">
                A/B split test options not available for this campaign.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Split Test Type
                  </div>
                  <div className="font-medium">
                    {data.ab_split_opts.split_test || (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Winner Criteria
                  </div>
                  <div className="font-medium">
                    {data.ab_split_opts.pick_winner || (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Wait Time</div>
                  <div className="font-medium">
                    {data.ab_split_opts.wait_time !== undefined &&
                    data.ab_split_opts.wait_units ? (
                      <>
                        {data.ab_split_opts.wait_time}{" "}
                        {data.ab_split_opts.wait_units}
                      </>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Split Size
                  </div>
                  <div className="font-medium">
                    {data.ab_split_opts.split_size !== undefined ? (
                      `${data.ab_split_opts.split_size}%`
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Multivariate Test Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Split className="h-4 w-4" />
              Multivariate Test Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!data.variate_settings ? (
              <p className="text-sm text-muted-foreground">
                Multivariate test settings not available for this campaign.
              </p>
            ) : (
              <div className="space-y-4">
                {/* Winner Information */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Winner Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Winner Criteria
                      </div>
                      <div className="font-medium">
                        {data.variate_settings.winner_criteria || (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Winning Combination ID
                      </div>
                      <div className="font-medium">
                        {data.variate_settings.winning_combination_id || (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Winning Campaign ID
                      </div>
                      <div className="font-medium">
                        {data.variate_settings.winning_campaign_id || (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test Configuration */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Test Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Wait Time
                      </div>
                      <div className="font-medium">
                        {data.variate_settings.wait_time !== undefined ? (
                          `${data.variate_settings.wait_time} minutes`
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Test Size
                      </div>
                      <div className="font-medium">
                        {data.variate_settings.test_size !== undefined ? (
                          `${data.variate_settings.test_size}%`
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Variants */}
                {(data.variate_settings.subject_lines?.length ||
                  data.variate_settings.from_names?.length ||
                  data.variate_settings.reply_to_addresses?.length ||
                  data.variate_settings.send_times?.length ||
                  data.variate_settings.contents?.length) && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Variants</h4>
                    <div className="space-y-3">
                      {data.variate_settings.subject_lines?.length ? (
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Subject Lines (
                            {data.variate_settings.subject_lines.length})
                          </div>
                          <div className="text-sm mt-1 space-y-1">
                            {data.variate_settings.subject_lines.map(
                              (line, idx) => (
                                <div key={idx} className="font-medium">
                                  {idx + 1}. {line}
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      ) : null}
                      {data.variate_settings.from_names?.length ? (
                        <div>
                          <div className="text-sm text-muted-foreground">
                            From Names (
                            {data.variate_settings.from_names.length})
                          </div>
                          <div className="text-sm mt-1 space-y-1">
                            {data.variate_settings.from_names.map(
                              (name, idx) => (
                                <div key={idx} className="font-medium">
                                  {idx + 1}. {name}
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      ) : null}
                      {data.variate_settings.reply_to_addresses?.length ? (
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Reply-To Addresses (
                            {data.variate_settings.reply_to_addresses.length})
                          </div>
                          <div className="text-sm mt-1 space-y-1">
                            {data.variate_settings.reply_to_addresses.map(
                              (email, idx) => (
                                <div key={idx} className="font-medium">
                                  {idx + 1}. {email}
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      ) : null}
                      {data.variate_settings.send_times?.length ? (
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Send Times (
                            {data.variate_settings.send_times.length})
                          </div>
                          <div className="text-sm mt-1 space-y-1">
                            {data.variate_settings.send_times.map(
                              (time, idx) => (
                                <div key={idx} className="font-medium">
                                  {idx + 1}. {formatDateTimeSafe(time)}
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      ) : null}
                      {data.variate_settings.contents?.length ? (
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Content Variants (
                            {data.variate_settings.contents.length})
                          </div>
                          <div className="text-sm mt-1 space-y-1">
                            {data.variate_settings.contents.map(
                              (content, idx) => (
                                <div key={idx} className="font-medium">
                                  {idx + 1}. {content}
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* Combinations */}
                {data.variate_settings.combinations?.length ? (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">
                      Combinations ({data.variate_settings.combinations.length})
                    </h4>
                    <div className="text-sm text-muted-foreground">
                      {data.variate_settings.combinations.length} test
                      combination
                      {data.variate_settings.combinations.length !== 1
                        ? "s"
                        : ""}{" "}
                      configured
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>

        {/* RSS Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4" />
              RSS Campaign Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!data.rss_opts ? (
              <p className="text-sm text-muted-foreground">
                RSS campaign options not available for this campaign.
              </p>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Feed URL</div>
                  {data.rss_opts.feed_url ? (
                    <a
                      href={data.rss_opts.feed_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm break-all"
                    >
                      {data.rss_opts.feed_url}
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">N/A</span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Frequency
                    </div>
                    <div className="font-medium">
                      {data.rss_opts.frequency || (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Last Sent
                    </div>
                    <div className="font-medium">
                      {data.rss_opts.last_sent ? (
                        formatDateTimeSafe(data.rss_opts.last_sent)
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resend Shortcut Eligibility */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Resend Eligibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!data.resend_shortcut_eligibility ? (
              <p className="text-sm text-muted-foreground">
                Resend eligibility information not available for this campaign.
              </p>
            ) : (
              <div className="space-y-3">
                {data.resend_shortcut_eligibility.to_non_openers ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Resend to Non-Openers</span>
                      <div className="flex items-center gap-2">
                        {data.resend_shortcut_eligibility.to_non_openers
                          .is_eligible ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <Badge
                          variant={
                            data.resend_shortcut_eligibility.to_non_openers
                              .is_eligible
                              ? "default"
                              : "secondary"
                          }
                        >
                          {data.resend_shortcut_eligibility.to_non_openers
                            .is_eligible
                            ? "Eligible"
                            : "Not Eligible"}
                        </Badge>
                      </div>
                    </div>
                    {data.resend_shortcut_eligibility.to_non_openers.reason && (
                      <div className="text-sm text-muted-foreground ml-6">
                        {data.resend_shortcut_eligibility.to_non_openers.reason}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Resend to Non-Openers</span>
                    <span className="text-sm text-muted-foreground">N/A</span>
                  </div>
                )}

                {data.resend_shortcut_eligibility.to_new_subscribers ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Resend to New Subscribers</span>
                      <div className="flex items-center gap-2">
                        {data.resend_shortcut_eligibility.to_new_subscribers
                          .is_eligible ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <Badge
                          variant={
                            data.resend_shortcut_eligibility.to_new_subscribers
                              .is_eligible
                              ? "default"
                              : "secondary"
                          }
                        >
                          {data.resend_shortcut_eligibility.to_new_subscribers
                            .is_eligible
                            ? "Eligible"
                            : "Not Eligible"}
                        </Badge>
                      </div>
                    </div>
                    {data.resend_shortcut_eligibility.to_new_subscribers
                      .reason && (
                      <div className="text-sm text-muted-foreground ml-6">
                        {
                          data.resend_shortcut_eligibility.to_new_subscribers
                            .reason
                        }
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Resend to New Subscribers</span>
                    <span className="text-sm text-muted-foreground">N/A</span>
                  </div>
                )}

                {data.resend_shortcut_eligibility.to_non_clickers ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Resend to Non-Clickers</span>
                      <div className="flex items-center gap-2">
                        {data.resend_shortcut_eligibility.to_non_clickers
                          .is_eligible ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <Badge
                          variant={
                            data.resend_shortcut_eligibility.to_non_clickers
                              .is_eligible
                              ? "default"
                              : "secondary"
                          }
                        >
                          {data.resend_shortcut_eligibility.to_non_clickers
                            .is_eligible
                            ? "Eligible"
                            : "Not Eligible"}
                        </Badge>
                      </div>
                    </div>
                    {data.resend_shortcut_eligibility.to_non_clickers
                      .reason && (
                      <div className="text-sm text-muted-foreground ml-6">
                        {
                          data.resend_shortcut_eligibility.to_non_clickers
                            .reason
                        }
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Resend to Non-Clickers</span>
                    <span className="text-sm text-muted-foreground">N/A</span>
                  </div>
                )}

                {data.resend_shortcut_eligibility.to_non_purchasers ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Resend to Non-Purchasers</span>
                      <div className="flex items-center gap-2">
                        {data.resend_shortcut_eligibility.to_non_purchasers
                          .is_eligible ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <Badge
                          variant={
                            data.resend_shortcut_eligibility.to_non_purchasers
                              .is_eligible
                              ? "default"
                              : "secondary"
                          }
                        >
                          {data.resend_shortcut_eligibility.to_non_purchasers
                            .is_eligible
                            ? "Eligible"
                            : "Not Eligible"}
                        </Badge>
                      </div>
                    </div>
                    {data.resend_shortcut_eligibility.to_non_purchasers
                      .reason && (
                      <div className="text-sm text-muted-foreground ml-6">
                        {
                          data.resend_shortcut_eligibility.to_non_purchasers
                            .reason
                        }
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Resend to Non-Purchasers</span>
                    <span className="text-sm text-muted-foreground">N/A</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resend Shortcut Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Resend History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!data.resend_shortcut_usage ? (
              <p className="text-sm text-muted-foreground">
                No resend history available for this campaign.
              </p>
            ) : !data.resend_shortcut_usage.original_campaign &&
              (!data.resend_shortcut_usage.shortcut_campaigns ||
                data.resend_shortcut_usage.shortcut_campaigns.length === 0) ? (
              <p className="text-sm text-muted-foreground">
                This campaign has not been resent and is not a resend of another
                campaign.
              </p>
            ) : (
              <div className="space-y-4">
                {/* Show original campaign if this is a resend */}
                {data.resend_shortcut_usage.original_campaign && (
                  <div>
                    <div className="text-sm font-medium mb-2">
                      This is a resend of:
                    </div>
                    <div className="bg-muted p-3 rounded-md space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Original Campaign
                          </div>
                          <div className="font-medium">
                            {data.resend_shortcut_usage.original_campaign.title}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Campaign ID
                          </div>
                          <div className="font-medium">
                            {data.resend_shortcut_usage.original_campaign.id}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Web ID
                          </div>
                          <div className="font-medium">
                            {
                              data.resend_shortcut_usage.original_campaign
                                .web_id
                            }
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Resend Type
                          </div>
                          <Badge variant="outline">
                            {data.resend_shortcut_usage.original_campaign.shortcut_type
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show resend campaigns created from this one */}
                {data.resend_shortcut_usage.shortcut_campaigns &&
                  data.resend_shortcut_usage.shortcut_campaigns.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">
                        Resend Campaigns Created (
                        {data.resend_shortcut_usage.shortcut_campaigns.length})
                      </div>
                      <div className="space-y-2">
                        {data.resend_shortcut_usage.shortcut_campaigns.map(
                          (campaign) => (
                            <div
                              key={campaign.id}
                              className="bg-muted p-3 rounded-md"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <div className="text-sm text-muted-foreground">
                                    Campaign ID
                                  </div>
                                  <div className="font-medium">
                                    {campaign.id}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm text-muted-foreground">
                                    Web ID
                                  </div>
                                  <div className="font-medium">
                                    {campaign.web_id}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm text-muted-foreground">
                                    Resend Type
                                  </div>
                                  <Badge variant="outline">
                                    {campaign.shortcut_type
                                      .replace(/_/g, " ")
                                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                                  </Badge>
                                </div>
                                <div>
                                  <div className="text-sm text-muted-foreground">
                                    Status
                                  </div>
                                  <Badge
                                    variant={
                                      campaign.status === "sent"
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {campaign.status}
                                  </Badge>
                                </div>
                                <div className="md:col-span-2">
                                  <div className="text-sm text-muted-foreground">
                                    Sent
                                  </div>
                                  <div className="font-medium">
                                    {formatDateTimeSafe(campaign.send_time)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MailchimpConnectionGuard>
  );
}
