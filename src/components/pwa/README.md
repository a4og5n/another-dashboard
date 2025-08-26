# Progressive Web App (PWA) Components

This directory contains components and utilities for Progressive Web App functionality, enabling your Next.js application to provide native app-like experiences.

## Components

### InstallPrompt

A customizable install prompt component that appears when the PWA can be installed.

**Features:**

- Automatic detection of install capability
- Custom UI that matches your app design
- Handles browser install prompt events
- Dismissible with user preference memory
- Mobile-responsive design

**Usage:**

```tsx
import { InstallPrompt } from "@/components/pwa/install-prompt";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <InstallPrompt />
    </div>
  );
}
```

### PWAStatus

A status indicator showing current PWA state and connection status.

**Features:**

- Shows if app is running as PWA or in browser
- Online/offline connection indicator
- Install source detection
- Real-time status updates

**Usage:**

```tsx
import { PWAStatus } from "@/components/pwa/pwa-status";

export default function Header() {
  return (
    <header>
      <h1>My App</h1>
      <PWAStatus />
    </header>
  );
}
```

### usePWA Hook

A custom React hook for managing PWA functionality programmatically.

**Features:**

- PWA installation management
- Status information access
- Platform detection
- Connection monitoring

**Usage:**

```tsx
import { usePWA } from "@/components/pwa/use-pwa";

export default function InstallButton() {
  const { pwaInfo, install, canInstall } = usePWA();

  return (
    <div>
      {canInstall && (
        <button onClick={install}>
          Install {pwaInfo.platform === "ios" ? "to Home Screen" : "App"}
        </button>
      )}
      <p>Running in: {pwaInfo.isStandalone ? "PWA" : "Browser"}</p>
      <p>Platform: {pwaInfo.platform}</p>
      <p>Online: {pwaInfo.isOnline ? "Yes" : "No"}</p>
    </div>
  );
}
```

## Manifest Configuration

The `public/manifest.json` file defines your PWA properties:

```json
{
  "name": "Your App Name",
  "short_name": "App",
  "description": "App description",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [...]
}
```

### Key Properties:

- **name**: Full app name (displayed during install)
- **short_name**: Abbreviated name (used on home screen)
- **start_url**: URL to load when app is launched
- **display**: How the app should be displayed ("standalone", "fullscreen", "minimal-ui", "browser")
- **background_color**: Background color while app is loading
- **theme_color**: Theme color for browser UI
- **icons**: Array of app icons for different sizes

## Icons and Assets

### Required Icon Sizes:

- **72x72px** - Android launcher (small)
- **96x96px** - Android launcher (medium)
- **128x128px** - Android launcher (large)
- **144x144px** - Android launcher (extra large)
- **152x152px** - iOS touch icon
- **192x192px** - Chrome splash screen
- **384x384px** - Chrome splash screen
- **512x512px** - Chrome splash screen (large)

### Generating Icons:

See `/public/icons/README.md` for detailed instructions on generating icons from your source design.

## Installation Process

### Android (Chrome):

1. User visits your PWA
2. Browser shows install banner or user taps "Add to Home Screen"
3. App installs and appears on home screen
4. Launches in standalone mode

### iOS (Safari):

1. User visits your PWA
2. User taps Share button → "Add to Home Screen"
3. User confirms installation
4. App appears on home screen

### Desktop (Chrome/Edge):

1. Install button appears in address bar
2. User clicks install button
3. App installs as desktop application
4. Can be launched from applications menu

## Best Practices

### Performance:

- Keep manifest.json small and optimized
- Optimize icon files for different sizes
- Use appropriate display modes
- Implement proper caching strategies

### User Experience:

- Don't show install prompts too aggressively
- Provide clear value proposition for installation
- Handle offline scenarios gracefully
- Test on various devices and browsers

### Testing:

- Test install flow on different devices
- Verify icons appear correctly at all sizes
- Test offline functionality
- Use Chrome DevTools for PWA auditing

## Browser Support

| Feature          | Chrome | Firefox | Safari | Edge |
| ---------------- | ------ | ------- | ------ | ---- |
| Web App Manifest | ✅     | ✅      | ✅     | ✅   |
| Install Prompts  | ✅     | ❌      | Manual | ✅   |
| Standalone Mode  | ✅     | ✅      | ✅     | ✅   |
| Service Workers  | ✅     | ✅      | ✅     | ✅   |

## Troubleshooting

### Install Button Not Showing:

- Check manifest.json is valid and served correctly
- Ensure HTTPS is enabled (required for PWA)
- Verify required manifest properties are present
- Check browser console for PWA-related errors

### Icons Not Displaying:

- Verify icon files exist at specified paths
- Check icon sizes match manifest declarations
- Ensure proper MIME types are served
- Test with different icon formats if needed

### App Not Installing:

- Verify all PWA requirements are met
- Check service worker registration
- Ensure manifest.json is linked in HTML
- Test with different browsers

## Resources

- [Web App Manifest MDN](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [PWA Builder](https://www.pwabuilder.com/)
- [Lighthouse PWA Audit](https://developers.google.com/web/tools/lighthouse)
- [Maskable Icon Editor](https://maskable.app/editor)
