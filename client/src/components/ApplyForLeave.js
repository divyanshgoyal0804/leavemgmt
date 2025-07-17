import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ApplyForLeave() {
  const [formData, setFormData] = useState({ leaveType: '', startDate: '', endDate: '', reason: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/leaves`, formData);
      navigate('/leave-history');
    } catch (err) {
      setError(err.response.data.msg);
    }
  };

  return (
    <div>
      <h2>Apply for Leave</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Leave Type:</label>
          <select name="leaveType" value={formData.leaveType} onChange={handleChange} required>
            <option value="">Select Leave Type</option>
            <option value="sick">Sick</option>
            <option value="casual">Casual</option>
          </select>
        </div>
        <div className="form-group">
          <label>Start Date:</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>End Date:</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Reason:</label>
          <textarea name="reason" value={formData.reason} onChange={handleChange} required></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ApplyForLeave;