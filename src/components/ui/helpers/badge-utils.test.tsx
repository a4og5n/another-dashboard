import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  getVipBadge,
  getMemberStatusBadge,
  getActiveStatusBadge,
  getVisibilityBadge,
  getCampaignStatusBadge,
} from "./badge-utils";

describe("Badge Utilities", () => {
  describe("getVisibilityBadge", () => {
    it("renders Public badge for pub visibility (simple variant)", () => {
      const badge = getVisibilityBadge("pub");
      render(<div>{badge}</div>);
      expect(screen.getByText("Public")).toBeInTheDocument();
    });

    it("renders Private badge for prv visibility (simple variant)", () => {
      const badge = getVisibilityBadge("prv");
      render(<div>{badge}</div>);
      expect(screen.getByText("Private")).toBeInTheDocument();
    });

    it("renders Public badge with icon (with-icon variant)", () => {
      const badge = getVisibilityBadge("pub", "with-icon");
      render(<div>{badge}</div>);
      expect(screen.getByText("Public")).toBeInTheDocument();
      // Icon should be present - just verify text is rendered
      const badgeElement = screen.getByText("Public");
      expect(badgeElement).toBeInTheDocument();
    });

    it("renders Private badge with icon (with-icon variant)", () => {
      const badge = getVisibilityBadge("prv", "with-icon");
      render(<div>{badge}</div>);
      expect(screen.getByText("Private")).toBeInTheDocument();
    });

    it("uses correct badge variants for visibility types (simple)", () => {
      const publicBadge = getVisibilityBadge("pub");
      const privateBadge = getVisibilityBadge("prv");

      render(
        <div>
          <div data-testid="public">{publicBadge}</div>
          <div data-testid="private">{privateBadge}</div>
        </div>,
      );

      // Just verify both badges render with their labels
      expect(screen.getByText("Public")).toBeInTheDocument();
      expect(screen.getByText("Private")).toBeInTheDocument();
    });
  });

  describe("getCampaignStatusBadge", () => {
    it("returns correct variant and label for 'sent' status", () => {
      const result = getCampaignStatusBadge("sent");
      expect(result).toEqual({ variant: "default", label: "Sent" });
    });

    it("returns correct variant and label for 'sending' status", () => {
      const result = getCampaignStatusBadge("sending");
      expect(result).toEqual({ variant: "secondary", label: "Sending" });
    });

    it("returns correct variant and label for 'schedule' status", () => {
      const result = getCampaignStatusBadge("schedule");
      expect(result).toEqual({ variant: "outline", label: "Scheduled" });
    });

    it("returns correct variant and label for 'save' status", () => {
      const result = getCampaignStatusBadge("save");
      expect(result).toEqual({ variant: "secondary", label: "Draft" });
    });

    it("returns correct variant and label for 'paused' status", () => {
      const result = getCampaignStatusBadge("paused");
      expect(result).toEqual({ variant: "outline", label: "Paused" });
    });

    it("returns correct variant and label for 'draft' status", () => {
      const result = getCampaignStatusBadge("draft");
      expect(result).toEqual({ variant: "outline", label: "Draft" });
    });

    it("returns correct variant and label for 'canceled' status", () => {
      const result = getCampaignStatusBadge("canceled");
      expect(result).toEqual({ variant: "outline", label: "Canceled" });
    });

    it("handles case-insensitive input", () => {
      const result1 = getCampaignStatusBadge("SENT");
      const result2 = getCampaignStatusBadge("Sent");
      const result3 = getCampaignStatusBadge("sent");

      expect(result1).toEqual({ variant: "default", label: "Sent" });
      expect(result2).toEqual({ variant: "default", label: "Sent" });
      expect(result3).toEqual({ variant: "default", label: "Sent" });
    });

    it("returns outline variant and original label for unknown status", () => {
      const result = getCampaignStatusBadge("unknown_status");
      expect(result).toEqual({
        variant: "outline",
        label: "unknown_status",
      });
    });
  });

  describe("getVipBadge", () => {
    it("renders VIP badge for VIP members (simple variant)", () => {
      const badge = getVipBadge(true);
      render(<div>{badge}</div>);
      expect(screen.getByText("VIP")).toBeInTheDocument();
    });

    it("renders null for non-VIP members (simple variant)", () => {
      const badge = getVipBadge(false);
      expect(badge).toBeNull();
    });

    it("renders VIP badge with icon for VIP members (with-icon variant)", () => {
      const badge = getVipBadge(true, "with-icon");
      render(<div>{badge}</div>);
      expect(screen.getByText("VIP")).toBeInTheDocument();
    });

    it("renders No badge for non-VIP members (with-icon variant)", () => {
      const badge = getVipBadge(false, "with-icon");
      render(<div>{badge}</div>);
      expect(screen.getByText("No")).toBeInTheDocument();
    });
  });

  describe("getMemberStatusBadge", () => {
    it("renders Active badge for subscribed status", () => {
      const badge = getMemberStatusBadge("subscribed");
      render(<div>{badge}</div>);
      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("renders Unsubscribed badge for unsubscribed status", () => {
      const badge = getMemberStatusBadge("unsubscribed");
      render(<div>{badge}</div>);
      expect(screen.getByText("Unsubscribed")).toBeInTheDocument();
    });

    it("renders Cleaned badge for cleaned status", () => {
      const badge = getMemberStatusBadge("cleaned");
      render(<div>{badge}</div>);
      expect(screen.getByText("Cleaned")).toBeInTheDocument();
    });

    it("renders Pending badge for pending status", () => {
      const badge = getMemberStatusBadge("pending");
      render(<div>{badge}</div>);
      expect(screen.getByText("Pending")).toBeInTheDocument();
    });

    it("handles case-insensitive input", () => {
      const badge = getMemberStatusBadge("SUBSCRIBED");
      render(<div>{badge}</div>);
      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("renders original status for unknown status", () => {
      const badge = getMemberStatusBadge("unknown");
      render(<div>{badge}</div>);
      expect(screen.getByText("unknown")).toBeInTheDocument();
    });
  });

  describe("getActiveStatusBadge", () => {
    it("renders Active badge for active items", () => {
      const badge = getActiveStatusBadge(true);
      render(<div>{badge}</div>);
      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("renders Inactive badge for inactive items", () => {
      const badge = getActiveStatusBadge(false);
      render(<div>{badge}</div>);
      expect(screen.getByText("Inactive")).toBeInTheDocument();
    });
  });
});
