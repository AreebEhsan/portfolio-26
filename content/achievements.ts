export type Achievement = {
  id: string;
  title: string;
  organization?: string;
  year?: string;
  description?: string;
};

export const achievements: Achievement[] = [
  {
    id: "scudem-outstanding",
    title: "SCUDEM Outstanding Award",
    organization: "SCUDEM",
    description: "Recognized for outstanding performance in a modeling challenge.",
  },
  {
    id: "grand-integrator",
    title: "Grand Integrator",
    description: "Award highlighting strong performance in advanced mathematics/integration.",
  },
  {
    id: "undergrad-math-competition",
    title: "Undergraduate Mathematics Competition — 3rd Place",
    description: "Placed 3rd in a university-level mathematics competition.",
  },
];
