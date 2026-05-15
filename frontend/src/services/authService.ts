import api from "./api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    return data;
  },

  signup: async (payload: SignupPayload): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/signup", payload);
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role); 
    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  },
};
