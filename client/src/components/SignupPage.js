import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignupPage({ auth, role }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'employee' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting signup form:', formData);
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, formData);
      console.log('Signup response:', res.data);
      if (res.data && res.data.token && res.data.employee) {
        setSuccess('User registered successfully');
        setError('');
        navigate('/dashboard');
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.msg || 'An error occurred');
      setSuccess('');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        {auth && role === 'admin' && (
          <div className="form-group">
            <label>Role:</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupPage;