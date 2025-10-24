/**
 * Member Profile Component
 * Complete member profile with subscription details and engagement metrics
 *
 * @route /mailchimp/lists/[id]/members/[subscriber_hash]
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { StatsGridCard } from "@/components/ui/stats-grid-card";
import {
  Mail,
  User,
  MapPin,
  Tag,
  Star,
  TrendingUp,
  Calendar,
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
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>ID: {data.unique_email_id}</span>
              </div>
            </div>
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
          </div>
        </CardHeader>
      </Card>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Member Rating"
          value={data.member_rating}
          icon={Star}
          description="out of 5 stars"
        />
        <StatCard
          label="Avg Open Rate"
          value={formatPercentage(data.stats.avg_open_rate)}
          icon={TrendingUp}
          description="engagement"
        />
        <StatCard
          label="Avg Click Rate"
          value={formatPercentage(data.stats.avg_click_rate)}
          icon={TrendingUp}
          description="engagement"
        />
        {data.stats.ecommerce_data && (
          <StatCard
            label="Total Revenue"
            value={`${data.stats.ecommerce_data.currency_code} ${data.stats.ecommerce_data.total_revenue.toLocaleString()}`}
            icon={TrendingUp}
            description={`${data.stats.ecommerce_data.number_of_orders} orders`}
          />
        )}
      </div>

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
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium">{data.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email Type</span>
                <span className="font-medium">{data.email_type || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">
                  {data.timestamp_signup
                    ? formatDateTimeSafe(data.timestamp_signup)
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Rating</span>
                <span className="font-medium">{data.member_rating}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Note</span>
                <span className="font-medium">
                  {data.last_note
                    ? formatDateTimeSafe(data.last_note.created_at)
                    : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tags */}
      {data.tags && data.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Tags ({data.tags.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location & Additional Info */}
      {data.location && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location & Additional Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatsGridCard
              title="Location & IP Information"
              stats={[
                {
                  label: "Country",
                  value: data.location.country_code || "N/A",
                },
                { label: "Timezone", value: data.location.timezone || "N/A" },
                {
                  label: "Latitude",
                  value: data.location.latitude?.toString() || "N/A",
                },
                {
                  label: "Longitude",
                  value: data.location.longitude?.toString() || "N/A",
                },
                {
                  label: "IP Signup",
                  value: data.ip_signup || "N/A",
                },
                {
                  label: "IP Opt",
                  value: data.ip_opt || "N/A",
                },
              ]}
            />
          </CardContent>
        </Card>
      )}

      {/* Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StatsGridCard
            title="Important Dates"
            stats={[
              {
                label: "Signup Date",
                value: data.timestamp_signup
                  ? formatDateTimeSafe(data.timestamp_signup)
                  : "N/A",
              },
              {
                label: "Opt-in Date",
                value: data.timestamp_opt
                  ? formatDateTimeSafe(data.timestamp_opt)
                  : "N/A",
              },
              {
                label: "Last Changed",
                value: data.last_changed
                  ? formatDateTimeSafe(data.last_changed)
                  : "N/A",
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
