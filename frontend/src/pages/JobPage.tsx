import { useParams, Navigate } from "react-router-dom";
import { jobs } from "../types/Job";
import Navbar from "../components/Navbar";
import JobHeader from "../components/JobHeader";
import TaskBody from "../components/TaskBody";
import Footer from "../components/Footer";

// Route: /jobs/:jobId
function JobPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const job = jobs.find((j) => j.id === jobId);

  // Redirect to home if job id not found
  if (!job) return <Navigate to="/" replace />;

  return (
    <div>
      <Navbar />
      <JobHeader job={job} />
      <TaskBody tasks={job.tasks}/>
      <Footer />
    </div>
  );
}

export default JobPage;
