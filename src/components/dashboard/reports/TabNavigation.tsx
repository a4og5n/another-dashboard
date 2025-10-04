/**
 * Tab Navigation Client Component
 * Handles client-side tab switching with URL synchronization
 *
 * Extracted from CampaignReportDetail to enable server component rendering
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ReactNode } from "react";

interface TabNavigationProps {
  activeTab: string;
  children: ReactNode;
}

export function TabNavigation({ activeTab, children }: TabNavigationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle tab changes - update URL when tab changes
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // If it's the default tab (overview), remove the tab parameter
    // Otherwise, set the tab parameter
    if (value === "overview") {
      params.delete("tab");
    } else {
      params.set("tab", value);
    }

    // Update the URL without reloading the page
    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : window.location.pathname, {
      scroll: false,
    });
  };

  // Extract children by tab
  const childrenArray = Array.isArray(children) ? children : [children];
  const overviewContent = childrenArray.find(
    (child) =>
      child &&
      typeof child === "object" &&
      "props" in child &&
      child.props?.["data-tab"] === "overview",
  );
  const detailsContent = childrenArray.find(
    (child) =>
      child &&
      typeof child === "object" &&
      "props" in child &&
      child.props?.["data-tab"] === "details",
  );

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-full overflow-x-auto">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">{overviewContent}</TabsContent>
      <TabsContent value="details">{detailsContent}</TabsContent>
    </Tabs>
  );
}
