function Footer() {
  return (
    <div className="bg-bg-dark px-14 pt-13 pb-10 grid grid-cols-[2fr_1fr_1fr_1fr] gap-10 border-b border-white/[0.08]">
      <div>
        <div className="text-[22px] font-bold text-white mb-2">مدار</div>
        <p className="text-[13px] leading-[1.75] text-text-muted/50 max-w-[220px]">
          منصة تساعدك على اكتشاف المسار المهني الأنسب من خلال محاكاة مهام حقيقية
          بالذكاء الاصطناعي.
        </p>
      </div>
      <div>
        <div className="text-[13px] font-bold text-white mb-3">المنصة</div>
        <ul className="list-none flex flex-col gap-2">
          <li>
            <a
              href="#"
              className="text-[13px] text-text-muted/50 no-underline transition-colors duration-200 hover:text-white"
            >
              استكشف المهن
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-[13px] text-text-muted/50 no-underline transition-colors duration-200 hover:text-white"
            >
              كيف يعمل
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-[13px] text-text-muted/50 no-underline transition-colors duration-200 hover:text-white"
            >
              تسجيل الدخول
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;
