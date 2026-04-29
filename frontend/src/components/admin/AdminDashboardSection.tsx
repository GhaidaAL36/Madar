import { jobs } from "../../data/jobsData";
import { dummyUsers } from "../../data/adminData";
import type { AdminSection } from "../../types/admin";

const LABELS = {
  dashboard:    "لوحة التحكم",
  totalUsers:   "إجمالي المستخدمين",
  totalJobs:    "المهن المتاحة",
  manageJobs:   "إدارة المهن",
  manageJobsSub:"إضافة وتعديل المهن",
  manageUsers:  "إدارة المستخدمين",
  manageUsersSub: "عرض وإدارة الحسابات",
} as const;

interface Props {
  setSection: (s: AdminSection) => void;
}

function AdminDashboardSection({ setSection }: Props) {
  const stats = [
    { label: LABELS.totalUsers, value: dummyUsers.length },
    { label: LABELS.totalJobs,  value: jobs.length       },
  ];

  return (
    <>
      <h1 className="text-[26px] font-bold text-bg-dark-secondary">
        {LABELS.dashboard}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-bg-card rounded-[18px] px-6 py-6 shadow-[0_10px_30px_rgba(26,58,74,0.06)]"
          >
            <div className="text-[26px] font-bold text-bg-dark-secondary">
              {stat.value}
            </div>
            <div className="text-[13px] text-text-muted mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-2 gap-5">
        <div
          onClick={() => setSection("jobs")}
          className="bg-bg-dark text-text-on-dark rounded-[20px] px-6 py-6 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(15,37,48,0.25)]"
        >
          <div className="font-bold mb-1">{LABELS.manageJobs}</div>
          <div className="text-text-on-dark/70 text-[13px]">{LABELS.manageJobsSub}</div>
        </div>

        <div
          onClick={() => setSection("users")}
          className="bg-bg-card rounded-[20px] px-6 py-6 cursor-pointer shadow-[0_8px_24px_rgba(26,58,74,0.06)] hover:-translate-y-0.5"
        >
          <div className="font-bold text-bg-dark-secondary mb-1">{LABELS.manageUsers}</div>
          <div className="text-text-muted text-[13px]">{LABELS.manageUsersSub}</div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboardSection;
