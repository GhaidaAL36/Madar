import type { AdminUser } from "../types/admin";

export const dummyUsers: AdminUser[] = [
  { id: 1, name: "سارة أحمد",    email: "sara@example.com",       status: "active"  },
  { id: 2, name: "محمد خالد",    email: "m.khalid@example.com",   status: "blocked" },
  { id: 3, name: "ليلى يوسف",    email: "layla.y@example.com",    status: "active"  },
  { id: 4, name: "عمر الشمري",   email: "omar.sh@example.com",    status: "active"  },
  { id: 5, name: "نورة العتيبي", email: "noura@example.com",      status: "blocked" },
];