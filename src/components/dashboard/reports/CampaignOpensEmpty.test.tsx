/**
 * Campaign Opens Empty Component Tests
 * Tests for the empty state component when campaign opens data is not available
 *
 * Issue #135: Campaign opens empty state component tests
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import { CampaignOpensEmpty } from "@/components/dashboard/reports";

describe("CampaignOpensEmpty", () => {
  const mockCampaignId = "test-campaign-123";

  it("renders with default title and message", () => {
    render(<CampaignOpensEmpty campaignId={mockCampaignId} />);

    expect(screen.getByText("No Opens Data Available")).toBeInTheDocument();
    expect(
      screen.getByText(/There's no opens data available for this campaign/),
    ).toBeInTheDocument();
  });

  it("renders with custom title and message", () => {
    const customTitle = "Custom Empty Title";
    const customMessage = "Custom empty message for testing";

    render(
      <CampaignOpensEmpty
        campaignId={mockCampaignId}
        title={customTitle}
        message={customMessage}
      />,
    );

    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it("renders navigation links with correct hrefs", () => {
    render(<CampaignOpensEmpty campaignId={mockCampaignId} />);

    // Check Back to Report link
    const backToReportLink = screen.getByRole("link", {
      name: /back to report/i,
    });
    expect(backToReportLink).toHaveAttribute(
      "href",
      `/mailchimp/campaigns/${mockCampaignId}/report`,
    );

    // Check View All Campaigns link
    const viewAllLink = screen.getByRole("link", {
      name: /view all campaigns/i,
    });
    expect(viewAllLink).toHaveAttribute("href", "/mailchimp/campaigns");
  });

  it("renders retry button when onRetry is provided", () => {
    const mockRetry = vi.fn();

    render(
      <CampaignOpensEmpty campaignId={mockCampaignId} onRetry={mockRetry} />,
    );

    const retryButton = screen.getByRole("button", { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
  });

  it("does not render retry button when onRetry is not provided", () => {
    render(<CampaignOpensEmpty campaignId={mockCampaignId} />);

    const retryButton = screen.queryByRole("button", { name: /try again/i });
    expect(retryButton).not.toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", async () => {
    const mockRetry = vi.fn();
    const { user } = render(
      <CampaignOpensEmpty campaignId={mockCampaignId} onRetry={mockRetry} />,
    );

    const retryButton = screen.getByRole("button", { name: /try again/i });
    await user.click(retryButton);

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it("has proper accessibility attributes", () => {
    render(<CampaignOpensEmpty campaignId={mockCampaignId} />);

    // Check that the main content is properly structured
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("No Opens Data Available");

    // Check that links are properly labeled
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    links.forEach((link) => {
      expect(link).toHaveAccessibleName();
    });
  });
});
