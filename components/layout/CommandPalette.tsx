"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/content/siteConfig";
import { cn } from "@/lib/utils";
import { Command, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useBackdropDismiss, useDialog } from "@/components/hooks/useDialog";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        // Every toggle starts from a clean slate rather than the last search.
        setQuery("");
        setHighlight(0);
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const close = () => {
    setQuery("");
    setHighlight(0);
    setOpen(false);
  };
  const backdropProps = useBackdropDismiss(close);
  // Escape / focus trap / scroll lock. The palette owns its own initial focus
  // (the input), so the hook's fallback never kicks in here.
  useDialog({ open, onClose: close, containerRef: panelRef });

  const items = siteConfig.nav;
  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = (id: string) => {
    close();
    // Wait for the scroll lock to lift, otherwise the smooth scroll is
    // swallowed while the body is still `overflow: hidden`.
    window.requestAnimationFrame(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((i) => (i + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filtered[Math.min(highlight, filtered.length - 1)];
      if (target) handleSelect(target.id);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setQuery("");
          setHighlight(0);
          setOpen(true);
        }}
        className={cn(
          "focus-ring fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40",
          "inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-2 text-xs text-zinc-300",
          "shadow-lg backdrop-blur transition-[transform,border-color,color] duration-200 ease-out",
          "hover:-translate-y-0.5 hover:border-cyan-400/50 hover:text-cyan-200 active:translate-y-0",
        )}
        aria-label="Open quick jump menu (Ctrl+K or Cmd+K)"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Quick jump</span>
        <span className="hidden rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-400 md:inline">
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
            transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
            {...backdropProps}
          >
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: 10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.985 }}
              transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
              className="glass-panel w-full max-w-lg p-3"
              role="dialog"
              aria-modal="true"
              aria-label="Quick jump to a section"
            >
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 transition-colors duration-200 focus-within:border-cyan-400/50">
                <Search className="h-4 w-4 text-zinc-500" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setHighlight(0);
                  }}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Jump to section…"
                  aria-label="Filter sections"
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
                {filtered.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    onMouseEnter={() => setHighlight(index)}
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors duration-150 focus-ring",
                      index === highlight
                        ? "bg-cyan-400/10 text-cyan-100"
                        : "text-zinc-200 hover:bg-white/5",
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
