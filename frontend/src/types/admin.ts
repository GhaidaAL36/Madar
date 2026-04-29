export type AdminSection = "dashboard" | "jobs" | "users";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  status: "active" | "blocked";
}