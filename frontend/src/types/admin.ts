export type AdminSection = "dashboard" | "jobs" | "users";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "blocked";
}