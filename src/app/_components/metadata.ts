import type { Metadata } from "next";

export interface MetadataConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  siteName?: string;
  twitterCard?: "summary" | "summary_large_image";
  locale?: string;
  authors?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}

/**
 * Generate comprehensive metadata for pages
 *
 * @param config - Metadata configuration object
 * @returns Next.js Metadata object
 *
 * @example
 * ```ts
 * export const metadata = generateMetadata({
 *   title: "My Page Title",
 *   description: "Description of my page",
 *   image: "/og-image.png"
 * });
 * ```
 */
export function generateMetadata(config: MetadataConfig): Metadata {
  const {
    title = "NextJS Project",
    description = "A modern Next.js application",
    image = "/og-default.png",
    url = process.env.NEXT_PUBLIC_APP_URL || "https://127.0.0.1:3000",
    type = "website",
    siteName = "NextJS Project",
    twitterCard = "summary_large_image",
    locale = "en_US",
    authors = [],
    publishedTime,
    modifiedTime,
    tags = [],
  } = config;

  const metadata: Metadata = {
    title,
    description,
    authors: authors.map((author) => ({ name: author })),
    keywords: tags,
    openGraph: {
      title,
      description,
      url,
      type,
      siteName,
      locale,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: twitterCard,
      title,
      description,
      images: [image],
      creator: authors.length > 0 ? `@${authors[0]}` : undefined,
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
  };

  // Add article-specific metadata
  if (type === "article") {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: "article",
      publishedTime,
      modifiedTime,
      authors: authors,
      tags,
    };
  }

  return metadata;
}

/**
 * Generate dynamic OG image URL
 *
 * @param title - Page title
 * @param description - Page description (optional)
 * @returns OG image URL
 *
 * @example
 * ```ts
 * const ogImage = generateOGImageUrl("My Page", "Page description");
 * ```
 */
export function generateOGImageUrl(
  title: string,
  description?: string,
  theme: "light" | "dark" = "light",
): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://127.0.0.1:3000";
  const params = new URLSearchParams({
    title,
    theme,
    ...(description && { description }),
  });

  return `${baseUrl}/api/og?${params.toString()}`;
}

/**
 * Default site metadata configuration
 */
export const siteConfig = {
  name: "NextJS Project",
  description: "A modern Next.js application with comprehensive tooling",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://127.0.0.1:3000",
  ogImage: "/og-default.png",
  creator: "NextJS Developer",
  keywords: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Modern Web Development",
  ],
} as const;

/**
 * Generate structured data (JSON-LD) for SEO
 */
export function generateStructuredData(config: {
  type: "WebSite" | "Article" | "Organization";
  name: string;
  description?: string;
  url?: string;
  image?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://127.0.0.1:3000";

  const baseSchema = {
    "@context": "https://schema.org",
    "@type": config.type,
    name: config.name,
    description: config.description,
    url: config.url || baseUrl,
    image: config.image,
  };

  if (config.type === "Article") {
    return {
      ...baseSchema,
      author: {
        "@type": "Person",
        name: config.author || "NextJS Developer",
      },
      datePublished: config.publishedDate,
      dateModified: config.modifiedDate || config.publishedDate,
    };
  }

  if (config.type === "Organization") {
    return {
      ...baseSchema,
      founder: config.author,
    };
  }

  return baseSchema;
}
