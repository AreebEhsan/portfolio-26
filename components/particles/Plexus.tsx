"use client";
import { useEffect } from "react";

const PARTICLES_SRC =
  "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";

declare global {
  interface Window {
    particlesJS?: (id: string, config: unknown) => void;
    pJSDom?: { pJS?: { fn?: { vendors?: { destroypJS?: () => void } } } }[];
  }
}

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`,
    );
    if (existing) {
      if (existing.dataset.loaded === "true") return resolve();
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error(`Failed to load ${src}`)),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

export default function Plexus() {
  useEffect(() => {
    // People who ask for less motion get the backdrop without the drift.
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let cancelled = false;

    const init = async () => {
      try {
        await loadScript(PARTICLES_SRC);
        if (cancelled || !window.particlesJS) return;

        window.particlesJS("particles-js", {
          particles: {
            number: { value: 40, density: { enable: true, value_area: 1600 } },
            color: { value: "#ffffff" },
            shape: {
              type: "circle",
              stroke: { width: 0, color: "#000000" },
              polygon: { nb_sides: 5 },
            },
            opacity: {
              value: 0.5,
              random: false,
              anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
            },
            size: {
              value: 3,
              random: true,
              anim: { enable: false, speed: 40, size_min: 0.1, sync: false },
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#ffffff",
              opacity: 0.4,
              width: 1,
            },
            move: {
              // Slow, ambient drift instead of the original speed-6 scatter —
              // the backdrop should read as depth, not as activity.
              enable: !reduceMotion,
              speed: 1.6,
              direction: "none",
              random: false,
              straight: false,
              out_mode: "out",
              bounce: false,
              attract: { enable: false, rotateX: 600, rotateY: 1200 },
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: { enable: !reduceMotion, mode: "repulse" },
              // Clicking used to spawn particles forever, which slowly ate
              // frame budget on a long visit.
              onclick: { enable: false },
              resize: true,
            },
            modes: {
              repulse: { distance: 110, duration: 0.4 },
            },
          },
          retina_detect: true,
        });
      } catch {
        // Background is decorative — failing to load it is not an error.
      }
    };

    init();

    return () => {
      cancelled = true;
      try {
        window.pJSDom?.forEach((instance) =>
          instance?.pJS?.fn?.vendors?.destroypJS?.(),
        );
        if (window.pJSDom) window.pJSDom.length = 0;
      } catch {
        // ignore teardown failures
      }
    };
  }, []);

  return <div id="particles-js" aria-hidden="true" />;
}
