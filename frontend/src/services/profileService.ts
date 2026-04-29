import api from "./api";
import type { Profile } from "../types/profile";

export const profileService = {
  getProfile: async (): Promise<Profile> => {
    const { data } = await api.get("/profile");
    return data;
  },

  updateInterests: async (interests: string[]): Promise<void> => {
    await api.patch("/profile/interests", { interests });
  },
};