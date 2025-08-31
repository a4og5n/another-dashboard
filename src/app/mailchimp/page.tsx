import { Suspense } from "react";
import { MailchimpDashboard } from "./mailchimp-dashboard";

export default function MailchimpPage() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <MailchimpDashboard />
    </Suspense>
  );
}
