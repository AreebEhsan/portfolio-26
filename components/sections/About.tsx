"use client";

import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import { fadeInUp, staggerContainer } from "@/components/motion/variants";

export function About() {
  return (
    <section id="about" className="section-shell section-spacing">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
      >
        <motion.div variants={fadeInUp} className="space-y-4">
          <p className="heading-subtle">About</p>
          <h2 className="heading-main">Building practical, production-style systems.</h2>
          <p className="max-w-xl text-sm leading-6 text-zinc-400 md:text-base md:leading-7">
            I enjoy taking ideas from rough prototype to reliable, production-style
            software. Recently, I&apos;ve been focused on retrieval-augmented
            generation (RAG), agentic workflows, and tools that make research and
            learning faster. My background in math and data science helps me
            reason about systems rigorously while still caring about craft and
            user experience.
          </p>
        </motion.div>
        <motion.div
          variants={fadeInUp}
          className="glass-panel grid gap-3 p-5 text-sm text-zinc-100"
        >
          {profile.quickFacts.map((fact) => (
            <div
              key={fact.label}
              className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-black/30 px-3 py-2.5 text-xs md:text-[0.8rem]"
            >
              <span className="text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">
                {fact.label}
              </span>
              <span className="text-right text-zinc-200">{fact.value}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
