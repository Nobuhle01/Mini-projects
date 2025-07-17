import React, { useEffect, useState } from 'react';
import '../styles/JobList.css';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/jobs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error('Fetch jobs error:', err);
      }
    };

    fetchJobs();
  }, [token]);

  const handleApply = async (jobId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/applications/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ coverLetter: 'Excited to apply!' }),
      });

      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error('Apply error:', err);
      alert('Failed to apply for job.');
    }
  };

  const handleSave = async (jobId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/jobs/${jobId}/save`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error('Save job error:', err);
      alert('Failed to save job.');
    }
  };

  const filteredJobs = jobs.filter((job) =>
    (job.title?.toLowerCase().includes(search.toLowerCase()) ||
     job.company?.toLowerCase().includes(search.toLowerCase()) ||
     job.location?.toLowerCase().includes(search.toLowerCase())) &&
    (jobType === '' || job.jobType === jobType)
  );

  return (
    <div className="job-dashboard">
      <h2>Available Jobs</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search jobs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="dropdown"
        >
          <option value="">All Types</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Remote">Remote</option>
          <option value="Contract">Contract</option>
        </select>
      </div>

      {filteredJobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        filteredJobs.map((job) => (
          <div key={job._id} className="job-card">
            <h3>{job.title}</h3>
            <p><strong>Company:</strong> {job.company || 'N/A'}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Type:</strong> {job.jobType}</p>
            <p>{job.description}</p>

            <div className="actions">
              <button onClick={() => handleApply(job._id)}>Apply</button>
              <button onClick={() => handleSave(job._id)} className="save-btn">
                Save
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default JobList;
