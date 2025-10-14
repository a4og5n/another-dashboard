import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { expectNoA11yViolations, renderWithA11y } from "@/test/axe-helper";
import { MailchimpConnectionGuard } from "@/components/mailchimp/mailchimp-connection-guard";

describe("MailchimpConnectionGuard", () => {
  describe("Valid connection (no errorCode)", () => {
    it("renders children when no errorCode is provided", () => {
      render(
        <MailchimpConnectionGuard>
          <div>Valid content</div>
        </MailchimpConnectionGuard>,
      );

      expect(screen.getByText("Valid content")).toBeInTheDocument();
    });

    it("evaluates function children when connection is valid", () => {
      render(
        <MailchimpConnectionGuard>
          {() => <div>Function child content</div>}
        </MailchimpConnectionGuard>,
      );

      expect(screen.getByText("Function child content")).toBeInTheDocument();
    });

    it("shows OAuth success banner when connected=true", () => {
      render(
        <MailchimpConnectionGuard connected={true}>
          <div>Valid content</div>
        </MailchimpConnectionGuard>,
      );

      expect(
        screen.getByText(/Mailchimp connected successfully!/i),
      ).toBeInTheDocument();
      expect(screen.getByText("Valid content")).toBeInTheDocument();
    });
  });

  describe("Invalid connection (with errorCode)", () => {
    it("shows empty state when errorCode is provided", () => {
      render(
        <MailchimpConnectionGuard errorCode="MAILCHIMP_NOT_CONNECTED">
          <div>Should not render</div>
        </MailchimpConnectionGuard>,
      );

      // Should show empty state
      expect(
        screen.getByText(/Connect your Mailchimp account/i),
      ).toBeInTheDocument();

      // Should NOT render children
      expect(screen.queryByText("Should not render")).not.toBeInTheDocument();
    });

    it("does not evaluate function children when errorCode present", () => {
      let wasEvaluated = false;

      render(
        <MailchimpConnectionGuard errorCode="MAILCHIMP_TOKEN_EXPIRED">
          {() => {
            wasEvaluated = true;
            return <div>Should not render</div>;
          }}
        </MailchimpConnectionGuard>,
      );

      expect(wasEvaluated).toBe(false);
      expect(screen.queryByText("Should not render")).not.toBeInTheDocument();
    });

    it("shows empty state with different error codes", () => {
      const errorCodes = [
        "MAILCHIMP_NOT_CONNECTED",
        "MAILCHIMP_TOKEN_EXPIRED",
        "MAILCHIMP_AUTH_ERROR",
      ];

      errorCodes.forEach((errorCode) => {
        const { unmount } = render(
          <MailchimpConnectionGuard errorCode={errorCode}>
            <div>Should not render</div>
          </MailchimpConnectionGuard>,
        );

        expect(
          screen.getByText(/Connect your Mailchimp account/i),
        ).toBeInTheDocument();
        expect(screen.queryByText("Should not render")).not.toBeInTheDocument();

        unmount();
      });
    });
  });

  describe("OAuth callback handling", () => {
    it("shows OAuth error banner when oauthError is provided", () => {
      render(
        <MailchimpConnectionGuard
          errorCode="MAILCHIMP_NOT_CONNECTED"
          oauthError="OAuth failed: Invalid state"
        >
          <div>Should not render</div>
        </MailchimpConnectionGuard>,
      );

      // The banner should show "Connection failed" and the errorCode
      expect(screen.getByText(/Connection failed/i)).toBeInTheDocument();
      expect(screen.getByText(/MAILCHIMP_NOT_CONNECTED/i)).toBeInTheDocument();
    });

    it("prioritizes errorCode over oauthError when both present", () => {
      render(
        <MailchimpConnectionGuard
          errorCode="MAILCHIMP_TOKEN_EXPIRED"
          oauthError="OAuth error"
        >
          <div>Should not render</div>
        </MailchimpConnectionGuard>,
      );

      // Should show errorCode in empty state
      expect(screen.getByText(/MAILCHIMP_TOKEN_EXPIRED/i)).toBeInTheDocument();
    });
  });

  describe("Pure UI behavior", () => {
    it("is a synchronous function (not async)", () => {
      // The component should be a regular function, not async
      expect(MailchimpConnectionGuard.constructor.name).toBe("Function");
      expect(MailchimpConnectionGuard.toString().includes("async")).toBe(false);
    });

    it("does not perform any validation logic internally", () => {
      // Component should not import or use validateMailchimpConnection
      const componentSource = MailchimpConnectionGuard.toString();
      expect(componentSource).not.toContain("validateMailchimpConnection");
      expect(componentSource).not.toContain("await");
    });
  });

  // Accessibility tests
  describe("Accessibility", () => {
    it("should not have accessibility violations when showing valid content", async () => {
      const { renderResult } = await renderWithA11y(
        <MailchimpConnectionGuard>
          <main>
            <h1>Dashboard Content</h1>
          </main>
        </MailchimpConnectionGuard>,
      );
      await expectNoA11yViolations(renderResult.container);
    });

    it("should not have accessibility violations when showing empty state", async () => {
      const { renderResult } = await renderWithA11y(
        <MailchimpConnectionGuard errorCode="MAILCHIMP_NOT_CONNECTED">
          <div>Should not render</div>
        </MailchimpConnectionGuard>,
      );
      await expectNoA11yViolations(renderResult.container);
    });

    it("should not have accessibility violations with OAuth success banner", async () => {
      const { renderResult } = await renderWithA11y(
        <MailchimpConnectionGuard connected={true}>
          <main>
            <h1>Dashboard Content</h1>
          </main>
        </MailchimpConnectionGuard>,
      );
      await expectNoA11yViolations(renderResult.container);
    });

    it("should not have accessibility violations with OAuth error banner", async () => {
      const { renderResult } = await renderWithA11y(
        <MailchimpConnectionGuard
          errorCode="MAILCHIMP_NOT_CONNECTED"
          oauthError="Connection failed"
        >
          <div>Should not render</div>
        </MailchimpConnectionGuard>,
      );
      await expectNoA11yViolations(renderResult.container);
    });
  });
});
