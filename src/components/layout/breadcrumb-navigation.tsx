/**
 * Breadcrumb Navigation Component
 * Reusable breadcrumb component for consistent page navigation
 *
 * Following project guidelines to create reusable UI components
 * and keep page components lean
 */

import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem as BreadcrumbItemUI,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { BreadcrumbNavigationProps } from "@/types/components";

export function BreadcrumbNavigation({
  items,
  className = "",
}: BreadcrumbNavigationProps) {
  return (
    <div className={`container mx-auto pt-20 pb-4 ${className}`}>
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => (
            <React.Fragment key={`breadcrumb-${index}`}>
              <BreadcrumbItemUI>
                {item.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <span className={item.isCurrent ? "font-medium" : ""}>
                    {item.label}
                  </span>
                )}
              </BreadcrumbItemUI>
              {index < items.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
