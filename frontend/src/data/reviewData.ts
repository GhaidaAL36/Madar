import type { ReviewData } from "../types/Review";

export const dummyReview: ReviewData = {
  score: 84,
  timeMinutes: 14,
  taskIndex: 1,
  strengths: [
    "تشخيص سريع ودقيق للخطأ المنطقي",
    "تحديد السطر الخاطئ بدون تردد",
    "شرح واضح لسبب الخطأ",
  ],
  improvements: [
    "ذكر Unit Testing كان مختصراً – يمكن توسيعه",
    "لم تشر إلى أهمية Code Review كأداة وقائية",
  ],
  detailedFeedback: [
    "أظهرت تفكيراً منطقياً وواضحاً في تشخيص المشكلة – وصلت مباشرة إلى جوهر الخطأ دون الحاجة لتلميحات إضافية. هذه مهارة قراءة الكود التي تُعدّ أساسية في عمل المهندس اليومي.",
    "توصيتك باستخدام Unit Testing صحيحة، لكن المهندس المحترف سيضيف أيضاً استخدام type hints في Python لتجنب هذا النوع من الأخطاء، والاعتماد على Code Review كشبكة أمان في الفريق.",
  ],
  answerReview: [
    {
      title: "تحديد نوع الخطأ",
      items: [
        { text: "خطأ منطقي (Logical Error) في سطر الدالة", correct: false },
        {
          text: "صحيح تماماً – اكتشفت المنطق في النتيجة الخاطئة بدقة عالية ✓",
          correct: true,
        },
      ],
    },
    {
      title: "تحديد السطر الخاطئ",
      items: [
        { text: "السطر الخاطئ في الدالة `return total`", correct: false },
        {
          text: "تحديد دقيق – استغرقت أقل من ثانيتين لإيجاد المشكلة ✓",
          correct: true,
        },
      ],
    },
    {
      title: "اقتراح التصحيح",
      items: [
        { text: "تغيير `return total` إلى `return average`", correct: false },
        { text: "حل صحيح وصائب ✓", correct: true },
      ],
    },
    {
      title: "كيفية تجنب الخطأ مستقبلاً",
      items: [
        {
          text: "مراجعة أسماء المتغيرات قبل return + كتابة unit tests",
          correct: false,
        },
        {
          text: "جيد – لكن يمكن إضافة Code Review و Python type hints لتحسين وقاية أكثر فاعلية",
          correct: false,
        },
      ],
    },
  ],
  skills: [
    { label: "تشخيص المشكلة", value: 95, color: "#2E7D8C" },
    { label: "صحة الحل", value: 90, color: "#2E7D8C" },
    { label: "وضوح التفسير", value: 82, color: "#2E7D8C" },
    { label: "اقتراح تجنب الخطأ", value: 70, color: "#C4922A" },
  ],
  fitPercent: 73,
  fitSummary:
    "أظهرت تفكيراً تحليلياً قوياً وسرعة في التشخيص – وهي من أهم صفات المهندس الناجح. أكمل المهام الأخرى لتحصل على صورة أشمل عن مدى توافقك.",
};
