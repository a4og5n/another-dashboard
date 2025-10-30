/**
 * Campaign Content Component
 * Preview campaign HTML and plain-text content
 *
 * @route /mailchimp/campaigns/[campaign_id]/content
 *
 * @features HTML content preview, Plain-text version display, Archive HTML view,
 * Variate content support (multivariate campaigns), Content sanitization and security,
 * Responsive display
 */

"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Code, Archive, Layers } from "lucide-react";
import type { CampaignContentSuccess } from "@/types/mailchimp/campaigns";
import { MailchimpConnectionGuard } from "@/components/mailchimp/mailchimp-connection-guard";

interface CampaignContentContentProps {
  data: CampaignContentSuccess;
  errorCode?: string;
}

/**
 * Campaign Content Content Component
 * Displays campaign HTML and plain-text content with tabbed navigation
 */
export function CampaignContentContent({
  data,
  errorCode,
}: CampaignContentContentProps) {
  const [selectedVariate, setSelectedVariate] = useState(0);

  // Check what content types are available
  const hasHtml = !!data.html;
  const hasPlainText = !!data.plain_text;
  const hasArchive = !!data.archive_html;
  const hasVariates = data.variate_contents && data.variate_contents.length > 0;

  // Default tab based on available content
  const defaultTab = hasHtml ? "html" : hasPlainText ? "plain" : "archive";

  return (
    <MailchimpConnectionGuard errorCode={errorCode}>
      <div className="space-y-6">
        {/* Variate Content Selector */}
        {hasVariates && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Multivariate Content
              </CardTitle>
              <CardDescription>
                This campaign has {data.variate_contents?.length} content
                variations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.variate_contents?.map((variate, index) => (
                  <Badge
                    key={index}
                    variant={selectedVariate === index ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedVariate(index)}
                  >
                    {variate.content_label || `Variation ${index + 1}`}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Campaign Content Preview
            </CardTitle>
            <CardDescription>
              View the HTML and plain-text versions of your campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="html" disabled={!hasHtml}>
                  <Code className="h-4 w-4 mr-2" />
                  HTML
                </TabsTrigger>
                <TabsTrigger value="plain" disabled={!hasPlainText}>
                  <FileText className="h-4 w-4 mr-2" />
                  Plain Text
                </TabsTrigger>
                <TabsTrigger value="archive" disabled={!hasArchive}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </TabsTrigger>
              </TabsList>

              {/* HTML Content */}
              <TabsContent value="html" className="mt-6">
                {hasVariates &&
                data.variate_contents?.[selectedVariate]?.html ? (
                  <div className="p-6 rounded-lg border bg-card">
                    <iframe
                      className="w-full min-h-[600px] border-0"
                      srcDoc={data.variate_contents[selectedVariate].html}
                      title="Campaign HTML Preview"
                      sandbox="allow-same-origin"
                    />
                  </div>
                ) : hasHtml ? (
                  <div className="p-6 rounded-lg border bg-card">
                    <iframe
                      className="w-full min-h-[600px] border-0"
                      srcDoc={data.html || ""}
                      title="Campaign HTML Preview"
                      sandbox="allow-same-origin"
                    />
                  </div>
                ) : (
                  <div className="p-6 text-center text-muted-foreground rounded-lg border border-dashed">
                    No HTML content available for this campaign
                  </div>
                )}
              </TabsContent>

              {/* Plain Text Content */}
              <TabsContent value="plain" className="mt-6">
                {hasVariates &&
                data.variate_contents?.[selectedVariate]?.plain_text ? (
                  <div className="p-6 rounded-lg border bg-card font-mono text-sm whitespace-pre-wrap">
                    {data.variate_contents[selectedVariate].plain_text}
                  </div>
                ) : hasPlainText ? (
                  <div className="p-6 rounded-lg border bg-card font-mono text-sm whitespace-pre-wrap">
                    {data.plain_text}
                  </div>
                ) : (
                  <div className="p-6 text-center text-muted-foreground rounded-lg border border-dashed">
                    No plain-text content available for this campaign
                  </div>
                )}
              </TabsContent>

              {/* Archive HTML Content */}
              <TabsContent value="archive" className="mt-6">
                {hasArchive ? (
                  <div className="p-6 rounded-lg border bg-card">
                    <iframe
                      className="w-full min-h-[600px] border-0"
                      srcDoc={data.archive_html || ""}
                      title="Campaign Archive HTML Preview"
                      sandbox="allow-same-origin"
                    />
                  </div>
                ) : (
                  <div className="p-6 text-center text-muted-foreground rounded-lg border border-dashed">
                    No archive HTML available for this campaign
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Content Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Content Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">HTML Content:</span>
              <span className="font-medium">
                {hasHtml ? "Available" : "Not available"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plain Text:</span>
              <span className="font-medium">
                {hasPlainText ? "Available" : "Not available"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Archive HTML:</span>
              <span className="font-medium">
                {hasArchive ? "Available" : "Not available"}
              </span>
            </div>
            {hasVariates && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Variate Variations:
                </span>
                <span className="font-medium">
                  {data.variate_contents?.length}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MailchimpConnectionGuard>
  );
}
