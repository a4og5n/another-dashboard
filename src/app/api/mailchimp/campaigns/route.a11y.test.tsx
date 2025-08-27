/**
 * Accessibility tests for Mailchimp campaigns API route responses
 */
import { describe, it } from "vitest";
import { renderWithA11y, expectNoA11yViolations } from "@/test/axe-helper";

// Type for campaign report used in tests
type CampaignReport = {
  id: string;
  campaign_title: string;
  type: string;
  emails_sent: number;
  delivery_status: { status: string };
};

// Example response component for accessibility testing
function CampaignReportsResponse({ reports }: { reports: CampaignReport[] }) {
  return (
    <main>
      <h1>Campaign Reports</h1>
      <ul>
        {reports.map((r) => (
          <li key={r.id}>
            <article>
              <h2>{r.campaign_title}</h2>
              <p>Type: {r.type}</p>
              <p>Emails Sent: {r.emails_sent}</p>
              <p>Status: {r.delivery_status.status}</p>
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
}

describe("Mailchimp campaigns API route accessibility", () => {
  it("renders campaign reports response with no accessibility violations", async () => {
    const reports = [
      {
        id: "abc123",
        campaign_title: "Test Campaign",
        type: "regular",
        emails_sent: 100,
        delivery_status: { status: "sent" },
      },
    ];
    const { renderResult } = await renderWithA11y(
      <CampaignReportsResponse reports={reports} />,
    );
    await expectNoA11yViolations(renderResult.container);
  });

  it("renders empty reports list with no accessibility violations", async () => {
    const { renderResult } = await renderWithA11y(
      <CampaignReportsResponse reports={[]} />,
    );
    await expectNoA11yViolations(renderResult.container);
  });
});
