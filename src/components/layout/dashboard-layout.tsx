import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return <main className="flex-1 p-6 pt-24 md:pt-24">{children}</main>;
}
