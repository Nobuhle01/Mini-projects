import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Dashboard.css';

const RecruiterSidebar = () => {
  return (
    <div className="sidebar">
      <h3>Recruiter Panel</h3>
      <nav>
        <NavLink to="/recruiter/post-job" activeclassname="active">Post Job</NavLink>
        <NavLink to="/recruiter/applications" activeclassname="active">Applications</NavLink>
        <NavLink to="/">Logout</NavLink>
      </nav>
    </div>
  );
};

export default RecruiterSidebar;
