import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Mail, BarChart3, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Marketing Dashboard
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Centralized analytics and insights for all your marketing integrations. 
              Monitor campaigns, track performance, and grow your audience.
            </p>
            <Link href="/mailchimp">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6 rounded-xl">
                Open Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Email Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Track open rates, click-through rates, and campaign performance across all your email marketing efforts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Analytics & Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Comprehensive analytics with real-time data visualization and actionable insights for better decisions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Audience Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Manage subscriber lists, segment audiences, and track growth patterns across all your platforms.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Integration Status */}
          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Available Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-8">
                <Link href="/mailchimp" className="group">
                  <div className="flex flex-col items-center space-y-3 p-4 rounded-lg hover:bg-white/50 transition-colors">
                    <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="h-8 w-8 text-yellow-900" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">Mailchimp</p>
                      <p className="text-sm text-muted-foreground">Email Marketing</p>
                    </div>
                  </div>
                </Link>
                
                <div className="flex flex-col items-center space-y-3 p-4 rounded-lg opacity-50">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-gray-500" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-500">More integrations</p>
                    <p className="text-sm text-muted-foreground">Coming soon</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
