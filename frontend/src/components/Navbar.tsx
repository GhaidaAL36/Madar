import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
  await logout();
  navigate("/");
  };

  return (
    /* link to hero */
    <nav className="fixed top-0 left-0 right-0 z-100 px-12 h-16 flex items-center justify-between bg-bg-dark backdrop-blur-md border-b border-white/8">
      <div className="flex items-baseline gap-2.5">
        <Link
          to={"/#hero"}
          className="text-[22px] font-bold text-white cursor-pointer"
        >
          مدار
        </Link>
        <span className="text-sm font-light text-text-muted tracking-[0.06em]">
          MADAR
        </span>
      </div>

      {/* links to jobs and how it works */}
      <ul className="flex items-center gap-8 list-none">
        <li>
          <Link
            to="/#jobs"
            className="text-sm text-text-muted no-underline transition-colors duration-200 hover:text-white"
          >
            المهن
          </Link>
        </li>

        <li>
          <Link
            to="/#how"
            className="text-sm text-text-muted no-underline transition-colors duration-200 hover:text-white"
          >
            كيف يعمل
          </Link>
        </li>
      </ul>

      {/* login/singup btns */}
      {isAuthenticated ? (
      <button
        onClick={handleLogout}
        className="text-[13px] font-medium text-text-muted px-4.5 py-1.75 rounded-md border border-white/15 transition-all duration-200 hover:text-white hover:border-white/35"
      >
        تسجيل الخروج
      </button>
    ) : (
      <div className="flex items-center gap-3">
        <Link to="/auth?mode=login" className="text-[13px] font-medium text-text-muted no-underline px-4.5 py-1.75 rounded-md border border-white/15 transition-all duration-200 hover:text-white hover:border-white/35">
          تسجيل الدخول
        </Link>
        <Link to="/auth?mode=signup" className="text-[13px] font-bold text-bg-dark no-underline px-5 py-2 rounded-md bg-gold transition-colors duration-200 hover:bg-gold-light">
          إنشاء حساب
        </Link>
      </div>
    )}
        </nav>
  );
}

export default Navbar;
