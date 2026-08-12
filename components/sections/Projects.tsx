"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MergedProject } from "@/lib/projects";
import { fadeInUp, staggerContainer } from "@/components/motion/variants";
import { Github, ExternalLink, Star, GitFork, X, ArrowRight } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { useBackdropDismiss, useDialog } from "@/components/hooks/useDialog";
import { buildPosterItems, type PosterItem } from "@/components/projects/projectPoster";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

// Keeps ogl out of the initial bundle and off the server — the gallery is
// WebGL-only and mounts after the capability check passes.
const CircularGallery = dynamic(
  () => import("@/components/projects/CircularGallery"),
  { ssr: false },
);

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// Probing WebGL means creating a real context, so the answer is cached for the
// page. getSnapshot below runs on every render and must stay cheap.
let webglSupport: boolean | null = null;

function supportsWebGL() {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    webglSupport = Boolean(
      canvas.getContext("webgl2") ??
        canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function galleryIsViable() {
  return !window.matchMedia(REDUCED_MOTION_QUERY).matches && supportsWebGL();
}

// Below this width the card renders far smaller on screen, so its face drops the
// description and scales the remaining type up rather than showing text nobody
// can read.
const COMPACT_QUERY = "(max-width: 639px)";

function subscribeToCompact(onChange: () => void) {
  const query = window.matchMedia(COMPACT_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function isCompactViewport() {
  return window.matchMedia(COMPACT_QUERY).matches;
}

export type ProjectsSectionProps = {
  projects: MergedProject[];
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selected, setSelected] = useState<MergedProject | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const close = () => setSelected(null);
  const backdropProps = useBackdropDismiss(close);
  useDialog({ open: selected !== null, onClose: close, containerRef: dialogRef });

  // Server snapshot is `false`, so SSR and hydration both render the grid and
  // the gallery takes over once the client confirms it is viable. Subscribing
  // rather than checking once means toggling the OS motion setting swaps the
  // display live, with no reload.
  const useGallery = useSyncExternalStore(
    subscribeToMotionPreference,
    galleryIsViable,
    () => false,
  );

  const compact = useSyncExternalStore(
    subscribeToCompact,
    isCompactViewport,
    () => false,
  );

  const [posterItems, setPosterItems] = useState<PosterItem[] | null>(null);

  // Card faces are drawn on a canvas, so they can only be built in the browser.
  // Crossing the compact breakpoint redraws them at the other type scale.
  useEffect(() => {
    if (!useGallery) return;
    let alive = true;
    buildPosterItems(projects, { compact }).then((items) => {
      if (alive) setPosterItems(items);
    });
    return () => {
      alive = false;
    };
  }, [useGallery, projects, compact]);

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

        <motion.div variants={fadeInUp}>
          {useGallery ? (
            <ProjectGallery
              projects={projects}
              items={posterItems}
              onOpen={setSelected}
            />
          ) : (
            <ProjectGrid projects={projects} onOpen={setSelected} />
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
              aria-label={selected.title}
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
                        sizes="(min-width: 768px) 320px, 100vw"
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

/**
 * The original card grid, preserved verbatim. It is the fallback whenever the
 * WebGL gallery cannot or should not run: no WebGL context, or the visitor has
 * asked for reduced motion.
 */
function ProjectGrid({
  projects,
  onOpen,
}: {
  projects: MergedProject[];
  onOpen: (project: MergedProject) => void;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <motion.button
          key={project.slug}
          layoutId={project.slug}
          onClick={() => onOpen(project)}
          className={cn(
            "glass-panel panel-interactive group flex h-full flex-col items-stretch text-left",
            "cursor-pointer p-4 text-sm text-zinc-200",
          )}
          whileHover={{ y: -4 }}
          whileTap={{ y: -1 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
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
          {/* mt-auto pins this row to the card bottom so the meta line
              stays aligned across cards of differing description length. */}
          <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-[0.7rem] text-zinc-500">
            {project.lastUpdated && (
              <span>
                Updated {formatDate(project.lastUpdated)}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-cyan-300 transition-colors duration-200 group-hover:text-cyan-200">
              View details
              <ArrowRight className="h-3 w-3 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            </span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

/**
 * WebGL display of the featured projects.
 *
 * A canvas is opaque to assistive tech and cannot be hit-tested cheaply, so the
 * gallery is paired with real DOM: a readout naming the centred project with a
 * route into the existing detail modal, plus a visually-hidden list covering
 * every project. Nothing that was reachable in the grid becomes unreachable
 * here — keyboard and screen-reader users get the full set either way.
 */
function ProjectGallery({
  projects,
  items,
  onOpen,
}: {
  projects: MergedProject[];
  items: PosterItem[] | null;
  onOpen: (project: MergedProject) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = projects[activeIndex] ?? projects[0];

  return (
    <div className="space-y-5">
      {/* Fixed height: the canvas is sized from its container, so the box must be
          reserved up front or the section would collapse then jump. The card
          occupies ~60% of this height, which is what sets on-screen text size —
          hence the generous scale rather than a slim strip. */}
      <div className="relative h-[420px] w-full sm:h-[540px] lg:h-[620px]">
        {items ? (
          <CircularGallery
            items={items}
            bend={2.6}
            borderRadius={0.06}
            textColor="#e4e4e7"
            font="600 30px Geist, system-ui, sans-serif"
            scrollEase={0.045}
            scrollSpeed={2}
            onActiveChange={setActiveIndex}
            ariaLabel="Featured project gallery. Use left and right arrow keys to browse."
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-zinc-500">
            Preparing gallery…
          </div>
        )}
      </div>

      <p className="text-center text-[0.7rem] text-zinc-500">
        Drag, scroll sideways, or use <kbd className="text-zinc-400">←</kbd>{" "}
        <kbd className="text-zinc-400">→</kbd> to browse
      </p>

      {active && (
        <div className="glass-panel flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">
              {String(activeIndex + 1).padStart(2, "0")} / {projects.length}
            </p>
            <h3 className="truncate text-sm font-medium text-zinc-50">
              {active.title}
            </h3>
            {active.repoFullName && (
              <p className="truncate text-[0.7rem] text-zinc-500">
                {active.repoFullName}
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {active.stars != null && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-[0.7rem] text-zinc-300">
                <Star className="h-3 w-3 text-yellow-300" />
                {active.stars}
                {active.forks != null && (
                  <>
                    <span className="mx-1 h-3 w-px bg-white/10" />
                    <GitFork className="h-3 w-3" />
                    {active.forks}
                  </>
                )}
              </span>
            )}
            {active.githubUrl && (
              <a
                href={active.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[0.75rem] text-zinc-100 transition-colors duration-200 hover:border-cyan-400/60 hover:text-cyan-200"
              >
                <Github className="h-3.5 w-3.5" />
                Repo
              </a>
            )}
            <button
              type="button"
              onClick={() => onOpen(active)}
              className="focus-ring group inline-flex items-center gap-1.5 rounded-full border border-cyan-400/50 bg-cyan-500/15 px-3 py-1.5 text-[0.75rem] text-cyan-100 transition-colors duration-200 hover:bg-cyan-500/25"
            >
              View details
              <ArrowRight className="h-3 w-3 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      )}

      {/* Full set, reachable by keyboard and screen readers regardless of the
          canvas above. */}
      <ul className="sr-only">
        {projects.map((project) => (
          <li key={project.slug}>
            <button type="button" onClick={() => onOpen(project)}>
              View details for {project.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
