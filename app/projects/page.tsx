import { ProjectsLibrary } from "@/components/projects/ProjectsLibrary";
import { fetchGitHubRepos } from "@/lib/github";
import { buildProjectLibrary } from "@/lib/projects";

export const revalidate = 21600; // 6 hours

export default async function ProjectsPage() {
  const repos = await fetchGitHubRepos();
  const projects = buildProjectLibrary(repos);

  return (
    <main className="flex flex-col gap-4 pb-16 pt-6">
      <ProjectsLibrary projects={projects} />
    </main>
  );
}
