import { Routes, Route } from "react-router-dom";

import { useScrollToHash } from "./hooks/useScrollToHash";
import { useScrollToTop } from "./hooks/useScrollToTop";

import HomePage from "./pages/HomePage";
import JobPage from "./pages/JobPage";
import TaskSimulationPage from "./pages/TaskSimulationPage";
import ReviewPage from "./pages/ReviewPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import { AdminRoute } from "./components/admin/AdminRoute";

function App() {
  useScrollToTop();
  useScrollToHash();
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/jobs/:jobId" element={<JobPage />} />
      <Route path="/not-found" element={<div>Not Found</div>} />
      <Route path="/jobs/:jobId/tasks/:taskId" element={<TaskSimulationPage />} />
      <Route path="/jobs/:jobId/tasks/:taskId/review" element={<ReviewPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>}/>
    </Routes>
  );
}

export default App;
