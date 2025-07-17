import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function EmployeeDashboard() {
  const [leaveBalance, setLeaveBalance] = useState({ sick: 0, casual: 0 });

  useEffect(() => {
    const fetchLeaveBalance = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/employees/me`);
        setLeaveBalance(res.data.leaveQuota);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLeaveBalance();
  }, []);

  return (
    <div>
      <h2>Employee Dashboard</h2>
      <div className="leave-balance">
        <p>Sick Leave Balance: {leaveBalance.sick}</p>
        <p>Casual Leave Balance: {leaveBalance.casual}</p>
      </div>
      <div className="dashboard-links">
        <Link to="/apply-leave">Apply for Leave</Link>
        <Link to="/leave-history">Leave History</Link>
      </div>
    </div>
  );
}

export default EmployeeDashboard;