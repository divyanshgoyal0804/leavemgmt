import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ auth, handleLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Employee Leave Management</Link>
      {auth ? (
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/apply-leave">Apply for Leave</Link>
          <Link to="/leave-history">Leave History</Link>
          <button onClick={() => {
            handleLogout();
            navigate('/');
          }}>Logout</button>
        </div>
      ) : (
        <div className="navbar-links">
          <Link to="/">Login</Link>
          <Link to="/signup">Sign Up</Link> {/* Add Sign Up link */}
        </div>
      )}
    </nav>
  );
}

export default Navbar;