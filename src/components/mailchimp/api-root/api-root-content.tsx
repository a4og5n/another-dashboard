/**
 * API Root Component
 * Display Mailchimp API metadata and account information
 *
 * @route /mailchimp/api-root
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsGridCard } from "@/components/ui/stats-grid-card";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import { formatDateTimeSafe } from "@/utils/format-date";
import type { RootSuccess } from "@/types/mailchimp/root";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Building,
  CreditCard,
  TrendingUp,
  Globe,
  Clock,
} from "lucide-react";

interface APIRootContentProps {
  data: RootSuccess;
  errorCode?: string;
}

export function APIRootContent({ data, errorCode }: APIRootContentProps) {
  return (
    <MailchimpConnectionGuard errorCode={errorCode}>
      <div className="space-y-6">
        {/* Account Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building className="h-4 w-4" />
                  <span>Account Name</span>
                </div>
                <p className="font-medium">{data.account_name}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Username</span>
                </div>
                <p className="font-medium">{data.username}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </div>
                <p className="font-medium">{data.email}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Owner</span>
                </div>
                <p className="font-medium">
                  {data.first_name} {data.last_name}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>Role</span>
                </div>
                <p className="font-medium">{data.role}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Timezone</span>
                </div>
                <p className="font-medium">{data.account_timezone}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building className="h-4 w-4" />
                  <span>Industry</span>
                </div>
                <p className="font-medium">{data.account_industry}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>Pricing Plan</span>
                </div>
                <p className="font-medium capitalize">
                  {data.pricing_plan_type.replace(/_/g, " ")}
                  {data.pro_enabled && " (Pro)"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Total Subscribers</span>
                </div>
                <p className="font-medium">
                  {data.total_subscribers.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Contact Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Company</div>
                <p className="font-medium">{data.contact.company}</p>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Address</div>
                <p className="font-medium">
                  {data.contact.addr1}
                  {data.contact.addr2 && <>, {data.contact.addr2}</>}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">City</div>
                <p className="font-medium">{data.contact.city}</p>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">State / ZIP</div>
                <p className="font-medium">
                  {data.contact.state}, {data.contact.zip}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Country</div>
                <p className="font-medium">{data.contact.country}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Industry Statistics */}
        <StatsGridCard
          title="Industry Stats"
          icon={TrendingUp}
          stats={[
            {
              label: "Industry Avg Open Rate",
              value: `${(data.industry_stats.open_rate * 100).toFixed(1)}%`,
            },
            {
              label: "Industry Avg Click Rate",
              value: `${(data.industry_stats.click_rate * 100).toFixed(1)}%`,
            },
            {
              label: "Industry Avg Bounce Rate",
              value: `${(data.industry_stats.bounce_rate * 100).toFixed(1)}%`,
            },
          ]}
          columns={3}
        />

        {/* Account Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Account Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Member Since</span>
                </div>
                <p className="font-medium">
                  {formatDateTimeSafe(data.member_since)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>First Payment</span>
                </div>
                <p className="font-medium">
                  {formatDateTimeSafe(data.first_payment)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Last Login</span>
                </div>
                <p className="font-medium">
                  {formatDateTimeSafe(data.last_login)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MailchimpConnectionGuard>
  );
}
