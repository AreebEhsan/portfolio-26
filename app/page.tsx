import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { CertificationsSection } from "@/components/sections/Certifications";
import { NowSection } from "@/components/sections/Now";
import { Contact } from "@/components/sections/Contact";
import { ProjectsSection } from "@/components/sections/Projects";
import { fetchGitHubRepos } from "@/lib/github";
import { mergeFeaturedProjects } from "@/lib/projects";

export const revalidate = 60 * 60 * 6; // 6 hours

export default async function HomePage() {
  const repos = await fetchGitHubRepos();
  const projects = mergeFeaturedProjects(repos, 8);

  return (
    <main className="flex flex-col gap-4 pb-16 pt-6">
      <Hero />
      <About />
      <Skills />
      <ProjectsSection projects={projects} />
      <Experience />
      <CertificationsSection />
      <NowSection />
      <Contact />
    </main>
  );
}
