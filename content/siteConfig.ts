export type AnalyticsProvider = "none" | "vercel" | "plausible";

export const siteConfig = {
  name: "Areeb Ehsan — Portfolio",
  titleTemplate: "%s | Areeb Ehsan",
  description:
    "Portfolio of Areeb Ehsan, a full-stack and AI/ML engineer building practical AI systems, RAG pipelines, and production-style software.",
  url: "https://your-domain.com", // TODO: update to your real domain
  ogImage: "/og.png", // TODO: replace with a real OG image
  analytics: {
    provider: "vercel" as AnalyticsProvider,
    plausibleDomain: "your-domain.com", // used only if provider === "plausible"
  },
  nav: [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "now", label: "Now" },
    { id: "contact", label: "Contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
