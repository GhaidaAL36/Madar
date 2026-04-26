export function getScoreMeta(score: number) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  const color = score >= 80 ? "#2E7D8C" : score >= 60 ? "#E8B74A" : "#e57373";
  const label = score >= 80 ? "أداء عالٍ" : score >= 60 ? "أداء جيد" : "يحتاج تحسين";
  const labelColor =
    score >= 80 ? "text-teal" : score >= 60 ? "text-accent" : "text-red-400";

  return { r, circ, dash, color, label, labelColor };
}

export function getFitLabel(percent: number) {
  return percent >= 75 ? "توافق مرتفع ✦" : percent >= 50 ? "توافق متوسط" : "توافق منخفض";
}