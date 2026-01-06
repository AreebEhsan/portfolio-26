import { featuredProjectOverrides } from "@/content/featuredProjects";
import { projectOverrides } from "@/content/projectsOverrides";
import type { NormalizedProject } from "@/lib/github";

export type MergedProject = {
  slug: string;
  title: string;
  repoFullName?: string;
  githubUrl?: string;
  liveUrl?: string;
  description: string;
  problem?: string;
  solution?: string;
  impact?: string[];
  techStack?: string[];
  highlightTags?: string[];
  stars?: number;
  forks?: number;
  lastUpdated?: string;
  screenshots?: { src: string; alt: string }[];
};

export function mergeFeaturedProjects(
  projects: NormalizedProject[],
  limit = 8,
): MergedProject[] {
  const byFullName = new Map(projects.map((p) => [p.fullName.toLowerCase(), p]));

  const merged: MergedProject[] = [];

  for (const override of featuredProjectOverrides) {
    const repo = override.repo?.toLowerCase();
    const match = repo ? byFullName.get(repo) : undefined;

    merged.push({
      slug: override.slug,
      title: override.title,
      repoFullName: match?.fullName ?? override.repo,
      githubUrl: match?.url,
      liveUrl: match?.homepage,
      description: match?.description ?? "", // will be supplemented in UI
      problem: override.problem,
      solution: override.solution,
      impact: override.impact,
      techStack: override.techStack,
      highlightTags: override.highlightTags,
      stars: match?.stars,
      forks: match?.forks,
      lastUpdated: match?.lastPushedAt,
      screenshots: override.screenshots,
    });

    if (match) {
      byFullName.delete(match.fullName.toLowerCase());
    }
  }

  // Fill remaining slots with top-scoring non-featured repos (by stars + recency)
  const remaining = Array.from(byFullName.values())
    .sort((a, b) => {
      const aStars = a.stars ?? 0;
      const bStars = b.stars ?? 0;
      const aDate = new Date(a.lastPushedAt).getTime();
      const bDate = new Date(b.lastPushedAt).getTime();
      return bStars - aStars || bDate - aDate;
    })
    .slice(0, Math.max(0, limit - merged.length));

  for (const p of remaining) {
    merged.push({
      slug: p.name,
      title: p.name,
      repoFullName: p.fullName,
      githubUrl: p.url,
      liveUrl: p.homepage,
      description: p.description,
      techStack: p.language ? [p.language] : undefined,
      stars: p.stars,
      forks: p.forks,
      lastUpdated: p.lastPushedAt,
      highlightTags: p.topics,
    });
  }

  return merged.slice(0, limit);
}

export type LibraryProject = NormalizedProject & {
  slug: string;
  featured?: boolean;
  priority?: number;
  hidden?: boolean;
  tags: string[];
  summary?: string;
};

export function buildProjectLibrary(projects: NormalizedProject[]): LibraryProject[] {
  const overridesByRepo = new Map(
    projectOverrides.map((o) => [o.repo.toLowerCase(), o]),
  );

  const merged: LibraryProject[] = [];

  for (const project of projects) {
    const override = overridesByRepo.get(project.fullName.toLowerCase());
    if (override?.hide) continue;

    const tagsSet = new Set<string>();
    if (project.language) tagsSet.add(project.language);
    for (const topic of project.topics) tagsSet.add(topic);
    if (override?.tags) {
      for (const t of override.tags) tagsSet.add(t);
    }

    merged.push({
      ...project,
      slug: override?.slug ?? project.name,
      featured: override?.featured,
      priority: override?.priority,
      hidden: override?.hide,
      summary: override?.summary,
      tags: Array.from(tagsSet),
    });
  }

  return merged;
}
