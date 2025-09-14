import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu, AuthLoading } from "@/components/auth";
import type { AuthSession } from "@/types/auth";

interface DashboardHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  session: AuthSession | null;
  displayName?: string;
  initials?: string;
}

export function DashboardHeader({
  sidebarOpen,
  setSidebarOpen,
  session,
  displayName,
  initials,
}: DashboardHeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6">
        {/* Hamburger always visible, left-aligned */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle menu"
          aria-controls="dashboard-sidebar"
          className="mr-4"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        {/* Logo and Title */}
        <div className="flex items-center space-x-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm"
            aria-label="Dashboard"
            role="img"
          >
            AD
          </div>
          <h1 className="text-xl font-semibold hidden md:inline">
            Another Dashboard
          </h1>
        </div>
        {/* Spacer to maintain layout */}
        <div className="flex-1" />
        {/* Actions - User menu when authenticated */}
        <div className="flex items-center space-x-4">
          {session && displayName && initials ? (
            <UserMenu
              user={session.user}
              displayName={displayName}
              initials={initials}
            />
          ) : (
            <AuthLoading />
          )}
        </div>
      </div>
    </header>
  );
}
