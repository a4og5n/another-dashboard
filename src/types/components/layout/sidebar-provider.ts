/**
 * Types for Sidebar Context Provider
 *
 * Follows project guidelines for centralized type definitions
 */
import type { ReactNode } from "react";

/**
 * Value shape for SidebarContext
 */
export interface SidebarContextValue {
  /**
   * Whether the sidebar is currently open
   */
  sidebarOpen: boolean;

  /**
   * Function to set sidebar open state
   */
  setSidebarOpen: (open: boolean) => void;
}

/**
 * Props for SidebarProvider component
 */
export interface SidebarProviderProps {
  /**
   * Child components to wrap with sidebar context
   */
  children: ReactNode;
}
