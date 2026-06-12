import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useProfile, useProfileHistory } from "../hooks/useProfileApi";
import { profileService } from "../services/profileService";
import type { SimulationHistory } from "../types/profile";
import { AVAILABLE_INTERESTS } from "../store/interests";

const LABELS = {
  editProfile: "تعديل الملف",
  interests: "الاهتمامات",
  addInterest: "+ إضافة",
  simulationHistory: "سجل المحاكاة",
  viewReview: "عرض التقييم",
  noHistory: "لم تُكمل أي محاكاة بعد",
} as const;

const getScoreColor = (score: number): string => {
  if (score >= 75) return "var(--color-teal)";
  if (score >= 55) return "var(--color-gold)";
  return "var(--color-text-muted)";
};

const TASK_TYPE_LABELS: Record<string, string> = {
  write_function:     "كتابة كود",
  debug_code:         "تصحيح كود",
  code_review:        "مراجعة كود",
  data_analyst:       "تحليل بيانات",
  clean_data:         "تنظيف بيانات",
  review_comments:    "مراجعة تعليقات",
  review_document:    "مراجعة وثيقة",
  ux_problem:         "مشكلة UX",
  stakeholder_notes:  "اجتماع أصحاب المصلحة",
};

const SimulationCard = ({ item }: { item: SimulationHistory }) => {
  const score = item.fitPercent ?? item.score ?? 0;
  const color = getScoreColor(score);
  const completedDate = new Date(item.completedAt).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex items-center justify-between bg-bg-card-secondary rounded-[16px] px-5 py-4 transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_10px_30px_rgba(46,125,140,0.12)]">
      <div className="flex items-center gap-4 min-w-0">
        {/* Task type badge */}
        <span className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal/10 text-teal border border-teal/20">
          {TASK_TYPE_LABELS[item.taskType] ?? item.taskType}
        </span>

        <div className="min-w-0">
          <div className="text-[15px] font-bold text-bg-dark-secondary truncate">
            {item.jobTitleAr}
          </div>
          <div className="text-[12px] text-text-muted truncate">
            {item.taskTitle}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <span className="text-[12px] text-text-muted hidden sm:block">
          {completedDate}
        </span>

        {score > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-bg-card rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${score}%`, background: color }}
              />
            </div>
            <span
              className="text-[13px] font-bold w-9 text-left"
              style={{ color }}
            >
              {score}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

function ProfilePage() {
  const { user, profileInterests, loading, error } = useProfile();
  const { history, loading: historyLoading } = useProfileHistory();

  const [interests, setInterests] = useState<string[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading) setInterests(profileInterests);
  }, [loading, profileInterests]);

  const available = AVAILABLE_INTERESTS.filter((i) => !interests.includes(i));

  const handleAdd = async (tag: string) => {
    const updated = [...interests, tag];
    setInterests(updated);
    setShowPicker(false);
    setSaving(true);
    await profileService.updateInterests(updated).finally(() => setSaving(false));
  };

  const handleRemove = async (tag: string) => {
    const updated = interests.filter((i) => i !== tag);
    setInterests(updated);
    await profileService.updateInterests(updated);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-text-muted">
      جارٍ التحميل...
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-500">
      {error}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-bg-light-secondary pt-24 pb-16 px-6">
        <div className="max-w-215 mx-auto flex flex-col gap-10">

          {/* Profile Card */}
          <div className="bg-bg-dark text-text-on-dark rounded-3xl px-8 py-8 flex items-center justify-between shadow-[0_20px_60px_rgba(15,37,48,0.25)]">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-white/10 text-text-on-dark text-[22px] font-bold flex items-center justify-center">
                {user.initials}
              </div>
              <div>
                <div className="text-[20px] font-bold mb-1">{user.name}</div>
                <div className="text-[14px] text-text-on-dark/70">{user.email}</div>
              </div>
            </div>
            <button className="text-[13px] font-bold text-text-on-dark/80 bg-white/10 border border-white/15 rounded-[10px] px-5 py-2 transition-all duration-200 hover:bg-white/20 hover:text-text-on-dark">
              {LABELS.editProfile}
            </button>
          </div>

          <div className="bg-bg-card rounded-[20px] px-8 py-7 shadow-[0_8px_24px_rgba(26,58,74,0.06)] relative">
            <div className="text-[13px] font-bold text-bg-dark-secondary mb-5 uppercase tracking-[0.08em]">
              {LABELS.interests}
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 text-[13px] font-medium text-teal bg-bg-card-secondary rounded-full px-4 py-1.5"
                >
                  {tag}
                  <button
                    onClick={() => handleRemove(tag)}
                    className="text-text-muted hover:text-red-400 transition-colors leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                onClick={() => setShowPicker((v) => !v)}
                className="text-[13px] font-medium text-text-muted border border-dashed border-teal-pale rounded-full px-4 py-1.5 transition-all duration-200 hover:border-teal hover:text-teal"
              >
                {saving ? "..." : LABELS.addInterest}
              </button>
            </div>

            {showPicker && (
              <div className="absolute z-10 mt-2 bg-bg-card border border-teal-pale rounded-xl shadow-lg p-4 flex flex-wrap gap-2 max-w-sm">
                {available.length === 0 ? (
                  <span className="text-xs text-text-muted">لا توجد اهتمامات أخرى</span>
                ) : (
                  available.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleAdd(tag)}
                      className="text-[13px] font-medium text-text-muted bg-bg-card-secondary rounded-full px-4 py-1.5 hover:bg-teal hover:text-white transition-colors"
                    >
                      {tag}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="bg-bg-card rounded-[20px] px-8 py-7 shadow-[0_8px_24px_rgba(26,58,74,0.06)]">
            <div className="text-[13px] font-bold text-bg-dark-secondary mb-6 uppercase tracking-[0.08em]">
              {LABELS.simulationHistory}
            </div>

            {historyLoading ? (
              <div className="text-sm text-text-muted text-center py-6">
                جارٍ التحميل...
              </div>
            ) : history.length === 0 ? (
              <div className="text-sm text-text-muted text-center py-6">
                {LABELS.noHistory}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {history.map((item) => (
                  <SimulationCard key={item.simulationId} item={item} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProfilePage;