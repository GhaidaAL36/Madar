import type { Job } from "../../types/Job";

export const mockJobs: Job[] = [
  {
      id: "software-engineer",
      icon: "💻",
      titleAr: "مطور واجهة أمامية",
      titleEn: "Frontend Developer",
      descriptionPrimary: "نبحث عن مطور متمرس في بناء واجهات مستخدم تفاعلية وسريعة الاستجابة.",
      descriptionSecondary: "ستعمل ضمن فريق منتج متكامل على تطوير منصة SaaS موجهة للسوق السعودي.",
      skills: ["React", "TypeScript", "Tailwind CSS", "REST APIs"],
      tasks: []
  },
  {
      id: "data-scientist",
      icon: "🛠️",
      titleAr: "مطور خلفية",
      titleEn: "Backend Developer",
      descriptionPrimary: "نبحث عن مطور خلفية لبناء APIs قوية وقابلة للتوسع.",
      descriptionSecondary: "ستعمل على تصميم قواعد البيانات وإدارة الخوادم.",
      skills: ["Node.js", "PostgreSQL", "Docker", "REST APIs"],
      tasks: []
  },
];