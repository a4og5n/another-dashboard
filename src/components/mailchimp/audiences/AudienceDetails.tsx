import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Mail,
  Building,
  Phone,
  Calendar,
  Activity,
  BarChart3,
  Settings,
  Edit,
  Archive,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AudienceModel } from "@/dal/models/audience.model";
import type { AudienceDetailsProps } from "@/types/mailchimp/audience";



export function AudienceDetails({
  audience,
  growthData = [],
  loading = false,
  onEdit,
  onArchive,
  onRefresh,
  className,
}: AudienceDetailsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatPercentage = (num: number) => {
    return `${(num * 100).toFixed(1)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: AudienceModel["sync_status"]) => {
    const config = {
      completed: {
        variant: "default" as const,
        icon: CheckCircle,
        className: "bg-green-100 text-green-800 border-green-200",
        label: "Synced",
      },
      syncing: {
        variant: "secondary" as const,
        icon: RefreshCw,
        className: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Syncing",
      },
      failed: {
        variant: "destructive" as const,
        icon: XCircle,
        className: "",
        label: "Failed",
      },
      pending: {
        variant: "outline" as const,
        icon: Clock,
        className: "",
        label: "Pending",
      },
    };

    const {
      variant,
      icon: Icon,
      className: badgeClassName,
      label,
    } = config[status];

    return (
      <Badge variant={variant} className={badgeClassName}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getVisibilityInfo = (visibility: AudienceModel["visibility"]) => {
    return visibility === "pub"
      ? {
          icon: Eye,
          label: "Public",
          description: "Visible to search engines and the public",
          className: "text-blue-600",
        }
      : {
          icon: EyeOff,
          label: "Private",
          description: "Only visible to authenticated users",
          className: "text-gray-600",
        };
  };

  const getEngagementLevel = (rate?: number) => {
    if (!rate) return null;

    if (rate >= 0.3)
      return { level: "High", color: "text-green-600", icon: TrendingUp };
    if (rate >= 0.15)
      return { level: "Medium", color: "text-yellow-600", icon: Activity };
    return { level: "Low", color: "text-red-600", icon: TrendingDown };
  };

  const engagementInfo = getEngagementLevel(
    audience.cached_stats?.engagement_rate,
  );
  const visibilityInfo = getVisibilityInfo(audience.visibility);
  const VisibilityIcon = visibilityInfo.icon;

  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{audience.name}</h1>
                {getStatusBadge(audience.sync_status)}
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <VisibilityIcon
                    className={cn("h-4 w-4", visibilityInfo.className)}
                  />
                  <span className="text-sm">{visibilityInfo.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    Created {formatDate(audience.date_created)}
                  </span>
                </div>
                {audience.last_synced_at && (
                  <div className="flex items-center gap-1">
                    <RefreshCw className="h-4 w-4" />
                    <span className="text-sm">
                      Last synced {formatDate(audience.last_synced_at)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardTitle>

          <CardAction>
            <div className="flex items-center gap-2">
              {onRefresh && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRefresh(audience.id)}
                  aria-label="Refresh audience data"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(audience.id)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              {onArchive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onArchive(audience.id)}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
              )}
            </div>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Members
                </p>
                <p className="text-2xl font-bold">
                  {formatNumber(audience.stats.member_count)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            {audience.cached_stats?.member_count &&
              audience.cached_stats.member_count !==
                audience.stats.member_count && (
                <p className="text-xs text-muted-foreground mt-2">
                  Cached: {formatNumber(audience.cached_stats.member_count)}
                </p>
              )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Unsubscribed
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {formatNumber(audience.stats.unsubscribe_count)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Cleaned
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatNumber(audience.stats.cleaned_count)}
                </p>
              </div>
              <Archive className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  List Rating
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{audience.list_rating}</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-4 w-4",
                          star <= audience.list_rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300",
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Defaults</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Engagement Rate */}
                {engagementInfo && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <engagementInfo.icon
                          className={cn("h-4 w-4", engagementInfo.color)}
                        />
                        <span className="text-sm font-medium">
                          Engagement Rate
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {formatPercentage(
                            audience.cached_stats?.engagement_rate || 0,
                          )}
                        </span>
                        <Badge
                          variant="outline"
                          className={engagementInfo.color}
                        >
                          {engagementInfo.level}
                        </Badge>
                      </div>
                    </div>
                    <Progress
                      value={
                        (audience.cached_stats?.engagement_rate || 0) * 100
                      }
                      className="h-2"
                    />
                  </div>
                )}

                {/* Member Retention */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatNumber(audience.stats.member_count)}
                    </div>
                    <div className="text-sm text-green-600">Active Members</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {formatNumber(audience.stats.unsubscribe_count)}
                    </div>
                    <div className="text-sm text-red-600">Unsubscribed</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatNumber(audience.stats.cleaned_count)}
                    </div>
                    <div className="text-sm text-orange-600">Cleaned</div>
                  </div>
                </div>

                {/* Growth Data */}
                {growthData.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-4">Recent Growth</h4>
                    <div className="space-y-2">
                      {growthData.slice(-7).map((data) => (
                        <div
                          key={data.date}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-muted-foreground">
                            {new Date(data.date).toLocaleDateString()}
                          </span>
                          <span className="font-medium">
                            {formatNumber(data.member_count)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Company
                      </label>
                      <p className="text-sm">{audience.contact.company}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Address
                      </label>
                      <div className="text-sm space-y-1">
                        <p>{audience.contact.address1}</p>
                        {audience.contact.address2 && (
                          <p>{audience.contact.address2}</p>
                        )}
                        <p>
                          {audience.contact.city}, {audience.contact.state}{" "}
                          {audience.contact.zip}
                        </p>
                        <p>{audience.contact.country}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {audience.contact.phone && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Phone
                        </label>
                        <p className="text-sm flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {audience.contact.phone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Campaign Defaults
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      From Name
                    </label>
                    <p className="text-sm">
                      {audience.campaign_defaults.from_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      From Email
                    </label>
                    <p className="text-sm">
                      {audience.campaign_defaults.from_email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Default Subject
                    </label>
                    <p className="text-sm">
                      {audience.campaign_defaults.subject}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Language
                    </label>
                    <p className="text-sm capitalize">
                      {audience.campaign_defaults.language}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <label className="text-sm font-medium text-muted-foreground">
                    Permission Reminder
                  </label>
                  <p className="text-sm mt-1">{audience.permission_reminder}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Audience Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Visibility</p>
                    <p className="text-xs text-muted-foreground">
                      {visibilityInfo.description}
                    </p>
                  </div>
                  <Badge variant="outline" className={visibilityInfo.className}>
                    <VisibilityIcon className="h-3 w-3 mr-1" />
                    {visibilityInfo.label}
                  </Badge>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Email Type Option</p>
                    <p className="text-xs text-muted-foreground">
                      Allow subscribers to choose HTML or text emails
                    </p>
                  </div>
                  <Badge
                    variant={
                      audience.email_type_option ? "default" : "secondary"
                    }
                  >
                    {audience.email_type_option ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Archive Bar</p>
                    <p className="text-xs text-muted-foreground">
                      Show archive bar at bottom of emails
                    </p>
                  </div>
                  <Badge
                    variant={audience.use_archive_bar ? "default" : "secondary"}
                  >
                    {audience.use_archive_bar ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Sync Status</p>
                    <p className="text-xs text-muted-foreground">
                      Current synchronization status
                    </p>
                  </div>
                  {getStatusBadge(audience.sync_status)}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

AudienceDetails.displayName = "AudienceDetails";
