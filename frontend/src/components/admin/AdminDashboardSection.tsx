import { jobs } from "../../data/jobsData";
import { dummyUsers } from "./AdminUsersSection";

type AdminSection = "dashboard" | "jobs" | "users";

interface Props {
  setSection: (s: AdminSection) => void;
}

function AdminDashboardSection({ setSection }: Props) {
  return (
    <>
      <h1 className="text-[26px] font-bold text-bg-dark-secondary">
        لوحة التحكم
      </h1>

      <div className="grid grid-cols-4 gap-5">
        {[
          { label: "إجمالي المستخدمين", value: String(dummyUsers.length) },
          { label: "المهن المتاحة", value: String(jobs.length) },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-[18px] px-6 py-6 shadow-[0_10px_30px_rgba(26,58,74,0.06)]"
          >
            <div className="text-[26px] font-bold text-bg-dark-secondary">
              {stat.value}
            </div>
            <div className="text-[13px] text-text-muted mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div
          onClick={() => setSection("jobs")}
          className="bg-bg-dark text-white rounded-[20px] px-6 py-6 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(15,37,48,0.25)]"
        >
          <div className="font-bold mb-1">إدارة المهن</div>
          <div className="text-white/70 text-[13px]">إضافة وتعديل المهن</div>
        </div>

        <div
          onClick={() => setSection("users")}
          className="bg-white rounded-[20px] px-6 py-6 cursor-pointer shadow-[0_8px_24px_rgba(26,58,74,0.06)] hover:-translate-y-0.5"
        >
          <div className="font-bold text-bg-dark-secondary mb-1">
            إدارة المستخدمين
          </div>
          <div className="text-text-muted text-[13px]">عرض وإدارة الحسابات</div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboardSection;
