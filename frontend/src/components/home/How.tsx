const steps = [
  {
    number: "1",
    title: "اختر مجالاً",
    description: "تصفح مهن متنوعة.",
    color: "bg-bg-dark-secondary text-white",
  },
  {
    number: "2",
    title: "جرّب مهمة حقيقية",
    description: "يضعك الذكاء الاصطناعي في موقف حقيقي من تلك المهنة.",
    color: "bg-teal text-white",
  },
  {
    number: "3",
    title: "اكتشف توافقك",
    description:
      "تحصل على تقييم شخصي: نقاط قوتك، مجالات التطوير، ونسبة توافقك مع المهنة.",
    color: "bg-gold text-bg-dark",
  },
];

type Step = (typeof steps)[number];

function StepCard({ step }: { step: Step }) {
  return (
    <div className="relative rounded-l-[20px] bg-bg-light px-8 py-9 shadow-[0_8px_20px_rgba(26,58,74,0.05)] transition-[transform,box-shadow] duration-[250ms] hover:shadow-[0_25px_70px_rgba(26,58,74,0.18)]">
      <div
        className={`mb-6 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${step.color}`}
      >
        {step.number}
      </div>

      <h3 className="mb-2 text-[20px] font-bold text-bg-dark-secondary">
        {step.title}
      </h3>

      <p className="text-[15px] leading-[1.7] text-bg-dark-secondary/60">
        {step.description}
      </p>
    </div>
  );
}

function How() {
  return (
    <section className="px-20 py-25 bg-bg-card" id="how">
      <div className="text-center mb-16">
        <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-teal bg-[rgba(46,125,140,0.08)] border border-[rgba(46,125,140,0.15)] rounded-full px-3.5 py-1.25 mb-4">
          كيف يعمل مدار
        </span>

        <h2 className="text-[40px] font-bold text-bg-dark-secondary leading-tight mb-3.5">
          ثلاث خطوات لاكتشاف مسارك
        </h2>

        <p className="text-[17px] text-bg-dark-secondary/55 max-w-120 mx-auto leading-[1.7]">
          لا اختبارات شخصية تقليدية — فقط تجربة فعلية لمهام حقيقية
        </p>
      </div>

      <div className="steps-grid grid grid-cols-3 gap-2.25 relative">
        {steps.map((step) => (
          <StepCard key={step.number} step={step} />
        ))}
      </div>
    </section>
  );
}

export default How;
