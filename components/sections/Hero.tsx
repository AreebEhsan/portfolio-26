"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import { fadeInUp, staggerContainer } from "@/components/motion/variants";
import { ArrowDownRight, FileDown } from "lucide-react";
import Link from "next/link";

const ROTATION_INTERVAL = 2600;

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
              <span className="mt-2 inline-flex items-center gap-2 text-lg text-cyan-300">
                <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[0.7rem] uppercase tracking-[0.18em] text-cyan-200">
                  {currentRole}
                </span>
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
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-cyan-500/40 transition hover:bg-cyan-400"
            >
              <ArrowDownRight className="h-4 w-4" />
              View projects
            </button>
            <Link
              href={profile.resumeUrl}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-zinc-200 transition hover:border-cyan-400/60 hover:text-cyan-200"
            >
              <FileDown className="h-4 w-4" />
              Download resume
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.19, 0.7, 0.3, 1] }}
          className="relative"
        >
          <div className="glass-panel relative overflow-hidden p-5">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.3),transparent_55%),radial-gradient(circle_at_100%_0%,rgba(129,140,248,0.3),transparent_55%)] opacity-80" />
            <div className="relative space-y-4">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">
                Now / Focus
              </p>
              <p className="text-sm leading-6 text-zinc-200 md:text-[0.95rem]">
                {profile.now}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-[0.65rem] text-zinc-300">
                {profile.quickFacts.slice(0, 4).map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-xl border border-white/10 bg-black/30 p-3"
                  >
                    <p className="text-[0.65rem] uppercase tracking-[0.14em] text-zinc-500">
                      {fact.label}
                    </p>
                    <p className="mt-1 text-[0.8rem] text-zinc-100">
                      {fact.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
