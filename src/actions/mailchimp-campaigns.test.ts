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
  it("accepts count at boundaries (0 and 1000)", () => {
    expect(validateMailchimpCampaignsQuery({ count: "0" }).count).toBe(0);
    expect(validateMailchimpCampaignsQuery({ count: "1000" }).count).toBe(1000);
  });

  it("throws ValidationError for count > 1000 or non-numeric", () => {
    expect(() => validateMailchimpCampaignsQuery({ count: "1001" })).toThrow(
      ValidationError,
    );
    expect(() => validateMailchimpCampaignsQuery({ count: "abc" })).toThrow(
      ValidationError,
    );
  });

  it("accepts offset at boundary (0)", () => {
    expect(validateMailchimpCampaignsQuery({ offset: "0" }).offset).toBe(0);
  });

  it("throws ValidationError for offset < 0 or non-numeric", () => {
    expect(() => validateMailchimpCampaignsQuery({ offset: "-1" })).toThrow(
      ValidationError,
    );
    expect(() => validateMailchimpCampaignsQuery({ offset: "xyz" })).toThrow(
      ValidationError,
    );
  });

  it("accepts all valid type values", () => {
    const types = [
      "regular",
      "plaintext",
      "absplit",
      "rss",
      "automation",
      "variate",
    ];
    types.forEach((type) => {
      expect(validateMailchimpCampaignsQuery({ type }).type).toBe(type);
    });
  });

  it("throws ValidationError for invalid type values", () => {
    expect(() => validateMailchimpCampaignsQuery({ type: "foo" })).toThrow(
      ValidationError,
    );
    expect(() => validateMailchimpCampaignsQuery({ type: "" })).toThrow(
      ValidationError,
    );
  });

  it("accepts valid ISO8601 date strings for before_send_time and since_send_time", () => {
    const params = {
      before_send_time: "2023-01-01T00:00:00Z",
      since_send_time: "2023-01-01T00:00:00Z",
    };
    expect(validateMailchimpCampaignsQuery(params).before_send_time).toBe(
      params.before_send_time,
    );
    expect(validateMailchimpCampaignsQuery(params).since_send_time).toBe(
      params.since_send_time,
    );
  });

  it("accepts empty string for optional fields (should be undefined)", () => {
    const result = validateMailchimpCampaignsQuery({
      fields: "",
      exclude_fields: "",
    });
    expect(result.fields).toEqual([]);
    expect(result.exclude_fields).toEqual([]);
  });

  it("ignores unexpected extra params", () => {
    const result = validateMailchimpCampaignsQuery({ count: "5", foo: "bar" });
    expect(result.count).toBe(5);
    // extra params are not present in the returned type
  });
});
