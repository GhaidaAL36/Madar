// delete when api
import { useState } from "react";
import { dummyUsers } from "../data/adminData";
import type { AdminUser } from "../types/admin";

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>(dummyUsers);

  const toggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "blocked" : "active" }
          : u
      )
    );
  };

  return { users, toggleStatus };
}