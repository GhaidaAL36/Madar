import api from "./api";
import type { AdminUser } from "../types/admin";

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
};