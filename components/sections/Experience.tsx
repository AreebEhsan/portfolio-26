"use client";

import { motion } from "framer-motion";
import { timeline } from "@/content/experience";
import { achievements } from "@/content/achievements";
import { fadeInUp, staggerContainer } from "@/components/motion/variants";

export function Experience() {
  return (
    <section id="experience" className="section-shell section-spacing">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="space-y-10"
      >
        <motion.div variants={fadeInUp} className="space-y-3">
          <p className="heading-subtle">Experience & Education</p>
          <h2 className="heading-main">Path through CS, data, and math.</h2>
          <p className="max-w-xl text-sm leading-6 text-zinc-400">
            A blend of computer science, data science, and math competitions—plus
            programs like CodePath—shapes how I think about building and
            validating systems.
          </p>
        </motion.div>

        <motion.ol
          variants={fadeInUp}
          className="relative border-l border-white/10 pl-5 text-sm md:pl-6"
        >
          {timeline.map((item) => (
            <li key={item.id} className="relative mb-8 last:mb-0">
              <div className="absolute -left-[10px] mt-1 h-2.5 w-2.5 rounded-full border border-cyan-300 bg-slate-950" />
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  {item.type === "education" ? "Education" : "Experience"}
                </p>
                <h3 className="text-sm font-medium text-zinc-100">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400">
                  {item.organization} • {item.start} – {item.end}
                </p>
                <ul className="mt-2 space-y-1 text-xs text-zinc-300">
                  {item.highlights.map((h) => (
                    <li key={h}>• {h}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </motion.ol>

        <motion.div variants={fadeInUp} className="space-y-4">
          <p className="heading-subtle">Accomplishments</p>
          <div className="grid gap-4 md:grid-cols-3">
            {achievements.map((award) => (
              <div
                key={award.id}
                className="glass-panel h-full p-4 text-sm text-zinc-100"
              >
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-200">
                  {award.title}
                </p>
                {award.organization && (
                  <p className="mt-1 text-[0.7rem] text-zinc-400">
                    {award.organization}
                  </p>
                )}
                {award.description && (
                  <p className="mt-2 text-xs leading-5 text-zinc-300">
                    {award.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
