import api from "./api";
import type { Profile, SimulationHistory } from "../types/profile";

export const profileService = {
  getProfile: async (): Promise<Profile> => {
    const { data } = await api.get("/profile");
    return data;
  },

  updateInterests: async (interests: string[]): Promise<void> => {
    await api.patch("/profile/interests", { interests });
  },

  getHistory: async (): Promise<SimulationHistory[]> => {
    const { data } = await api.get("/profile/history");
    return data;
  },
};