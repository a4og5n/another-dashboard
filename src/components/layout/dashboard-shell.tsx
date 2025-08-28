"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout";
import { DashboardSidebar } from "@/components/layout";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <>
      <DashboardHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex">
        <DashboardSidebar visible={sidebarOpen} />
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
