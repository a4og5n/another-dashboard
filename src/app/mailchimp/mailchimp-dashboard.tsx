"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CampaignsTable, AudiencesOverview } from "@/components/dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ProgressiveLoading } from "@/components/ui/loading-state";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RefreshCw, AlertCircle } from "lucide-react";

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

// Mock data for development and testing
const MOCK_DATA: DashboardData = {
  campaigns: {
    totalCampaigns: 47,
    sentCampaigns: 42,
    avgOpenRate: 28.5,
    avgClickRate: 4.2,
    totalEmailsSent: 128450,
    recentCampaigns: [
      {
        id: "1",
        title: "Weekly Newsletter #45",
        status: "sent",
        emailsSent: 12450,
        openRate: 32.1,
        clickRate: 5.3,
        sendTime: "2025-01-15T10:00:00Z",
      },
      {
        id: "2",
        title: "Product Launch Announcement",
        status: "sent",
        emailsSent: 8900,
        openRate: 45.7,
        clickRate: 8.9,
        sendTime: "2025-01-10T14:30:00Z",
      },
      {
        id: "3",
        title: "Holiday Sale Reminder",
        status: "sent",
        emailsSent: 15600,
        openRate: 28.4,
        clickRate: 6.1,
        sendTime: "2025-01-08T09:15:00Z",
      },
      {
        id: "4",
        title: "Customer Feedback Survey",
        status: "draft",
        emailsSent: 0,
        openRate: 0,
        clickRate: 0,
        sendTime: "",
      },
      {
        id: "5",
        title: "Monthly Report - December",
        status: "sent",
        emailsSent: 11200,
        openRate: 24.8,
        clickRate: 3.2,
        sendTime: "2025-01-01T08:00:00Z",
      },
    ],
  },
  audiences: {
    totalLists: 8,
    totalSubscribers: 24760,
    avgGrowthRate: 2.3,
    avgOpenRate: 31.2,
    avgClickRate: 4.8,
    topLists: [
      {
        id: "1",
        name: "Newsletter Subscribers",
        memberCount: 15420,
        growthRate: 3.1,
        openRate: 26.8,
        clickRate: 3.7,
      },
      {
        id: "2",
        name: "Product Updates List",
        memberCount: 6890,
        growthRate: 1.8,
        openRate: 31.2,
        clickRate: 4.3,
      },
      {
        id: "3",
        name: "VIP Customers",
        memberCount: 2450,
        growthRate: 0.9,
        openRate: 45.6,
        clickRate: 8.1,
      },
    ],
  },
};

export function MailchimpDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Pagination state
  const campaignsPerPageOptions = [5, 10, 20, 50];
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignsPerPageParam = parseInt(
    searchParams.get("perPage") || "10",
    10,
  );
  const [campaignsPerPage, setCampaignsPerPage] = useState(
    campaignsPerPageParam,
  );
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const totalCampaigns = data?.campaigns.totalCampaigns ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCampaigns / campaignsPerPage));

  const fetchDashboardData = async (
    isRefresh = false,
  ): Promise<DashboardData> => {
    if (isRefresh) setIsRefreshing(true);

    try {
      // Use the proper environment configuration to determine data source
      const { shouldUseMockData } = await import("@/lib/config");

      if (shouldUseMockData) {
        console.log(
          "📊 Using mock data (check environment variables to switch to real data)",
        );
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        return MOCK_DATA;
      }

      console.log("🌐 Fetching real data from Mailchimp API...");
      const response = await fetch("/api/mailchimp/dashboard");
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Fallback to mock data in case of error
      return MOCK_DATA;
    } finally {
      if (isRefresh) setIsRefreshing(false);
    }
  };

  const updateUrlParams = (newPage: number, newPerPage: number) => {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    params.set("perPage", newPerPage.toString());
    router.push(`/mailchimp?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateUrlParams(newPage, campaignsPerPage);
  };

  const handlePerPageChange = (newPerPage: string) => {
    const perPage = parseInt(newPerPage, 10);
    setCampaignsPerPage(perPage);
    // Reset to page 1 when changing per page count
    setCurrentPage(1);
    updateUrlParams(1, perPage);
  };

  useEffect(() => {
    fetchDashboardData()
      .then((dashboardData) => {
        setData(dashboardData);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to load dashboard:", err);
        setError("Failed to load dashboard data. Please try refreshing.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Sync URL params with state on mount
  useEffect(() => {
    if (campaignsPerPageParam !== campaignsPerPage) {
      setCampaignsPerPage(campaignsPerPageParam);
    }
    if (pageParam !== currentPage) {
      setCurrentPage(pageParam);
    }
  }, [campaignsPerPageParam, pageParam, campaignsPerPage, currentPage]);

  const handleRefresh = async () => {
    try {
      const freshData = await fetchDashboardData(true);
      setData(freshData);
      setError(null);
    } catch (err) {
      console.error("Refresh failed:", err);
      setError("Failed to refresh data. Please try again.");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <ProgressiveLoading isLoading={true}>
            <div className="h-8 w-48 rounded-md bg-gray-200" />
            <div className="h-64 rounded-lg bg-gray-100" />
            <div className="h-96 rounded-lg bg-gray-100" />
          </ProgressiveLoading>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Mailchimp Dashboard</h1>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh Data
          </Button>
        </div>

        {error && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="flex items-center space-x-3 pt-6">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-yellow-800">{error}</p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="campaigns">Email Campaigns</TabsTrigger>
            <TabsTrigger value="audiences">Audiences</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            {data?.campaigns && (
              <>
                <CampaignsTable
                  campaigns={data.campaigns.recentCampaigns.slice(
                    (currentPage - 1) * campaignsPerPage,
                    currentPage * campaignsPerPage,
                  )}
                />

                {/* Campaigns per page selector and pagination */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Show</span>
                    <Select
                      value={campaignsPerPage.toString()}
                      onValueChange={handlePerPageChange}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {campaignsPerPageOptions.map((option) => (
                          <SelectItem key={option} value={option.toString()}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">
                      campaigns per page
                    </span>
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="audiences" className="space-y-6">
            {data?.audiences && (
              <AudiencesOverview
                audiences={data.audiences.topLists}
                totalSubscribers={data.audiences.totalSubscribers}
                avgGrowthRate={data.audiences.avgGrowthRate}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
