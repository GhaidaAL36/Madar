import { useParams } from "react-router-dom";
import { useJob } from "../hooks/useJobApi";
import { useTasks } from "../hooks/useTasksApi";
import Navbar from "../components/Navbar";
import JobHeader from "../components/job/JobHeader";
import TaskBody from "../components/job/TaskBody";
import Footer from "../components/Footer";

const JobPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { job, loading, error } = useJob(jobId ?? "");
  const { tasks } = useTasks(jobId ?? "");

  if (loading) return <div className="min-h-screen flex items-center justify-center text-text-muted">جارٍ التحميل...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!job) return null;

  return (
    <>
      <Navbar />
      <JobHeader job={job} />
      <TaskBody tasks={tasks} />
      <Footer />
    </>
  );
};

export default JobPage;