import { Link } from "react-router-dom";
import type { AdminSection } from "../../types/admin";

const NAV_ITEMS: { key: AdminSection; label: string }[] = [
  { key: "dashboard",   label: "لوحة التحكم" },
  { key: "jobs",        label: "المجالات"        },
  { key: "simulations", label: "المحاكاة"     },
  { key: "users",       label: "المستخدمون"   },
];

interface Props {
  section: AdminSection;
  setSection: (s: AdminSection) => void;
}

function AdminTopNav({ section, setSection }: Props) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-100 h-16 bg-bg-dark flex items-center justify-between px-10 shadow-[0_6px_20px_rgba(0,0,0,0.2)]">
      <div className="flex items-baseline gap-2">
        <Link to="/#hero" className="text-[20px] font-bold text-text-on-dark">
          مدار
        </Link>
        <span className="text-[11px] font-bold text-gold bg-gold/15 border border-gold/25 rounded-full px-2.5 py-0.5">
          ADMIN
        </span>
      </div>

      <div className="flex items-center gap-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => setSection(item.key)}
            className={`px-4 py-2 rounded-[10px] text-[13px] font-bold transition-all cursor-pointer border-0
              ${section === item.key
                ? "bg-white/10 text-text-on-dark"
                : "text-text-muted hover:text-text-on-dark"
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-text-on-dark text-[13px] font-bold">
        A
      </div>
    </nav>
  );
}

export default AdminTopNav;