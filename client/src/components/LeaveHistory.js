import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LeaveHistory() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/leaves/employee`);
        setLeaves(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLeaves();
  }, []);

  return (
    <div>
      <h2>Leave History</h2>
      <table>
        <thead>
          <tr>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id}>
              <td>{leave.leaveType}</td>
              <td>{new Date(leave.startDate).toLocaleDateString()}</td>
              <td>{new Date(leave.endDate).toLocaleDateString()}</td>
              <td>{leave.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaveHistory;