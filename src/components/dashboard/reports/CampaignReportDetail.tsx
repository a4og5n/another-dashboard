/**
 * Campaign Report Detail Container Component
 * Main container that orchestrates all campaign report sub-components
 *
 * Issue #135: Agent 3 - Campaign report detail UI components
 * Following established patterns from existing dashboard components
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportHeader } from "./ReportHeader";
import { ReportMetrics } from "./ReportMetrics";
import { ReportCharts } from "./ReportCharts";
import { ReportLinks } from "./ReportLinks";
import type { MailchimpCampaignReport } from "@/services/mailchimp.service";

interface CampaignReportDetailProps {
  report: MailchimpCampaignReport;
}

export function CampaignReportDetail({ report }: CampaignReportDetailProps) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Report Header */}
      <ReportHeader report={report} />

      {/* Tabbed Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="links">Links & Sharing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            <ReportMetrics report={report} />
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="mt-6">
          <div className="space-y-6">
            <ReportMetrics report={report} />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="space-y-6">
            <ReportCharts report={report} />
          </div>
        </TabsContent>

        <TabsContent value="links" className="mt-6">
          <div className="space-y-6">
            <ReportLinks report={report} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
