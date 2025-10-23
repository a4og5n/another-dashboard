/**
 * List Detail Container Component
 * Main container that displays detailed information about a Mailchimp list
 *
 * Following established patterns from CampaignReportDetail component
 * Only displays data available in the list schema - no member data
 */

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { ListTabNavigation } from "@/components/mailchimp/lists/list-tab-navigation";
import type { ListDetailProps } from "@/types/components";
import { formatDateLongSafe, buildMailchimpListUrl } from "@/utils";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import Link from "next/link";

export function ListDetail({
  list,
  error,
  activeTab = "overview",
  serverPrefix,
}: ListDetailProps) {
  // Handle service-level errors passed from parent
  if (error) {
    return <DashboardInlineError error={error} />;
  }

  // Handle prop validation - no list data provided
  if (!list) {
    return <DashboardInlineError error="No list data provided" />;
  }

  // Build Mailchimp admin URL
  const mailchimpAdminUrl = buildMailchimpListUrl(serverPrefix, list.web_id);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* List Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{list.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Created {formatDateLongSafe(list.date_created)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rating:</span>
              <StarRating rating={list.list_rating} size="md" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabbed Content */}
      <ListTabNavigation activeTab={activeTab}>
        {/* Overview Tab */}
        <div data-tab="overview" className="mt-6">
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold">{list.contact.company}</p>
                    <p className="text-sm text-muted-foreground">
                      {list.contact.address1}
                    </p>
                    {list.contact.address2 && (
                      <p className="text-sm text-muted-foreground">
                        {list.contact.address2}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {list.contact.city}, {list.contact.state}{" "}
                      {list.contact.zip}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {list.contact.country}
                    </p>
                    {list.contact.phone && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {list.contact.phone}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Defaults */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Defaults</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">From Name</p>
                    <p className="font-semibold">
                      {list.campaign_defaults.from_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">From Email</p>
                    <p className="font-semibold">
                      {list.campaign_defaults.from_email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Default Subject
                    </p>
                    <p className="font-semibold">
                      {list.campaign_defaults.subject}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Language</p>
                    <p className="font-semibold">
                      {list.campaign_defaults.language}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Permission Reminder */}
            {list.permission_reminder && (
              <Card>
                <CardHeader>
                  <CardTitle>Permission Reminder</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{list.permission_reminder}</p>
                </CardContent>
              </Card>
            )}

            {/* External Link to Mailchimp Admin */}
            {mailchimpAdminUrl && (
              <Card>
                <CardContent className="pt-6">
                  <a
                    href={mailchimpAdminUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on Mailchimp Admin
                  </a>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Stats Tab */}
        <div data-tab="stats" className="mt-6">
          <div className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Subscribed Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {list.stats.member_count.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Active subscribers
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Total Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {list.stats.total_contacts !== undefined
                      ? list.stats.total_contacts.toLocaleString()
                      : "N/A"}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    All contacts
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Campaigns Sent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {list.stats.campaign_count.toLocaleString()}
                  </div>
                  {list.stats.campaign_last_sent && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Last sent:{" "}
                      {formatDateLongSafe(list.stats.campaign_last_sent)}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Merge Fields
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {list.stats.merge_field_count.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Custom fields
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Member Activity & Engagement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Member Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Member Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Unsubscribed:
                      </span>
                      <span className="font-semibold">
                        {list.stats.unsubscribe_count.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cleaned:</span>
                      <span className="font-semibold">
                        {list.stats.cleaned_count.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Members Since Send:
                      </span>
                      <span className="font-semibold">
                        {list.stats.member_count_since_send.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Unsubscribe Since Send:
                      </span>
                      <span className="font-semibold">
                        {list.stats.unsubscribe_count_since_send.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Cleaned Since Send:
                      </span>
                      <span className="font-semibold">
                        {list.stats.cleaned_count_since_send.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Link href={`/mailchimp/lists/${list.id}/activity`}>
                      View Activity Timeline
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Engagement Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {list.stats.open_rate !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Open Rate:
                        </span>
                        <span className="font-semibold">
                          {list.stats.open_rate.toFixed(1)}%
                        </span>
                      </div>
                    )}
                    {list.stats.click_rate !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Click Rate:
                        </span>
                        <span className="font-semibold">
                          {list.stats.click_rate.toFixed(1)}%
                        </span>
                      </div>
                    )}
                    {list.stats.avg_sub_rate !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Avg Subscribe Rate:
                        </span>
                        <span className="font-semibold">
                          {list.stats.avg_sub_rate.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {list.stats.avg_unsub_rate !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Avg Unsubscribe Rate:
                        </span>
                        <span className="font-semibold">
                          {list.stats.avg_unsub_rate.toFixed(2)}
                        </span>
                      </div>
                    )}
                    {list.stats.target_sub_rate !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Target Subscribe Rate:
                        </span>
                        <span className="font-semibold">
                          {list.stats.target_sub_rate.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Date Activity */}
            {(list.stats.last_sub_date || list.stats.last_unsub_date) && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {list.stats.last_sub_date && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Last Subscribe:
                        </span>
                        <span className="font-semibold">
                          {formatDateLongSafe(list.stats.last_sub_date)}
                        </span>
                      </div>
                    )}
                    {list.stats.last_unsub_date && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Last Unsubscribe:
                        </span>
                        <span className="font-semibold">
                          {formatDateLongSafe(list.stats.last_unsub_date)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Settings Tab */}
        <div data-tab="settings" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>List Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Visibility</span>
                    <span className="font-semibold capitalize">
                      {list.visibility === "pub" ? "Public" : "Private"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Double Opt-in</span>
                    <span className="font-semibold">
                      {list.double_optin ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Welcome Email</span>
                    <span className="font-semibold">
                      {list.has_welcome ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Email Type Option
                    </span>
                    <span className="font-semibold">
                      {list.email_type_option ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Marketing Permissions
                    </span>
                    <span className="font-semibold">
                      {list.marketing_permissions ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Use Archive Bar
                    </span>
                    <span className="font-semibold">
                      {list.use_archive_bar ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            {(list.notify_on_subscribe || list.notify_on_unsubscribe) && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {list.notify_on_subscribe && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Notify on Subscribe
                        </p>
                        <p className="font-semibold">
                          {list.notify_on_subscribe}
                        </p>
                      </div>
                    )}
                    {list.notify_on_unsubscribe && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Notify on Unsubscribe
                        </p>
                        <p className="font-semibold">
                          {list.notify_on_unsubscribe}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Subscribe URLs */}
            <Card>
              <CardHeader>
                <CardTitle>Subscribe URLs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Short URL
                    </p>
                    <a
                      href={list.subscribe_url_short}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline break-all"
                    >
                      {list.subscribe_url_short}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Long URL
                    </p>
                    <a
                      href={list.subscribe_url_long}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline break-all"
                    >
                      {list.subscribe_url_long}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Beamer Address
                    </p>
                    <p className="text-sm font-mono">{list.beamer_address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modules (Integrations) */}
            <Card>
              <CardHeader>
                <CardTitle>Modules</CardTitle>
              </CardHeader>
              <CardContent>
                {list.modules && list.modules.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {list.modules.map((module, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm font-medium"
                      >
                        {module}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">N/A</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </ListTabNavigation>
    </div>
  );
}
