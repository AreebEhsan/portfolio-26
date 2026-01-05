"use client";

import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import { fadeInUp } from "@/components/motion/variants";

export function NowSection() {
  return (
    <section id="now" className="section-shell section-spacing">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className="glass-panel relative overflow-hidden p-5"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="heading-subtle">Now</p>
            <h2 className="heading-main text-[1.4rem] md:text-[1.6rem]">
              What I&apos;m focused on.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-zinc-200 md:text-[0.95rem]">
            {profile.now}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
