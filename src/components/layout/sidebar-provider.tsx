"use client";

import { createContext, useContext, useState } from "react";
import type {
  SidebarContextValue,
  SidebarProviderProps,
} from "@/types/components/layout";

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}
