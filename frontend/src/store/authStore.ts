import { create } from "zustand";
import { authService } from "../services/authService";
import type { AuthUser } from "../services/authService";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: authService.isAuthenticated(),

  setUser: (user) => set({ user, isAuthenticated: true }),

  logout: async () => {
  await authService.logout();
  localStorage.removeItem("role");
  localStorage.removeItem("token");
  set({ user: null, isAuthenticated: false });
},
}));