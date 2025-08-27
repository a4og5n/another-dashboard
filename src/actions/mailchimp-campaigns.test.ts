/**
 * Unit tests for validateMailchimpCampaignsQuery
 */
import { describe, it, expect } from "vitest";
import {
  validateMailchimpCampaignsQuery,
  ValidationError,
} from "./mailchimp-campaigns";

const validParams = {
  fields: "id,type",
  exclude_fields: "settings",
  count: "10",
  offset: "0",
  type: "regular",
  before_send_time: "2025-08-01T00:00:00Z",
  since_send_time: "2025-07-01T00:00:00Z",
};

const invalidParams = {
  count: "-1",
  offset: "-5",
  type: "invalidtype",
};

describe("validateMailchimpCampaignsQuery", () => {
  it("parses valid params and transforms fields/exclude_fields to arrays", () => {
    const result = validateMailchimpCampaignsQuery(validParams);
    expect(result.fields).toEqual(["id", "type"]);
    expect(result.exclude_fields).toEqual(["settings"]);
    expect(result.count).toBe(10);
    expect(result.offset).toBe(0);
    expect(result.type).toBe("regular");
    expect(result.before_send_time).toBe("2025-08-01T00:00:00Z");
    expect(result.since_send_time).toBe("2025-07-01T00:00:00Z");
  });

  it("throws ValidationError for invalid params", () => {
    expect(() => validateMailchimpCampaignsQuery(invalidParams)).toThrow(
      ValidationError,
    );
  });

  it("handles missing optional params", () => {
    const result = validateMailchimpCampaignsQuery({ count: "5" });
    expect(result.count).toBe(5);
    expect(result.fields).toBeUndefined();
    expect(result.exclude_fields).toBeUndefined();
    expect(result.type).toBeUndefined();
  });

  it("trims and splits fields/exclude_fields correctly", () => {
    const result = validateMailchimpCampaignsQuery({
      fields: "id, type ,name ",
      exclude_fields: " settings ,data ",
    });
    expect(result.fields).toEqual(["id", "type", "name"]);
    expect(result.exclude_fields).toEqual(["settings", "data"]);
  });
});
