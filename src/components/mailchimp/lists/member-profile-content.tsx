/**
 * Member Profile Component
 * Complete member profile with subscription details and engagement metrics
 *
 * @route /mailchimp/lists/[id]/members/[subscriber_hash]
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import {
  Mail,
  User,
  MapPin,
  Tag,
  Star,
  TrendingUp,
  Calendar,
  Smartphone,
  FileText,
} from "lucide-react";
import type { MemberInfoResponse } from "@/types/mailchimp/member-info";
import { formatDateTimeSafe } from "@/utils";

interface MemberProfileContentProps {
  data: MemberInfoResponse;
  listId: string;
  subscriberHash: string;
}

/**
 * Member Profile Content Component
 * Displays complete member information including contact details, status, and engagement metrics
 */
export function MemberProfileContent({ data }: MemberProfileContentProps) {
  const statusColorMap: Record<string, string> = {
    subscribed: "bg-green-500",
    unsubscribed: "bg-red-500",
    cleaned: "bg-gray-500",
    pending: "bg-yellow-500",
    transactional: "bg-blue-500",
    archived: "bg-gray-400",
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header Card - Member Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                {data.email_address}
              </CardTitle>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{data.full_name || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>ID: {data.unique_email_id}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                {data.vip && (
                  <Badge variant="secondary" className="gap-1">
                    <Star className="h-3 w-3" />
                    VIP
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className={statusColorMap[data.status] || "bg-gray-500"}
                >
                  {data.status}
                </Badge>
              </div>
              {data.status === "unsubscribed" && data.unsubscribe_reason && (
                <div className="text-sm text-red-600">
                  <span className="font-medium">
                    Reason: {data.unsubscribe_reason}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Member Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email Type</span>
                <span className="font-medium">{data.email_type || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Opt-in Date</span>
                <span className="font-medium">
                  {data.timestamp_opt
                    ? formatDateTimeSafe(data.timestamp_opt)
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Changed</span>
                <span className="font-medium">
                  {formatDateTimeSafe(data.last_changed)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Language</span>
                <span className="font-medium">{data.language || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email Client</span>
                <span className="font-medium">
                  {data.email_client || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  One-to-One Messaging
                </span>
                <span className="font-medium">
                  {data.consents_to_one_to_one_messaging !== undefined
                    ? data.consents_to_one_to_one_messaging
                      ? "Yes"
                      : "No"
                    : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Engagement Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Open Rate</span>
                <span className="font-medium">
                  {formatPercentage(data.stats.avg_open_rate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Click Rate</span>
                <span className="font-medium">
                  {formatPercentage(data.stats.avg_click_rate)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Member Rating</span>
                <StarRating rating={data.member_rating} size="sm" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Note */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Last Note
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.last_note ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Note ID</span>
                <span className="font-medium">{data.last_note.note_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created At</span>
                <span className="font-medium">
                  {formatDateTimeSafe(data.last_note.created_at)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created By</span>
                <span className="font-medium">{data.last_note.created_by}</span>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Note</span>
                <p className="font-medium text-sm">{data.last_note.note}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No notes added</p>
          )}
        </CardContent>
      </Card>

      {/* SMS Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            SMS Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">
                Phone Number
              </span>
              <p className="font-medium">{data.sms_phone_number || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">
                Subscription Status
              </span>
              <p className="font-medium">
                {data.sms_subscription_status || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">
                Last Updated
              </span>
              <p className="font-medium">
                {data.sms_subscription_last_updated
                  ? formatDateTimeSafe(data.sms_subscription_last_updated)
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Merge Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Merge Fields ({Object.keys(data.merge_fields || {}).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.merge_fields && Object.keys(data.merge_fields).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(data.merge_fields).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <span className="text-sm text-muted-foreground font-mono">
                    {key}
                  </span>
                  <p className="font-medium text-sm">
                    {typeof value === "object"
                      ? JSON.stringify(value, null, 2)
                      : value || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No merge fields configured
            </p>
          )}
        </CardContent>
      </Card>

      {/* Interests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Interests ({Object.keys(data.interests || {}).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.interests && Object.keys(data.interests).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(data.interests).map(
                ([interestId, subscribed]) => (
                  <div
                    key={interestId}
                    className="flex items-center justify-between border-b pb-2 last:border-b-0"
                  >
                    <span className="text-sm font-mono">{interestId}</span>
                    <Badge variant={subscribed ? "default" : "secondary"}>
                      {subscribed ? "Subscribed" : "Not Subscribed"}
                    </Badge>
                  </div>
                ),
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No interests configured
            </p>
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Tags ({data.tags?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.tags && data.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No tags assigned</p>
          )}
        </CardContent>
      </Card>

      {/* Source */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Source
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium">{data.source || "N/A"}</p>
        </CardContent>
      </Card>

      {/* Marketing Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Marketing Permissions ({data.marketing_permissions?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.marketing_permissions &&
          data.marketing_permissions.length > 0 ? (
            <div className="space-y-3">
              {data.marketing_permissions.map((permission) => (
                <div
                  key={permission.marketing_permission_id}
                  className="flex items-center justify-between border-b pb-2 last:border-b-0"
                >
                  <span className="text-sm">{permission.text}</span>
                  <Badge variant={permission.enabled ? "default" : "secondary"}>
                    {permission.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No marketing permissions
            </p>
          )}
        </CardContent>
      </Card>

      {/* Location */}
      {data.location && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">
                  Country Code
                </span>
                <p className="font-medium">
                  {data.location.country_code || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Region</span>
                <p className="font-medium">{data.location.region || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Timezone</span>
                <p className="font-medium">{data.location.timezone || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Latitude</span>
                <p className="font-medium">
                  {data.location.latitude?.toString() || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Longitude</span>
                <p className="font-medium">
                  {data.location.longitude?.toString() || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">
                  GMT Offset
                </span>
                <p className="font-medium">
                  {data.location.gmtoff?.toString() || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">
                  DST Offset
                </span>
                <p className="font-medium">
                  {data.location.dstoff?.toString() || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">IP Signup</span>
                <p className="font-medium">{data.ip_signup || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">IP Opt</span>
                <p className="font-medium">{data.ip_opt || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Signup Date</span>
              <p className="font-medium">
                {data.timestamp_signup
                  ? formatDateTimeSafe(data.timestamp_signup)
                  : "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Opt-in Date</span>
              <p className="font-medium">
                {data.timestamp_opt
                  ? formatDateTimeSafe(data.timestamp_opt)
                  : "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">
                Last Changed
              </span>
              <p className="font-medium">
                {data.last_changed
                  ? formatDateTimeSafe(data.last_changed)
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
