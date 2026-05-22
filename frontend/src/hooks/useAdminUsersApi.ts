import { useEffect, useState } from "react";
import { adminService } from "../services/adminService";
import type { AdminUser } from "../types/admin";

interface UseAdminUsersResult {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
  toggleStatus: (id: string) => void;
  deleteUser: (id: string) => void;
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

  const toggleStatus = (id: string) => {
    adminService
      .toggleUserStatus(id)
      .then(({ status }) => {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, status: status as AdminUser["status"] } : u
          )
        );
      })
      .catch(() => setError("فشل تحديث الحالة"));
  };

  const deleteUser = (id: string) => {
    adminService
      .deleteUser(id)
      .then(() => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      })
      .catch(() => setError("فشل حذف المستخدم"));
  };

  return { users, loading, error, toggleStatus, deleteUser };
}