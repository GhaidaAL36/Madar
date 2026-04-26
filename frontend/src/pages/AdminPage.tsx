import { useState } from "react";
import AdminTopNav from "../components/admin/AdminTopNav";
import AdminDashboardSection from "../components/admin/AdminDashboardSection";
import AdminJobsSection from "../components/admin/AdminJobsSection";
import AdminUsersSection from "../components/admin/AdminUsersSection";

type AdminSection = "dashboard" | "jobs" | "users";

function AdminPage() {
  const [section, setSection] = useState<AdminSection>("dashboard");

  return (
    <div className="min-h-screen bg-bg-light-secondary">
      <AdminTopNav section={section} setSection={setSection} />

      <div className="pt-24 pb-16 px-10 max-w-275 mx-auto flex flex-col gap-10">
        {section === "dashboard" && <AdminDashboardSection setSection={setSection} />}
        {section === "jobs" && <AdminJobsSection />}
        {section === "users" && <AdminUsersSection />}
      </div>
    </div>
  );
}

export default AdminPage;