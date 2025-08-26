import { NextRequest, NextResponse } from 'next/server';
import { getMailchimpService } from '@/services';

/**
 * Mailchimp Campaigns API
 * 
 * GET /api/mailchimp/campaigns - Get all campaigns
 * GET /api/mailchimp/campaigns?reports=true - Get campaign reports
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reports = searchParams.get('reports') === 'true';
    const count = parseInt(searchParams.get('count') || '25', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const type = searchParams.get('type') || undefined;
    const since = searchParams.get('since') || undefined;
    const sortField = (searchParams.get('sort_field') as 'send_time' | 'create_time') || 'send_time';
    const sortDir = (searchParams.get('sort_dir')?.toUpperCase() as 'ASC' | 'DESC') || 'DESC';

    const mailchimp = getMailchimpService();

    const params = {
      count,
      offset,
      type,
      since_send_time: since,
      sort_field: sortField,
      sort_dir: sortDir,
    };

    const response = reports 
      ? await mailchimp.getCampaignReports(params)
      : await mailchimp.getCampaigns(params);

    if (!response.success) {
      return NextResponse.json(
        { 
          error: 'Failed to fetch campaigns', 
          details: response.error 
        },
        { status: response.statusCode || 500 }
      );
    }

    return NextResponse.json({
      ...response.data,
      metadata: {
        count,
        offset,
        type,
        since,
        sortField,
        sortDir,
        lastUpdated: new Date().toISOString(),
        rateLimit: response.rateLimit,
      },
    });

  } catch (error) {
    console.error('Mailchimp campaigns API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
