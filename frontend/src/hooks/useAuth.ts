import { useState } from "react";
import type { LoginPayload, SignupPayload } from "../services/authService";

// TODO: swap with useAuthApi when backend is ready
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (payload: LoginPayload) => {
    setLoading(true);
    console.log("login →", payload);
    setLoading(false);
  };

  const signup = async (payload: SignupPayload) => {
    setLoading(true);
    console.log("signup →", payload);
    setLoading(false);
  };

  return { login, signup, loading, error };
}