import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

function AdminDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState({ totalEmployees: 0, leavesThisMonth: 0, approved: 0, pending: 0, rejected: 0 });

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/leaves`);
        setLeaves(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/employees`);
        const totalEmployees = res.data.length;
        const now = new Date();
        const leavesThisMonth = res.data.reduce((acc, emp) => acc + emp.leaves.filter(l => l.startDate.getMonth() === now.getMonth() && l.startDate.getFullYear() === now.getFullYear()).length, 0);
        const approved = res.data.reduce((acc, emp) => acc + emp.leaves.filter(l => l.status === 'approved').length, 0);
        const pending = res.data.reduce((acc, emp) => acc + emp.leaves.filter(l => l.status === 'pending').length, 0);
        const rejected = res.data.reduce((acc, emp) => acc + emp.leaves.filter(l => l.status === 'rejected').length, 0);
        setStats({ totalEmployees, leavesThisMonth, approved, pending, rejected });
      } catch (err) {
        console.error(err);
      }
    };

    fetchLeaves();
    fetchStats();
  }, []);

  const data = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        label: 'Leave Status',
        data: [stats.approved, stats.pending, stats.rejected],
        backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
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
      <Bar data={data} />
    </div>
  );
}

export default AdminDashboard;