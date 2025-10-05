/**
 * Mailchimp Connection Banner
 * Shown after OAuth connection attempt (success or error)
 * Auto-dismisses after 5 seconds
 */

"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, X } from "lucide-react";

interface MailchimpConnectionBannerProps {
  connected?: boolean;
  error?: string | null;
}

/**
 * Banner shown after OAuth connection (success or error)
 */
export function MailchimpConnectionBanner({
  connected,
  error,
}: MailchimpConnectionBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!connected && !error) return;

    const timer = setTimeout(() => setIsVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [connected, error]);

  if (!isVisible || (!connected && !error)) return null;

  return (
    <Alert variant={connected ? "default" : "destructive"} className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {connected ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription>
                <strong>Mailchimp connected successfully!</strong> Your
                dashboard is now loading...
              </AlertDescription>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5" />
              <AlertDescription>
                <strong>Connection failed.</strong> {error}
              </AlertDescription>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(false)}
          className="h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}
