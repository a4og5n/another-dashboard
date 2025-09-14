/**
 * Avatar Component Types
 * TypeScript types for Avatar UI component
 *
 * Following established types patterns
 */
import * as React from "react";

export interface AvatarProps extends React.ComponentProps<"div"> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "default" | "lg";
}
