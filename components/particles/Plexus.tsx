"use client";
import React, { useEffect } from "react";

export default function Plexus() {
  useEffect(() => {
    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src=\"${src}\"]`)) return resolve();
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(s);
      });

    const init = async () => {
      try {
        await loadScript("https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js");
        // init particles
        const cfg = {
          particles: {
            number: { value: 40, density: { enable: true, value_area: 1600 } },
            color: { value: "#ffffff" },
            shape: {
              type: "circle",
              stroke: { width: 0, color: "#000000" },
              polygon: { nb_sides: 5 },
              image: { src: "img/github.svg", width: 100, height: 100 },
            },
            opacity: { value: 0.5, random: false, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
            size: { value: 3, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false } },
            line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 6, direction: "none", random: false, straight: false, out_mode: "out", bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 } },
          },
          interactivity: {
            detect_on: "canvas",
            events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
            modes: { grab: { distance: 400, line_linked: { opacity: 1 } }, bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 }, repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 }, remove: { particles_nb: 2 } },
          },
          retina_detect: true,
        } as any;

        // @ts-ignore
        if (window.particlesJS) window.particlesJS("particles-js", cfg);

        // optionally load stats and show particle count
        await loadScript("https://threejs.org/examples/js/libs/stats.min.js");
        // @ts-ignore
        const Stats = (window as any).Stats;
        if (Stats) {
          const stats = new Stats();
          stats.setMode?.(0);
          const el = stats.domElement as HTMLElement;
          el.style.position = "absolute";
          el.style.left = "0px";
          el.style.top = "0px";
          document.body.appendChild(el);

          const countEl = document.querySelector(".js-count-particles");
          const update = () => {
            stats.begin();
            stats.end();
            try {
              // @ts-ignore
              const len = window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS && window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array ? window.pJSDom[0].pJS.particles.array.length : 0;
              if (countEl) countEl.textContent = String(len);
            } catch (e) {}
            requestAnimationFrame(update);
          };
          requestAnimationFrame(update);
        }
      } catch (err) {
        // fail silently
      }
    };

    init();
  }, []);

  return (
    <>
      <div id="particles-js" />
      <div className="count-particles">
        <span className="js-count-particles">--</span> particles
      </div>
    </>
  );
}
