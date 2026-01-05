"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/content/siteConfig";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";
import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState<string>(sectionIds[0] ?? "hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id) setActive(id);
          }
        });
      },
      {
        threshold: 0.35,
      },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return active;
}

export function NavBar() {
  const sectionIds = siteConfig.nav.map((item) => item.id);
  const active = useActiveSection(sectionIds);

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const github = profile.social.find((s) => s.type === "github");
  const linkedin = profile.social.find((s) => s.type === "linkedin");
  const email = profile.social.find((s) => s.type === "email");

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-gradient-to-b from-black/60 via-black/40 to-transparent backdrop-blur-xl">
      <div className="section-shell flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="badge-pill">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span className="uppercase tracking-[0.18em] text-[0.65rem] text-zinc-300">
              {profile.name}
            </span>
          </div>
        </div>
        <nav className="hidden items-center gap-4 text-sm text-zinc-300 md:flex">
          {siteConfig.nav.map((item) => (
            <button
              key={item.id}
              onClick={handleClick(item.id)}
              className={cn(
                "relative rounded-full px-3 py-1 text-xs font-medium transition-colors focus-ring",
                active === item.id
                  ? "text-cyan-300"
                  : "text-zinc-400 hover:text-zinc-100",
              )}
              aria-label={`Jump to ${item.label} section`}
            >
              {item.label}
              {active === item.id && (
                <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-cyan-400/10" />
              )}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {github && (
            <Link
              href={github.href}
              aria-label="GitHub profile"
              className="focus-ring rounded-full p-1.5 text-zinc-300 transition hover:text-cyan-300"
            >
              <Github className="h-4 w-4" />
            </Link>
          )}
          {linkedin && (
            <Link
              href={linkedin.href}
              aria-label="LinkedIn profile"
              className="focus-ring rounded-full p-1.5 text-zinc-300 transition hover:text-cyan-300"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
          )}
          {email && (
            <Link
              href={email.href}
              aria-label="Email Areeb"
              className="focus-ring rounded-full p-1.5 text-zinc-300 transition hover:text-cyan-300"
            >
              <Mail className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
