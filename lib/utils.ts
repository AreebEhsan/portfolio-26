export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  // Use a fixed locale so server and client render identical strings
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}
