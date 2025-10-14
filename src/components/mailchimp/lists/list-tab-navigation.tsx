/**
 * List Tab Navigation Client Component
 * Handles client-side tab switching with URL synchronization for list detail pages
 *
 * Adapted from CampaignReportDetail TabNavigation pattern
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ReactNode } from "react";

interface ListTabNavigationProps {
  activeTab: string;
  children: ReactNode;
}

export function ListTabNavigation({
  activeTab,
  children,
}: ListTabNavigationProps) {
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
  const statsContent = childrenArray.find(
    (child) =>
      child &&
      typeof child === "object" &&
      "props" in child &&
      child.props?.["data-tab"] === "stats",
  );
  const settingsContent = childrenArray.find(
    (child) =>
      child &&
      typeof child === "object" &&
      "props" in child &&
      child.props?.["data-tab"] === "settings",
  );

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 max-w-full overflow-x-auto">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="stats">Stats</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">{overviewContent}</TabsContent>
      <TabsContent value="stats">{statsContent}</TabsContent>
      <TabsContent value="settings">{settingsContent}</TabsContent>
    </Tabs>
  );
}
