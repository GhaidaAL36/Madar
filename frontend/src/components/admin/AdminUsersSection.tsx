import { useAdminUsers } from "../../hooks/useAdminUsersApi";

const LABELS = {
  heading:   "المستخدمون",
  active:    "نشط",
  blocked:   "محظور",
  block:     "حظر",
  unblock:   "إلغاء الحظر",
} as const;

function AdminUsersSection() {
  const { users, toggleStatus } = useAdminUsers();

  return (
    <>
      <h1 className="text-[26px] font-bold text-bg-dark-secondary">
        {LABELS.heading}
      </h1>

      <div className="bg-bg-card rounded-[20px] shadow-[0_10px_30px_rgba(26,58,74,0.06)] overflow-hidden">
        {users.map((u) => (
          <div
            key={u.id}
            className="flex items-center justify-between px-6 py-5 border-b last:border-0 border-teal-pale hover:bg-bg-light-secondary/40"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center text-teal text-[13px] font-bold">
                {u.name[0]}
              </div>
              <div className="font-bold text-bg-dark-secondary">{u.name}</div>
            </div>

            <div className="text-text-muted text-[13px]">{u.email}</div>

            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
              u.status === "active"
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-400"
            }`}>
              {u.status === "active" ? LABELS.active : LABELS.blocked}
            </span>

            <button
              onClick={() => toggleStatus(u.id)}
              className={`text-[12px] font-bold px-3 py-1.5 rounded-sm transition-colors cursor-pointer border-0 bg-transparent ${
                u.status === "active"
                  ? "text-red-400 hover:text-red-500"
                  : "text-teal hover:text-teal/80"
              }`}
            >
              {u.status === "active" ? LABELS.block : LABELS.unblock}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default AdminUsersSection;