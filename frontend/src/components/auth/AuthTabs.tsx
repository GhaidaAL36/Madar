import { useNavigate } from "react-router-dom";
import type { AuthMode } from "../../types/auth";

const TABS = [
  { key: "login",  label: "تسجيل الدخول" },
  { key: "signup", label: "إنشاء حساب" },
] as const;

interface Props {
  mode: AuthMode;
}

function AuthTabs({ mode }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex bg-bg-card border border-teal-pale rounded-[16px] p-1 mb-10">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => navigate(`/auth?mode=${tab.key}`)}
          className={`flex-1 py-2.5 text-[14px] font-bold rounded-md transition-all duration-200 cursor-pointer border-0
            ${mode === tab.key
              ? "bg-bg-dark text-text-on-dark shadow-sm"
              : "bg-transparent text-text-muted hover:text-bg-dark-secondary"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default AuthTabs;