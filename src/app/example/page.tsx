/**
 * Example Page
 * Demonstration page for testing components and patterns (development only)
 *
 * @route /example
 * @requires None
 * @features Component demos, Pattern examples, Development utilities
 */

import type { Metadata } from "next";
import {
  generateMetadata,
  generateOGImageUrl,
} from "@/app/_components/metadata";

// Generate metadata with Open Graph and Twitter Cards
export const metadata: Metadata = generateMetadata({
  title: "Example Page - NextJS Project",
  description:
    "This is an example page demonstrating Open Graph and social sharing metadata.",
  image: generateOGImageUrl(
    "Example Page",
    "Demonstrating social sharing capabilities",
  ),
  type: "article",
  authors: ["NextJS Developer"],
  tags: ["example", "open-graph", "social-sharing"],
  publishedTime: new Date().toISOString(),
});

export default function ExamplePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Example Page</h1>

      <div className="prose prose-lg max-w-none">
        <p>
          This is an example page that demonstrates how to use the Open Graph
          and social sharing metadata utilities provided by this template.
        </p>

        <h2>Features Demonstrated</h2>
        <ul>
          <li>Dynamic Open Graph image generation</li>
          <li>Twitter Card optimization</li>
          <li>SEO-friendly metadata</li>
          <li>Structured data (JSON-LD)</li>
        </ul>

        <h2>How It Works</h2>
        <p>
          The metadata for this page is generated using the{" "}
          <code>generateMetadata</code>
          utility function, which creates comprehensive Open Graph and Twitter
          Card metadata.
        </p>

        <p>
          The Open Graph image is dynamically generated using our API route at
          <code>/api/og</code>, which creates beautiful social sharing images
          with your content.
        </p>

        <h2>Usage Example</h2>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
          <code>{`import { generateMetadata, generateOGImageUrl } from '@/app/_components/metadata';

export const metadata = generateMetadata({
  title: 'My Page Title',
  description: 'Page description for social sharing',
  image: generateOGImageUrl('My Page Title', 'Description'),
  type: 'article',
  authors: ['Author Name'],
  tags: ['tag1', 'tag2'],
});`}</code>
        </pre>
      </div>
    </div>
  );
}
