import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import EmployeeDashboard from './components/EmployeeDashboard';
import ApplyForLeave from './components/ApplyForLeave';
import LeaveHistory from './components/LeaveHistory';
import AdminDashboard from './components/AdminDashboard';
import EmployeeManagement from './components/EmployeeManagement';
import LeaveManagement from './components/LeaveManagement';
import Reports from './components/Reports';
import Notifications from './components/Notifications';
import AccountSettings from './components/AccountSettings';

function App() {
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuth(true);
      axios.defaults.headers.common['x-auth-token'] = token;
      axios.get(`${process.env.REACT_APP_API_URL}/auth/login`)
        .then(res => setRole(res.data.employee.role))
        .catch(err => {
          console.error(err);
          setAuth(false);
        });
    }
  }, []);

  const handleLogin = (token, role) => {
    localStorage.setItem('token', token);
    setAuth(true);
    setRole(role);
    axios.defaults.headers.common['x-auth-token'] = token;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    setRole('');
    delete axios.defaults.headers.common['x-auth-token'];
  };

  return (
    <Router>
      <Navbar auth={auth} role={role} handleLogout={handleLogout} />
      <div className="container">
        <Routes>
          <Route path="/" element={<LoginPage handleLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupPage auth={auth} role={role} />} /> {/* Pass auth and role props */}
          <Route path="/dashboard" element={auth ? <EmployeeDashboard /> : <LoginPage handleLogin={handleLogin} />} />
          <Route path="/apply-leave" element={auth ? <ApplyForLeave /> : <LoginPage handleLogin={handleLogin} />} />
          <Route path="/leave-history" element={auth ? <LeaveHistory /> : <LoginPage handleLogin={handleLogin} />} />
          <Route path="/admin-dashboard" element={auth && role === 'admin' ? <AdminDashboard /> : <LoginPage handleLogin={handleLogin} />} />
          <Route path="/employee-management" element={auth && role === 'admin' ? <EmployeeManagement /> : <LoginPage handleLogin={handleLogin} />} />
          <Route path="/leave-management" element={auth && role === 'admin' ? <LeaveManagement /> : <LoginPage handleLogin={handleLogin} />} />
          <Route path="/reports" element={auth && role === 'admin' ? <Reports /> : <LoginPage handleLogin={handleLogin} />} />
          <Route path="/notifications" element={auth && role === 'admin' ? <Notifications /> : <LoginPage handleLogin={handleLogin} />} />
          <Route path="/account-settings" element={auth && role === 'admin' ? <AccountSettings handleLogout={handleLogout} /> : <LoginPage handleLogin={handleLogin} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;