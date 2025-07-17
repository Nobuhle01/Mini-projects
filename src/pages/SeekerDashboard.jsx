import React from 'react';
import SeekerSidebar from '../components/SeekerSidebar';
import { Outlet } from 'react-router-dom';
import '../styles/Dashboard.css';

const SeekerDashboard = () => {
  return (
    <div className="dashboard-layout">
      <SeekerSidebar />
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default SeekerDashboard;
