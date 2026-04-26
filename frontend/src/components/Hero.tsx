import "../style/hero.css";

function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg-rings">
        <div className="hero-bg-ring"></div>
        <div className="hero-bg-ring"></div>
        <div className="hero-bg-ring"></div>
        <div className="hero-bg-ring"></div>
      </div>

      <div className="hero-content">
        <h1 className="hero-headline anim-fadeup d2">
          اكتشف
          <br />
          <span className="highlight">مسارك المهني</span>
          <br />
          بالتجربة الحقيقية
        </h1>

        <p className="hero-subline anim-fadeup d3">
          Explore. Simulate. Find your fit.
        </p>

        <p className="hero-desc anim-fadeup d3">
          جرّب مهام حقيقية من وظائف مختلفة، واكتشف أي المجالات يناسبك — قبل أن
          تبدأ رحلتك المهنية.
        </p>

        <div className="hero-actions anim-fadeup d4">
          <a href="#jobs" className="btn-primary-lg">
            ابدأ الاستكشاف ←
          </a>
          <a href="#how" className="btn-ghost-lg">
            كيف يعمل؟
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle
                cx="8"
                cy="8"
                r="7"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <polygon points="7,5 11,8 7,11" fill="currentColor" />
            </svg>
          </a>
        </div>
      </div>

      <div className="hero-visual anim-fadein d2">
        <div className="orbit-system">
          <div className="orbit-ring orbit-ring-1">
            <div className="orbit-planet op1-b">محاسب</div>
          </div>

          <div className="orbit-ring orbit-ring-2">
            <div className="orbit-planet op2-a">مهندس برمجيات</div>
            <div className="orbit-planet op2-b">مصمم جرافيك</div>
          </div>

          <div className="orbit-ring orbit-ring-3">
            <div className="orbit-planet op3-a">محلل بيانات</div>
            <div className="orbit-planet op3-b">مدير مشاريع</div>
          </div>

          <div className="orbit-center-wrap">
            <div className="orbit-center-circle">
              <span className="orbit-center-ar">م</span>
              <span className="orbit-center-en">MDAR</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
