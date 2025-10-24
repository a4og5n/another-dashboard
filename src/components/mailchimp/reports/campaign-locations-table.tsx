/**
 * Campaign Locations Table Component
 * Displays geographic location data with engagement metrics
 *
 * Uses shadcn/ui Table component for consistency
 * Shows country code, region, opens, and proxy-excluded opens data
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
import { Pagination } from "@/components/ui/pagination";
import { PerPageSelector } from "@/components/dashboard/shared/per-page-selector";
import type { LocationActivitySuccess } from "@/types/mailchimp/location-activity";
import { createPaginationUrls } from "@/utils/pagination/url-generators";

interface CampaignLocationsTableProps {
  locationsData: LocationActivitySuccess;
  currentPage: number;
  pageSize: number;
  perPageOptions: number[];
  baseUrl: string;
  campaignId: string;
}

export function CampaignLocationsTable({
  locationsData,
  currentPage,
  pageSize,
  perPageOptions,
  baseUrl,
}: CampaignLocationsTableProps) {
  const { locations, total_items } = locationsData;
  const totalPages = Math.ceil(total_items / pageSize);

  // URL generators for server-side pagination
  const { createPageUrl, createPerPageUrl } = createPaginationUrls(
    baseUrl,
    pageSize,
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Geographic Locations ({total_items.toLocaleString()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {locations.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No location data available for this campaign.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country Code</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Region Name</TableHead>
                  <TableHead className="text-right">Opens</TableHead>
                  <TableHead className="text-right">
                    Proxy Excluded Opens
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((location, index) => (
                  <TableRow key={`${location.country_code}-${index}`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span className="text-lg" title={location.country_code}>
                          {/* Flag emoji using country code */}
                          {String.fromCodePoint(
                            ...[...location.country_code].map(
                              (c) => 127397 + c.charCodeAt(0),
                            ),
                          )}
                        </span>
                        <span>{location.country_code}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {location.region || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {location.region_name}
                    </TableCell>
                    <TableCell className="text-right">
                      {location.opens.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {location.proxy_excluded_opens.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing page {currentPage} of {totalPages}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            createPageUrl={createPageUrl}
          />
        </div>
      )}

      {/* Per Page Selector */}
      <PerPageSelector
        value={pageSize}
        createPerPageUrl={createPerPageUrl}
        itemName="locations per page"
        options={perPageOptions}
      />
    </div>
  );
}
