import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

function Reports() {
  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState({ totalRequests: 0, approved: 0, rejected: 0 });

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
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/leaves`);
        const totalRequests = res.data.length;
        const approved = res.data.filter(l => l.status === 'approved').length;
        const rejected = res.data.filter(l => l.status === 'rejected').length;
        setStats({ totalRequests, approved, rejected });
      } catch (err) {
        console.error(err);
      }
    };

    fetchLeaves();
    fetchStats();
  }, []);

  const data = {
    labels: ['Approved', 'Rejected'],
    datasets: [
      {
        label: 'Leave Status',
        data: [stats.approved, stats.rejected],
        backgroundColor: ['#28a745', '#dc3545'],
      },
    ],
  };

  return (
    <div>
      <h2>Reports</h2>
      <div className="summary-cards">
        <div className="card">
          <h3>Total Requests</h3>
          <p>{stats.totalRequests}</p>
        </div>
        <div className="card">
          <h3>Approved</h3>
          <p>{stats.approved}</p>
        </div>
        <div className="card">
          <h3>Rejected</h3>
          <p>{stats.rejected}</p>
        </div>
      </div>
      <Bar data={data} />
    </div>
  );
}

export default Reports;