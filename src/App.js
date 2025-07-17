import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PostJob from './pages/PostJob';
import Applications from './pages/Applications';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import SeekerDashboard from './pages/SeekerDashboard';
import JobList from './pages/JobList';
import MyApplications from './pages/MyApplications';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Recruiter layout and subroutes */}
        <Route path="/recruiter" element={<RecruiterDashboard />}>
          <Route path="post-job" element={<PostJob />} />
          <Route path="applications" element={<Applications />} />
        </Route>
        <Route path="/seeker" element={<SeekerDashboard />}>
  <Route path="jobs" element={<JobList />} />
  <Route path="applications" element={<MyApplications />} />
</Route>
      </Routes>
    </Router>
  );
}

export default App;
