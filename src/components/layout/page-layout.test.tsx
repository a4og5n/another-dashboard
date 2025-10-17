/**
 * Unit tests for PageLayout component
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageLayout } from "@/components/layout/page-layout";
import { bc } from "@/utils/breadcrumbs";

describe("PageLayout", () => {
  describe("Pattern A - Static Breadcrumbs", () => {
    it("renders with static breadcrumbs", () => {
      render(
        <PageLayout
          breadcrumbs={[bc.home, bc.mailchimp, bc.current("Reports")]}
          title="Reports"
          description="View and analyze your reports"
          skeleton={<div data-testid="skeleton">Loading...</div>}
        >
          <div data-testid="content">Page Content</div>
        </PageLayout>,
      );

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Reports");
      expect(
        screen.getByText("View and analyze your reports"),
      ).toBeInTheDocument();
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Mailchimp")).toBeInTheDocument();
    });

    it("renders page title and description", () => {
      render(
        <PageLayout
          breadcrumbs={[bc.home]}
          title="Test Page"
          description="Test description"
          skeleton={<div>Loading...</div>}
        >
          <div>Content</div>
        </PageLayout>,
      );

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Test Page");
      expect(screen.getByText("Test description")).toBeInTheDocument();
    });
  });

  describe("Pattern B - Dynamic Breadcrumbs", () => {
    it("renders with breadcrumbsSlot", () => {
      const BreadcrumbSlot = (
        <div data-testid="breadcrumb-slot">Custom Breadcrumbs</div>
      );

      render(
        <PageLayout
          breadcrumbsSlot={BreadcrumbSlot}
          title="Campaign Opens"
          description="Members who opened this campaign"
          skeleton={<div>Loading...</div>}
        >
          <div>Content</div>
        </PageLayout>,
      );

      expect(screen.getByTestId("breadcrumb-slot")).toBeInTheDocument();
      expect(screen.getByText("Campaign Opens")).toBeInTheDocument();
    });

    it("does not render breadcrumbs when using breadcrumbsSlot", () => {
      render(
        <PageLayout
          breadcrumbsSlot={<div>Slot</div>}
          title="Title"
          description="Description"
          skeleton={<div>Loading...</div>}
        >
          <div>Content</div>
        </PageLayout>,
      );

      // Breadcrumb component should not be rendered when using slot
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    });
  });

  describe("Content Rendering", () => {
    it("renders children inside Suspense boundary", () => {
      render(
        <PageLayout
          breadcrumbs={[bc.home]}
          title="Title"
          description="Description"
          skeleton={<div>Loading...</div>}
        >
          <div data-testid="page-content">Page Content</div>
        </PageLayout>,
      );

      expect(screen.getByTestId("page-content")).toBeInTheDocument();
    });

    it("uses correct spacing classes", () => {
      const { container } = render(
        <PageLayout
          breadcrumbs={[bc.home]}
          title="Title"
          description="Description"
          skeleton={<div>Loading...</div>}
        >
          <div>Content</div>
        </PageLayout>,
      );

      const spacingDiv = container.querySelector(".space-y-6");
      expect(spacingDiv).toBeInTheDocument();
    });
  });

  describe("Mutual Exclusivity", () => {
    it("prioritizes breadcrumbs prop when both props provided", () => {
      render(
        <PageLayout
          breadcrumbs={[bc.home, bc.current("Test")]}
          breadcrumbsSlot={<div data-testid="slot">Slot</div>}
          title="Title"
          description="Description"
          skeleton={<div>Loading...</div>}
        >
          <div>Content</div>
        </PageLayout>,
      );

      // Should render breadcrumbs navigation
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });
});
