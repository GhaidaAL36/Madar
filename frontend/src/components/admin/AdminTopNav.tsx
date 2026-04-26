type AdminSection = "dashboard" | "jobs" | "users";

interface Props {
  section: AdminSection;
  setSection: (s: AdminSection) => void;
}

const navItems = [
  { key: "dashboard", label: "لوحة التحكم" },
  { key: "jobs", label: "المهن" },
  { key: "users", label: "المستخدمون" },
];

function AdminTopNav({ section, setSection }: Props) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-100 h-16 bg-bg-dark flex items-center justify-between px-10 shadow-[0_6px_20px_rgba(0,0,0,0.2)]">
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
              ${section === item.key
                ? "bg-white/10 text-white"
                : "text-text-muted hover:text-white"
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-white text-[13px] font-bold">
        A
      </div>
    </nav>
  );
}

export default AdminTopNav;