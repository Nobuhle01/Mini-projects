// src/pages/Applications.jsx
import React, { useEffect, useState } from 'react';

const Applications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApps = async () => {
      const res = await fetch('http://localhost:8080/api/applications');
      const data = await res.json();
      setApplications(data);
    };

    fetchApps();
  }, []);

  return (
    <div>
      <h2>Applications</h2>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <ul>
          {applications.map(app => (
            <li key={app._id}>
              <strong>Job ID:</strong> {app.job} <br />
              <strong>Applicant:</strong> {app.applicant} <br />
              <strong>Cover Letter:</strong> {app.coverLetter}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Applications;
