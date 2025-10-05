/**
 * Unit tests for validateReportsQuery
 */
import { describe, it, expect } from "vitest";
import {
  validateReportsQuery,
  ValidationError,
} from "@/actions/mailchimp-reports";

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
  // Using an invalid type to test schema validation
  type: "invalidtype" as unknown,
};

describe("validateReportsQuery", () => {
  it("parses valid params and transforms fields/exclude_fields to arrays", () => {
    const result = validateReportsQuery(validParams);
    expect(result.fields).toEqual(["id", "type"]);
    expect(result.exclude_fields).toEqual(["settings"]);
    expect(result.count).toBe(10);
    expect(result.offset).toBe(0);
    expect(result.type).toBe("regular");
    expect(result.before_send_time).toBe("2025-08-01T00:00:00Z");
    expect(result.since_send_time).toBe("2025-07-01T00:00:00Z");
  });

  it("throws ValidationError for invalid params", () => {
    expect(() => validateReportsQuery(invalidParams)).toThrow(ValidationError);
  });

  it("handles missing optional params", () => {
    const result = validateReportsQuery({ count: "5" });
    expect(result.count).toBe(5);
    expect(result.fields).toBeUndefined();
    expect(result.exclude_fields).toBeUndefined();
    expect(result.type).toBeUndefined();
  });

  it("trims and splits fields/exclude_fields correctly", () => {
    const result = validateReportsQuery({
      fields: "id, type ,name ",
      exclude_fields: " settings ,data ",
    });
    expect(result.fields).toEqual(["id", "type", "name"]);
    expect(result.exclude_fields).toEqual(["settings", "data"]);
  });
  it("accepts count at boundaries (1 and 1000)", () => {
    expect(validateReportsQuery({ count: "1" }).count).toBe(1);
    expect(validateReportsQuery({ count: "1000" }).count).toBe(1000);
  });

  it("throws ValidationError for count > 1000, < 1, or non-numeric", () => {
    expect(() => validateReportsQuery({ count: "0" })).toThrow(ValidationError);
    expect(() => validateReportsQuery({ count: "1001" })).toThrow(
      ValidationError,
    );
    expect(() => validateReportsQuery({ count: "abc" })).toThrow(
      ValidationError,
    );
  });

  it("accepts offset at boundary (0)", () => {
    expect(validateReportsQuery({ offset: "0" }).offset).toBe(0);
  });

  it("throws ValidationError for offset < 0 or non-numeric", () => {
    expect(() => validateReportsQuery({ offset: "-1" })).toThrow(
      ValidationError,
    );
    expect(() => validateReportsQuery({ offset: "xyz" })).toThrow(
      ValidationError,
    );
  });

  it("accepts all valid type values", () => {
    const types = ["regular", "plaintext", "absplit", "rss", "variate"];
    types.forEach((type) => {
      expect(validateReportsQuery({ type }).type).toBe(type);
    });
  });

  it("throws ValidationError for invalid type values", () => {
    expect(() => validateReportsQuery({ type: "foo" })).toThrow(
      ValidationError,
    );
    expect(() => validateReportsQuery({ type: "" })).toThrow(ValidationError);
  });

  it("accepts valid ISO8601 date strings for before_send_time and since_send_time", () => {
    const params = {
      before_send_time: "2023-01-01T00:00:00Z",
      since_send_time: "2023-01-01T00:00:00Z",
    };
    expect(validateReportsQuery(params).before_send_time).toBe(
      params.before_send_time,
    );
    expect(validateReportsQuery(params).since_send_time).toBe(
      params.since_send_time,
    );
  });

  it("accepts empty string for optional fields (should be undefined)", () => {
    const result = validateReportsQuery({
      fields: "",
      exclude_fields: "",
    });
    expect(result.fields).toEqual([]);
    expect(result.exclude_fields).toEqual([]);
  });

  it("throws ValidationError for unexpected extra params", () => {
    expect(() => validateReportsQuery({ count: "5", foo: "bar" })).toThrow(
      ValidationError,
    );
  });
});
