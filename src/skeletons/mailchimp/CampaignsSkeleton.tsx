/**
 * Campaigns Loading Skeleton
 * Displays a loading skeleton while fetching campaigns
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function CampaignsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-48 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </TableHead>
              <TableHead>
                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              </TableHead>
              <TableHead>
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              </TableHead>
              <TableHead>
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </TableHead>
              <TableHead>
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </TableHead>
              <TableHead>
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </TableHead>
              <TableHead>
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between pt-4">
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            <div className="h-8 w-20 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
