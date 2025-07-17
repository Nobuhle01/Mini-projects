import React, { useState } from 'react';

const PostJob = () => {
  const [form, setForm] = useState({ title: '', company: '', location: '', description: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) alert('Job posted successfully!');
      else alert('Error: ' + data.message);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Post a Job</h2>
      <input name="title" placeholder="Job Title" onChange={handleChange} required />
      <input name="company" placeholder="Company" onChange={handleChange} required />
      <input name="location" placeholder="Location" onChange={handleChange} required />
      <textarea name="description" placeholder="Job Description" onChange={handleChange}></textarea>
      <button type="submit">Post Job</button>
    </form>
  );
};

export default PostJob;
