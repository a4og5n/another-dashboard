/**
 * Batch Webhooks Component
 * Displays batch webhooks in a table format (max 20 webhooks)
 *
 * @route /mailchimp/batch-webhooks
 *
 * Server component with simple table display.
 * No pagination needed as Mailchimp limits to 20 webhooks max.
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
import { TableEmptyState } from "@/components/ui/table-empty-state";
import { Badge } from "@/components/ui/badge";
import { MailchimpConnectionGuard } from "@/components/mailchimp";
import type { BatchWebhooksResponse } from "@/types/mailchimp/batch-webhooks";
import { ExternalLink, Power, PowerOff } from "lucide-react";

interface BatchWebhooksContentProps {
  data: BatchWebhooksResponse;
  errorCode?: string;
}

export function BatchWebhooksContent({
  data,
  errorCode,
}: BatchWebhooksContentProps) {
  const { webhooks, total_items } = data;

  return (
    <MailchimpConnectionGuard errorCode={errorCode}>
      <Card>
        <CardHeader>
          <CardTitle>
            Batch Webhooks ({(total_items || 0).toLocaleString()}/20)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {webhooks.length === 0 ? (
            <TableEmptyState message="No batch webhooks configured." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Webhook URL</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    {/* Webhook ID */}
                    <TableCell className="font-mono text-sm">
                      {webhook.id}
                    </TableCell>

                    {/* Webhook URL with external link icon */}
                    <TableCell>
                      <a
                        href={webhook.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <span className="truncate max-w-md">{webhook.url}</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </TableCell>

                    {/* Enabled Status */}
                    <TableCell>
                      {webhook.enabled ? (
                        <Badge variant="default" className="gap-1">
                          <Power className="h-3 w-3" />
                          Enabled
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <PowerOff className="h-3 w-3" />
                          Disabled
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </MailchimpConnectionGuard>
  );
}
