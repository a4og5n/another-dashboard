import { NextRequest, NextResponse } from 'next/server';
import { getMailchimpService } from '@/services';

/**
 * Mailchimp Single Audience API
 * 
 * GET /api/mailchimp/audiences/[id] - Get specific audience/list
 */
interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id: listId } = await params;

    const mailchimp = getMailchimpService();
    const response = await mailchimp.getList(listId);

    if (!response.success) {
      const status = response.statusCode === 404 ? 404 : 500;
      return NextResponse.json(
        { 
          error: 'Audience not found', 
          details: response.error 
        },
        { status }
      );
    }

    return NextResponse.json({
      ...response.data,
      metadata: {
        listId,
        lastUpdated: new Date().toISOString(),
        rateLimit: response.rateLimit,
      },
    });

  } catch (error) {
    console.error('Mailchimp audience API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
