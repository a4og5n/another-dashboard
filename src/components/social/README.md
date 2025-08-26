# Social Sharing Components

This directory contains components for social media sharing and Open Graph optimization.

## Components

### SocialShare

A comprehensive social sharing component with support for multiple platforms and native sharing.

## Usage

### Basic Social Share Button

```tsx
import { SocialShare } from "@/components/social/social-share";

export default function BlogPost() {
  return (
    <article>
      <h1>My Blog Post</h1>
      <p>Content...</p>

      <SocialShare
        title="My Blog Post Title"
        description="Brief description of the post"
        hashtags={["blog", "nextjs"]}
        via="yourtwitterhandle"
      />
    </article>
  );
}
```

### Using Metadata Utilities

```tsx
import {
  generateMetadata,
  generateOGImageUrl,
} from "@/app/_components/metadata";

export const metadata = generateMetadata({
  title: "Blog Post Title",
  description: "Description for social sharing",
  image: generateOGImageUrl("Blog Post Title", "Description"),
  type: "article",
  authors: ["Author Name"],
  publishedTime: "2025-01-01T00:00:00.000Z",
});
```

### Dynamic OG Images

The `/api/og` route generates dynamic Open Graph images:

- `/api/og?title=My%20Title` - Basic title
- `/api/og?title=My%20Title&description=Description` - With description
- `/api/og?title=My%20Title&theme=dark` - Dark theme

## Features

- **Multiple Platforms**: Twitter, Facebook, LinkedIn
- **Native Sharing**: Uses Web Share API when available
- **Copy Link**: Clipboard integration
- **Dynamic OG Images**: Automated social media image generation
- **SEO Optimized**: Comprehensive metadata generation
- **Responsive Design**: Works on all device sizes

## Customization

### OG Image Themes

The OG image generator supports light and dark themes. You can extend it with custom themes by modifying `/api/og/route.tsx`.

### Social Platforms

Add more platforms by extending the `shareUrls` object in the `SocialShare` component.

### Styling

The components use Tailwind CSS and shadcn/ui design tokens for consistent styling.

## Best Practices

1. **Always provide meaningful titles and descriptions**
2. **Use relevant hashtags for Twitter sharing**
3. **Test your Open Graph images across platforms**
4. **Keep titles under 60 characters for optimal display**
5. **Descriptions should be 155-160 characters for best SEO**
6. **Include structured data for better search engine understanding**

## Resources

- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
