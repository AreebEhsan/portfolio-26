"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LibraryProject } from "@/lib/projects";
import { fadeInUp, staggerContainer, hoverLift } from "@/components/motion/variants";
import { cn, formatDate } from "@/lib/utils";
import { useBackdropDismiss, useDialog } from "@/components/hooks/useDialog";
import { ExternalLink, Github, Star, GitFork, X, Filter } from "lucide-react";

export type ProjectsLibraryProps = {
  projects: LibraryProject[];
};

type SortOption = "curated" | "stars" | "recent" | "az";

export function ProjectsLibrary({ projects }: ProjectsLibraryProps) {
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState<string>("all");
  const [tag, setTag] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("curated");
  const [showArchived, setShowArchived] = useState(false);
  const [selected, setSelected] = useState<LibraryProject | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const close = () => setSelected(null);
  const backdropProps = useBackdropDismiss(close);
  useDialog({ open: selected !== null, onClose: close, containerRef: dialogRef });

  const languages = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) {
      if (p.language) set.add(p.language);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) {
      for (const t of p.tags) set.add(t);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    let result = projects.filter((p) => {
      if (!showArchived && p.archived) return false;
      if (language !== "all" && p.language !== language) return false;
      if (tag !== "all" && !p.tags.includes(tag)) return false;

      if (!q) return true;
      const haystack = `${p.name} ${p.description} ${p.summary ?? ""} ${p.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });

    result = sortProjects(result, sortBy);
    return result;
  }, [projects, search, language, tag, sortBy, showArchived]);

  return (
    <section className="section-shell section-spacing">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.div variants={fadeInUp} className="space-y-3">
          <p className="heading-subtle">Projects Library</p>
          <h1 className="heading-main">Explore all GitHub projects.</h1>
          <p className="max-w-2xl text-sm leading-6 text-zinc-400">
            A searchable library of everything I&apos;ve shipped publicly—from small
            experiments to production-style systems.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="glass-panel flex flex-col gap-3 p-4 text-xs text-zinc-200 md:flex-row md:items-end md:justify-between"
        >
          <div className="flex flex-1 flex-col gap-2 md:max-w-md">
            <label className="text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">
              Search
            </label>
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, description, or tags"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/70"
              />
              <Filter className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            </div>
          </div>

          <div className="grid flex-1 gap-3 md:grid-cols-3">
            <div className="space-y-1">
              <label className="text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-zinc-100 transition-colors duration-200 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 [&>option]:bg-slate-950 [&>option]:text-zinc-100"
              >
                <option value="all">All</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">
                Tag
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-zinc-100 transition-colors duration-200 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 [&>option]:bg-slate-950 [&>option]:text-zinc-100"
              >
                <option value="all">All</option>
                {tags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-zinc-100 transition-colors duration-200 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 [&>option]:bg-slate-950 [&>option]:text-zinc-100"
              >
                <option value="curated">Featured & popularity</option>
                <option value="stars">Most starred</option>
                <option value="recent">Recently updated</option>
                <option value="az">A–Z</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 md:pt-0">
            <input
              id="show-archived"
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className="h-3 w-3 rounded border-white/20 bg-black/60 text-cyan-500 focus:ring-cyan-500/70"
            />
            <label
              htmlFor="show-archived"
              className="text-[0.7rem] text-zinc-400"
            >
              Show archived
            </label>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="min-h-[200px] space-y-4">
          <p
            className="text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500"
            aria-live="polite"
          >
            {filtered.length} of {projects.length}{" "}
            {projects.length === 1 ? "project" : "projects"}
          </p>
          {filtered.length === 0 ? (
            <div className="glass-panel flex flex-col items-center justify-center gap-2 p-8 text-sm text-zinc-400">
              <p>No projects match your filters.</p>
              <p className="text-xs text-zinc-500">
                Try clearing the search or resetting filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((project) => (
                <motion.button
                  key={project.id}
                  type="button"
                  layoutId={project.slug}
                  className={cn(
                    "glass-panel panel-interactive flex h-full flex-col items-stretch text-left",
                    "cursor-pointer p-4 text-sm text-zinc-200",
                  )}
                  initial="rest"
                  animate="rest"
                  whileHover="hover"
                  variants={hoverLift}
                  onClick={() => setSelected(project)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-medium text-zinc-50">
                        {getDisplayTitle(project)}
                      </h3>
                      <p className="mt-0.5 text-[0.7rem] text-zinc-500">
                        {project.fullName}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-[0.7rem] text-zinc-400">
                      {project.stars > 0 && (
                        <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2 py-0.5">
                          <Star className="h-3 w-3 text-yellow-300" />
                          <span>{project.stars}</span>
                          {project.forks > 0 && (
                            <>
                              <span className="mx-1 h-3 w-px bg-white/10" />
                              <GitFork className="h-3 w-3" />
                              <span>{project.forks}</span>
                            </>
                          )}
                        </div>
                      )}
                      <span className="text-[0.65rem] text-zinc-500">
                        Updated {formatDate(project.lastPushedAt)}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-3 text-xs leading-5 text-zinc-300">
                    {project.summary ?? project.description}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-1.5 pt-3 text-[0.65rem] text-zinc-300">
                    {project.language && (
                      <span className="chip border-white/15 bg-black/40 px-2 py-0.5">
                        {project.language}
                      </span>
                    )}
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="chip border-white/15 bg-black/40 px-2 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-10 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
            {...backdropProps}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={getDisplayTitle(selected)}
              layoutId={selected.slug}
              className="glass-panel relative max-h-[85vh] w-full max-w-3xl overflow-y-auto overscroll-contain p-6 text-sm text-zinc-200"
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              <button
                onClick={close}
                className="focus-ring absolute right-3 top-3 rounded-full border border-white/10 bg-black/60 p-1.5 text-zinc-400 transition-colors duration-200 hover:border-white/25 hover:text-zinc-100"
                aria-label="Close project details"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-2 pr-7">
                <p className="heading-subtle">Project</p>
                <h2 className="heading-main text-[1.5rem]">
                  {getDisplayTitle(selected)}
                </h2>
                <p className="text-[0.8rem] text-zinc-500">
                  {selected.fullName}
                </p>
                <p className="text-[0.75rem] text-zinc-500">
                  Last updated {formatDate(selected.lastPushedAt)}
                </p>
              </div>

              <div className="mt-4 space-y-4 text-xs leading-6 text-zinc-200">
                <p>{selected.summary ?? selected.description}</p>

                {selected.tags.length > 0 && (
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">
                      Tags
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {selected.tags.map((t) => (
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

                <div className="mt-2 flex flex-wrap gap-2">
                  <a
                    href={selected.url}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[0.75rem] text-zinc-100 hover:border-cyan-400/60 hover:text-cyan-200"
                  >
                    <Github className="h-3.5 w-3.5" />
                    View repo
                  </a>
                  {selected.homepage && (
                    <a
                      href={selected.homepage}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function getDisplayTitle(project: LibraryProject) {
  return project.summary ? project.summary.split(".")[0] ?? project.name : project.name;
}

function sortProjects(projects: LibraryProject[], sortBy: SortOption): LibraryProject[] {
  const copy = [...projects];
  switch (sortBy) {
    case "stars":
      copy.sort((a, b) => b.stars - a.stars || compareDateDesc(a, b));
      break;
    case "recent":
      copy.sort(compareDateDesc);
      break;
    case "az":
      copy.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "curated":
    default:
      copy.sort((a, b) => {
        const aFeat = a.featured ? 1 : 0;
        const bFeat = b.featured ? 1 : 0;
        if (aFeat !== bFeat) return bFeat - aFeat;

        const aPriority = a.priority ?? Number.POSITIVE_INFINITY;
        const bPriority = b.priority ?? Number.POSITIVE_INFINITY;
        if (aPriority !== bPriority) return aPriority - bPriority;

        if (a.stars !== b.stars) return b.stars - a.stars;
        return compareDateDesc(a, b);
      });
      break;
  }
  return copy;
}

function compareDateDesc(a: LibraryProject, b: LibraryProject) {
  const aDate = new Date(a.lastPushedAt).getTime();
  const bDate = new Date(b.lastPushedAt).getTime();
  return bDate - aDate;
}
