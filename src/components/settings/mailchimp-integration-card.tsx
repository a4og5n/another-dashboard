"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, ExternalLink, Unplug, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import type { MailchimpConnection } from "@/db/schema";

/**
 * Mailchimp Integration Card
 * Displays connection status and provides connect/disconnect actions
 */

interface MailchimpIntegrationCardProps {
  connection: MailchimpConnection | null;
}

export function MailchimpIntegrationCard({
  connection,
}: MailchimpIntegrationCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isConnected = connection && connection.isActive;

  async function handleConnect() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/mailchimp/authorize", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to connect");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Connection error:", error);
      toast.error("Failed to connect Mailchimp. Please try again.");
      setIsLoading(false);
    }
  }

  async function handleDisconnect() {
    if (
      !confirm(
        "Are you sure you want to disconnect Mailchimp? You'll need to reconnect to view your dashboard.",
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/mailchimp/disconnect", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to disconnect");
      }

      toast.success("Mailchimp disconnected successfully");
      window.location.reload();
    } catch (error) {
      console.error("Disconnect error:", error);
      toast.error("Failed to disconnect Mailchimp. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Mailchimp
                {isConnected && (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Connected
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Email marketing and campaign analytics
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isConnected ? (
          <>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Email:</span>
                <span className="font-medium">{connection.email || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account ID:</span>
                <span className="font-mono text-xs">
                  {connection.accountId || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Server:</span>
                <span className="font-mono text-xs">
                  {connection.serverPrefix}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Connected:</span>
                <span className="text-xs">
                  {formatDistanceToNow(new Date(connection.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Validated:</span>
                <span className="text-xs">
                  {formatDistanceToNow(new Date(connection.lastValidatedAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleDisconnect}
                disabled={isLoading}
                variant="destructive"
                size="sm"
              >
                <Unplug className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Connect your Mailchimp account to view campaign analytics,
              audience insights, and performance metrics.
            </p>
            <Button
              onClick={handleConnect}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                "Connecting..."
              ) : (
                <>
                  Connect Mailchimp
                  <ExternalLink className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
