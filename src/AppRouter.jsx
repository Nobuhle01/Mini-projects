import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import JobList from './pages/JobList';
import PostJob from './pages/PostJob';
import ApplyJob from './pages/ApplyJob';
import Applications from './pages/Applications';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JobList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/apply/:jobId" element={<ApplyJob />} />
        <Route path="/applications/:jobId" element={<Applications />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
