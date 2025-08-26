import { NextRequest, NextResponse } from 'next/server';
import { getMailchimpService } from '@/services';

/**
 * Mailchimp Dashboard API
 * Returns summarized data for the dashboard
 * 
 * GET /api/mailchimp/dashboard
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const since = searchParams.get('since') || undefined;
    const campaignType = searchParams.get('type') || undefined;

    const mailchimp = getMailchimpService();

    // Fetch campaign and audience data in parallel
    const [campaignSummary, audienceSummary] = await Promise.all([
      mailchimp.getCampaignSummary({
        limit,
        sinceDate: since,
        campaignType,
      }),
      mailchimp.getAudienceSummary(),
    ]);

    if (!campaignSummary.success) {
      return NextResponse.json(
        { 
          error: 'Failed to fetch campaign data', 
          details: campaignSummary.error 
        },
        { status: 500 }
      );
    }

    if (!audienceSummary.success) {
      return NextResponse.json(
        { 
          error: 'Failed to fetch audience data', 
          details: audienceSummary.error 
        },
        { status: 500 }
      );
    }

    // Combine data for dashboard
    const dashboardData = {
      campaigns: campaignSummary.data,
      audiences: audienceSummary.data,
      metadata: {
        lastUpdated: new Date().toISOString(),
        rateLimit: campaignSummary.rateLimit || audienceSummary.rateLimit,
      },
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('Mailchimp dashboard API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
