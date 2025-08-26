'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Home,
  Mail,
  Settings,
  Users,
  Youtube,
  TrendingUp,
  Database,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  disabled?: boolean;
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    name: 'Mailchimp',
    href: '/mailchimp',
    icon: Mail,
    badge: 'Primary',
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    disabled: true,
  },
  {
    name: 'YouTube',
    href: '/youtube',
    icon: Youtube,
    disabled: true,
  },
  {
    name: 'Social Media',
    href: '/social',
    icon: TrendingUp,
    disabled: true,
  },
  {
    name: 'Audiences',
    href: '/audiences',
    icon: Users,
  },
  {
    name: 'Data Sources',
    href: '/sources',
    icon: Database,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-background">
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <div key={item.name} className="relative">
              <Button
                asChild={!item.disabled}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  item.disabled && 'opacity-50 cursor-not-allowed',
                  isActive && 'bg-secondary'
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
                  <Link href={item.href} className="flex items-center space-x-3 w-full">
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

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground">
          <div>Another Dashboard v1.0</div>
          <div className="mt-1">API Status: Connected</div>
        </div>
      </div>
    </aside>
  );
}
