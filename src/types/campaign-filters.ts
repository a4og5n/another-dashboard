/**
 * Date filtering types for campaign filtering
 */

export interface DateFilter {
  startDate?: Date;
  endDate?: Date;
  preset?:
    | "last_7_days"
    | "last_30_days"
    | "last_3_months"
    | "last_6_months"
    | "last_year"
    | "custom";
}

export interface CampaignFilters {
  dateRange?: DateFilter;
  page?: number;
  limit?: number;
  // Future filters can be added here
  searchQuery?: string;
  status?: string;
  campaignType?: string;
}

export interface FilteredCampaignsResponse {
  campaigns: {
    totalCampaigns: number;
    filteredCount?: number;
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
  appliedFilters?: {
    dateRange?: DateFilter;
    hasActiveFilters: boolean;
  };
}
