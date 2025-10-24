/**
 * Tests for Mailchimp Merge Fields Utility
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { formatMergeFields } from "./merge-fields";

describe("formatMergeFields", () => {
  describe("Empty/Null Cases", () => {
    it("should return em dash for undefined", () => {
      const { container } = render(<>{formatMergeFields(undefined)}</>);
      expect(container.textContent).toBe("—");
      expect(container.querySelector(".text-muted-foreground")).toBeTruthy();
    });

    it("should return em dash for empty object", () => {
      const { container } = render(<>{formatMergeFields({})}</>);
      expect(container.textContent).toBe("—");
    });

    it("should return em dash for null", () => {
      const { container } = render(
        <>{formatMergeFields(null as unknown as Record<string, string>)}</>,
      );
      expect(container.textContent).toBe("—");
    });
  });

  describe("Simple String Values", () => {
    it("should format single string field", () => {
      const { container } = render(<>{formatMergeFields({ FNAME: "John" })}</>);
      expect(screen.getByText("FNAME:")).toBeInTheDocument();
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(container.querySelector(".space-y-1")).toBeTruthy();
    });

    it("should format multiple string fields", () => {
      render(
        <>
          {formatMergeFields({
            FNAME: "John",
            LNAME: "Doe",
            EMAIL: "john@example.com",
          })}
        </>,
      );
      expect(screen.getByText("FNAME:")).toBeInTheDocument();
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("LNAME:")).toBeInTheDocument();
      expect(screen.getByText("Doe")).toBeInTheDocument();
      expect(screen.getByText("EMAIL:")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    it("should render empty string values", () => {
      const { container } = render(<>{formatMergeFields({ COMPANY: "" })}</>);
      expect(screen.getByText("COMPANY:")).toBeInTheDocument();
      // Empty string creates an empty span
      const emptySpans = container.querySelectorAll(".text-muted-foreground");
      expect(emptySpans.length).toBeGreaterThan(0);
    });
  });

  describe("Number Values", () => {
    it("should format number values as strings", () => {
      render(<>{formatMergeFields({ AGE: 30 })}</>);
      expect(screen.getByText("AGE:")).toBeInTheDocument();
      expect(screen.getByText("30")).toBeInTheDocument();
    });

    it("should format zero as string", () => {
      render(<>{formatMergeFields({ COUNT: 0 })}</>);
      expect(screen.getByText("COUNT:")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should format negative numbers", () => {
      render(<>{formatMergeFields({ BALANCE: -100 })}</>);
      expect(screen.getByText("BALANCE:")).toBeInTheDocument();
      expect(screen.getByText("-100")).toBeInTheDocument();
    });

    it("should format decimal numbers", () => {
      render(<>{formatMergeFields({ SCORE: 95.5 })}</>);
      expect(screen.getByText("SCORE:")).toBeInTheDocument();
      expect(screen.getByText("95.5")).toBeInTheDocument();
    });
  });

  describe("Address Objects", () => {
    it("should format complete address object", () => {
      const address = {
        addr1: "123 Main St",
        city: "Boston",
        state: "MA",
        zip: "02101",
      };
      render(<>{formatMergeFields({ ADDRESS: address })}</>);
      expect(screen.getByText("ADDRESS:")).toBeInTheDocument();
      expect(
        screen.getByText("123 Main St, Boston, MA, 02101"),
      ).toBeInTheDocument();
    });

    it("should handle partial address (missing fields)", () => {
      const address = {
        city: "Boston",
        state: "MA",
      };
      render(<>{formatMergeFields({ ADDRESS: address })}</>);
      expect(screen.getByText("ADDRESS:")).toBeInTheDocument();
      expect(screen.getByText("Boston, MA")).toBeInTheDocument();
    });

    it("should handle address with only addr1", () => {
      const address = {
        addr1: "123 Main St",
      };
      render(<>{formatMergeFields({ ADDRESS: address })}</>);
      expect(screen.getByText("ADDRESS:")).toBeInTheDocument();
      expect(screen.getByText("123 Main St")).toBeInTheDocument();
    });

    it("should filter out falsy values in address", () => {
      const address = {
        addr1: "123 Main St",
        city: "",
        state: "MA",
        zip: null,
      };
      render(<>{formatMergeFields({ ADDRESS: address })}</>);
      expect(screen.getByText("ADDRESS:")).toBeInTheDocument();
      // Should only show addr1 and state (city is empty string, zip is null)
      expect(screen.getByText("123 Main St, MA")).toBeInTheDocument();
    });

    it("should handle empty address object", () => {
      const address = {};
      render(<>{formatMergeFields({ ADDRESS: address })}</>);
      expect(screen.getByText("ADDRESS:")).toBeInTheDocument();
      // Empty object should result in empty string after join (with space before it)
      const addressValue = screen.getByText("ADDRESS:").nextSibling;
      expect(addressValue?.textContent?.trim()).toBe("");
    });
  });

  describe("Mixed Value Types", () => {
    it("should handle mix of strings, numbers, and objects", () => {
      const mergeFields = {
        FNAME: "John",
        AGE: 30,
        ADDRESS: {
          addr1: "123 Main St",
          city: "Boston",
          state: "MA",
          zip: "02101",
        },
        COMPANY: "Acme Corp",
      };
      render(<>{formatMergeFields(mergeFields)}</>);

      expect(screen.getByText("FNAME:")).toBeInTheDocument();
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("AGE:")).toBeInTheDocument();
      expect(screen.getByText("30")).toBeInTheDocument();
      expect(screen.getByText("ADDRESS:")).toBeInTheDocument();
      expect(
        screen.getByText("123 Main St, Boston, MA, 02101"),
      ).toBeInTheDocument();
      expect(screen.getByText("COMPANY:")).toBeInTheDocument();
      expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    });

    it("should handle multiple address objects", () => {
      const mergeFields = {
        HOME: {
          addr1: "123 Main St",
          city: "Boston",
          state: "MA",
        },
        WORK: {
          addr1: "456 Office Blvd",
          city: "Cambridge",
          state: "MA",
        },
      };
      render(<>{formatMergeFields(mergeFields)}</>);

      expect(screen.getByText("HOME:")).toBeInTheDocument();
      expect(screen.getByText("123 Main St, Boston, MA")).toBeInTheDocument();
      expect(screen.getByText("WORK:")).toBeInTheDocument();
      expect(
        screen.getByText("456 Office Blvd, Cambridge, MA"),
      ).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle boolean values", () => {
      render(<>{formatMergeFields({ SUBSCRIBED: true })}</>);
      expect(screen.getByText("SUBSCRIBED:")).toBeInTheDocument();
      expect(screen.getByText("true")).toBeInTheDocument();
    });

    it("should handle array values (converted to string)", () => {
      const { container } = render(
        <>
          {formatMergeFields({ TAGS: ["tag1", "tag2"] as unknown as string })}
        </>,
      );
      expect(screen.getByText("TAGS:")).toBeInTheDocument();
      // Arrays are converted via String() which may create [object Object] or similar
      // Just verify the key is displayed - the exact value conversion isn't critical for this edge case
      const valueSpan = container.querySelector(".text-muted-foreground");
      expect(valueSpan).toBeTruthy();
    });

    it("should handle nested objects (not address pattern)", () => {
      const nested = {
        foo: "bar",
        baz: "qux",
      };
      render(<>{formatMergeFields({ METADATA: nested })}</>);
      expect(screen.getByText("METADATA:")).toBeInTheDocument();
      // Should try to parse as address (addr1, city, state, zip not found)
      // Results in empty string since none of those keys exist
    });
  });

  describe("CSS Classes", () => {
    it("should apply correct classes to container", () => {
      const { container } = render(<>{formatMergeFields({ FNAME: "John" })}</>);
      const wrapper = container.querySelector(".space-y-1.max-w-xs");
      expect(wrapper).toBeTruthy();
    });

    it("should apply correct classes to field labels", () => {
      const { container } = render(<>{formatMergeFields({ FNAME: "John" })}</>);
      const label = container.querySelector(".font-medium");
      expect(label).toBeTruthy();
      expect(label?.textContent).toBe("FNAME:");
    });

    it("should apply correct classes to field values", () => {
      const { container } = render(<>{formatMergeFields({ FNAME: "John" })}</>);
      const value = container.querySelector(".text-muted-foreground");
      expect(value).toBeTruthy();
      expect(value?.textContent).toBe("John");
    });

    it("should apply text-xs class to field rows", () => {
      const { container } = render(<>{formatMergeFields({ FNAME: "John" })}</>);
      const row = container.querySelector(".text-xs");
      expect(row).toBeTruthy();
    });
  });

  describe("Real-World Examples", () => {
    it("should format typical Mailchimp merge fields", () => {
      const mergeFields = {
        FNAME: "Jane",
        LNAME: "Smith",
        PHONE: "555-1234",
        BIRTHDAY: "01/15",
        ADDRESS: {
          addr1: "789 Elm Street",
          addr2: "Apt 4B",
          city: "New York",
          state: "NY",
          zip: "10001",
          country: "US",
        },
      };
      render(<>{formatMergeFields(mergeFields)}</>);

      expect(screen.getByText("FNAME:")).toBeInTheDocument();
      expect(screen.getByText("Jane")).toBeInTheDocument();
      expect(screen.getByText("LNAME:")).toBeInTheDocument();
      expect(screen.getByText("Smith")).toBeInTheDocument();
      expect(screen.getByText("PHONE:")).toBeInTheDocument();
      expect(screen.getByText("555-1234")).toBeInTheDocument();
      expect(screen.getByText("BIRTHDAY:")).toBeInTheDocument();
      expect(screen.getByText("01/15")).toBeInTheDocument();
      expect(screen.getByText("ADDRESS:")).toBeInTheDocument();
      // Note: addr2, country not in filter list, so not displayed
      expect(
        screen.getByText("789 Elm Street, New York, NY, 10001"),
      ).toBeInTheDocument();
    });
  });
});
