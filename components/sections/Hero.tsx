"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/content/profile";
import { fadeInUp, staggerContainer } from "@/components/motion/variants";
import { ArrowDownRight, FileDown } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const Hero3D = dynamic(() => import("@/components/hero/Hero3D"), {
  ssr: false,
  // Reserve the canvas box up front so the hero doesn't jump when the 3D
  // bundle finishes loading.
  loading: () => <div className="h-[340px] w-full md:h-[520px]" />,
});

const ROTATION_INTERVAL = 2600;

// Widest label decides the pill width, so rotating roles never resize it.
const WIDEST_ROLE = profile.roles.reduce(
  (longest, role) => (role.length > longest.length ? role : longest),
  "",
);

const ROLE_PILL_CLASS =
  "col-start-1 row-start-1 rounded-full bg-cyan-400/10 px-2.5 py-1 text-[0.7rem] uppercase tracking-[0.18em] text-cyan-200";

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % profile.roles.length);
    }, ROTATION_INTERVAL);
    return () => window.clearInterval(id);
  }, []);

  const currentRole = profile.roles[roleIndex];

  const handleScrollProjects = () => {
    const el = document.getElementById("projects");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="hero"
      className="section-shell section-spacing flex min-h-[72vh] items-center"
    >
      <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={fadeInUp} className="space-y-3">
            <p className="heading-subtle">Engineer with taste</p>
            <h1 className="heading-main">
              <span className="block text-zinc-200">{profile.name}</span>
              <span className="mt-3 inline-grid align-middle text-lg text-cyan-300">
                {/* Invisible sizer holds the box; the visible label cross-fades
                    inside it, so the rotation never nudges the layout. */}
                <span aria-hidden className={`${ROLE_PILL_CLASS} invisible`}>
                  {WIDEST_ROLE}
                </span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={currentRole}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
                    className={`${ROLE_PILL_CLASS} grid place-items-center`}
                  >
                    {currentRole}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="max-w-xl text-sm leading-6 text-zinc-400 md:text-base md:leading-7"
          >
            {profile.subheadline}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center gap-3 text-xs text-zinc-400"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Available for internships & collaborations
            </span>

            {profile.location && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-black/30 px-3 py-1">
                <span className="h-1 w-1 rounded-full bg-zinc-500" />
                {profile.location}
              </span>
            )}
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="mt-4 flex flex-wrap gap-3 text-sm"
          >
            <button
              onClick={handleScrollProjects}
              className="focus-ring group inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-cyan-500/30 transition-[background-color,box-shadow,transform] duration-200 ease-out hover:bg-cyan-400 hover:shadow-cyan-500/45 active:scale-[0.98]"
            >
              <ArrowDownRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              View projects
            </button>

            <Link
              href={profile.resumeUrl}
              download
              className="focus-ring group relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-zinc-200 transition-[border-color,color,transform] duration-200 ease-out hover:border-cyan-400/60 hover:text-cyan-200 active:scale-[0.98]"
            >
              <div className="relative flex items-center gap-2">
                <FileDown className="h-4 w-4" />
                <span>Download resume</span>

                <div className="mail-icon">
                  <div className="animated-mail">
                    <div className="back-fold" />
                    <div className="letter">
                      <div className="letter-border" />
                      <div className="letter-title" />
                      <div className="letter-context" />
                      <div className="letter-stamp">
                        <div className="letter-stamp-inner" />
                      </div>
                    </div>
                    <div className="top-fold" />
                    <div className="body" />
                    <div className="left-fold" />
                  </div>
                  <div className="shadow" />
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating 3D cube */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.19, 0.7, 0.3, 1] }}
          className="relative"
        >
          {/* <div className="pointer-events-none absolute -inset-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_30%_20%,_rgba(34,211,238,0.22),_transparent_55%),radial-gradient(circle_at_70%_80%,_rgba(129,140,248,0.18),_transparent_60%)] blur-2xl" /> */}
          <Hero3D />
        </motion.div>
      </div>
    </section>
  );
}
