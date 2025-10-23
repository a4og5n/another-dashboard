/**
 * Domain Performance Content Component
 * Displays email provider domain performance with engagement metrics
 *
 * Uses shadcn/ui Table component for consistency
 * Shows domain, emails sent, delivery stats, and engagement percentages
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DomainPerformanceResponse } from "@/types/mailchimp";

interface DomainPerformanceContentProps {
  data: DomainPerformanceResponse;
}

export function DomainPerformanceContent({
  data,
}: DomainPerformanceContentProps) {
  const { domains, total_sent, total_items } = data;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Email Provider Performance ({total_items.toLocaleString()}{" "}
            {total_items === 1 ? "domain" : "domains"})
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Total emails sent: {total_sent.toLocaleString()}
          </p>
        </CardHeader>
        <CardContent>
          {domains.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No domain performance data available for this campaign.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email Provider</TableHead>
                  <TableHead className="text-right">Emails Sent</TableHead>
                  <TableHead className="text-right">Delivered</TableHead>
                  <TableHead className="text-right">Bounces</TableHead>
                  <TableHead className="text-right">Opens</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Unsubscribes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((domain, index) => (
                  <TableRow key={`${domain.domain}-${index}`}>
                    <TableCell className="font-medium">
                      {domain.domain}
                      <div className="text-xs text-muted-foreground">
                        {(domain.emails_pct * 100).toFixed(1)}% of campaign
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {domain.emails_sent.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {domain.delivered.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div>{domain.bounces.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {(domain.bounces_pct * 100).toFixed(1)}% rate
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div>{domain.opens.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {(domain.opens_pct * 100).toFixed(1)}% rate
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div>{domain.clicks.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {(domain.clicks_pct * 100).toFixed(1)}% rate
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div>{domain.unsubs.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {(domain.unsubs_pct * 100).toFixed(1)}% rate
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
