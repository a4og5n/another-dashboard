"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
import { RefreshCw, AlertCircle, ArrowLeft } from "lucide-react";
import {
  DateFilter,
  FilteredCampaignsResponse,
} from "@/types/campaign-filters";
import { format } from "date-fns";

// Helper function to format date as YYYY-MM-DD for URL parameters
const formatDateForUrl = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

interface DashboardData extends FilteredCampaignsResponse {
  metadata?: {
    lastUpdated: string;
    rateLimit?: {
      limit?: number;
      remaining?: number;
      reset?: number;
    };
  };
}

export function MailchimpDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Date filtering state
  const [dateFilter, setDateFilter] = useState<DateFilter | undefined>(
    undefined,
  );

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

  const fetchDashboardData = useCallback(
    async (
      isRefresh = false,
      page: number,
      perPage: number,
      dateRange?: DateFilter,
    ): Promise<DashboardData> => {
      if (isRefresh) setIsRefreshing(true);

      try {
        // Always fetch from the server API. The server will decide whether to
        // use real Mailchimp data or mock data based on validated environment
        // variables. Client-side code should not import server-only modules
        // (like `@/lib/config`) because those run Zod validation at bundle
        // evaluation time and can cause environment validation errors.
        console.log("🌐 Fetching real data from Mailchimp API...", {
          page,
          perPage,
          dateRange,
        });

        // Build query parameters for pagination and filtering
        const params = new URLSearchParams({
          page: page.toString(),
          limit: perPage.toString(),
        });

        // Add date range parameters if provided (only dates, not presets)
        if (dateRange?.startDate) {
          params.set("startDate", formatDateForUrl(dateRange.startDate));
        }
        if (dateRange?.endDate) {
          params.set("endDate", formatDateForUrl(dateRange.endDate));
        }
        // Note: Presets are UI shortcuts only, we only send actual dates to API

        const response = await fetch(`/api/mailchimp/dashboard?${params}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            error: "Unknown error",
            details: "Failed to parse error response",
          }));

          // Create detailed error message based on response status
          let errorMessage = `API Request Failed (${response.status})`;
          if (errorData.error) {
            errorMessage = errorData.error;
          }
          if (errorData.details) {
            errorMessage += `: ${errorData.details}`;
          }

          // Throw an error with detailed information for proper error handling
          const error = new Error(errorMessage) as Error & {
            status?: number;
            details?: string;
          };
          error.status = response.status;
          error.details = errorData.details;
          throw error;
        }

        return await response.json();
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Re-throw the error to be handled by the calling code
        // Do NOT fall back to mock data - let proper error handling take over
        throw error;
      } finally {
        if (isRefresh) setIsRefreshing(false);
      }
    },
    [], // Remove dependencies to prevent recreation
  );

  const updateUrlParams = (
    newPage: number,
    newPerPage: number,
    newDateFilter?: DateFilter,
  ) => {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    params.set("perPage", newPerPage.toString());

    // Add date filter parameters to URL (only dates, not presets)
    if (newDateFilter?.startDate) {
      params.set("startDate", formatDateForUrl(newDateFilter.startDate));
    }
    if (newDateFilter?.endDate) {
      params.set("endDate", formatDateForUrl(newDateFilter.endDate));
    }
    // Note: We don't include preset in URL as it's just a UI shortcut

    router.push(`/mailchimp?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateUrlParams(newPage, campaignsPerPage, dateFilter);
  };

  const handlePerPageChange = (newPerPage: string) => {
    const perPage = parseInt(newPerPage, 10);
    setCampaignsPerPage(perPage);
    // Reset to page 1 when changing per page count
    setCurrentPage(1);
    updateUrlParams(1, perPage, dateFilter);
  };

  const handleDateFilterChange = (newDateFilter?: DateFilter) => {
    setDateFilter(newDateFilter);
    // Reset to page 1 when changing filters
    setCurrentPage(1);
    updateUrlParams(1, campaignsPerPage, newDateFilter);
  };

  // Single useEffect to handle data fetching when relevant parameters change
  // fetchDashboardData is intentionally stable (no deps) to prevent recreation
  useEffect(() => {
    let isCancelled = false; // Prevent race conditions with stale requests

    const loadData = async () => {
      // Use main loading state only for initial load, campaigns loading for subsequent updates
      const isInitialLoad = data === null;

      if (isInitialLoad) {
        setLoading(true);
      } else {
        setCampaignsLoading(true);
      }

      try {
        const dashboardData = await fetchDashboardData(
          false,
          currentPage,
          campaignsPerPage,
          dateFilter,
        );

        // Only update state if this request hasn't been cancelled
        if (!isCancelled) {
          setData(dashboardData);
          setError(null);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Failed to load dashboard:", err);

          // Set appropriate error message based on error type
          let errorMessage = "Failed to load dashboard data. Please try again.";

          if (err instanceof Error) {
            // Use the detailed error message from fetchDashboardData
            errorMessage = err.message;

            // Check for specific error types and provide helpful guidance
            if (err.message.includes("500")) {
              errorMessage =
                "Server error occurred. Please check your Mailchimp API configuration and try again.";
            } else if (
              err.message.includes("401") ||
              err.message.includes("403")
            ) {
              errorMessage =
                "Authentication failed. Please verify your Mailchimp API key is correct.";
            } else if (err.message.includes("404")) {
              errorMessage = "API endpoint not found. Please contact support.";
            } else if (err.message.includes("429")) {
              errorMessage =
                "Rate limit exceeded. Please wait a moment and try again.";
            } else if (err.message.includes("Network")) {
              errorMessage =
                "Network error. Please check your internet connection and try again.";
            }
          }

          setError(errorMessage);
          setData(null); // Clear any stale data
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
          setCampaignsLoading(false);
        }
      }
    };

    loadData();

    // Cleanup function to cancel stale requests
    return () => {
      isCancelled = true;
    };
    // fetchDashboardData is intentionally omitted from deps (stable with no dependencies)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, campaignsPerPage, dateFilter]);

  // Use refs to track previous values to prevent infinite loops
  const prevPageRef = useRef(pageParam);
  const prevPerPageRef = useRef(campaignsPerPageParam);
  const prevSearchParamsRef = useRef(searchParams.toString());

  // Sync URL params with state when URL changes - prevent infinite loops
  useEffect(() => {
    const currentSearchParamsString = searchParams.toString();

    // Only run if URL actually changed
    if (
      pageParam !== prevPageRef.current ||
      campaignsPerPageParam !== prevPerPageRef.current ||
      currentSearchParamsString !== prevSearchParamsRef.current
    ) {
      let hasChanges = false;

      // Update state in a single batch to prevent multiple re-renders
      if (campaignsPerPageParam !== campaignsPerPage) {
        setCampaignsPerPage(campaignsPerPageParam);
        hasChanges = true;
      }
      if (pageParam !== currentPage) {
        setCurrentPage(pageParam);
        hasChanges = true;
      }

      // Parse date filter from URL (only dates, ignore presets)
      const startDateParam = searchParams.get("startDate");
      const endDateParam = searchParams.get("endDate");

      const currentStartDate = dateFilter?.startDate
        ? formatDateForUrl(dateFilter.startDate)
        : null;
      const currentEndDate = dateFilter?.endDate
        ? formatDateForUrl(dateFilter.endDate)
        : null;

      // Only update date filter if URL dates are different from current state
      if (
        startDateParam !== currentStartDate ||
        endDateParam !== currentEndDate
      ) {
        if (startDateParam || endDateParam) {
          const urlDateFilter: DateFilter = {
            startDate: startDateParam
              ? new Date(startDateParam + "T00:00:00.000Z")
              : undefined,
            endDate: endDateParam
              ? new Date(endDateParam + "T23:59:59.999Z")
              : undefined,
            // No preset - it's not needed once we have actual dates
          };
          setDateFilter(urlDateFilter);
        } else if (dateFilter) {
          // Clear date filter if URL has no date parameters
          setDateFilter(undefined);
        }
        hasChanges = true;
      }

      // Update refs to current values
      prevPageRef.current = pageParam;
      prevPerPageRef.current = campaignsPerPageParam;
      prevSearchParamsRef.current = currentSearchParamsString;

      // Log URL sync changes for debugging
      if (hasChanges) {
        console.log("URL sync updated state:", {
          page: pageParam,
          perPage: campaignsPerPageParam,
          startDate: startDateParam,
          endDate: endDateParam,
        });
      }
    }
  }, [
    campaignsPerPageParam,
    pageParam,
    searchParams,
    campaignsPerPage,
    currentPage,
    dateFilter,
  ]);

  const handleRefresh = async () => {
    try {
      const refreshedData = await fetchDashboardData(
        true,
        currentPage,
        campaignsPerPage,
        dateFilter,
      );
      setData(refreshedData);
      setError(null);
    } catch (err) {
      console.error("Failed to refresh dashboard:", err);

      // Set appropriate error message for refresh failures
      let errorMessage = "Failed to refresh data. Please try again.";

      if (err instanceof Error) {
        if (err.message.includes("500")) {
          errorMessage =
            "Server error during refresh. Please check your Mailchimp API configuration.";
        } else if (err.message.includes("401") || err.message.includes("403")) {
          errorMessage =
            "Authentication failed during refresh. Please verify your Mailchimp API key.";
        } else if (err.message.includes("429")) {
          errorMessage =
            "Rate limit exceeded. Please wait a moment before refreshing.";
        } else {
          errorMessage = `Refresh failed: ${err.message}`;
        }
      }

      setError(errorMessage);
    }
  };

  const handleGoHome = () => {
    router.push("/");
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

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-destructive/10 p-3 mb-4">
                <RefreshCw className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-center">
                Dashboard Error
              </h3>
              <p className="text-muted-foreground text-center max-w-sm mb-6">
                {error}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  onClick={handleRefresh}
                  variant="default"
                  className="flex-1 gap-2"
                  disabled={isRefreshing}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  {isRefreshing ? "Retrying..." : "Try Again"}
                </Button>
                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center mt-6">
          <h1 className="text-3xl font-bold">Mailchimp Dashboard</h1>
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
                  campaigns={data.campaigns.recentCampaigns}
                  loading={campaignsLoading}
                  dateRange={
                    dateFilter?.startDate || dateFilter?.endDate
                      ? {
                          from: dateFilter.startDate,
                          to: dateFilter.endDate,
                        }
                      : undefined
                  }
                  onDateRangeChange={(range) => {
                    // Manual selection - only executed when submit button is pressed
                    if (range?.from || range?.to) {
                      handleDateFilterChange({
                        startDate: range.from,
                        endDate: range.to,
                      });
                    } else {
                      handleDateFilterChange(undefined);
                    }
                  }}
                  onPresetSelect={(range) => {
                    // Preset selection - executed immediately
                    if (range?.from || range?.to) {
                      handleDateFilterChange({
                        startDate: range.from,
                        endDate: range.to,
                      });
                    } else {
                      handleDateFilterChange(undefined);
                    }
                  }}
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
