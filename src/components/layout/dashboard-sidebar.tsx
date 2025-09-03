"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  ChevronDown,
  ChevronRight,
  Send,
  Building2,
  FileText,
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
        name: "Account",
        href: "/mailchimp/account",
        icon: Building2,
      },
      {
        name: "Audiences",
        href: "/mailchimp/audiences",
        icon: Users,
      },
      {
        name: "Reports",
        href: "/mailchimp/reports",
        icon: FileText,
      },
      {
        name: "Campaigns",
        href: "/mailchimp/campaigns",
        icon: Send,
        disabled: true,
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
    name: "Data Sources",
    href: "/sources",
    icon: Database,
    disabled: true,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    disabled: true,
  },
];

export function DashboardSidebar({ visible }: { visible: boolean }) {
  const pathname = usePathname();
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
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
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
        {item.expandable && item.children && isExpanded && (
          <div className="ml-4 mt-1 space-y-1">
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
        {navigation.map((item, idx) => renderNavigationItem(item, idx))}
      </nav>
      {/* Footer fixed to bottom */}
      <div className="p-4 border-t text-xs text-muted-foreground w-full sticky bottom-0 bg-background">
        <div>Another Dashboard v1.0</div>
        <div className="mt-1">API Status: Connected</div>
      </div>
    </aside>
  );
}
