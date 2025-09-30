import { CampaignsArraySchema } from "@/schemas/components/dashboard/campaigns";

describe("CampaignsArraySchema validation", () => {
  it("validates a correct campaigns array", () => {
    const valid = [
      {
        id: "abc123",
        title: "Test Campaign",
        status: "sent",
        emailsSent: 1000,
        sendTime: "2025-08-30T12:00:00Z",
      },
      {
        id: "def456",
        title: "Another Campaign",
        status: "draft",
        emailsSent: 0,
        sendTime: "2025-08-29T09:00:00Z",
      },
    ];
    expect(CampaignsArraySchema.safeParse(valid).success).toBe(true);
  });

  it("fails validation for missing required fields", () => {
    const invalid = [
      {
        id: "abc123",
        // title missing
        status: "sent",
        emailsSent: 1000,
        sendTime: "2025-08-30T12:00:00Z",
      },
    ];
    expect(CampaignsArraySchema.safeParse(invalid).success).toBe(false);
  });

  it("fails validation for wrong types", () => {
    const invalid = [
      {
        id: "abc123",
        title: "Test Campaign",
        status: "sent",
        emailsSent: "not-a-number",
        sendTime: "2025-08-30T12:00:00Z",
      },
    ];
    expect(CampaignsArraySchema.safeParse(invalid).success).toBe(false);
  });
});
