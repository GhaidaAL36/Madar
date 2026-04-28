import { useParams } from "react-router-dom";
import { useJob } from "../hooks/useJob"; /* delete when api ready */
/* import { useJob } from "../hooks/useJobApi"; - import when api ready*/
import Navbar from "../components/Navbar";
import JobHeader from "../components/job/JobHeader";
import TaskBody from "../components/job/TaskBody";
import Footer from "../components/Footer";

const JobPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const job = useJob(jobId ?? "");

  if (!job) return null;

  return (
    <>
      <Navbar />
      <JobHeader job={job} />
      <TaskBody tasks={job.tasks} />
      <Footer />
    </>
  );
};

export default JobPage;
