import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto'; // Import Chart.js automatically

function Reports() {
  const [monthlyLeaves, setMonthlyLeaves] = useState([]);
  const [departmentLeaves, setDepartmentLeaves] = useState([]);

  useEffect(() => {
    const fetchMonthlyLeaves = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/leaves`);
        const monthlyData = Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          count: res.data.filter(l => new Date(l.startDate).getMonth() === i).length,
        }));
        setMonthlyLeaves(monthlyData);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchDepartmentLeaves = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/employees`);
        const departmentData = res.data.map(emp => ({
          name: emp.name,
          leaves: emp.leaves.filter(l => l.status === 'approved').length,
        }));
        setDepartmentLeaves(departmentData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMonthlyLeaves();
    fetchDepartmentLeaves();
  }, []);

  const monthlyLeavesData = {
    labels: monthlyLeaves.map(m => new Date(0, m.month - 1).toLocaleString('default', { month: 'long' })),
    datasets: [
      {
        label: 'Monthly Leaves',
        data: monthlyLeaves.map(m => m.count),
        backgroundColor: '#457b9dff',
      },
    ],
  };

  const departmentLeavesData = {
    labels: departmentLeaves.map(d => d.name),
    datasets: [
      {
        label: 'Department-wise Leaves',
        data: departmentLeaves.map(d => d.leaves),
        backgroundColor: '#a8dadcff',
      },
    ],
  };

  return (
    <div>
      <h2>Reports & Analytics</h2>
      <div className="charts">
        <div className="chart-container">
          <h3>Monthly Leaves</h3>
          <Doughnut data={monthlyLeavesData} />
        </div>
        <div className="chart-container">
          <h3>Department-wise Leaves</h3>
          <Bar data={departmentLeavesData} />
        </div>
      </div>
    </div>
  );
}

export default Reports;