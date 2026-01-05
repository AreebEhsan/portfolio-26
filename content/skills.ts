export type Skill = {
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  tags?: string[];
};

export type SkillGroup = {
  id: "languages" | "frameworks" | "tools" | "libraries";
  label: string;
  skills: Skill[];
};

export type SkillFilter = {
  id: "all" | "ai-ml" | "full-stack" | "cybersecurity" | "research";
  label: string;
};

export const skillFilters: SkillFilter[] = [
  { id: "all", label: "All" },
  { id: "ai-ml", label: "AI / ML" },
  { id: "full-stack", label: "Full Stack" },
  { id: "cybersecurity", label: "Cybersecurity" },
  { id: "research", label: "Research" },
];

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    skills: [
      { name: "Python", level: "expert", tags: ["ai-ml", "full-stack", "research"] },
      { name: "TypeScript", level: "advanced", tags: ["full-stack"] },
      { name: "Java", level: "advanced", tags: ["full-stack"] },
      { name: "C/C++", level: "intermediate", tags: ["systems", "research"] },
      { name: "SQL", level: "advanced", tags: ["full-stack", "ai-ml"] },
    ],
  },
  {
    id: "frameworks",
    label: "Frameworks",
    skills: [
      { name: "Next.js", level: "advanced", tags: ["full-stack"] },
      { name: "React", level: "advanced", tags: ["full-stack"] },
      { name: "Spring Boot", level: "intermediate", tags: ["full-stack"] },
      { name: "Node.js / Express", level: "advanced", tags: ["full-stack"] },
      { name: "LangChain", level: "advanced", tags: ["ai-ml"] },
      { name: "Streamlit", level: "advanced", tags: ["ai-ml"] },
      { name: "FastAPI / Flask", level: "intermediate", tags: ["ai-ml", "full-stack"] },
    ],
  },
  {
    id: "libraries",
    label: "Libraries",
    skills: [
      { name: "PyTorch / TensorFlow", level: "intermediate", tags: ["ai-ml"] },
      { name: "scikit-learn", level: "advanced", tags: ["ai-ml"] },
      { name: "FAISS / Chroma", level: "advanced", tags: ["ai-ml"] },
      { name: "Framer Motion", level: "advanced", tags: ["full-stack"] },
      { name: "Tailwind CSS", level: "advanced", tags: ["full-stack"] },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    skills: [
      { name: "Git & GitHub", level: "advanced", tags: ["full-stack", "research"] },
      { name: "Linux", level: "advanced", tags: ["full-stack", "cybersecurity"] },
      { name: "Docker", level: "intermediate", tags: ["full-stack", "ai-ml"] },
      { name: "Postman / Insomnia", level: "advanced", tags: ["full-stack"] },
      { name: "VS Code", level: "advanced", tags: ["full-stack", "research"] },
      { name: "Security tooling", level: "intermediate", tags: ["cybersecurity"] },
    ],
  },
];
