import { useEffect, useState } from "react";
import { adminService } from "../services/adminService";
import type { AdminUser } from "../types/admin";

interface UseAdminUsersResult {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
  toggleStatus: (id: number) => void;
}

export function useAdminUsers(): UseAdminUsersResult {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminService
      .getUsers()
      .then(setUsers)
      .catch(() => setError("فشل تحميل المستخدمين"))
      .finally(() => setLoading(false));
  }, []);

  const toggleStatus = (id: number) => {
    adminService.toggleUserStatus(id).then((updated) => {
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    });
  };

  return { users, loading, error, toggleStatus };
}