"use client";

import { siteConfig } from "@/content/siteConfig";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { MotionConfig } from "framer-motion";

export function AnalyticsShell({ children }: { children: React.ReactNode }) {
  return (
    // `reducedMotion="user"` makes every framer-motion animation on the site
    // honour the OS "reduce motion" setting: transforms are dropped, opacity
    // cross-fades are kept, so nothing ever fails to appear.
    <MotionConfig reducedMotion="user">
      {children}
      {siteConfig.analytics.provider === "vercel" && <VercelAnalytics />}
      {/* If you want Plausible, add a <Script> tag here and switch provider to "plausible". */}
    </MotionConfig>
  );
}
