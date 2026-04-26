import { useState } from "react";

type AdminSection = "dashboard" | "jobs" | "users";

function AdminPage() {
  const [section, setSection] = useState<AdminSection>("dashboard");

  const navItems = [
    { key: "dashboard", label: "لوحة التحكم", icon: "◈" },
    { key: "jobs", label: "المهن", icon: "💼" },
    { key: "users", label: "المستخدمون", icon: "👥" },
  ];

  return (
    <div className="min-h-screen bg-bg-light-secondary">

      {/* ===== Top Nav (kept, slightly cleaner) ===== */}
      <nav className="fixed top-0 left-0 right-0 z-[100] h-16 bg-bg-dark flex items-center justify-between px-10 shadow-[0_6px_20px_rgba(0,0,0,0.2)]">
        <div className="flex items-baseline gap-2">
          <span className="text-[20px] font-bold text-white">مدار</span>
          <span className="text-[11px] font-bold text-gold bg-gold/15 border border-gold/25 rounded-full px-2.5 py-0.5">
            ADMIN
          </span>
        </div>

        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setSection(item.key as AdminSection)}
              className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-[13px] font-bold transition-all
              ${
                section === item.key
                  ? "bg-white/10 text-white"
                  : "text-text-muted hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-white text-[13px] font-bold">
          A
        </div>
      </nav>

      {/* ===== Content ===== */}
      <div className="pt-24 pb-16 px-10 max-w-[1100px] mx-auto flex flex-col gap-10">

        {/* ── Dashboard ── */}
        {section === "dashboard" && (
          <>
            <h1 className="text-[26px] font-bold text-bg-dark-secondary">لوحة التحكم</h1>

            {/* ===== Stats (stronger visual) ===== */}
            <div className="grid grid-cols-4 gap-5">
              {[
                { label: "إجمالي المستخدمين", value: "١٬٢٤٧", icon: "👥" },
                { label: "المهن المتاحة", value: "٤٢", icon: "💼" },
                { label: "محاكاة مكتملة", value: "٨٬٩٣١", icon: "✅" },
                { label: "مستخدمون نشطون", value: "٣٨٤", icon: "🟢" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white rounded-[18px] px-6 py-6 shadow-[0_10px_30px_rgba(26,58,74,0.06)]"
                >
                  <div className="text-[22px] mb-3">{stat.icon}</div>
                  <div className="text-[26px] font-bold text-bg-dark-secondary">{stat.value}</div>
                  <div className="text-[13px] text-text-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* ===== Quick actions ===== */}
            <div className="grid grid-cols-2 gap-5">
              <div
                onClick={() => setSection("jobs")}
                className="bg-bg-dark text-white rounded-[20px] px-6 py-6 cursor-pointer transition-all hover:-translate-y-[2px] hover:shadow-[0_20px_40px_rgba(15,37,48,0.25)]"
              >
                <div className="text-[26px] mb-3">💼</div>
                <div className="font-bold mb-1">إدارة المهن</div>
                <div className="text-white/70 text-[13px]">إضافة وتعديل المهن</div>
              </div>

              <div
                onClick={() => setSection("users")}
                className="bg-white rounded-[20px] px-6 py-6 cursor-pointer shadow-[0_8px_24px_rgba(26,58,74,0.06)] hover:-translate-y-[2px]"
              >
                <div className="text-[26px] mb-3">👥</div>
                <div className="font-bold text-bg-dark-secondary mb-1">إدارة المستخدمين</div>
                <div className="text-text-muted text-[13px]">عرض وإدارة الحسابات</div>
              </div>
            </div>
          </>
        )}

        {/* ── Jobs ── */}
        {section === "jobs" && (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-[26px] font-bold text-bg-dark-secondary">المهن</h1>
              <button className="bg-gold text-bg-dark font-bold text-[13px] px-5 py-2.5 rounded-[10px] hover:bg-gold-light transition">
                + إضافة مهنة
              </button>
            </div>

            <div className="bg-white rounded-[20px] shadow-[0_10px_30px_rgba(26,58,74,0.06)] overflow-hidden">
              {[
                { name: "مهندس برمجيات", cat: "التقنية", tasks: 12 },
                { name: "محلل بيانات", cat: "البيانات", tasks: 8 },
              ].map((job, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-6 py-5 border-b last:border-0 border-border-light hover:bg-bg-light-secondary/40"
                >
                  <div className="font-bold text-bg-dark-secondary">{job.name}</div>
                  <div className="text-text-muted text-[13px]">{job.cat}</div>
                  <div className="text-text-muted text-[13px]">{job.tasks} مهام</div>

                  <div className="flex gap-2">
                    <button className="text-teal text-[12px] font-bold">تعديل</button>
                    <button className="text-red-400 text-[12px] font-bold">حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Users ── */}
        {section === "users" && (
          <>
            <h1 className="text-[26px] font-bold text-bg-dark-secondary">المستخدمون</h1>

            <div className="bg-white rounded-[20px] shadow-[0_10px_30px_rgba(26,58,74,0.06)] overflow-hidden">
              {[
                { name: "سارة أحمد", email: "sara@example.com", status: "active" },
                { name: "محمد خالد", email: "m.khalid@example.com", status: "blocked" },
              ].map((u, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-6 py-5 border-b last:border-0 border-border-light"
                >
                  <div className="font-bold text-bg-dark-secondary">{u.name}</div>
                  <div className="text-text-muted text-[13px]">{u.email}</div>

                  <button
                    className={`text-[12px] font-bold px-3 py-1.5 rounded-[8px]
                    ${
                      u.status === "active"
                        ? "text-red-400"
                        : "text-teal"
                    }`}
                  >
                    {u.status === "active" ? "حظر" : "إلغاء الحظر"}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminPage;