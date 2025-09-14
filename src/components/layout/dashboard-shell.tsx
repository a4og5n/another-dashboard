"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout";
import { DashboardSidebar } from "@/components/layout";
import type { AuthSession } from "@/types/auth";

interface DashboardShellProps {
  children: React.ReactNode;
  authData: {
    session: AuthSession | null;
    displayName?: string;
    initials?: string;
  };
}

export function DashboardShell({ children, authData }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <>
      <DashboardHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        session={authData.session}
        displayName={authData.displayName}
        initials={authData.initials}
      />
      <div className="flex">
        <DashboardSidebar visible={sidebarOpen} />
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
