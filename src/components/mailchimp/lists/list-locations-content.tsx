/**
 * List Locations Content Component
 * Displays geographic distribution of subscribers by country
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
import type { ListLocationsResponse } from "@/types/mailchimp/list-locations";

interface ListLocationsContentProps {
  data: ListLocationsResponse;
  listId: string;
}

export function ListLocationsContent({ data }: ListLocationsContentProps) {
  const { locations, total_items } = data;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Subscriber Locations ({total_items.toLocaleString()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {locations.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No location data available for this list.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                  <TableHead className="text-right">
                    Total Subscribers
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((location) => (
                  <TableRow key={location.cc}>
                    <TableCell className="font-medium">
                      {location.country}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{location.cc}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      {location.percent.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">
                      {location.total.toLocaleString()}
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
