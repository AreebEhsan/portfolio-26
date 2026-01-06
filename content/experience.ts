export type TimelineItem = {
  id: string;
  title: string;
  organization: string;
  location?: string;
  start: string; // e.g., "Aug 2024"
  end: string; // e.g., "Present" or "May 2026"
  type: "education" | "experience";
  highlights: string[];
};

export const timeline: TimelineItem[] = [
  {
    id: "gsu-bs-cs",
    title: "B.S. Computer Science, Data Science Certificate",
    organization: "Georgia State University",
    location: "Atlanta, GA",
    start: "Aug 2022",
    end: "May 2026",
    type: "education",
    highlights: [
      "GPA: 3.93",
      "Data Science certificate with strong grounding in statistics and machine learning.",
      "Coursework spanning algorithms, systems, AI/ML, and security.",
    ],
  },
  {
    id: "codepath-emerging-engineer",
    title: "Emerging Engineer Empowerment Scholar",
    organization: "CodePath",
    location: "Remote",
    start: "Aug 2024",
    end: "Present",
    type: "experience",
    highlights: [
      "Selected for CodePath's Emerging Engineer Empowerment Scholar program.",
      "Focused on deepening full-stack engineering and professional development.",
    ],
  },
  // TODO: Add internships, research roles, and other experience entries here.
];
