import { render, screen } from "@/test/test-utils";
import { CampaignsTable } from "./campaigns-table";

const validCampaigns = [
  {
    id: "1",
    title: "Spring Sale",
    status: "sent",
    emailsSent: 1000,
    sendTime: "2025-03-15T10:00:00Z",
  },
];

const invalidCampaigns = [
  {
    id: 1, // should be string
    title: "Broken Data",
    status: "sent",
    emailsSent: "1000", // should be number
    sendTime: "2025-03-15T10:00:00Z",
  },
];

describe("CampaignsTable", () => {
  it("renders valid campaigns without crashing", () => {
    render(<CampaignsTable campaigns={validCampaigns} />);
    expect(screen.getByText("Spring Sale")).toBeInTheDocument();
  });

  it("renders improved empty state for invalid campaigns data", () => {
    render(<CampaignsTable campaigns={invalidCampaigns} />);
    expect(screen.getByText("No campaigns found")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    expect(
      screen.getByRole("button", { name: /connect mailchimp/i }),
    ).toBeInTheDocument();
  });

  it("renders improved empty state if campaigns is undefined", () => {
    render(<CampaignsTable campaigns={undefined} />);
    expect(screen.getByText("No campaigns found")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    expect(
      screen.getByRole("button", { name: /connect mailchimp/i }),
    ).toBeInTheDocument();
  });

  it("renders loading skeleton when loading is true", () => {
    render(<CampaignsTable campaigns={validCampaigns} loading={true} />);
    expect(screen.getByTestId("table-skeleton")).toBeInTheDocument();
    expect(screen.queryByText("No campaigns found")).not.toBeInTheDocument();
  });
});
