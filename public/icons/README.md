# PWA App Icons

This directory contains the app icons for your Progressive Web App (PWA).

## Icon Requirements

The following icon sizes are required for proper PWA support:

- 72x72px - Android launcher icon (small)
- 96x96px - Android launcher icon (medium)
- 128x128px - Android launcher icon (large)
- 144x144px - Android launcher icon (extra large)
- 152x152px - iOS touch icon
- 192x192px - Android launcher icon (extra extra large)
- 384x384px - Chrome splash screen
- 512x512px - Chrome splash screen (large)

## Generating Icons

You can generate all required sizes from the provided `icon.svg` file:

### Using ImageMagick

```bash
# Install ImageMagick if not already installed
brew install imagemagick  # macOS
# sudo apt-get install imagemagick  # Ubuntu/Debian

# Generate all sizes
magick icon.svg -resize 72x72 icon-72x72.png
magick icon.svg -resize 96x96 icon-96x96.png
magick icon.svg -resize 128x128 icon-128x128.png
magick icon.svg -resize 144x144 icon-144x144.png
magick icon.svg -resize 152x152 icon-152x152.png
magick icon.svg -resize 192x192 icon-192x192.png
magick icon.svg -resize 384x384 icon-384x384.png
magick icon.svg -resize 512x512 icon-512x512.png
```

### Using Sharp (Node.js)

```javascript
const sharp = require("sharp");
const fs = require("fs");

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach((size) => {
  sharp("icon.svg")
    .resize(size, size)
    .png()
    .toFile(`icon-${size}x${size}.png`)
    .then((info) => console.log(`Generated ${size}x${size} icon`));
});
```

### Online Tools

- [Favicon.io](https://favicon.io/) - Generate icons from text, image, or emoji
- [RealFaviconGenerator](https://realfavicongenerator.net/) - Comprehensive favicon generator
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator) - CLI tool for PWA assets

## Customization

Replace the `icon.svg` file with your own design, ensuring:

- Square aspect ratio (1:1)
- Minimum size of 512x512px
- Simple design that works at small sizes
- High contrast for visibility
- Consider maskable icon guidelines for Android

## Maskable Icons

For better Android integration, consider creating maskable icons:

- Use a safe zone (inner 80% of the icon)
- The outer 20% may be cropped on some devices
- Test your icons with the [Maskable.app](https://maskable.app/) tool

## Screenshots

Add app screenshots to `/public/screenshots/` for better app store presentation:

- `desktop.png` - Desktop view (1280x720px recommended)
- `mobile.png` - Mobile view (390x844px recommended)
- Use actual screenshots of your application
- Ensure high quality and proper aspect ratios
