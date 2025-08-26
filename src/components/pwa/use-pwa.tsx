"use client";

import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

interface PWAInfo {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isOnline: boolean;
  platform: string;
  installSource: "browser" | "homescreen" | "pwa" | "unknown";
}

interface UsePWAReturn {
  pwaInfo: PWAInfo;
  install: () => Promise<boolean>;
  canInstall: boolean;
}

/**
 * Custom hook for PWA functionality
 *
 * Provides PWA installation capabilities and status information
 *
 * @returns Object with PWA info and install function
 *
 * @example
 * ```tsx
 * const { pwaInfo, install, canInstall } = usePWA();
 *
 * return (
 *   <div>
 *     {canInstall && (
 *       <button onClick={install}>
 *         Install App
 *       </button>
 *     )}
 *     <p>Status: {pwaInfo.isInstalled ? 'Installed' : 'Not Installed'}</p>
 *   </div>
 * );
 * ```
 */
export function usePWA(): UsePWAReturn {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [pwaInfo, setPWAInfo] = useState<PWAInfo>({
    isInstallable: false,
    isInstalled: false,
    isStandalone: false,
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    platform: "unknown",
    installSource: "unknown",
  });

  const updatePWAInfo = useCallback(() => {
    if (typeof window === "undefined") return;

    const isStandalone = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode =
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true;
    const isInstalled = isStandalone || (isIOS && isInStandaloneMode);

    // Detect platform
    let platform = "unknown";
    if (isIOS) platform = "ios";
    else if (/Android/.test(navigator.userAgent)) platform = "android";
    else if (/Windows/.test(navigator.userAgent)) platform = "windows";
    else if (/Mac/.test(navigator.userAgent)) platform = "macos";
    else if (/Linux/.test(navigator.userAgent)) platform = "linux";

    // Detect install source
    let installSource: PWAInfo["installSource"] = "unknown";
    if (isStandalone) {
      installSource = "pwa";
    } else if (isInStandaloneMode) {
      installSource = "homescreen";
    } else {
      installSource = "browser";
    }

    setPWAInfo((prev) => ({
      ...prev,
      isInstalled,
      isStandalone: isStandalone || isInStandaloneMode,
      platform,
      installSource,
      isOnline: navigator.onLine,
    }));
  }, []);

  const install = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.warn("No install prompt available");
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      setDeferredPrompt(null);
      setPWAInfo((prev) => ({ ...prev, isInstallable: false }));

      return choiceResult.outcome === "accepted";
    } catch (error) {
      console.error("Error during PWA installation:", error);
      return false;
    }
  }, [deferredPrompt]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initial PWA info update
    updatePWAInfo();

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setPWAInfo((prev) => ({ ...prev, isInstallable: true }));
    };

    // Handle app installation
    const handleAppInstalled = () => {
      setPWAInfo((prev) => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        installSource: "pwa",
      }));
      setDeferredPrompt(null);
    };

    // Handle online/offline status
    const handleOnline = () =>
      setPWAInfo((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () =>
      setPWAInfo((prev) => ({ ...prev, isOnline: false }));

    // Handle display mode changes
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    mediaQuery.addEventListener("change", updatePWAInfo);

    // Add event listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      mediaQuery.removeEventListener("change", updatePWAInfo);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [updatePWAInfo]);

  return {
    pwaInfo,
    install,
    canInstall:
      !!deferredPrompt && pwaInfo.isInstallable && !pwaInfo.isInstalled,
  };
}
