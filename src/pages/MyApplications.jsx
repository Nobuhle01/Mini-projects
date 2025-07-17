import React, { useEffect, useState } from 'react';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token'); // assuming token is stored
    fetch('http://localhost:8080/api/applications', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setApplications(data || []))
      .catch(err => console.error('Error fetching applications:', err));
  }, []);

  return (
    <div>
      <h2>My Applications</h2>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <ul className="application-list">
          {applications.map(app => (
            <li key={app._id} className="job-card">
              <h4>Job ID: {app.job}</h4>
              <p>Status: Submitted</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyApplications;
