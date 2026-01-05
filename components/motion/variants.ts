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

export const hoverLift: Variants = {
  rest: { y: 0, scale: 1, boxShadow: "0 18px 45px rgba(15,23,42,0.8)" },
  hover: {
    y: -4,
    scale: 1.02,
    boxShadow: "0 22px 55px rgba(15,23,42,0.95)",
    transition: { type: "spring", stiffness: 260, damping: 18 },
  },
};
