import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/error-boundary";
import { InstallPrompt } from "@/components/pwa/install-prompt";

export const metadata: Metadata = {
  title: {
    default: "NextJS Project",
    template: "%s | NextJS Project"
  },
  description: "A modern Next.js application with comprehensive tooling and best practices.",
  keywords: ["nextjs", "react", "typescript", "tailwind", "pwa"],
  authors: [{ name: "NextJS Developer" }],
  creator: "NextJS Project",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "NextJS Project",
    description: "A modern Next.js application with comprehensive tooling and best practices.",
    siteName: "NextJS Project",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextJS Project",
    description: "A modern Next.js application with comprehensive tooling and best practices.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NextJS Project",
    startupImage: [
      "/icons/icon-192x192.png",
    ],
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512" }
    ],
    shortcut: ["/icons/icon-192x192.png"],
    apple: [
      { url: "/icons/icon-152x152.png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192" }
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" }
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="NextJS Project" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="NextJS Project" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        
        <link rel="mask-icon" href="/icons/icon.svg" color="#000000" />
        <link rel="shortcut icon" href="/icons/icon-192x192.png" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content={process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'} />
        <meta name="twitter:title" content="NextJS Project" />
        <meta name="twitter:description" content="A modern Next.js application with comprehensive tooling and best practices." />
        <meta name="twitter:image" content="/icons/icon-192x192.png" />
        <meta name="twitter:creator" content="@nextjsproject" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="NextJS Project" />
        <meta property="og:description" content="A modern Next.js application with comprehensive tooling and best practices." />
        <meta property="og:site_name" content="NextJS Project" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'} />
        <meta property="og:image" content="/icons/icon-512x512.png" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ErrorBoundary>
          {children}
          <InstallPrompt />
        </ErrorBoundary>
      </body>
    </html>
  );
}
