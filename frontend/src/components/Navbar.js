import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { removeAuthToken } from '../utils/auth';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <h2>Learning Platform</h2>
        </Link>
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/notes" className="navbar-link">Notes</Link>
          <Link to="/review-plans" className="navbar-link">Review Plans</Link>
          <Link to="/progress" className="navbar-link">Progress</Link>
          <button onClick={handleLogout} className="navbar-button">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

