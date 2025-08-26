'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { CampaignsTable, AudiencesOverview } from '@/components/dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ProgressiveLoading } from '@/components/ui/loading-state';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface DashboardData {
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
}

// Mock data for development (when API keys are not available)
const mockData: DashboardData = {
  campaigns: {
    totalCampaigns: 28,
    sentCampaigns: 24,
    avgOpenRate: 24.5,
    avgClickRate: 3.2,
    totalEmailsSent: 156780,
    recentCampaigns: [
      {
        id: '1',
        title: 'Weekly Newsletter - Product Updates',
        status: 'sent',
        emailsSent: 12450,
        openRate: 28.3,
        clickRate: 4.1,
        sendTime: '2025-08-22T09:00:00Z',
      },
      {
        id: '2',
        title: 'Summer Sale - 30% Off Everything',
        status: 'sent',
        emailsSent: 18920,
        openRate: 31.7,
        clickRate: 5.8,
        sendTime: '2025-08-20T14:30:00Z',
      },
      {
        id: '3',
        title: 'Customer Success Stories',
        status: 'sent',
        emailsSent: 8340,
        openRate: 22.1,
        clickRate: 2.9,
        sendTime: '2025-08-18T11:15:00Z',
      },
    ],
  },
  audiences: {
    totalLists: 4,
    totalSubscribers: 25680,
    avgGrowthRate: 2.3,
    avgOpenRate: 24.5,
    avgClickRate: 3.2,
    topLists: [
      {
        id: '1',
        name: 'Newsletter Subscribers',
        memberCount: 15420,
        growthRate: 3.1,
        openRate: 26.8,
        clickRate: 3.7,
      },
      {
        id: '2',
        name: 'Product Updates List',
        memberCount: 6890,
        growthRate: 1.8,
        openRate: 31.2,
        clickRate: 4.3,
      },
      {
        id: '3',
        name: 'VIP Customers',
        memberCount: 2450,
        growthRate: 0.9,
        openRate: 45.6,
        clickRate: 8.1,
      },
    ],
  },
};

export default function MailchimpPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Pagination state
  const campaignsPerPageOptions = [5, 10, 20, 50];
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignsPerPageParam = parseInt(searchParams.get('perPage') || '10', 10);
  const [campaignsPerPage, setCampaignsPerPage] = useState(campaignsPerPageParam);
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const totalCampaigns = data?.campaigns.totalCampaigns ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCampaigns / campaignsPerPage));

  const fetchDashboardData = async (isRefresh = false, page = currentPage, perPage = campaignsPerPage) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
  const response = await fetch(`/api/mailchimp/dashboard?limit=${perPage}&page=${page}`);
      
      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData);
      } else {
        // If API fails (no API keys), use mock data
        console.warn('API call failed, using mock data');
        setData(mockData);
        if (response.status === 500) {
          setError('API keys not configured. Using sample data.');
        }
      }
    } catch (err) {
      console.warn('API call failed, using mock data:', err);
      setData(mockData);
      setError('Unable to connect to Mailchimp API. Using sample data.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(false, currentPage, campaignsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, campaignsPerPage]);

  // Sync page state with URL
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page');
      const query = params.toString();
      router.replace(query ? `?${query}` : window.location.pathname);
    } else {
      params.set('page', page.toString());
      router.replace(`?${params.toString()}`);
    }
  };

  const handlePerPageChange = (value: string) => {
    const perPage = parseInt(value, 10);
    setCampaignsPerPage(perPage);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (perPage === 10) {
      params.delete('perPage');
    } else {
      params.set('perPage', perPage.toString());
    }
    params.delete('page');
    const query = params.toString();
    router.replace(query ? `?${query}` : window.location.pathname);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mailchimp Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your email marketing performance
            </p>
          </div>
          <Button 
            onClick={() => fetchDashboardData(true)} 
            disabled={loading || isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${(loading || isRefreshing) ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="flex items-center space-x-3 pt-6">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">{error}</p>
                <p className="text-sm text-yellow-600 mt-1">
                  To connect your Mailchimp account, add your API key to the environment variables.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Content */}
        <ProgressiveLoading
          isLoading={loading}
          hasError={false}
          isEmpty={!data}
          onRetry={() => fetchDashboardData()}
          loadingTitle="Loading your Mailchimp dashboard"
          loadingMessage="Fetching the latest data from your Mailchimp account..."
        >
          {/* Main Content Tabs */}
          <Tabs defaultValue="campaigns" className="space-y-4">
            <TabsList>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="audiences">Audiences</TabsTrigger>
              <TabsTrigger value="analytics" disabled>Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="campaigns" className="space-y-4">
              <div className="flex flex-col gap-4">
                <CampaignsTable
                  campaigns={data?.campaigns.recentCampaigns ?? []}
                  loading={isRefreshing}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Show</span>
                    <Select value={campaignsPerPage.toString()} onValueChange={handlePerPageChange}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {campaignsPerPageOptions.map(opt => (
                          <SelectItem key={opt} value={opt.toString()}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">campaigns per page</span>
                  </div>
                  <div className="flex justify-end w-full">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="audiences" className="space-y-4">
              <AudiencesOverview
                audiences={data?.audiences.topLists ?? []}
                totalSubscribers={data?.audiences.totalSubscribers ?? 0}
                avgGrowthRate={data?.audiences.avgGrowthRate ?? 0}
                loading={isRefreshing}
              />
            </TabsContent>
          </Tabs>
        </ProgressiveLoading>
      </div>
    </DashboardLayout>
  );
}
