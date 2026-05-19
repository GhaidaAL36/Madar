import type { Job } from "../../types/Job";
import StructuredDescription from "./StructuredDescription";
import { useAuthStore } from "@/store/authStore";
import { useProfile } from "@/hooks/useProfileApi";

const LABELS = {
  requiredSkills: "المهارات المطلوبة",
  match: "تطابق مع اهتماماتك",
} as const;

const getMatchColor = (match: number): string => {
  if (match >= 75) return "var(--color-teal)";
  if (match >= 55) return "var(--color-gold)";
  return "var(--color-text-muted)";
};

interface Props {
  job: Job;
}

const JobHeader = ({ job }: Props) => {
  const { isAuthenticated } = useAuthStore();
  const { profileInterests } = useProfile();

  const matchRate = (() => {
    if (!isAuthenticated || !profileInterests.length || !job.skills?.length) return null;
    const matched = job.skills.filter((s) => profileInterests.includes(s)).length;
    return Math.round((matched / job.skills.length) * 100);
  })();

  const matchColor = matchRate !== null ? getMatchColor(matchRate) : undefined;

  return (
    <header
      dir="ltr"
      className="w-full min-h-120 mt-10 bg-bg-dark px-10 py-12 flex flex-row-reverse items-start gap-10"
    >
      <div className="flex-1 flex flex-col items-end gap-3 pt-1">
        <div
          role="img"
          aria-label={job.titleEn}
          className="w-16 h-16 rounded-md border border-teal bg-bg-dark flex items-center justify-center mb-1"
        >
          <span className="text-2xl">{job.icon}</span>
        </div>

        <h1 className="text-text-on-dark text-4xl font-bold leading-tight text-right">
          {job.titleAr}
        </h1>

        <p className="text-text-muted text-sm tracking-wide">{job.titleEn}</p>

        <p className="text-text-on-dark text-sm leading-relaxed text-right max-w-140">
          {job.descriptionPrimary}
        </p>

        <StructuredDescription text={job.descriptionSecondary} />
      </div>

      <div className="flex flex-col gap-4 shrink-0 w-85">
        <div className="bg-bg-light rounded-md overflow-hidden">
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-b border-teal/20">
            <span className="text-text-primary font-semibold text-sm">
              {LABELS.requiredSkills}
            </span>
            <div className="w-5 h-5 rounded-xl border border-teal flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-teal" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-5" dir="rtl">
            {(job.skills ?? []).map((skill) => {
              const isMatch = profileInterests.includes(skill);
              return (
                <div key={skill} className="flex items-center justify-end gap-2">
                  <span className={`bg-bg-card border rounded-lg px-3 py-1.5 text-xs font-medium text-right leading-relaxed transition-colors ${isMatch ? "border-teal text-teal" : "border-teal/20 text-text-primary"
                    }`}>
                    {skill}
                  </span>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${isMatch ? "bg-teal" : "bg-teal/30"}`} />
                </div>
              );
            })}
          </div>

          {/* Match Rate */}
          {matchRate !== null && (
            <div className="px-5 py-4 border-t border-teal/20 flex items-center justify-end gap-2">
              <span className="text-xs text-text-muted">{LABELS.match}</span>
              <span className="text-sm font-bold" style={{ color: matchColor }}>
                {matchRate}%
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default JobHeader;