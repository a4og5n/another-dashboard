"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { mailchimpDashboardPaginationSchema } from "@/schemas/mailchimp-dashboard-pagination";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardError } from "@/components/dashboard/shared/dashboard-error";
import { DashboardInlineError } from "@/components/dashboard/shared/dashboard-inline-error";
import { PaginationControls } from "@/components/dashboard/shared/pagination-controls";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import { CampaignsTable, AudiencesOverview } from "@/components/dashboard";
import { CampaignsArraySchema } from "@/schemas/campaign";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  // ...existing code...
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pagination and filter options
  const campaignsPerPageOptions = [5, 10, 20, 50];
  const router = useRouter();
  const searchParams = useSearchParams();

  // Validate pagination params using Zod schema
  const paginationResult = mailchimpDashboardPaginationSchema.safeParse({
    page: searchParams.get("page") ?? "1",
    limit: searchParams.get("perPage") ?? "10",
  });
  const campaignsPerPage = paginationResult.success
    ? paginationResult.data.limit
    : 10;
  const currentPage = paginationResult.success ? paginationResult.data.page : 1;

  // Zod schema for date filter params
  const dateFilterSchema = z.object({
    startDate: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: "Invalid startDate",
      }),
    endDate: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: "Invalid endDate",
      }),
  });
  const dateFilterResult = dateFilterSchema.safeParse({
    startDate: searchParams.get("startDate") ?? undefined,
    endDate: searchParams.get("endDate") ?? undefined,
  });
  const dateFilter = useMemo(() => {
    return dateFilterResult.success &&
      (dateFilterResult.data.startDate || dateFilterResult.data.endDate)
      ? {
          startDate: dateFilterResult.data.startDate
            ? new Date(dateFilterResult.data.startDate + "T00:00:00.000Z")
            : undefined,
          endDate: dateFilterResult.data.endDate
            ? new Date(dateFilterResult.data.endDate + "T23:59:59.999Z")
            : undefined,
        }
      : undefined;
  }, [dateFilterResult]);

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

        // Validate campaigns data using Zod schema
        const json = await response.json();
        if (json?.campaigns?.recentCampaigns) {
          const campaignsValidation = CampaignsArraySchema.safeParse(
            json.campaigns.recentCampaigns,
          );
          if (!campaignsValidation.success) {
            throw new Error(
              "Invalid campaigns data: " + campaignsValidation.error.message,
            );
          }
        }
        return json;
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
    if (newDateFilter?.startDate) {
      params.set("startDate", formatDateForUrl(newDateFilter.startDate));
    }
    if (newDateFilter?.endDate) {
      params.set("endDate", formatDateForUrl(newDateFilter.endDate));
    }
    router.push(`/mailchimp?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams(newPage, campaignsPerPage, dateFilter);
  };

  const handlePerPageChange = (perPage: number) => {
    updateUrlParams(1, perPage, dateFilter);
  };

  const handleDateFilterChange = (newDateFilter?: DateFilter) => {
    updateUrlParams(1, campaignsPerPage, newDateFilter);
  };

  // Single useEffect to handle data fetching when relevant parameters change
  useEffect(() => {
    let isCancelled = false;
    setCampaignsLoading(true);
    const loadData = async () => {
      try {
        const dashboardData = await fetchDashboardData(
          false,
          currentPage,
          campaignsPerPage,
          dateFilter,
        );
        if (!isCancelled) {
          setData(dashboardData);
          setError(null);
        }
      } catch (err) {
        if (!isCancelled) {
          let errorMessage = "Failed to load dashboard data. Please try again.";
          if (err instanceof Error) {
            errorMessage = err.message;
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
          setData(null);
        }
      } finally {
        if (!isCancelled) {
          setCampaignsLoading(false);
        }
      }
    };
    loadData();
    return () => {
      isCancelled = true;
    };
  }, [currentPage, campaignsPerPage, dateFilter, fetchDashboardData]);

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

  // ...existing code...

  if (error) {
    return (
      <DashboardLayout>
        <DashboardError
          error={error}
          onRetry={handleRefresh}
          onGoHome={handleGoHome}
          isRefreshing={isRefreshing}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center mt-6">
          <h1 className="text-3xl font-bold">Mailchimp Dashboard</h1>
        </div>

        {error && <DashboardInlineError error={error} />}

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
                  <PerPageSelector
                    value={campaignsPerPage}
                    options={campaignsPerPageOptions}
                    onChange={handlePerPageChange}
                  />
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="audiences" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Audience Overview</h2>
                <p className="text-muted-foreground">
                  Quick overview of your top audiences
                </p>
              </div>
              <button
                onClick={() => router.push("/mailchimp/audiences")}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Manage Audiences
              </button>
            </div>

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
