"use client";

import type { BackButtonProps } from "@/types/components/not-found";

export function BackButton({ className }: BackButtonProps) {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <button
      onClick={handleGoBack}
      className={
        className ||
        "w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
      }
    >
      Go back
    </button>
  );
}
