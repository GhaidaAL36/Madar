import type { Job } from "../../types/Job";

const LABELS = {
  heading: "المهن",
  addJob:  "+ إضافة مهنة",
  edit:    "تعديل",
  delete:  "حذف",
} as const;

interface Props {
  jobs: Job[];
}

function AdminJobsSection({ jobs }: Props) { 
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-[26px] font-bold text-bg-dark-secondary">
          {LABELS.heading}
        </h1>
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
              <button className="text-teal text-[12px] font-bold cursor-pointer border-0 bg-transparent">
                {LABELS.edit}
              </button>
              <button className="text-red-400 text-[12px] font-bold cursor-pointer border-0 bg-transparent">
                {LABELS.delete}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default AdminJobsSection;