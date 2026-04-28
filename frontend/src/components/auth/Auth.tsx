import { useState } from "react";
import { useAuthMode } from "../../hooks/useAuthMode"; // delete when api ready
import { useAuth } from "../../hooks/useAuth"; // delete when api ready
// import { useAuth } from "../../hooks/useAuthApi"; - when api ready
// import { useAuthMode } from "../../hooks/useAuthModeApi"; - when api ready
import AuthTabs from "./AuthTabs";
import InputField from "./InputField";

const LABELS = {
  loginHeading: "أهلاً بعودتك",
  signupHeading: "ابدأ رحلتك",
  loginSub: "سجّل دخولك لمتابعة استكشاف مساراتك المهنية",
  signupSub: "أنشئ حسابك المجاني وابدأ الاستكشاف الآن",
  name: "الاسم",
  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  forgotPassword: "نسيت كلمة المرور؟",
  loginBtn: "تسجيل الدخول ←",
  signupBtn: "إنشاء الحساب ←",
} as const;

function Auth() {
  const mode = useAuthMode();
  const { login, signup, loading, error } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (mode === "login") {
      login({ email, password });
    } else {
      signup({ name, email, password });
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex">
      <div className="flex-1 flex items-center justify-center px-8 py-14 bg-bg-light-secondary">
        <div className="w-full max-w-105">
          <AuthTabs mode={mode} />

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[32px] font-bold text-bg-dark-secondary leading-[1.2] mb-2">
              {mode === "login" ? LABELS.loginHeading : LABELS.signupHeading}
            </h1>
            <p className="text-[15px] text-text-muted">
              {mode === "login" ? LABELS.loginSub : LABELS.signupSub}
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            {mode === "signup" && (
              <InputField
                label={LABELS.name}
                type="text"
                placeholder="أدخل اسمك"
                value={name}
                onChange={setName}
              />
            )}

            <InputField
              label={LABELS.email}
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={setEmail}
              dir="ltr"
            />

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-bold text-bg-dark-secondary">
                  {LABELS.password}
                </label>
                {mode === "login" && (
                  <a
                    href="#"
                    className="text-[12px] text-teal no-underline hover:text-teal-light transition-colors duration-200"
                  >
                    {LABELS.forgotPassword}
                  </a>
                )}
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-card border border-teal-pale rounded-md px-4 py-3 text-[14px] text-bg-dark-secondary placeholder:text-text-muted/60 outline-none transition-all duration-200 focus:border-teal focus:shadow-[0_0_0_3px_rgba(46,125,140,0.1)]"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-[13px] text-red-500 text-center">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gold text-bg-dark font-bold text-[15px] py-3.5 rounded-md border-0 cursor-pointer transition-all duration-200 hover:bg-gold-light hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(232,183,74,0.3)] mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "..."
                : mode === "login"
                  ? LABELS.loginBtn
                  : LABELS.signupBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
