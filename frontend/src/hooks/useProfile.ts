// will delete when api ready
import type { Profile } from "../types/profile";

export function useProfile(): Profile {
  return {
    user: {
      name: "سارة أحمد",
      email: "sara@example.com",
      initials: "سا",
    },
    interests: ["#python", "#debug", "#تصميم", "#بيانات", "#ذكاء_اصطناعي"],
    simulations: [
      { icon: "💻", job: "مهندس برمجيات", match: 87 },
      { icon: "📊", job: "محلل بيانات", match: 74 },
    ],
  };
}