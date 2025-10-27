/**
 * Search Members Content Component
 * Displays search form and search results with exact matches and full search sections
 *
 * Uses shadcn/ui Table component for consistency
 * Shows member details: email, status, list, VIP status, engagement stats
 */

"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import Link from "next/link";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Star } from "lucide-react";
import type {
  SearchMembersSuccess,
  SearchMemberResult,
} from "@/types/mailchimp/search-members";

interface SearchMembersContentProps {
  data: SearchMembersSuccess | null;
  query: string;
  listId?: string;
  hasSearched: boolean;
}

/**
 * Get badge variant for member status
 */
function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "subscribed":
      return "default";
    case "unsubscribed":
      return "destructive";
    case "cleaned":
    case "archived":
      return "secondary";
    case "pending":
    case "transactional":
      return "outline";
    default:
      return "default";
  }
}

/**
 * Render star rating
 */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-3 w-3 ${
            index < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Member table row component
 */
function MemberRow({ member }: { member: SearchMemberResult }) {
  return (
    <TableRow>
      <TableCell>
        <div className="space-y-1">
          <Link
            href={`/mailchimp/lists/${member.list_id}/members/${member.id}`}
            className="font-medium hover:underline"
          >
            {member.email_address}
          </Link>
          {member.full_name && (
            <div className="text-sm text-muted-foreground">
              {member.full_name}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={getStatusVariant(member.status)}>{member.status}</Badge>
      </TableCell>
      <TableCell>
        <Link
          href={`/mailchimp/lists/${member.list_id}`}
          className="text-sm text-muted-foreground hover:underline"
        >
          {member.list_id}
        </Link>
      </TableCell>
      <TableCell>
        {member.vip && <Badge variant="outline">VIP</Badge>}
      </TableCell>
      <TableCell>
        {member.member_rating !== undefined && (
          <StarRating rating={member.member_rating} />
        )}
      </TableCell>
      <TableCell>
        {member.stats && (
          <div className="space-y-1 text-sm text-muted-foreground">
            <div>Opens: {(member.stats.avg_open_rate * 100).toFixed(1)}%</div>
            <div>Clicks: {(member.stats.avg_click_rate * 100).toFixed(1)}%</div>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}

export function SearchMembersContent({
  data,
  query: initialQuery,
  listId,
  hasSearched,
}: SearchMembersContentProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      const params = new URLSearchParams({ query: query.trim() });
      if (listId) {
        params.set("list_id", listId);
      }
      router.push(`/mailchimp/search/members?${params.toString()}`);
    }
  };

  const exactMatches = data?.exact_matches;
  const fullSearch = data?.full_search;

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle>Search Members</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="query" className="sr-only">
                Search query
              </Label>
              <Input
                id="query"
                type="text"
                placeholder="Search by email, first name, or last name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
              />
            </div>
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
          <p className="mt-2 text-sm text-muted-foreground">
            Searches email address, first name (FNAME), and last name (LNAME)
            fields
          </p>
        </CardContent>
      </Card>

      {/* Show results only if search has been performed */}
      {hasSearched && (
        <>
          {/* Exact Matches */}
          {exactMatches && exactMatches.total_items > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Exact Matches ({exactMatches.total_items.toLocaleString()})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email / Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>List</TableHead>
                      <TableHead>VIP</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Engagement</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exactMatches.members.map((member) => (
                      <MemberRow
                        key={`exact-${member.list_id}-${member.id}`}
                        member={member}
                      />
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Full Search Results */}
          {fullSearch && fullSearch.total_items > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    All Results ({fullSearch.total_items.toLocaleString()})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email / Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>List</TableHead>
                      <TableHead>VIP</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Engagement</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fullSearch.members.map((member) => (
                      <MemberRow
                        key={`full-${member.list_id}-${member.id}`}
                        member={member}
                      />
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* No Results */}
          {(!exactMatches || exactMatches.total_items === 0) &&
            (!fullSearch || fullSearch.total_items === 0) && (
              <Card>
                <CardContent className="py-8">
                  <TableEmptyState
                    message={`No members match "${query}". Try a different search term.`}
                  />
                </CardContent>
              </Card>
            )}
        </>
      )}
    </div>
  );
}
