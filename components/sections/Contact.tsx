"use client";

import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import { fadeInUp } from "@/components/motion/variants";
import { Github, Linkedin, Mail, Copy } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const emailLink = profile.social.find((s) => s.type === "email");
  const emailAddress = emailLink?.href.replace(/^mailto:/, "").split("?")[0];

  const handleCopy = async () => {
    if (!emailAddress) return;
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error("Failed to copy email", err);
    }
  };

  const github = profile.social.find((s) => s.type === "github");
  const linkedin = profile.social.find((s) => s.type === "linkedin");

  return (
    <section id="contact" className="section-shell section-spacing">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="glass-panel relative overflow-hidden p-6 md:p-7"
      >
        <div className="pointer-events-none absolute -left-20 top-0 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="heading-subtle">Contact</p>
            <h2 className="heading-main text-[1.5rem] md:text-[1.8rem]">
              Let&apos;s build something.
            </h2>
            <p className="max-w-lg text-sm leading-6 text-zinc-300">
              If you&apos;re exploring RAG systems, agentic workflows, or want a
              pragmatic engineer for your team, I&apos;d love to chat.
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-zinc-200">
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate max-w-[14rem] md:max-w-xs">
                {emailAddress ?? "your-email@example.com"}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                aria-label={`Copy email address ${emailAddress ?? ""}`}
                className="ml-1 inline-flex shrink-0 items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[0.65rem] text-zinc-200 transition-colors duration-200 hover:bg-white/10 hover:text-cyan-200 focus-ring"
              >
                <Copy className="h-3 w-3" />
                {/* Fixed width: "Copy" → "Copied" would otherwise resize the
                    button and nudge the whole row. */}
                <span className="inline-block w-[3.1em] text-left">
                  {copied ? "Copied" : "Copy"}
                </span>
              </button>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              {github && (
                <Link
                  href={github.href}
                  className="inline-flex items-center gap-1 rounded-full text-zinc-300 transition-colors duration-200 hover:text-cyan-300 focus-ring"
                >
                  <Github className="h-3.5 w-3.5" /> GitHub
                </Link>
              )}
              {linkedin && (
                <Link
                  href={linkedin.href}
                  className="inline-flex items-center gap-1 rounded-full text-zinc-300 transition-colors duration-200 hover:text-cyan-300 focus-ring"
                >
                  <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                </Link>
              )}
            </div>
            {emailLink && (
              <div className="text-[0.7rem] text-zinc-500">
                Prefer a form? For now, this uses a simple mailto link:
                <span className="ml-1 underline">
                  <a href={emailLink.href}>Open email draft</a>
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
