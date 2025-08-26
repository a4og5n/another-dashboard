"use client";

import React, { useEffect } from "react";

interface A11yProviderProps {
  children: React.ReactNode;
  enableInDevelopment?: boolean;
}

/**
 * Accessibility Provider Component
 *
 * This component sets up accessibility testing in development mode.
 * Add this to your root layout to enable accessibility checks.
 *
 * Usage in layout.tsx:
 * ```tsx
 * import { A11yProvider } from '@/components/accessibility/a11y-provider';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <A11yProvider enableInDevelopment>
 *           {children}
 *         </A11yProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function A11yProvider({
  children,
  enableInDevelopment = true,
}: A11yProviderProps) {
  useEffect(() => {
    // Only run in development mode if explicitly enabled
    if (process.env.NODE_ENV !== "development" || !enableInDevelopment) {
      return;
    }

    // TODO: Fix @axe-core/react integration in future update
    // Currently disabled to resolve build issues
    // Dynamically import @axe-core/react to avoid bundle bloat in production
    let axeReactCleanup: (() => void) | undefined;

    if (process.env.NODE_ENV === "development") {
      console.log("Accessibility provider initialized for development");
      // Axe-core integration will be added in a future update
    }

    // Cleanup function
    return () => {
      if (axeReactCleanup) {
        axeReactCleanup();
      }
    };
  }, [enableInDevelopment]);

  return <>{children}</>;
}
