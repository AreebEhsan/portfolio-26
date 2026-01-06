export type ProjectOverride = {
  // GitHub repo in the form "owner/name"
  repo: string;
  // Optional stable slug used for URLs and motion layout IDs
  slug?: string;
  // If true, prioritized in the library sort and can be surfaced as featured
  featured?: boolean;
  // Lower numbers appear earlier among featured projects
  priority?: number;
  // Optional custom title and summary to override GitHub defaults
  title?: string;
  summary?: string;
  // Additional tags beyond GitHub topics/language (e.g., "RAG", "Hackathon")
  tags?: string[];
  // Hide this repo from the public library even if it exists on GitHub
  hide?: boolean;
};

export const projectOverrides: ProjectOverride[] = [
  {
    repo: "AreebEhsan/research-assistant-extension",
    slug: "research-assistant-extension",
    featured: true,
    priority: 1,
    title: "Research Assistant Extension",
    summary:
      "Spring Boot + Chrome extension that turns any web page into an interactive research surface with Gemini-backed summarization and note-taking.",
    tags: ["AI/ML", "Chrome Extension", "Spring Boot", "Gemini"],
  },
  {
    repo: "AreebEhsan/rag-llm-applications",
    slug: "rag-llm-applications",
    featured: true,
    priority: 2,
    title: "RAG-LLM Applications",
    summary:
      "A suite of retrieval-augmented generation demos exploring chunking strategies, vector stores, and LLM configs over custom datasets.",
    tags: ["AI/ML", "RAG", "LangChain", "Vector Search"],
  },
  {
    repo: "AreebEhsan/trace-ai",
    slug: "trace-ai",
    featured: true,
    priority: 3,
    title: "Trace.ai (HackGT)",
    summary:
      "Hackathon project that uses pose estimation and DTW to compare user motion traces to reference gestures for real-time feedback.",
    tags: ["Hackathon", "Computer Vision", "DTW"],
  },
  // Add more overrides here as you create new repos.
];
