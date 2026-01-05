export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  homepage?: string | null;
  pushed_at: string;
};

export type NormalizedProject = {
  id: number;
  name: string;
  fullName: string;
  url: string;
  description: string;
  homepage?: string;
  stars: number;
  forks: number;
  language?: string;
  topics: string[];
  lastPushedAt: string;
};

const GITHUB_USER = "AreebEhsan";

export async function fetchGitHubRepos(): Promise<NormalizedProject[]> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`,
    {
      headers,
      // Revalidate every 6 hours
      next: { revalidate: 60 * 60 * 6 },
    },
  );

  if (!res.ok) {
    console.error("Failed to fetch GitHub repos", res.status, await res.text());
    return [];
  }

  const data = (await res.json()) as GitHubRepo[];

  return data.map((repo) => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    url: repo.html_url,
    description: repo.description ?? "No description provided.",
    homepage: repo.homepage ?? undefined,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language ?? undefined,
    topics: repo.topics ?? [],
    lastPushedAt: repo.pushed_at,
  }));
}

export type ProjectScore = {
  project: NormalizedProject;
  score: number;
};

const KEYWORD_BOOSTS = [
  "ai",
  "ml",
  "rag",
  "llm",
  "agent",
  "langchain",
  "security",
  "spring",
  "extension",
  "chrome",
  "hackgt",
];

export function scoreProjects(projects: NormalizedProject[]): ProjectScore[] {
  const now = Date.now();

  return projects.map((p) => {
    const stars = p.stars;
    const forks = p.forks;

    const pushedTime = new Date(p.lastPushedAt).getTime();
    const daysSinceUpdate = Math.max(1, (now - pushedTime) / (1000 * 60 * 60 * 24));
    const recencyScore = 100 / daysSinceUpdate; // recent repos score higher

    const haystack = `${p.name} ${p.description} ${p.topics.join(" ")}`.toLowerCase();
    let keywordScore = 0;
    for (const kw of KEYWORD_BOOSTS) {
      if (haystack.includes(kw)) keywordScore += 10;
    }

    const score = stars * 3 + forks * 2 + recencyScore * 5 + keywordScore;

    return { project: p, score };
  });
}
