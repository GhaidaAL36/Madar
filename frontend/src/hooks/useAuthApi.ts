import { useState } from "react";
import { authService, type LoginPayload, type SignupPayload } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const extractError = (err: unknown, fallback: string): string => {
  const data = (err as any)?.response?.data;
  return typeof data?.error === "string"
    ? data.error
    : data?.error?.message ?? fallback;
};

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const login = async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);

    authService.login(payload)
      .then((data) => {
        setUser(data.user);
        localStorage.setItem("role", data.user.role ?? "");

        const role = data.user.role?.trim().toLowerCase();
        const destination = role === "admin" ? "/admin" : "/profile";
        navigate(destination);
      })
      .catch((err) => setError(extractError(err, "حدث خطأ، حاول مرة أخرى")))
      .finally(() => setLoading(false));
  };

  const signup = async (payload: SignupPayload) => {
    setLoading(true);
    setError(null);

    authService.signup(payload)
      .then((data) => {
        setUser(data.user);
        navigate("/profile");
      })
      .catch((err) => setError(extractError(err, "حدث خطأ، حاول مرة أخرى")))
      .finally(() => setLoading(false));
  };

  return { login, signup, loading, error };
}