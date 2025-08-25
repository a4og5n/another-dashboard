import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, TrendingUp } from 'lucide-react';

interface Audience {
  id: string;
  name: string;
  memberCount: number;
  growthRate: number;
  openRate: number;
  clickRate: number;
}

interface AudiencesOverviewProps {
  audiences: Audience[];
  totalSubscribers: number;
  avgGrowthRate: number;
  loading?: boolean;
}

export function AudiencesOverview({
  audiences,
  totalSubscribers,
  avgGrowthRate,
  loading = false,
}: AudiencesOverviewProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Top Audiences</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="flex space-x-4">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxMembers = Math.max(...audiences.map(a => a.memberCount));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Top Audiences</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
          <div>
            <div className="text-2xl font-bold">{totalSubscribers.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Subscribers</div>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-600">+{avgGrowthRate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Avg Growth Rate</div>
            </div>
          </div>
        </div>

        {/* Top Audiences List */}
        <div className="space-y-4">
          {audiences.slice(0, 5).map((audience) => (
            <div key={audience.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium truncate" title={audience.name}>
                  {audience.name}
                </h4>
                <span className="text-sm font-medium">
                  {audience.memberCount.toLocaleString()}
                </span>
              </div>
              
              <Progress 
                value={(audience.memberCount / maxMembers) * 100} 
                className="h-2"
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Growth: +{audience.growthRate.toFixed(1)}%</span>
                <span>Open: {audience.openRate.toFixed(1)}%</span>
                <span>Click: {audience.clickRate.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>

        {audiences.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No audiences found. Connect your Mailchimp account to view audience data.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
