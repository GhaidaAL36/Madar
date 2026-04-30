function Footer() {
  return (
    <footer className="grid grid-cols-[2fr_1fr] gap-10 border-b border-white/8 bg-bg-dark px-14 pb-10 pt-13">
      <div>
        <div className="mb-2 text-[22px] font-bold text-white">مدار</div>
        <p className="max-w-55 text-[13px] leading-[1.75] text-text-muted/50">
          منصة تساعدك على اكتشاف المسار المهني الأنسب من خلال محاكاة مهام
          بالذكاء الاصطناعي.
        </p>
      </div>

      <div>
        <div className="mb-3 text-[13px] font-bold text-white">المنصة</div>
        <ul className="flex list-none flex-col gap-2">
          <li>
            <a
              href="#jobs"
              className="text-[13px] text-text-muted/50 no-underline transition-colors duration-200 hover:text-white"
            >
              استكشف المهن
            </a>
          </li>
          <li>
            <a
              href="#how"
              className="text-[13px] text-text-muted/50 no-underline transition-colors duration-200 hover:text-white"
            >
              كيف يعمل
            </a>
          </li>
          <li>
            <a
              href="/auth?mode=login"
              className="text-[13px] text-text-muted/50 no-underline transition-colors duration-200 hover:text-white"
            >
              تسجيل الدخول
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
export default Footer;
