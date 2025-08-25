import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

/**
 * Dynamic Open Graph Image Generation
 * 
 * This API route generates dynamic OG images using Vercel's @vercel/og library.
 * It supports different themes and customizable content.
 * 
 * Usage:
 * /api/og?title=Page%20Title&description=Page%20Description&theme=light
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const title = searchParams.get('title') ?? 'NextJS Project';
    const description = searchParams.get('description') ?? 'A modern Next.js application';
    const theme = (searchParams.get('theme') ?? 'light') as 'light' | 'dark';
    
    const colors = {
      light: {
        bg: '#ffffff',
        text: '#000000',
        accent: '#0070f3',
        secondary: '#666666',
      },
      dark: {
        bg: '#000000',
        text: '#ffffff',
        accent: '#0070f3',
        secondary: '#888888',
      },
    };
    
    const currentColors = colors[theme];

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentColors.bg,
            fontSize: 32,
            fontWeight: 600,
            padding: '80px',
            position: 'relative',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: theme === 'light' 
                ? 'radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)'
                : 'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
              backgroundSize: '100px 100px',
              opacity: 0.4,
            }}
          />
          
          {/* Logo/Brand Area */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: currentColors.accent,
                borderRadius: '12px',
                marginRight: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              N
            </div>
            <div
              style={{
                fontSize: '28px',
                color: currentColors.secondary,
                fontWeight: 500,
              }}
            >
              NextJS Project
            </div>
          </div>

          {/* Main Title */}
          <div
            style={{
              color: currentColors.text,
              fontSize: title.length > 50 ? '48px' : '64px',
              fontWeight: 700,
              textAlign: 'center',
              lineHeight: 1.2,
              marginBottom: '24px',
              maxWidth: '900px',
            }}
          >
            {title}
          </div>

          {/* Description */}
          {description && (
            <div
              style={{
                color: currentColors.secondary,
                fontSize: '28px',
                fontWeight: 400,
                textAlign: 'center',
                lineHeight: 1.4,
                maxWidth: '800px',
                marginBottom: '40px',
              }}
            >
              {description}
            </div>
          )}

          {/* Bottom Accent */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: `linear-gradient(90deg, ${currentColors.accent}, #00d4ff)`,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
