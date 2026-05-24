import api from "./api";
import type { AdminUser, AdminSimulation } from "../types/admin";  
import type { Job } from "../types/Job";                        

export const adminService = {
  getUsers: async (): Promise<AdminUser[]> => {
    const { data } = await api.get("/admin/users");
    return data;
  },

  toggleUserStatus: async (id: string): Promise<{ message: string; status: string }> => {
    const { data } = await api.patch(`/admin/users/${id}/toggle-status`);
    return data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },

  deleteJob: async (id: string): Promise<void> => {
    await api.delete(`/admin/jobs/${id}`);
  },

  updateJobSkills: async (id: string, skills: string[]): Promise<Job> => {
    const { data } = await api.patch(`/admin/jobs/${id}/skills`, { skills });
    return data;
  },

  getSimulations: async (): Promise<AdminSimulation[]> => {
    const { data } = await api.get("/admin/simulations");
    return data;
  },
};