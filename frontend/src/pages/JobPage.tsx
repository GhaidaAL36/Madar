import { useParams, Navigate } from "react-router-dom";
import { useJob } from "../hooks/useJob";
import Navbar from "../components/Navbar";
import JobHeader from "../components/job/JobHeader";
import TaskBody from "../components/job/TaskBody";
import Footer from "../components/Footer";

// Route: /jobs/:jobId
function JobPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const job = useJob(jobId ?? "");

  // Redirect to home if job id not found
  if (!job) return <Navigate to="/" replace />;

  return (
    <div>
      <Navbar />
      <JobHeader job={job} />
      <TaskBody tasks={job.tasks} />
      <Footer />
    </div>
  );
}

export default JobPage;
