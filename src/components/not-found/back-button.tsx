"use client";

import type { BackButtonProps } from "@/types/components/not-found";
import { Button } from "@/components/ui/button";

export function BackButton({ className }: BackButtonProps) {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Button
      onClick={handleGoBack}
      variant="secondary"
      className={className || "w-full"}
    >
      Go back
    </Button>
  );
}
