import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { SidebarProvider } from "@/components/layout/sidebar-provider";
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
  return (
    <SidebarProvider>
      <DashboardHeader
        session={authData.session}
        displayName={authData.displayName}
        initials={authData.initials}
      />
      <div className="flex transition-all duration-300 ease-in-out">
        <DashboardSidebar />
        <main className="flex-1 transition-[width,margin,padding] duration-300 ease-in-out">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
