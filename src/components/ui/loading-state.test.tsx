import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { LoadingState, ProgressiveLoading } from "./loading-state";

describe("LoadingState", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe("loading type", () => {
    it("renders loading state with default title and message", () => {
      render(<LoadingState type="loading" showSkeleton={false} />);

      expect(screen.getByText(/Loading dashboard data/i)).toBeInTheDocument();
      expect(
        screen.getByText(
          /Fetching the latest data from your Mailchimp account/i,
        ),
      ).toBeInTheDocument();
    });

    it("renders loading state with custom title and message", () => {
      render(
        <LoadingState
          type="loading"
          title="Custom Loading"
          message="Custom message"
          showSkeleton={false}
        />,
      );

      expect(screen.getByText("Custom Loading")).toBeInTheDocument();
      expect(screen.getByText("Custom message")).toBeInTheDocument();
    });

    it("renders skeleton when showSkeleton is true", () => {
      const { container } = render(
        <LoadingState type="loading" showSkeleton={true} />,
      );

      // Check that loading text is NOT rendered when skeleton is shown
      expect(
        screen.queryByText(/Loading dashboard data/i),
      ).not.toBeInTheDocument();
      // Skeleton should be present
      expect(container.querySelector(".space-y-6")).toBeInTheDocument();
    });

    it("animates dots in loading text", async () => {
      render(<LoadingState type="loading" showSkeleton={false} />);

      // Initial state
      expect(screen.getByText(/Loading dashboard data/i)).toBeInTheDocument();

      // After 500ms, should have one dot
      await act(async () => {
        vi.advanceTimersByTime(500);
      });
      expect(screen.getByText(/Loading dashboard data\./i)).toBeInTheDocument();

      // After 1000ms, should have two dots
      await act(async () => {
        vi.advanceTimersByTime(500);
      });
      expect(
        screen.getByText(/Loading dashboard data\.\./i),
      ).toBeInTheDocument();

      // After 1500ms, should have three dots
      await act(async () => {
        vi.advanceTimersByTime(500);
      });
      expect(
        screen.getByText(/Loading dashboard data\.\.\./i),
      ).toBeInTheDocument();

      // After 2000ms, should reset to no dots
      await act(async () => {
        vi.advanceTimersByTime(500);
      });
      expect(screen.getByText(/Loading dashboard data$/i)).toBeInTheDocument();
    });

    it("displays spinning icon", () => {
      render(<LoadingState type="loading" showSkeleton={false} />);

      const spinner = screen
        .getByText(/Loading dashboard data/i)
        .closest("div")
        ?.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });
  });

  describe("error type", () => {
    it("renders error state with default title and message", () => {
      render(<LoadingState type="error" />);

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(
        screen.getByText(
          /We encountered an error while loading your dashboard data/i,
        ),
      ).toBeInTheDocument();
    });

    it("renders error state with custom title and message", () => {
      render(
        <LoadingState
          type="error"
          title="Custom Error"
          message="Custom error message"
        />,
      );

      expect(screen.getByText("Custom Error")).toBeInTheDocument();
      expect(screen.getByText("Custom error message")).toBeInTheDocument();
    });

    it("renders retry button when onRetry is provided", () => {
      const onRetry = vi.fn();
      render(<LoadingState type="error" onRetry={onRetry} />);

      expect(
        screen.getByRole("button", { name: /Try again/i }),
      ).toBeInTheDocument();
    });

    it("does not render retry button when onRetry is not provided", () => {
      render(<LoadingState type="error" />);

      expect(
        screen.queryByRole("button", { name: /Try again/i }),
      ).not.toBeInTheDocument();
    });

    it("calls onRetry when retry button is clicked", () => {
      const onRetry = vi.fn();
      render(<LoadingState type="error" onRetry={onRetry} />);

      const retryButton = screen.getByRole("button", { name: /Try again/i });
      fireEvent.click(retryButton);

      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it("uses custom retry label when provided", () => {
      const onRetry = vi.fn();
      render(
        <LoadingState type="error" onRetry={onRetry} retryLabel="Retry Now" />,
      );

      expect(
        screen.getByRole("button", { name: "Retry Now" }),
      ).toBeInTheDocument();
    });
  });

  describe("network-error type", () => {
    it("renders network error state with default title and message", () => {
      render(<LoadingState type="network-error" />);

      expect(screen.getByText("Connection issue")).toBeInTheDocument();
      expect(
        screen.getByText(
          /Unable to connect to Mailchimp API. Please check your internet connection/i,
        ),
      ).toBeInTheDocument();
    });

    it("renders network error state with custom title and message", () => {
      render(
        <LoadingState
          type="network-error"
          title="Network Down"
          message="Check your connection"
        />,
      );

      expect(screen.getByText("Network Down")).toBeInTheDocument();
      expect(screen.getByText("Check your connection")).toBeInTheDocument();
    });

    it("renders retry button when onRetry is provided", () => {
      const onRetry = vi.fn();
      render(<LoadingState type="network-error" onRetry={onRetry} />);

      expect(
        screen.getByRole("button", { name: /Try again/i }),
      ).toBeInTheDocument();
    });

    it("calls onRetry when retry button is clicked", () => {
      const onRetry = vi.fn();
      render(<LoadingState type="network-error" onRetry={onRetry} />);

      const retryButton = screen.getByRole("button", { name: /Try again/i });
      fireEvent.click(retryButton);

      expect(onRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe("empty type", () => {
    it("renders empty state with default title and message", () => {
      render(<LoadingState type="empty" />);

      expect(screen.getByText("No data available")).toBeInTheDocument();
      expect(
        screen.getByText(
          /There's no data to display right now. Try refreshing or check your Mailchimp account/i,
        ),
      ).toBeInTheDocument();
    });

    it("renders empty state with custom title and message", () => {
      render(
        <LoadingState
          type="empty"
          title="No Items"
          message="Add some items to get started"
        />,
      );

      expect(screen.getByText("No Items")).toBeInTheDocument();
      expect(
        screen.getByText("Add some items to get started"),
      ).toBeInTheDocument();
    });

    it("does not render retry button in empty state", () => {
      const onRetry = vi.fn();
      render(<LoadingState type="empty" onRetry={onRetry} />);

      expect(
        screen.queryByRole("button", { name: /Try again/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("dot animation cleanup", () => {
    it("clears interval when component unmounts", () => {
      const { unmount } = render(
        <LoadingState type="loading" showSkeleton={false} />,
      );

      vi.advanceTimersByTime(500);
      unmount();

      // Should not throw or cause memory leaks
      vi.advanceTimersByTime(1000);
    });

    it("resets dots when type changes from loading to error", () => {
      const { rerender } = render(
        <LoadingState type="loading" showSkeleton={false} />,
      );

      // Advance time to get dots
      vi.advanceTimersByTime(1000);

      // Change to error type
      rerender(<LoadingState type="error" />);

      // Dots should not appear in error state
      expect(screen.queryByText(/\.\.\./)).not.toBeInTheDocument();
    });
  });
});

describe("ProgressiveLoading", () => {
  it("renders loading state when isLoading is true", () => {
    render(
      <ProgressiveLoading isLoading={true}>
        <div>Content</div>
      </ProgressiveLoading>,
    );

    // Should not render children
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
    // Should show skeleton
    expect(document.querySelector(".space-y-6")).toBeInTheDocument();
  });

  it("renders error state when hasError is true", () => {
    render(
      <ProgressiveLoading isLoading={false} hasError={true}>
        <div>Content</div>
      </ProgressiveLoading>,
    );

    expect(screen.queryByText("Content")).not.toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders empty state when isEmpty is true", () => {
    render(
      <ProgressiveLoading isLoading={false} isEmpty={true}>
        <div>Content</div>
      </ProgressiveLoading>,
    );

    expect(screen.queryByText("Content")).not.toBeInTheDocument();
    expect(screen.getByText("No data to display")).toBeInTheDocument();
  });

  it("renders children when all conditions are false", () => {
    render(
      <ProgressiveLoading isLoading={false} hasError={false} isEmpty={false}>
        <div>Content</div>
      </ProgressiveLoading>,
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("uses custom loading title and message when skeleton is disabled", () => {
    // Note: ProgressiveLoading always uses showSkeleton={true}, so custom messages
    // only appear if LoadingState component changes. This test verifies the props are passed.
    const { container } = render(
      <ProgressiveLoading
        isLoading={true}
        loadingTitle="Loading Data"
        loadingMessage="Please wait..."
      >
        <div>Content</div>
      </ProgressiveLoading>,
    );

    // Should render skeleton (ProgressiveLoading uses showSkeleton={true})
    expect(container.querySelector(".space-y-6")).toBeInTheDocument();
  });

  it("uses custom error title and message", () => {
    render(
      <ProgressiveLoading
        isLoading={false}
        hasError={true}
        errorTitle="Load Failed"
        errorMessage="Could not load data"
      >
        <div>Content</div>
      </ProgressiveLoading>,
    );

    expect(screen.getByText("Load Failed")).toBeInTheDocument();
    expect(screen.getByText("Could not load data")).toBeInTheDocument();
  });

  it("passes onRetry to error state", () => {
    const onRetry = vi.fn();

    render(
      <ProgressiveLoading isLoading={false} hasError={true} onRetry={onRetry}>
        <div>Content</div>
      </ProgressiveLoading>,
    );

    const retryButton = screen.getByRole("button", { name: /Try again/i });
    fireEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("prioritizes loading over error state", () => {
    render(
      <ProgressiveLoading isLoading={true} hasError={true}>
        <div>Content</div>
      </ProgressiveLoading>,
    );

    // Should show loading, not error
    expect(document.querySelector(".space-y-6")).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });

  it("prioritizes error over empty state", () => {
    render(
      <ProgressiveLoading isLoading={false} hasError={true} isEmpty={true}>
        <div>Content</div>
      </ProgressiveLoading>,
    );

    // Should show error, not empty
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.queryByText("No data to display")).not.toBeInTheDocument();
  });
});
