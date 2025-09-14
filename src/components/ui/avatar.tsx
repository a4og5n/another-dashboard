import * as React from "react";
import { cn } from "@/lib/utils";
import type { AvatarProps } from "@/types/components/avatar";

// Use next/image for optimized images if available (client-side only)
import { useEffect, useState } from "react";

function useNextImage() {
  const [NextImage, setNextImage] =
    useState<typeof import("next/image").default>();
  useEffect(() => {
    let mounted = true;
    import("next/image")
      .then((mod) => {
        if (mounted) setNextImage(() => mod.default);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);
  return NextImage;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "default", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8 text-sm",
      default: "h-10 w-10 text-base",
      lg: "h-12 w-12 text-lg",
    };
    const NextImage = useNextImage();
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full",
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {src ? (
          NextImage ? (
            <NextImage
              src={src}
              alt={alt || "Avatar"}
              fill
              sizes="32x32"
              className="aspect-square h-full w-full object-cover rounded-full"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <img
              src={src}
              alt={alt || "Avatar"}
              className="aspect-square h-full w-full object-cover"
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground">
            {fallback || "?"}
          </div>
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";

export { Avatar };
