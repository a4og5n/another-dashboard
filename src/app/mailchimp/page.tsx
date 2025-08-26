'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { MetricCard, CampaignsTable, AudiencesOverview } from '@/components/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, AlertCircle, Mail, Users, BarChart } from 'lucide-react';

interface MailchimpDashboardData {
  campaigns: {
    totalCampaigns: number;
    sentCampaigns: number;
    avgOpenRate: number;
    avgClickRate: number;
    totalEmailsSent: number;
    recentCampaigns: Array<{
      id: string;
      title: string;
      status: string;
      emailsSent: number;
      openRate: number;
      clickRate: number;
      sendTime: string;
    }>;
  };
  audiences: {
    totalLists: number;
    totalSubscribers: number;
    avgGrowthRate: number;
    avgOpenRate: number;
    avgClickRate: number;
    topLists: Array<{
      id: string;
      name: string;
      memberCount: number;
      growthRate: number;
      openRate: number;
      clickRate: number;
    }>;
  };
  metadata?: {
    lastUpdated: string;
  };
}

export default function MailchimpPage() {
  const [data, setData] = useState<MailchimpDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMailchimpData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/mailchimp/dashboard');
      
      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData);
      } else {
        setError('Failed to connect to Mailchimp API. Please check your API configuration.');
      }
    } catch {
      setError('Unable to connect to Mailchimp API. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMailchimpData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-8 w-8 text-yellow-600" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Mailchimp</h1>
                <p className="text-muted-foreground">
                  Email marketing campaigns and audience insights
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Primary Integration
            </Badge>
          </div>
          <Button onClick={fetchMailchimpData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="flex items-center space-x-3 pt-6">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">{error}</p>
                <p className="text-sm text-red-600 mt-1">
                  Make sure your Mailchimp API key is properly configured in your environment variables.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connection Status */}
        <Card>
          <CardContent className="flex items-center justify-between pt-6">
            <div className="flex items-center space-x-3">
              <div className={`h-3 w-3 rounded-full ${data ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div>
                <p className="font-medium">
                  {data ? 'Connected to Mailchimp' : 'Disconnected'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {data 
                    ? `Last updated: ${new Date(data.metadata?.lastUpdated || Date.now()).toLocaleString()}`
                    : 'Unable to connect to your Mailchimp account'
                  }
                </p>
              </div>
            </div>
            {data && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                API Connected
              </Badge>
            )}
          </CardContent>
        </Card>

        {data && (
          <>
            {/* Campaign Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart className="h-5 w-5" />
                  <span>Campaign Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <MetricCard
                    title="Total Campaigns"
                    value={data.campaigns.totalCampaigns}
                    description="All campaigns created"
                    loading={loading}
                  />
                  <MetricCard
                    title="Sent Campaigns"
                    value={data.campaigns.sentCampaigns}
                    description="Successfully delivered"
                    loading={loading}
                  />
                  <MetricCard
                    title="Average Open Rate"
                    value={`${data.campaigns.avgOpenRate.toFixed(1)}%`}
                    trend={data.campaigns.avgOpenRate > 20 ? 'up' : 'neutral'}
                    description="Industry avg: 21.3%"
                    loading={loading}
                  />
                  <MetricCard
                    title="Average Click Rate"
                    value={`${data.campaigns.avgClickRate.toFixed(1)}%`}
                    trend={data.campaigns.avgClickRate > 2.5 ? 'up' : 'neutral'}
                    description="Industry avg: 2.6%"
                    loading={loading}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recent Campaigns */}
            <CampaignsTable
              campaigns={data.campaigns.recentCampaigns}
              loading={loading}
            />

            {/* Audience Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Audience Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <AudiencesOverview
                    audiences={data.audiences.topLists}
                    totalSubscribers={data.audiences.totalSubscribers}
                    avgGrowthRate={data.audiences.avgGrowthRate}
                    loading={loading}
                  />
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <MetricCard
                        title="Total Lists"
                        value={data.audiences.totalLists}
                        loading={loading}
                      />
                      <MetricCard
                        title="Growth Rate"
                        value={`+${data.audiences.avgGrowthRate.toFixed(1)}%`}
                        trend="up"
                        loading={loading}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <MetricCard
                        title="List Open Rate"
                        value={`${data.audiences.avgOpenRate.toFixed(1)}%`}
                        loading={loading}
                      />
                      <MetricCard
                        title="List Click Rate"
                        value={`${data.audiences.avgClickRate.toFixed(1)}%`}
                        loading={loading}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Setup Instructions (when not connected) */}
        {!data && !loading && (
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Mailchimp Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      To start viewing your Mailchimp data, you&apos;ll need to configure your API credentials:
                    </p>              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                    1
                  </span>
                  <div>
                    <p className="font-medium">Get your API key from Mailchimp</p>
                    <p className="text-muted-foreground">
                      Go to Account → Extras → API keys in your Mailchimp dashboard
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                    2
                  </span>
                  <div>
                    <p className="font-medium">Add environment variables</p>
                    <p className="text-muted-foreground">
                      Set MAILCHIMP_API_KEY and MAILCHIMP_SERVER_PREFIX in your .env.local file
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                    3
                  </span>
                  <div>
                    <p className="font-medium">Restart your development server</p>
                    <p className="text-muted-foreground">
                      Refresh this page to see your Mailchimp data
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
