"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/content/siteConfig";
import { cn } from "@/lib/utils";
import { Command, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const items = siteConfig.nav;
  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 hidden items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-zinc-300 shadow-lg backdrop-blur md:flex focus-ring"
        aria-label="Open command palette (Ctrl+K or Cmd+K)"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Quick jump</span>
        <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-400">
          ⌘K
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-24 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="glass-panel w-full max-w-lg p-3"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2">
                <Search className="h-4 w-4 text-zinc-500" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Jump to section…"
                  className="h-7 w-full border-none bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                />
                <span className="text-[10px] text-zinc-500">ESC</span>
              </div>

              <div className="mt-2 max-h-64 overflow-y-auto rounded-lg border border-white/10 bg-black/40 text-sm">
                {filtered.length === 0 && (
                  <div className="px-3 py-2 text-xs text-zinc-500">
                    No matches. Try a different query.
                  </div>
                )}
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-2 text-left text-xs text-zinc-200 hover:bg-white/5 focus-ring",
                    )}
                  >
                    <span>{item.label}</span>
                    <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                      <Command className="h-3 w-3" />
                      {item.id}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
