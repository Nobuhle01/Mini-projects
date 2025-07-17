import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Dashboard.css';

const SeekerSidebar = () => {
  return (
    <div className="sidebar">
      <h3>Job Seeker</h3>
      <nav>
        <NavLink to="/seeker/jobs" activeclassname="active">
          <i className="bi bi-briefcase me-2"></i> Browse Jobs
        </NavLink>
        <NavLink to="/seeker/applications" activeclassname="active">
          <i className="bi bi-file-earmark-check me-2"></i> My Applications
        </NavLink>
        <NavLink to="/" activeclassname="active">
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </NavLink>
      </nav>
    </div>
  );
};

export default SeekerSidebar;
