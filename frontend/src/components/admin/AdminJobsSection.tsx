import { useState } from "react";
import type { Job } from "../../types/Job";
import { AVAILABLE_INTERESTS } from "../../store/interests";
import { adminService } from "../../services/adminService";
import "@/style/scrollbar.css"

const LABELS = {
  heading: "المجالات",
  addJob: "+ إضافة مجال",
  edit: "تعديل",
  delete: "حذف",
  editSkills: "تعديل المهارات",
  save: "حفظ",
  cancel: "إلغاء",
} as const;

interface Props {
  jobs: Job[];
}

function AdminJobsSection({ jobs: initialJobs }: Props) {
  const [jobs, setJobs] = useState(initialJobs);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const openEdit = (job: Job) => {
    setEditingJob(job);
    setSelectedSkills(job.skills ?? []);
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSave = async () => {
    if (!editingJob) return;
    await adminService.updateJobSkills(editingJob.id, selectedSkills);
    setJobs((prev) =>
      prev.map((j) => (j.id === editingJob.id ? { ...j, skills: selectedSkills } : j))
    );
    setEditingJob(null);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-[26px] font-bold text-bg-dark-secondary">{LABELS.heading}</h1>
        <button className="bg-gold text-bg-dark font-bold text-[13px] px-5 py-2.5 rounded-[10px] hover:bg-gold-light transition cursor-pointer border-0">
          {LABELS.addJob}
        </button>
      </div>

      <div className="bg-bg-card rounded-[20px] shadow-[0_10px_30px_rgba(26,58,74,0.06)] overflow-hidden">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="flex items-center justify-between px-6 py-5 border-b last:border-0 border-teal-pale hover:bg-bg-light-secondary/40"
          >
            <div className="flex items-center gap-3">
              <span className="text-[20px]">{job.icon}</span>
              <div className="font-bold text-bg-dark-secondary">{job.titleAr}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(job)}
                className="text-teal text-[12px] font-bold cursor-pointer border-0 bg-transparent"
              >
                {LABELS.edit}
              </button>
              <button className="text-red-400 text-[12px] font-bold cursor-pointer border-0 bg-transparent">
                {LABELS.delete}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 custom-scrollbar">
          <div className="bg-bg-card rounded-[20px] p-8 w-full max-w-lg shadow-xl flex flex-col gap-6">
            <h2 className="text-lg font-bold text-bg-dark-secondary text-right">
              {LABELS.editSkills} — {editingJob.titleAr}
            </h2>

            <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto pr-1 justify-end">
              {AVAILABLE_INTERESTS.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${selectedSkills.includes(skill)
                      ? "bg-teal text-white border-teal"
                      : "bg-bg-light text-text-muted border-teal/20 hover:border-teal"
                    }`}
                >
                  {skill}
                </button>
              ))}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEditingJob(null)}
                className="px-5 py-2 rounded-lg text-sm font-medium text-text-muted border border-white/15 hover:text-white transition"
              >
                {LABELS.cancel}
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-lg text-sm font-bold bg-gold text-bg-dark hover:bg-gold-light transition"
              >
                {LABELS.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminJobsSection;