import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DashboardShell } from "@/components/layout/dashboard-shell";
export const metadata: Metadata = {
  title: {
    default: "Mailchimp Dashboard",
    template: "%s | Mailchimp Dashboard",
  },
  description:
    "Professional dashboard for Mailchimp campaign and audience analytics with real-time insights.",
  keywords: [
    "mailchimp",
    "dashboard",
    "analytics",
    "campaigns",
    "email marketing",
    "audience",
  ],
  authors: [{ name: "Dashboard Developer" }],
  creator: "Mailchimp Dashboard",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Mailchimp Dashboard",
    description:
      "Professional dashboard for Mailchimp campaign and audience analytics with real-time insights.",
    siteName: "Mailchimp Dashboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mailchimp Dashboard",
    description:
      "Professional dashboard for Mailchimp campaign and audience analytics with real-time insights.",
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
    title: "Mailchimp Dashboard",
    startupImage: ["/icons/icon-192x192.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: ["/favicon-32x32.png"],
    apple: [
      { url: "/icons/icon-152x152.png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
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
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/icon-192x192.png"
        />

        <link rel="mask-icon" href="/icons/icon.svg" color="#000000" />
        <link rel="shortcut icon" href="/icons/icon-192x192.png" />

        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:url"
          content={process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}
        />
        <meta name="twitter:title" content="NextJS Project" />
        <meta
          name="twitter:description"
          content="A modern Next.js application with comprehensive tooling and best practices."
        />
        <meta name="twitter:image" content="/icons/icon-192x192.png" />
        <meta name="twitter:creator" content="@nextjsproject" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="NextJS Project" />
        <meta
          property="og:description"
          content="A modern Next.js application with comprehensive tooling and best practices."
        />
        <meta property="og:site_name" content="NextJS Project" />
        <meta
          property="og:url"
          content={process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}
        />
        <meta property="og:image" content="/icons/icon-512x512.png" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
