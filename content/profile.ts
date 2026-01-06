export type SocialLink = {
  type: "github" | "linkedin" | "email";
  label: string;
  href: string;
};

export type Profile = {
  name: string;
  headline: string;
  roles: string[];
  subheadline: string;
  location?: string;
  quickFacts: { label: string; value: string }[];
  now: string;
  social: SocialLink[];
  email: string;
  resumeUrl: string; // can be a public URL or /files/resume.pdf
};

export const profile: Profile = {
  name: "Areeb Ehsan",
  headline: "Engineer crafting practical AI systems and polished user experiences.",
  roles: ["Full-Stack Engineer", "AI/ML", "Cybersecurity", "Research"],
  subheadline:
    "CS @ Georgia State (’26) focusing on RAG pipelines, agentic workflows, and production-style software.",
  location: "Atlanta, GA, USA",
  quickFacts: [
    { label: "Education", value: "B.S. Computer Science, Georgia State University" },
    { label: "Graduation", value: "May 2026" },
    { label: "GPA", value: "3.93" },
    { label: "Interests", value: "Applied AI, security, research, developer experience" },
  ],
  now: "Designing robust RAG/LLM systems, exploring agentic workflows, and sharpening full-stack fundamentals.",
  email: "mailto:areebehsan16@gmail.com",
  resumeUrl: "/files/areeb-ehsan-resume.pdf", // put your exported resume in public/files
  social: [
    {
      type: "github",
      label: "GitHub",
      href: "https://github.com/AreebEhsan",
    },
    {
      type: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/areebehsan/?profileId=ACoAAD-0wQsBapt-cG4P5y1_1BU0B9RSm8nEqjM",
    },
    {
      type: "email",
      label: "Email",
      href: "mailto:areebehsan16@gmail.com?subject=Hey%20Areeb%20%E2%80%94%20let%27s%20chat",
    },
  ],
};
