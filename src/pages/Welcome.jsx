import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Welcome.css';

const Welcome = () => {
  return (
    <div className="welcome-container">
      <nav className="navbar">
        <div className="nav-logo">JobRecruit</div>
        <div className="nav-links">
          <Link to="/register" className="btn btn-outline">Register</Link>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </nav>

      <header className="welcome-header">
        <h1>Welcome to JobRecruit!</h1>
        <p>Your bridge between talented seekers and top recruiters.</p>
        <p>
          Whether you're searching for your dream job or the perfect candidate, we’ve got you covered.
        </p>
        <div className="welcome-buttons">
          <Link to="/register" className="btn btn-primary btn-large">Get Started</Link>
          <Link to="/login" className="btn btn-outline btn-large">Already have an account?</Link>
        </div>
      </header>
    </div>
  );
};

export default Welcome;
