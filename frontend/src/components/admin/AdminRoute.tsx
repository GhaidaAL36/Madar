import { Navigate } from "react-router-dom";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/profile" replace />;
  }

  return children;
}