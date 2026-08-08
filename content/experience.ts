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
    id: "uiuc-mcs",
    title: "M.C.S. Computer Science",
    organization: "University of Illinois Urbana-Champaign",
    location: "Urbana-Champaign, IL",
    start: "Aug 2026",
    end: "May 2028",
    type: "education",
    highlights: [
      "Siebel School of Computing and Data Science.",
      "Focusing on advanced computing, systems, and intelligent data pipelines.",
    ],
  },
  {
    id: "gsu-bs-cs",
    title: "B.S. Computer Science, Data Science Certificate",
    organization: "Georgia State University",
    location: "Atlanta, GA",
    start: "Aug 2022",
    end: "May 2026",
    type: "education",
    highlights: [
      "GPA: 3.96 | Summa Cum Laude | Distinction in Major",
      "Data Science certificate with strong grounding in statistics and machine learning.",
      "Coursework spanning algorithms, systems, AI/ML, and security.",
    ],
  },
  {
    id: "codepath-open-source-ai",
    title: "Open Source Contributor, Applied AI Capstone (AI301)",
    organization: "CodePath × Anthropic",
    location: "Remote",
    start: "Jun 2026",
    end: "Present",
    type: "experience",
    highlights: [
      "Contributed merged PRs to production open-source repositories as part of CodePath's capstone tier developed with Anthropic.",
      "Fixed live defect in graphql-hive/console (PR #8166): traced root cause across TypeScript modules, authored unit tests, and resolved CI feedback.",
      "Added Claude support across traceroot-ai/traceroot observability platform, updating system configs, pricing metadata, and test suites.",
    ],
  },
  {
    id: "ai-virtual-biopsies-research",
    title: "AI Research & Publication (Solo-authored)",
    organization: "arXiv:2512.22184",
    location: "Remote",
    start: "Dec 2025",
    end: "Dec 2025",
    type: "experience",
    highlights: [
      "Published 'AI-Enhanced Virtual Biopsies for Brain Tumor Diagnosis' evaluating multi-class classification in low-resource clinical settings.",
      "Built late-fusion pipeline combining MobileNetV2 embeddings with GLCM radiomics features, boosting accuracy from 85.0% to 95.1%.",
      "Designed robustness testing under resolution degradation and noise, analyzing interpretability via Grad-CAM and feature importance.",
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
];