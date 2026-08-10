import type { Variants } from "framer-motion";

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/**
 * Transform-only lift. Shadow and border are handled by `.panel-interactive`
 * in CSS — animating box-shadow per frame in JS forced a repaint on every
 * tick, which showed up as stutter on hover across a grid of cards.
 */
export const hoverLift: Variants = {
  rest: { y: 0 },
  hover: {
    y: -4,
    transition: { type: "spring", stiffness: 320, damping: 26 },
  },
};
