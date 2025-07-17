import React from 'react';
import RecruiterSidebar from '../components/RecruiterSidebar';
import { Outlet } from 'react-router-dom';
import '../styles/Dashboard.css';

const RecruiterDashboard = () => {
  return (
    <div className="dashboard-layout">
      <RecruiterSidebar />
      <div className="dashboard-content">
        <Outlet /> {/* Child routes like Post Job and Applications will be rendered here */}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
