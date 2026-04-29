export const getFitLabel = (percent: number): string => {
  if (percent >= 80) return "توافق ممتاز 🌟";
  if (percent >= 60) return "توافق جيد ✓";
  if (percent >= 40) return "توافق متوسط";
  return "يحتاج تطوير";
};

interface ScoreMeta {
  r: number;
  circ: number;
  dash: number;
  color: string;
  label: string;
  labelColor: string;
}

export const getScoreMeta = (score: number): ScoreMeta => {
  const r = 37;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  if (score >= 80) return { r, circ, dash, color: "var(--color-teal)",       label: "ممتاز",    labelColor: "text-teal"       };
  if (score >= 60) return { r, circ, dash, color: "var(--color-teal-light)", label: "جيد جداً", labelColor: "text-teal-light" };
  if (score >= 40) return { r, circ, dash, color: "var(--color-gold)",       label: "متوسط",    labelColor: "text-gold"       };
                   return { r, circ, dash, color: "var(--color-text-muted)", label: "ضعيف",     labelColor: "text-text-muted" };
};