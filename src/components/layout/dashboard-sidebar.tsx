"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Home,
  Mail,
  Settings,
  Users,
  Youtube,
  TrendingUp,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  disabled?: boolean;
}

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    name: "Mailchimp",
    href: "/mailchimp",
    icon: Mail,
    badge: "Primary",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    disabled: true,
  },
  {
    name: "YouTube",
    href: "/youtube",
    icon: Youtube,
    disabled: true,
  },
  {
    name: "Social Media",
    href: "/social",
    icon: TrendingUp,
    disabled: true,
  },
  {
    name: "Audiences",
    href: "/audiences",
    icon: Users,
  },
  {
    name: "Data Sources",
    href: "/sources",
    icon: Database,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function DashboardSidebar({ visible }: { visible: boolean }) {
  const pathname = usePathname();
  return (
    <aside
      id="dashboard-sidebar"
      className={cn(
        "w-64 h-screen flex flex-col border-r bg-background transition-transform duration-300 pt-16", // pt-16 matches header height
        visible ? "md:flex" : "md:hidden -translate-x-full",
        !visible ? "absolute z-[999] left-0 top-16 h-[calc(100vh-4rem)]" : "",
      )}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item, idx) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          // Add extra top margin to the first item (Mailchimp)
          const extraMargin = idx === 1 ? "mt-6" : "";
          return (
            <div key={item.name} className={cn("relative", extraMargin)}>
              <Button
                asChild={!item.disabled}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  item.disabled && "opacity-50 cursor-not-allowed",
                  isActive && "bg-secondary",
                )}
                disabled={item.disabled}
              >
                {item.disabled ? (
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                    {item.badge && (
                      <Badge variant="outline" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center space-x-3 w-full"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                    {item.badge && (
                      <Badge variant="outline" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )}
              </Button>
            </div>
          );
        })}
      </nav>
      {/* Footer fixed to bottom */}
      <div className="p-4 border-t text-xs text-muted-foreground w-full sticky bottom-0 bg-background">
        <div>Another Dashboard v1.0</div>
        <div className="mt-1">API Status: Connected</div>
      </div>
    </aside>
  );
}
