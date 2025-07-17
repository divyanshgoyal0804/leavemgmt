import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';

function AdminDashboard() {
  const [stats, setStats] = useState({ totalEmployees: 0, leavesThisMonth: 0, approved: 0, pending: 0, rejected: 0 });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/reports`);
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchRecentActivity = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/leaves`);
        setRecentActivity(res.data.slice(0, 5)); // Get the last 5 leave requests
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
    fetchRecentActivity();
  }, []);

  const leaveStatusData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        label: 'Leave Status',
        data: [stats.approved, stats.pending, stats.rejected],
        backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
      },
    ],
  };

  const recentActivityData = {
    labels: recentActivity.map(leave => `${leave.employeeId} (${leave.leaveType})`),
    datasets: [
      {
        label: 'Recent Activity',
        data: recentActivity.map(leave => leave.status === 'approved' ? 1 : leave.status === 'pending' ? 2 : 3),
        backgroundColor: recentActivity.map(leave => leave.status === 'approved' ? '#28a745' : leave.status === 'pending' ? '#ffc107' : '#dc3545'),
      },
    ],
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="summary-cards">
        <div className="card">
          <h3>Total Employees</h3>
          <p>{stats.totalEmployees}</p>
        </div>
        <div className="card">
          <h3>Leaves This Month</h3>
          <p>{stats.leavesThisMonth}</p>
        </div>
        <div className="card">
          <h3>Approved Leaves</h3>
          <p>{stats.approved}</p>
        </div>
        <div className="card">
          <h3>Pending Leaves</h3>
          <p>{stats.pending}</p>
        </div>
        <div className="card">
          <h3>Rejected Leaves</h3>
          <p>{stats.rejected}</p>
        </div>
      </div>
      <div className="charts">
        <div className="chart-container">
          <h3>Leave Status</h3>
          <Doughnut data={leaveStatusData} />
        </div>
        <div className="chart-container">
          <h3>Recent Activity</h3>
          <Bar data={recentActivityData} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;