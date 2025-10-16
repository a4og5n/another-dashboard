"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/layout/sidebar-provider";
import {
  BarChart3,
  Home,
  Mail,
  Settings,
  Users,
  Video,
  TrendingUp,
  Database,
  ChevronRight,
  Send,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  disabled?: boolean;
  children?: NavigationItem[];
  expandable?: boolean;
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
    expandable: true,
    children: [
      {
        name: "Dashboard",
        href: "/mailchimp",
        icon: BarChart3,
      },
      {
        name: "General Info",
        href: "/mailchimp/general-info",
        icon: Building2,
      },
      {
        name: "Lists",
        href: "/mailchimp/lists",
        icon: Users,
      },
      {
        name: "Reports",
        href: "/mailchimp/reports",
        icon: Send,
      },
    ],
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
    icon: Video,
    disabled: true,
  },
  {
    name: "Social Media",
    href: "/social",
    icon: TrendingUp,
    disabled: true,
  },
  {
    name: "Data Sources",
    href: "/sources",
    icon: Database,
    disabled: true,
  },
  {
    name: "Settings",
    href: "/settings/integrations",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    // Auto-expand Mailchimp if we're on a Mailchimp page
    return pathname.startsWith("/mailchimp") ? ["Mailchimp"] : [];
  });

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName],
    );
  };

  const isItemActive = (item: NavigationItem): boolean => {
    if (item.href && pathname === item.href) return true;
    if (item.children) {
      return item.children.some((child) => child.href === pathname);
    }
    return false;
  };

  const renderNavigationItem = (item: NavigationItem, idx: number) => {
    const isActive = isItemActive(item);
    const isExpanded = expandedItems.includes(item.name);
    const Icon = item.icon;
    const extraMargin = idx === 1 ? "mt-6" : "";

    return (
      <div key={item.name} className={cn("relative", extraMargin)}>
        {/* Main item */}
        <Button
          asChild={!item.disabled && !item.expandable}
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start",
            item.disabled && "opacity-50 cursor-not-allowed",
            isActive && "bg-secondary",
          )}
          disabled={item.disabled}
          onClick={
            item.expandable ? () => toggleExpanded(item.name) : undefined
          }
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
          ) : item.expandable ? (
            <div className="flex items-center space-x-3 w-full cursor-pointer">
              <Icon className="h-5 w-5" />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <Badge variant="outline" className="mr-2">
                  {item.badge}
                </Badge>
              )}
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform duration-300 ease-in-out",
                  isExpanded && "rotate-90",
                )}
              />
            </div>
          ) : (
            <Link
              href={item.href!}
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

        {/* Submenu items */}
        {item.expandable && item.children && (
          <div
            className={cn(
              "ml-4 space-y-1 overflow-hidden transition-all duration-300 ease-in-out",
              isExpanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0",
            )}
          >
            {item.children.map((child) => {
              const childIsActive = pathname === child.href;
              const ChildIcon = child.icon;

              return (
                <Button
                  key={child.name}
                  asChild={!child.disabled}
                  variant={childIsActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full justify-start",
                    child.disabled && "opacity-50 cursor-not-allowed",
                    childIsActive && "bg-secondary",
                  )}
                  disabled={child.disabled}
                >
                  {child.disabled ? (
                    <div className="flex items-center space-x-3">
                      <ChildIcon className="h-4 w-4" />
                      <span className="text-sm">{child.name}</span>
                    </div>
                  ) : (
                    <Link
                      href={child.href!}
                      className="flex items-center space-x-3 w-full"
                    >
                      <ChildIcon className="h-4 w-4" />
                      <span className="text-sm">{child.name}</span>
                    </Link>
                  )}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[998] md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="dashboard-sidebar"
        className={cn(
          "w-64 h-[calc(100vh-4rem)] flex flex-col border-r bg-background pt-16 z-40",
          "transition-[transform,left,top,position] duration-300 ease-in-out",
          // On mobile: always fixed and slide in/out
          "fixed left-0 top-16",
          // On desktop: only fixed when closed, otherwise relative
          sidebarOpen
            ? "translate-x-0 md:relative md:left-auto md:top-auto"
            : "-translate-x-full md:fixed",
        )}
        aria-hidden={!sidebarOpen}
        tabIndex={sidebarOpen ? 0 : -1}
      >
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item, idx) => renderNavigationItem(item, idx))}
        </nav>
        {/* Footer fixed to bottom */}
        <div className="p-4 border-t text-xs text-muted-foreground w-full sticky bottom-0 bg-background">
          <div>Another Dashboard v1.0</div>
          <div className="mt-1">API Status: Connected</div>
        </div>
      </aside>
    </>
  );
}
