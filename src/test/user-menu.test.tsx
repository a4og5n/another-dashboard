/**
 * User Menu Component Test
 * Tests for authentication user menu component
 * 
 * Following established component testing patterns
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserMenu } from "@/components/auth/user-menu";
import type { KindeUser } from "@/types/auth";

// Mock Kinde components
vi.mock("@kinde-oss/kinde-auth-nextjs/components", () => ({
  LogoutLink: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="logout-link">{children}</div>
  ),
}));

describe("UserMenu", () => {
  const mockUser: KindeUser = {
    id: "kinde_123456",
    email: "john.doe@example.com",
    given_name: "John",
    family_name: "Doe",
    picture: "https://example.com/avatar.jpg",
    created_on: "2024-01-01T00:00:00Z",
    organization: "ACME Corp",
    job_title: "Developer",
    phone: "+1234567890",
  };

  const defaultProps = {
    user: mockUser,
    displayName: "John Doe",
    initials: "JD",
  };

  it("should render user menu trigger", () => {
    render(<UserMenu {...defaultProps} />);
    
    const trigger = screen.getByRole("button");
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
  });

  it("should render user picture in avatar when provided", () => {
    render(<UserMenu {...defaultProps} />);
    
    const avatar = screen.getByRole("img");
    expect(avatar).toHaveAttribute("src", mockUser.picture);
    expect(avatar).toHaveAttribute("alt", "John Doe");
  });

  it("should render initials when no picture provided", () => {
    const userWithoutPicture = {
      ...mockUser,
      picture: null,
    };
    
    render(
      <UserMenu
        {...defaultProps}
        user={userWithoutPicture}
      />
    );
    
    // Should show initials when no picture
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("should open dropdown and show menu content when clicked", async () => {
    const user = userEvent.setup();
    render(<UserMenu {...defaultProps} />);
    
    const trigger = screen.getByRole("button");
    await user.click(trigger);
    
    // Check if dropdown opened (aria-expanded should be true)
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    
    // Check for dropdown content
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });

  it("should render logout link in dropdown", async () => {
    const user = userEvent.setup();
    render(<UserMenu {...defaultProps} />);
    
    const trigger = screen.getByRole("button");
    await user.click(trigger);
    
    expect(screen.getByTestId("logout-link")).toBeInTheDocument();
  });

  it("should handle accessibility attributes", () => {
    render(<UserMenu {...defaultProps} />);
    
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});