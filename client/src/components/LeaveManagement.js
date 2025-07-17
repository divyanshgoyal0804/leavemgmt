import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LeaveManagement() {
  const [leaves, setLeaves] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/leaves`);
        setLeaves(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLeaves();
  }, []);

  const handleApproveLeave = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/leaves/approve/${id}`, { comments: '' });
      setLeaves(leaves.map(leave => (leave._id === id ? { ...leave, status: 'approved' } : leave)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectLeave = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/leaves/reject/${id}`, { comments: '' });
      setLeaves(leaves.map(leave => (leave._id === id ? { ...leave, status: 'rejected' } : leave)));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLeaves = filterStatus === 'all' ? leaves : leaves.filter(leave => leave.status === filterStatus);

  return (
    <div>
      <h2>Leave Management</h2>
      <div className="filter-container">
        <label>Filter by Status:</label>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeaves.map((leave) => (
            <tr key={leave._id}>
              <td>{leave.employeeId}</td>
              <td>{leave.leaveType}</td>
              <td>{new Date(leave.startDate).toLocaleDateString()}</td>
              <td>{new Date(leave.endDate).toLocaleDateString()}</td>
              <td>{leave.status}</td>
              <td>
                {leave.status === 'pending' && (
                  <>
                    <button onClick={() => handleApproveLeave(leave._id)}>Approve</button>
                    <button onClick={() => handleRejectLeave(leave._id)}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaveManagement;