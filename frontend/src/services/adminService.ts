import api from "./api";
import type { AdminUser } from "../types/admin";
import type { Job } from "@/types/Job";

export const adminService = {
  getUsers: async (): Promise<AdminUser[]> => {
    const { data } = await api.get("/admin/users");
    return data;
  },

  toggleUserStatus: async (id: number): Promise<AdminUser> => {
    const { data } = await api.patch(`/admin/users/${id}/toggle-status`);
    return data;
  },

  deleteJob: async (id: string): Promise<void> => {
    await api.delete(`/admin/jobs/${id}`);
  },

  updateJobSkills: async (id: string, skills: string[]): Promise<Job> => {
    const { data } = await api.patch(`/admin/jobs/${id}/skills`, { skills });
    return data;
  },
};