"use client";

import { siteConfig } from "@/content/siteConfig";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";

export function AnalyticsShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {siteConfig.analytics.provider === "vercel" && <VercelAnalytics />}
      {/* If you want Plausible, add a <Script> tag here and switch provider to "plausible". */}
    </>
  );
}
