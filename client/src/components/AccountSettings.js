import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AccountSettings({ handleLogout }) {
  const [formData, setFormData] = useState({ password: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/employees/me`, { password: formData.password });
      if (res.data) {
        setSuccess('Password updated successfully');
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred');
      setSuccess('');
    }
  };

  return (
    <div>
      <h2>Account Settings</h2>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>New Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit">Update Password</button>
      </form>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default AccountSettings;