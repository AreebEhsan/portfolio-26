"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { certifications, type Certification } from "@/content/certifications";
import { fadeInUp, staggerContainer, hoverLift } from "@/components/motion/variants";
import { cn } from "@/lib/utils";
import { ExternalLink, X } from "lucide-react";

export function CertificationsSection() {
  const [active, setActive] = useState<Certification | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Focus trap + ESC to close
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setActive(null);
        return;
      }

      if (event.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;

        const first = focusable[0]!;
        const last = focusable[focusable.length - 1]!;
        const current = document.activeElement as HTMLElement | null;

        if (event.shiftKey) {
          if (!current || current === first) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (!current || current === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active]);

  // Focus the close button when the modal opens
  useEffect(() => {
    if (active && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [active]);

  return (
    <section id="certifications" className="section-shell section-spacing">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="space-y-8"
      >
        <motion.div variants={fadeInUp} className="space-y-3">
          <p className="heading-subtle">Certifications</p>
          <h2 className="heading-main">Cloud and cybersecurity foundations.</h2>
          <p className="max-w-xl text-sm leading-6 text-zinc-400">
            Verified credentials across cloud and cybersecurity that back up the
            hands-on AI and full-stack projects.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {certifications.map((cert) => (
            <motion.button
              key={cert.id}
              type="button"
              layoutId={cert.id}
              className={cn(
                "glass-panel group flex h-full flex-col items-stretch text-left",
                "cursor-pointer overflow-hidden p-4 text-sm text-zinc-200 transition",
              )}
              initial="rest"
              animate="rest"
              whileHover="hover"
              variants={hoverLift}
              onClick={() => setActive(cert)}
            >
              <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
                <Image
                  src={cert.image.src}
                  alt={cert.image.alt}
                  width={cert.image.width}
                  height={cert.image.height}
                  className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">
                  {cert.issuer}
                </p>
                <h3 className="text-sm font-medium text-zinc-50">{cert.name}</h3>
                <p className="text-[0.7rem] text-zinc-400">
                  Issued {cert.issued}
                  {cert.expires ? ` • Expires ${cert.expires}` : null}
                </p>
              </div>
              {cert.credentialId && (
                <p className="mt-2 text-[0.65rem] text-zinc-500">
                  Credential ID: {cert.credentialId}
                </p>
              )}
              <div className="mt-3 flex items-center justify-between text-[0.75rem] text-cyan-300">
                <span>View certificate</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </div>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-modal="true"
            role="dialog"
            aria-label={active.name}
          >
            <motion.div
              ref={modalRef}
              layoutId={active.id}
              className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/95 p-4 md:p-6"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setActive(null)}
                className="focus-ring absolute right-3 top-3 rounded-full border border-white/10 bg-black/70 p-1 text-zinc-400 hover:text-zinc-100"
                aria-label="Close certification details"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-3 pr-7">
                <p className="heading-subtle">Certification</p>
                <h2 className="heading-main text-[1.4rem]">{active.name}</h2>
                <p className="text-[0.8rem] text-zinc-400">
                  {active.issuer} • Issued {active.issued}
                  {active.expires ? ` • Expires ${active.expires}` : null}
                </p>
                {active.credentialId && (
                  <p className="text-[0.75rem] text-zinc-500">
                    Credential ID: {active.credentialId}
                  </p>
                )}
              </div>

              <div className="mt-4 space-y-4 text-sm text-zinc-200">
                <div className="overflow-hidden rounded-xl border border-white/10 bg-black/50">
                  <Image
                    src={active.image.src}
                    alt={active.image.alt}
                    width={active.image.width}
                    height={active.image.height}
                    className="h-auto max-h-[80vh] w-full object-contain"
                  />
                </div>

                <div className="flex flex-wrap gap-3 text-[0.8rem]">
                  {active.url && (
                    <a
                      href={active.url}
                      target="_blank"
                      rel="noreferrer"
                      className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-cyan-400/70 bg-cyan-500/15 px-3 py-1.5 text-cyan-200 hover:bg-cyan-500/25"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View credential
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
