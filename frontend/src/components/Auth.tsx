import { useNavigate } from "react-router-dom";
import type { AuthMode } from "../types/auth";
import { useAuthMode } from "../hooks/useAuthMode";

function AuthTabs({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate();

  const setMode = (newMode: AuthMode) => {
    navigate(`/auth?mode=${newMode}`);
  };

  return (
    <div className="flex bg-white border border-border-light rounded-[16px] p-1 mb-10">
      {[
        { key: "login", label: "تسجيل الدخول" },
        { key: "signup", label: "إنشاء حساب" },
      ].map((tab) => (
        <button
          key={tab.key}
          onClick={() => setMode(tab.key as AuthMode)}
          className={`flex-1 py-2.5 text-[14px] font-bold rounded-md transition-all duration-200 cursor-pointer border-0
            ${
              mode === tab.key
                ? "bg-bg-dark text-white shadow-sm"
                : "bg-transparent text-text-muted hover:text-bg-dark-secondary"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function InputField({
  label,
  type,
  placeholder,
  dir,
}: {
  label: string;
  type: string;
  placeholder: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-bold text-bg-dark-secondary">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        dir={dir}
        className="w-full bg-white border border-border-light rounded-md px-4 py-3 text-[14px] text-bg-dark-secondary placeholder:text-text-muted/60 outline-none transition-all duration-200 focus:border-teal focus:shadow-[0_0_0_3px_rgba(46,125,140,0.1)]"
      />
    </div>
  );
}

function Auth() {
  const mode = useAuthMode();

  return (
    <div className="min-h-screen bg-bg-dark flex">
      <div className="flex-1 flex items-center justify-center px-8 py-14 bg-bg-light-secondary">
        <div className="w-full max-w-105">
          
          {/* Tabs */}
          <AuthTabs mode={mode} />

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[32px] font-bold text-bg-dark-secondary leading-[1.2] mb-2">
              {mode === "login" ? "أهلاً بعودتك" : "ابدأ رحلتك"}
            </h1>

            <p className="text-[15px] text-text-muted">
              {mode === "login"
                ? "سجّل دخولك لمتابعة استكشاف مساراتك المهنية"
                : "أنشئ حسابك المجاني وابدأ الاستكشاف الآن"}
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            {mode === "signup" && (
              <InputField
                label="الاسم"
                type="text"
                placeholder="أدخل اسمك"
              />
            )}

            <InputField
              label="البريد الإلكتروني"
              type="email"
              placeholder="example@email.com"
              dir="ltr"
            />

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-bold text-bg-dark-secondary">
                  كلمة المرور
                </label>

                {mode === "login" && (
                  <a
                    href="#"
                    className="text-[12px] text-teal no-underline hover:text-teal-light transition-colors duration-200"
                  >
                    نسيت كلمة المرور؟
                  </a>
                )}
              </div>

              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-white border border-border-light rounded-md px-4 py-3 text-[14px] text-bg-dark-secondary placeholder:text-text-muted/60 outline-none transition-all duration-200 focus:border-teal focus:shadow-[0_0_0_3px_rgba(46,125,140,0.1)]"
              />
            </div>

            <button className="w-full bg-gold text-bg-dark font-bold text-[15px] py-3.5 rounded-md border-0 cursor-pointer transition-all duration-200 hover:bg-gold-light hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(232,183,74,0.3)] mt-2">
              {mode === "login" ? "تسجيل الدخول ←" : "إنشاء الحساب ←"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Auth;