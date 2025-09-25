/**
 * Tests for pagination utilities
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRouter } from "next/navigation";
import {
  usePaginationHandlers,
  useStaticPaginationHandlers,
  buildURLParams,
  type PaginationParams,
} from "./pagination";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

const mockUseRouter = useRouter as ReturnType<typeof vi.fn>;
const mockPush = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  mockUseRouter.mockReturnValue({
    push: mockPush,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  });
});

describe("buildURLParams", () => {
  it("builds basic pagination params", () => {
    const params: PaginationParams = {
      page: 2,
      perPage: 20,
    };

    const result = buildURLParams(params);

    expect(result.get("page")).toBe("2");
    expect(result.get("perPage")).toBe("20");
  });

  it("omits page 1 to keep URLs clean", () => {
    const params: PaginationParams = {
      page: 1,
      perPage: 10,
    };

    const result = buildURLParams(params);

    expect(result.get("page")).toBeNull();
    expect(result.get("perPage")).toBe("10");
  });

  it("includes additional parameters", () => {
    const params: PaginationParams = {
      page: 2,
      perPage: 20,
      additionalParams: {
        type: "regular",
        status: "active",
      },
    };

    const result = buildURLParams(params);

    expect(result.get("page")).toBe("2");
    expect(result.get("perPage")).toBe("20");
    expect(result.get("type")).toBe("regular");
    expect(result.get("status")).toBe("active");
  });

  it("filters out undefined and empty additional parameters", () => {
    const params: PaginationParams = {
      page: 1,
      perPage: 10,
      additionalParams: {
        type: "regular",
        status: undefined,
        category: "",
        tags: undefined,
      },
    };

    const result = buildURLParams(params);

    expect(result.get("type")).toBe("regular");
    expect(result.get("status")).toBeNull();
    expect(result.get("category")).toBeNull();
    expect(result.get("tags")).toBeNull();
  });
});

describe("usePaginationHandlers", () => {
  const config = {
    basePath: "/mailchimp/campaigns",
    currentParams: {
      page: 2,
      perPage: 20,
      additionalParams: {
        type: "regular",
        before_send_time: "2024-01-01",
      },
    },
  };

  it("creates pagination handlers", () => {
    const { result } = renderHook(() => usePaginationHandlers(config));

    expect(result.current).toHaveProperty("handlePageChange");
    expect(result.current).toHaveProperty("handlePerPageChange");
    expect(typeof result.current.handlePageChange).toBe("function");
    expect(typeof result.current.handlePerPageChange).toBe("function");
  });

  it("handlePageChange navigates to correct URL", () => {
    const { result } = renderHook(() => usePaginationHandlers(config));

    act(() => {
      result.current.handlePageChange(3);
    });

    expect(mockPush).toHaveBeenCalledWith(
      "/mailchimp/campaigns?page=3&perPage=20&type=regular&before_send_time=2024-01-01",
    );
  });

  it("handlePerPageChange resets to page 1 and updates perPage", () => {
    const { result } = renderHook(() => usePaginationHandlers(config));

    act(() => {
      result.current.handlePerPageChange(50);
    });

    expect(mockPush).toHaveBeenCalledWith(
      "/mailchimp/campaigns?perPage=50&type=regular&before_send_time=2024-01-01",
    );
  });

  it("handles page 1 navigation correctly (omits page param)", () => {
    const { result } = renderHook(() => usePaginationHandlers(config));

    act(() => {
      result.current.handlePageChange(1);
    });

    expect(mockPush).toHaveBeenCalledWith(
      "/mailchimp/campaigns?perPage=20&type=regular&before_send_time=2024-01-01",
    );
  });

  it("works without additional parameters", () => {
    const minimalConfig = {
      basePath: "/test",
      currentParams: {
        page: 1,
        perPage: 10,
      },
    };

    const { result } = renderHook(() => usePaginationHandlers(minimalConfig));

    act(() => {
      result.current.handlePageChange(2);
    });

    expect(mockPush).toHaveBeenCalledWith("/test?page=2&perPage=10");
  });

  it("memoizes handlers correctly", () => {
    const { result, rerender } = renderHook(() =>
      usePaginationHandlers(config),
    );

    const firstHandlePageChange = result.current.handlePageChange;
    const firstHandlePerPageChange = result.current.handlePerPageChange;

    // Re-render with same config
    rerender();

    expect(result.current.handlePageChange).toBe(firstHandlePageChange);
    expect(result.current.handlePerPageChange).toBe(firstHandlePerPageChange);
  });

  it("updates handlers when config changes", () => {
    const { result, rerender } = renderHook(
      (props) => usePaginationHandlers(props),
      { initialProps: config },
    );

    const firstHandlePageChange = result.current.handlePageChange;

    // Re-render with different config
    const newConfig = {
      ...config,
      currentParams: {
        ...config.currentParams,
        page: 3,
      },
    };

    rerender(newConfig);

    expect(result.current.handlePageChange).not.toBe(firstHandlePageChange);
  });
});

describe("useStaticPaginationHandlers", () => {
  it("creates no-op pagination handlers", () => {
    const { result } = renderHook(() => useStaticPaginationHandlers());

    expect(result.current).toHaveProperty("handlePageChange");
    expect(result.current).toHaveProperty("handlePerPageChange");
    expect(typeof result.current.handlePageChange).toBe("function");
    expect(typeof result.current.handlePerPageChange).toBe("function");
  });

  it("handlers are no-ops that don't call router", () => {
    const { result } = renderHook(() => useStaticPaginationHandlers());

    act(() => {
      result.current.handlePageChange();
      result.current.handlePerPageChange();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("memoizes handlers correctly", () => {
    const { result, rerender } = renderHook(() =>
      useStaticPaginationHandlers(),
    );

    const firstHandlePageChange = result.current.handlePageChange;
    const firstHandlePerPageChange = result.current.handlePerPageChange;

    rerender();

    expect(result.current.handlePageChange).toBe(firstHandlePageChange);
    expect(result.current.handlePerPageChange).toBe(firstHandlePerPageChange);
  });
});
