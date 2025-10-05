import { render, screen } from "@testing-library/react";
import { CampaignStatusBadge } from "@/components/ui/campaign-status-badge";

describe("CampaignStatusBadge", () => {
  it("renders sent status correctly", () => {
    render(<CampaignStatusBadge status="sent" />);
    expect(screen.getByText("Sent")).toBeInTheDocument();
  });

  it("renders sending status correctly", () => {
    render(<CampaignStatusBadge status="sending" />);
    expect(screen.getByText("Sending")).toBeInTheDocument();
  });

  it("renders scheduled status correctly", () => {
    render(<CampaignStatusBadge status="schedule" />);
    expect(screen.getByText("Scheduled")).toBeInTheDocument();
  });

  it("renders draft status for 'save'", () => {
    render(<CampaignStatusBadge status="save" />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("renders paused status correctly", () => {
    render(<CampaignStatusBadge status="paused" />);
    expect(screen.getByText("Paused")).toBeInTheDocument();
  });

  it("renders legacy draft status correctly", () => {
    render(<CampaignStatusBadge status="draft" />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("renders legacy canceled status correctly", () => {
    render(<CampaignStatusBadge status="canceled" />);
    expect(screen.getByText("Canceled")).toBeInTheDocument();
  });

  it("handles case insensitive status", () => {
    render(<CampaignStatusBadge status="SENT" />);
    expect(screen.getByText("Sent")).toBeInTheDocument();
  });

  it("renders unknown status as-is", () => {
    render(<CampaignStatusBadge status="unknown" />);
    expect(screen.getByText("unknown")).toBeInTheDocument();
  });

  it("applies additional className", () => {
    render(<CampaignStatusBadge status="sent" className="test-class" />);
    const badge = screen.getByText("Sent").closest("[class*='test-class']");
    expect(badge).toBeInTheDocument();
  });
});
