"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/content/siteConfig";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";
import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = siteConfig.nav;
const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

/**
 * Tracks the section under a probe line a third of the way down the viewport
 * and whether the page has left the top. A single rAF-throttled scroll pass
 * replaces the old IntersectionObserver, which let whichever entry happened to
 * be last in the callback batch win — so the indicator flickered between
 * neighbouring sections and never settled on the final one.
 */
function useScrollState() {
  const [active, setActive] = useState<string>(SECTION_IDS[0] ?? "hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);

      const probe = window.innerHeight * 0.34;
      let current = SECTION_IDS[0];

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= probe) current = id;
      }

      // Short trailing sections never reach the probe line; once the page is
      // scrolled to the end, the last section is unambiguously the active one.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) current = SECTION_IDS[SECTION_IDS.length - 1] ?? current;

      if (current) setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { active, scrolled };
}

export function NavBar() {
  const { active, scrolled } = useScrollState();
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === "/";

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();

    // If we are not on the homepage, navigate back and let the browser handle the hash scroll.
    if (!onHome) {
      router.push(`/#${id}`);
      return;
    }

    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const github = profile.social.find((s) => s.type === "github");
  const linkedin = profile.social.find((s) => s.type === "linkedin");
  const email = profile.social.find((s) => s.type === "email");

  const socials = [
    { link: github, Icon: Github, label: "GitHub profile" },
    { link: linkedin, Icon: Linkedin, label: "LinkedIn profile" },
    { link: email, Icon: Mail, label: "Email Areeb" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-gradient-to-b from-black/60 via-black/40 to-transparent backdrop-blur-xl",
        "transition-[background-color,border-color,box-shadow] duration-300 ease-out",
        scrolled
          ? "border-white/10 bg-black/70 shadow-[0_1px_0_0_rgba(148,163,184,0.06),0_18px_40px_-24px_rgba(0,0,0,0.9)]"
          : "border-transparent",
      )}
    >
      <div className="section-shell flex h-16 items-center justify-between gap-4">
        {/* Doubles as the way back to the homepage from /projects — the only
            route out on mobile, where the section nav is hidden. */}
        <Link
          href="/"
          onClick={(e) => {
            if (!onHome) return;
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="focus-ring shrink-0 rounded-full"
          aria-label={onHome ? "Back to top" : "Back to homepage"}
        >
          <span className="badge-pill transition-colors duration-200 hover:border-cyan-400/60">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span className="uppercase tracking-[0.18em] text-[0.65rem] text-zinc-300">
              {profile.name}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm text-zinc-300 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = onHome && active === item.id;
            return (
              <button
                key={item.id}
                onClick={handleClick(item.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-200 focus-ring",
                  isActive ? "text-cyan-300" : "text-zinc-400 hover:text-zinc-100",
                )}
                aria-label={`Jump to ${item.label} section`}
              >
                <span className="relative z-10">{item.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-cyan-400/10 ring-1 ring-inset ring-cyan-400/20"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          {socials.map(({ link, Icon, label }) =>
            link ? (
              <Link
                key={label}
                href={link.href}
                aria-label={label}
                className="focus-ring rounded-full p-2 text-zinc-400 transition-[color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:text-cyan-300"
              >
                <Icon className="h-4 w-4" />
              </Link>
            ) : null,
          )}
        </div>
      </div>
    </header>
  );
}
