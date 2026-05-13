import { useParams } from "react-router-dom";
import { useJob } from "../hooks/useJobApi"; 
import { useTasks } from "../hooks/useTasks"; // delete when api
/* import { useTasks } from "../hooks/useTasksApi"; - when api is ready*/
import Navbar from "../components/Navbar";
import JobHeader from "../components/job/JobHeader";
import TaskBody from "../components/job/TaskBody";
import Footer from "../components/Footer";

const JobPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const job = useJob(jobId ?? "");
  const tasks = useTasks(jobId ?? "");
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
