import { useState } from "react";
import { authService, type LoginPayload, type SignupPayload } from "../services/authService";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);

    authService.login(payload)
    .then((data) => {
      console.log("LOGIN RESPONSE:", data);
      console.log("USER ROLE:", data.user.role);

      const role = data.user.role?.trim().toLowerCase();
      const destination = role === "admin" ? "/admin" : "/profile";

      navigate(destination);
    })
      .catch(() => setError("البريد الإلكتروني أو كلمة المرور غير صحيحة"))
      .finally(() => setLoading(false));
  };

  const signup = async (payload: SignupPayload) => {
    setLoading(true);
    setError(null);
    authService.signup(payload)
      .then(() => navigate("/profile"))
      .catch(() => setError("فشل إنشاء الحساب، حاول مرة أخرى"))
      .finally(() => setLoading(false));
  };

  return { login, signup, loading, error };
}