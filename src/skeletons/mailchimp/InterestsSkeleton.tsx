/**
 * Interests Table Skeleton
 * Loading state for interests table
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
import { Skeleton } from "@/skeletons";

export function InterestsSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Subscribers</TableHead>
                <TableHead className="text-right">Display Order</TableHead>
                <TableHead className="text-right">Interest ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-5 w-48" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-5 w-16 ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-5 w-8 ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-5 w-24 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-64" />
      </div>
    </div>
  );
}
