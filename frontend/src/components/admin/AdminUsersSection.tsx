import { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  status: "active" | "blocked";
}

export const dummyUsers: User[] = [
  { id: 1, name: "سارة أحمد", email: "sara@example.com", status: "active" },
  { id: 2, name: "محمد خالد", email: "m.khalid@example.com", status: "blocked" },
  { id: 3, name: "ليلى يوسف", email: "layla.y@example.com", status: "active" },
  { id: 4, name: "عمر الشمري", email: "omar.sh@example.com", status: "active" },
  { id: 5, name: "نورة العتيبي", email: "noura@example.com", status: "blocked" },
];

function AdminUsersSection() {
  const [users, setUsers] = useState<User[]>(dummyUsers);

  const toggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "blocked" : "active" }
          : u
      )
    );
  };

  return (
    <>
      <h1 className="text-[26px] font-bold text-bg-dark-secondary">المستخدمون</h1>

      <div className="bg-white rounded-[20px] shadow-[0_10px_30px_rgba(26,58,74,0.06)] overflow-hidden">
        {users.map((u) => (
          <div
            key={u.id}
            className="flex items-center justify-between px-6 py-5 border-b last:border-0 border-border-light hover:bg-bg-light-secondary/40"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center text-teal text-[13px] font-bold">
                {u.name[0]}
              </div>
              <div className="font-bold text-bg-dark-secondary">{u.name}</div>
            </div>

            <div className="text-text-muted text-[13px]">{u.email}</div>

            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                u.status === "active"
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-400"
              }`}
            >
              {u.status === "active" ? "نشط" : "محظور"}
            </span>

            <button
              onClick={() => toggleStatus(u.id)}
              className={`text-[12px] font-bold px-3 py-1.5 rounded-sm transition-colors ${
                u.status === "active"
                  ? "text-red-400 hover:text-red-500"
                  : "text-teal hover:text-teal/80"
              }`}
            >
              {u.status === "active" ? "حظر" : "إلغاء الحظر"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default AdminUsersSection;