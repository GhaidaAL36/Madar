import { useState } from "react";
import type { AdminSection } from "../types/admin";
import AdminTopNav from "../components/admin/AdminTopNav";
import AdminDashboardSection from "../components/admin/AdminDashboardSection";
import AdminJobsSection from "../components/admin/AdminJobsSection";
import AdminUsersSection from "../components/admin/AdminUsersSection";
import { useAdminUsers } from "../hooks/useAdminUsersApi";
import { useJobs } from "@/hooks/useJobsApi";

function AdminPage() {
  const [section, setSection] = useState<AdminSection>("dashboard");
  const { users } = useAdminUsers();
  const { jobs } = useJobs();

  return (
    <div className="min-h-screen bg-bg-light-secondary">
      <AdminTopNav section={section} setSection={setSection} />
      <div className="pt-24 pb-16 px-10 max-w-275 mx-auto flex flex-col gap-10">
        {section === "dashboard" && (
          <AdminDashboardSection
            setSection={setSection}
            userCount={users.length}
            jobCount={jobs.length}
          />
        )}
        {section === "jobs"  && <AdminJobsSection jobs={jobs} />}
        {section === "users" && <AdminUsersSection />}
      </div>
    </div>
  );
}

export default AdminPage;