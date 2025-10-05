import { formatPricingPlan, getPricingPlanVariant } from "@/utils/mailchimp";

describe("Pricing Plan Utils", () => {
  describe("formatPricingPlan", () => {
    it("formats known pricing plan types correctly", () => {
      expect(formatPricingPlan("monthly")).toBe("Monthly");
      expect(formatPricingPlan("pay_as_you_go")).toBe("Pay As You Go");
      expect(formatPricingPlan("forever_free")).toBe("Forever Free");
    });

    it("returns original value for unknown plan types", () => {
      expect(formatPricingPlan("unknown_plan")).toBe("unknown_plan");
      expect(formatPricingPlan("custom_plan")).toBe("custom_plan");
    });

    it("handles empty string", () => {
      expect(formatPricingPlan("")).toBe("");
    });
  });

  describe("getPricingPlanVariant", () => {
    it("returns correct badge variants for known plan types", () => {
      expect(getPricingPlanVariant("forever_free")).toBe("secondary");
      expect(getPricingPlanVariant("pay_as_you_go")).toBe("outline");
      expect(getPricingPlanVariant("monthly")).toBe("default");
    });

    it("returns outline variant for unknown plan types", () => {
      expect(getPricingPlanVariant("unknown_plan")).toBe("outline");
      expect(getPricingPlanVariant("custom_plan")).toBe("outline");
      expect(getPricingPlanVariant("")).toBe("outline");
    });
  });
});
