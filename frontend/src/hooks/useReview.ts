// delete when api
import type { ReviewContext } from "../types/Review";

export function useReview(jobId: string, taskId: number): ReviewContext {
  return {
    jobTitleAr: "مهندس برمجيات",
    taskTitle: "تحليل المتطلبات",
    taskDuration: "20 دقيقة",
    review: {
      score: 82,
      fitPercent: 78,
      fitSummary: "أظهرت كفاءة عالية في تحليل المتطلبات وتوثيقها بشكل منهجي.",
      skills: [
        { label: "تحليل المتطلبات", value: 85, color: "teal" },
        { label: "التواصل",         value: 70, color: "teal" },
        { label: "التوثيق",         value: 90, color: "gold" },
      ],
      strengths: [
        "تحليل منهجي ومنظم",
        "توثيق واضح وشامل",
        "فهم عميق للمتطلبات",
      ],
      improvements: [
        "تطوير مهارات التفاوض",
        "التعامل مع المتطلبات المتضاربة",
      ],
      detailedFeedback: [
        "أظهرت قدرة ممتازة في استخلاص المتطلبات من السياق المعطى.",
        "يُنصح بالتركيز على توثيق حالات الاستثناء بشكل أوضح.",
      ],
      answerReview: [
        {
          title: "تحديد المتطلبات الوظيفية",
          items: [
            { text: "تحديد المستخدمين الرئيسيين بدقة", correct: true  },
            { text: "إغفال متطلبات الأداء",             correct: false },
          ],
        },
      ],
    },
  };
}