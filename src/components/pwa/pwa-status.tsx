"use client";

import { useState, useEffect } from "react";
import { Smartphone, Monitor, Wifi, WifiOff } from "lucide-react";

interface PWAStatus {
  isInstalled: boolean;
  isStandalone: boolean;
  isOnline: boolean;
  installSource: "browser" | "homescreen" | "pwa" | "unknown";
}

/**
 * PWA Status Component
 *
 * Displays the current PWA status and connection information
 * Useful for debugging and user awareness
 */
export function PWAStatus() {
  const [status, setStatus] = useState<PWAStatus>({
    isInstalled: false,
    isStandalone: false,
    isOnline: navigator.onLine,
    installSource: "unknown",
  });

  useEffect(() => {
    const updateStatus = () => {
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)",
      ).matches;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isInStandaloneMode =
        (window.navigator as Navigator & { standalone?: boolean })
          .standalone === true;
      const isInstalled = isStandalone || (isIOS && isInStandaloneMode);

      // Detect install source
      let installSource: PWAStatus["installSource"] = "unknown";
      if (isStandalone) {
        installSource = "pwa";
      } else if (isInStandaloneMode) {
        installSource = "homescreen";
      } else {
        installSource = "browser";
      }

      setStatus((prev) => ({
        ...prev,
        isInstalled,
        isStandalone: isStandalone || isInStandaloneMode,
        installSource,
      }));
    };

    const handleOnline = () =>
      setStatus((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () =>
      setStatus((prev) => ({ ...prev, isOnline: false }));

    // Initial status check
    updateStatus();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    mediaQuery.addEventListener("change", updateStatus);

    // Listen for online/offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      mediaQuery.removeEventListener("change", updateStatus);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {/* Display Mode Indicator */}
      {status.isStandalone ? (
        <div className="flex items-center gap-1">
          <Smartphone className="w-4 h-4" />
          <span>PWA</span>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <Monitor className="w-4 h-4" />
          <span>Browser</span>
        </div>
      )}

      {/* Connection Status */}
      <div className="flex items-center gap-1">
        {status.isOnline ? (
          <>
            <Wifi className="w-4 h-4 text-green-600" />
            <span>Online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-red-600" />
            <span>Offline</span>
          </>
        )}
      </div>
    </div>
  );
}
