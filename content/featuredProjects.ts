export type FeaturedProjectOverride = {
  slug: string;
  title: string;
  // GitHub repo in the form "owner/name"; used to merge with live data.
  repo?: string;
  // Manual priority for sorting; lower is more prominent.
  priority?: number;
  highlightTags?: string[];
  problem?: string;
  solution?: string;
  impact?: string[];
  techStack?: string[];
  screenshots?: { src: string; alt: string }[];
};

export const featuredProjectOverrides: FeaturedProjectOverride[] = [
  {
    slug: "research-assistant-extension",
    title: "Research Assistant Extension",
    repo: "AreebEhsan/research-assistant-extension", // TODO: update to the actual repo name if different
    priority: 1,
    highlightTags: ["Full Stack", "AI/ML", "Chrome Extension"],
    problem:
      "Manually searching, summarizing, and organizing academic papers is slow and brittle.",
    solution:
      "A Spring Boot backend exposing Gemini-powered endpoints, paired with a Chrome extension that lets you highlight content, ask questions, and capture structured notes directly from the browser.",
    impact: [
      "Streamlined research workflows for quickly distilling long-form technical content.",
      "Demonstrates production-style backend design with clean APIs and browser integration.",
    ],
    techStack: ["Spring Boot", "Gemini", "Chrome Extension", "REST APIs"],
    screenshots: [
      {
        src: "/images/projects/research-assistant-1.png",
        alt: "Research assistant extension UI overlaying an article",
      },
    ],
  },
  {
    slug: "rag-llm-applications",
    title: "RAG-LLM Applications",
    repo: "AreebEhsan/rag-llm-applications", // TODO: update to actual repo if needed
    priority: 2,
    highlightTags: ["AI/ML", "RAG", "LLM"],
    problem:
      "General-purpose LLMs hallucinate and cannot reliably answer domain-specific questions without context.",
    solution:
      "A suite of RAG pipelines using LangChain and vector stores (FAISS/Chroma) exposed via Streamlit apps for interactive querying over custom corpora.",
    impact: [
      "Showcases end-to-end RAG design, from ingestion and chunking to retrieval and generation.",
      "Explores trade-offs between different embedding models, chunking strategies, and vector backends.",
    ],
    techStack: ["Python", "LangChain", "FAISS", "Chroma", "Streamlit"],
    screenshots: [
      {
        src: "/images/projects/rag-llm-1.png",
        alt: "Streamlit dashboard for a RAG-LLM application",
      },
    ],
  },
  {
    slug: "trace-ai",
    title: "Trace.ai (HackGT)",
    repo: "AreebEhsan/trace-ai", // TODO: update to actual repo if needed
    priority: 3,
    highlightTags: ["Hackathon", "Computer Vision", "DTW"],
    problem:
      "It is hard to get structured, real-time feedback on physical movements (e.g., exercises, gestures) without expensive hardware.",
    solution:
      "A pose-based recognition system using keypoint extraction and Dynamic Time Warping (DTW) to compare user movements against reference traces.",
    impact: [
      "Built under hackathon constraints, demonstrating rapid prototyping and applied ML.",
      "Highlights an interest in human-computer interaction and applied computer vision.",
    ],
    techStack: ["Python", "OpenCV", "Pose Estimation", "DTW"],
    screenshots: [
      {
        src: "/images/projects/trace-ai-1.png",
        alt: "Trace.ai interface showing pose traces and similarity scores",
      },
    ],
  },
  // You can add more manual feature overrides here.
];
