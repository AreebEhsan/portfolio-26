"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { skillFilters, skillGroups } from "@/content/skills";
import { fadeInUp, staggerContainer } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

export function Skills() {
  const [filter, setFilter] = useState<string>("all");

  return (
    <section id="skills" className="section-shell section-spacing">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="space-y-8"
      >
        <motion.div variants={fadeInUp} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="heading-subtle">Skills</p>
            <h2 className="heading-main">Systems thinking across the stack.</h2>
            <p className="max-w-xl text-sm leading-6 text-zinc-400">
              I like blending strong fundamentals (data structures, systems, math)
              with modern tooling—whether that&apos;s building RAG pipelines, shipping
              full-stack apps, or tightening security.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {skillFilters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className={cn(
                  "chip focus-ring",
                  filter === f.id && "chip-active text-cyan-200",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="glass-panel grid gap-6 p-5 md:grid-cols-2 lg:grid-cols-4"
        >
          {skillGroups.map((group) => (
            <div key={group.id} className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {group.skills.map((skill) => {
                  const active =
                    filter === "all" || (filter !== "all" && skill.tags?.includes(filter));
                  return (
                    <span
                      key={skill.name}
                      className={cn(
                        "chip text-[0.7rem] text-zinc-200",
                        !active && "opacity-25",
                      )}
                    >
                      {skill.name}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
