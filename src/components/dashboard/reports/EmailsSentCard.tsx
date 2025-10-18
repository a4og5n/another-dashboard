/**
 * Emails Sent Card Component
 * Displays the total number of emails sent in a campaign
 *
 * Issue #135: Campaign report detail UI components - Emails Sent Card
 * Migrated to use standardized StatCard component
 */

"use client";

import { StatCard } from "@/components/ui/stat-card";
import { Mail } from "lucide-react";
import type { EmailsSentCardProps } from "@/types/components/dashboard/reports";

export function EmailsSentCard({ emailsSent, className }: EmailsSentCardProps) {
  return (
    <StatCard
      icon={Mail}
      value={emailsSent}
      label="Emails Sent"
      iconColor="var(--muted-foreground)"
      className={className}
    />
  );
}
