"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { certifications, type Certification } from "@/content/certifications";
import { fadeInUp, staggerContainer, hoverLift } from "@/components/motion/variants";
import { cn } from "@/lib/utils";
import { useBackdropDismiss, useDialog } from "@/components/hooks/useDialog";
import { ExternalLink, X } from "lucide-react";

export function CertificationsSection() {
  const [active, setActive] = useState<Certification | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const close = () => setActive(null);
  const backdropProps = useBackdropDismiss(close);
  // Escape, focus trap, focus restore and scroll lock now come from the shared
  // dialog hook so all three modals on the site behave identically.
  useDialog({ open: active !== null, onClose: close, containerRef: modalRef });

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
                "glass-panel panel-interactive group flex h-full flex-col items-stretch text-left",
                "cursor-pointer overflow-hidden p-4 text-sm text-zinc-200",
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
                  sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
                  className="h-32 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
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
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 px-4 py-6 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
            {...backdropProps}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-label={active.name}
              layoutId={active.id}
              className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-slate-950/95 p-4 md:p-6"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              <button
                type="button"
                onClick={close}
                className="focus-ring absolute right-3 top-3 rounded-full border border-white/10 bg-black/70 p-1.5 text-zinc-400 transition-colors duration-200 hover:border-white/25 hover:text-zinc-100"
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
                    sizes="(min-width: 1024px) 896px, 100vw"
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
