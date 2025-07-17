import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ auth, role, handleLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Employee Leave Management</Link>
      {auth ? (
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/apply-leave">Apply for Leave</Link>
          <Link to="/leave-history">Leave History</Link>
          {role === 'admin' && (
            <>
              <Link to="/admin-dashboard">Admin Dashboard</Link>
              <Link to="/employee-management">Employee Management</Link>
              <Link to="/leave-management">Leave Management</Link>
              <Link to="/reports">Reports</Link>
              <Link to="/notifications">Notifications</Link>
              <Link to="/account-settings">Account Settings</Link>
            </>
          )}
          <button onClick={() => {
            handleLogout();
            navigate('/');
          }}>Logout</button>
        </div>
      ) : (
        <div className="navbar-links">
          <Link to="/">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;