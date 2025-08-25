# PWA Screenshots

This directory contains screenshots for your Progressive Web App (PWA) that will be displayed in app stores and installation prompts.

## Required Screenshots

### Desktop Screenshot (`desktop.png`)
- **Dimensions**: 1280x720px (16:9 aspect ratio)
- **Format**: PNG or JPEG
- **Content**: Show the main interface of your desktop application
- **Quality**: High resolution, clear text and interface elements

### Mobile Screenshot (`mobile.png`)
- **Dimensions**: 390x844px (iPhone 14 dimensions) or similar mobile ratio
- **Format**: PNG or JPEG
- **Content**: Show the main interface optimized for mobile
- **Quality**: High resolution, demonstrate mobile-first design

## How to Create Screenshots

### Using Browser Developer Tools
1. Open your app in Chrome/Firefox
2. Open Developer Tools (F12)
3. Use device simulation for mobile screenshot
4. Take screenshots using browser tools or OS screenshot functionality

### Using Playwright (Automated)
```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Desktop screenshot
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('http://localhost:3000');
  await page.screenshot({ path: 'public/screenshots/desktop.png' });
  
  // Mobile screenshot
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'public/screenshots/mobile.png' });
  
  await browser.close();
})();
```

## Best Practices
- Use actual app content, not placeholder text
- Show key features and functionality
- Ensure screenshots represent the current app design
- Update screenshots when making significant UI changes
- Consider showing different sections/pages of your app

## Store Requirements
Different app stores may have specific requirements:
- **Google Play**: Up to 8 screenshots, various device sizes
- **Apple App Store**: Up to 10 screenshots per device type
- **Microsoft Store**: Various sizes supported

Check the latest requirements for each platform you plan to target.
