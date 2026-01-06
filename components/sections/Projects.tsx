"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MergedProject } from "@/lib/projects";
import { fadeInUp, staggerContainer } from "@/components/motion/variants";
import { Github, ExternalLink, Star, GitFork, X, ArrowRight } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export type ProjectsSectionProps = {
  projects: MergedProject[];
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selected, setSelected] = useState<MergedProject | null>(null);

  return (
    <section id="projects" className="section-shell section-spacing">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="space-y-8"
      >
        <motion.div
          variants={fadeInUp}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="space-y-3">
            <p className="heading-subtle">Featured Projects</p>
            <h2 className="heading-main">Applied AI, full stack, and research tooling.</h2>
            <p className="max-w-xl text-sm leading-6 text-zinc-400">
              Pulled live from GitHub, then curated so the top projects reflect
              what I&apos;m actually proud of—especially AI systems, RAG pipelines,
              and research tools.
            </p>
          </div>
          <Link
            href="/projects"
            className="focus-ring group inline-flex flex-col items-start rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-3 text-xs text-cyan-100 shadow-[0_18px_45px_rgba(8,47,73,0.6)] transition hover:bg-cyan-500/15 hover:shadow-[0_22px_55px_rgba(8,47,73,0.9)]"
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium">
              Enter Project Library
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
            <span className="mt-0.5 text-[0.7rem] text-cyan-200/80">
              Browse all projects
            </span>
          </Link>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {projects.map((project) => (
            <motion.button
              key={project.slug}
              layoutId={project.slug}
              onClick={() => setSelected(project)}
              className={cn(
                "glass-panel flex h-full flex-col items-stretch text-left",
                "cursor-pointer p-4 text-sm text-zinc-200 transition",
              )}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-medium text-zinc-50">
                    {project.title}
                  </h3>
                  {project.repoFullName && (
                    <p className="mt-0.5 text-[0.7rem] text-zinc-500">
                      {project.repoFullName}
                    </p>
                  )}
                </div>
                {project.stars != null && (
                  <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-[0.7rem] text-zinc-300">
                    <Star className="h-3 w-3 text-yellow-300" />
                    <span>{project.stars}</span>
                    {project.forks != null && (
                      <>
                        <span className="mx-1 h-3 w-px bg-white/10" />
                        <GitFork className="h-3 w-3" />
                        <span>{project.forks}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              <p className="mt-3 line-clamp-3 text-xs leading-5 text-zinc-300">
                {project.problem ?? project.description}
              </p>
              {project.techStack && (
                <div className="mt-3 flex flex-wrap gap-1.5 text-[0.65rem] text-zinc-300">
                  {project.techStack.map((t) => (
                    <span
                      key={t}
                      className="chip border-white/15 bg-black/40 px-2 py-0.5 text-[0.65rem]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex items-center justify-between text-[0.7rem] text-zinc-500">
                {project.lastUpdated && (
                  <span>
                    Updated {formatDate(project.lastUpdated)}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-cyan-300">
                  View details
                  <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-10 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId={selected.slug}
              className="glass-panel relative max-h-[80vh] w-full max-w-3xl overflow-y-auto p-6 text-sm text-zinc-200"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <button
                onClick={() => setSelected(null)}
                className="focus-ring absolute right-3 top-3 rounded-full border border-white/10 bg-black/60 p-1 text-zinc-400 hover:text-zinc-100"
                aria-label="Close project details"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-2 pr-7">
                <p className="heading-subtle">Project</p>
                <h2 className="heading-main text-[1.5rem]">
                  {selected.title}
                </h2>
                {selected.repoFullName && (
                  <p className="text-[0.8rem] text-zinc-500">
                    {selected.repoFullName}
                  </p>
                )}
                {selected.lastUpdated && (
                  <p className="text-[0.75rem] text-zinc-500">
                    Last updated {formatDate(selected.lastUpdated)}
                  </p>
                )}
              </div>

              <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                <div className="space-y-4 text-sm text-zinc-200">
                  {selected.problem && (
                    <div>
                      <p className="text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">
                        Problem
                      </p>
                      <p className="mt-1 text-xs leading-6 text-zinc-200">
                        {selected.problem}
                      </p>
                    </div>
                  )}
                  {selected.solution && (
                    <div>
                      <p className="text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">
                        Solution
                      </p>
                      <p className="mt-1 text-xs leading-6 text-zinc-200">
                        {selected.solution}
                      </p>
                    </div>
                  )}
                  {selected.impact && selected.impact.length > 0 && (
                    <div>
                      <p className="text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">
                        Impact
                      </p>
                      <ul className="mt-1 space-y-1 text-xs leading-5 text-zinc-200">
                        {selected.impact.map((line) => (
                          <li key={line}>• {line}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="space-y-3 text-xs text-zinc-200">
                  {selected.screenshots && selected.screenshots.length > 0 && (
                    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
                      <Image
                        src={selected.screenshots[0]!.src}
                        alt={selected.screenshots[0]!.alt}
                        width={640}
                        height={360}
                        className="h-40 w-full object-cover"
                      />
                    </div>
                  )}
                  {selected.techStack && (
                    <div>
                      <p className="text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">
                        Tech
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {selected.techStack.map((t) => (
                          <span
                            key={t}
                            className="chip border-white/20 bg-black/50 px-2 py-0.5 text-[0.65rem]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selected.githubUrl && (
                      <a
                        href={selected.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[0.75rem] text-zinc-100 hover:border-cyan-400/60 hover:text-cyan-200"
                      >
                        <Github className="h-3.5 w-3.5" />
                        View repo
                      </a>
                    )}
                    {selected.liveUrl && (
                      <a
                        href={selected.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-cyan-400/60 bg-cyan-500/20 px-3 py-1.5 text-[0.75rem] text-cyan-200 hover:bg-cyan-500/30"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Live demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
