import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', password: '', role: 'employee', leaveQuota: { sick: 12, casual: 12 } });
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/employees`);
        setEmployees(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleQuotaChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, leaveQuota: { ...newEmployee.leaveQuota, [name]: parseInt(value) } });
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/employees`, newEmployee);
      setNewEmployee({ name: '', email: '', password: '', role: 'employee', leaveQuota: { sick: 12, casual: 12 } });
      setEmployees([...employees, newEmployee]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setNewEmployee(employee);
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/employees/${editingEmployee._id}`, newEmployee);
      setEmployees(employees.map(emp => (emp._id === editingEmployee._id ? newEmployee : emp)));
      setEditingEmployee(null);
      setNewEmployee({ name: '', email: '', password: '', role: 'employee', leaveQuota: { sick: 12, casual: 12 } });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/employees/${id}`);
      setEmployees(employees.filter(emp => emp._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Employee Management</h2>
      <form onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={newEmployee.name} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={newEmployee.email} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" value={newEmployee.password} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <select name="role" value={newEmployee.role} onChange={handleInputChange} required>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="form-group">
          <label>Sick Leave Quota:</label>
          <input type="number" name="sick" value={newEmployee.leaveQuota.sick} onChange={handleQuotaChange} required />
        </div>
        <div className="form-group">
          <label>Casual Leave Quota:</label>
          <input type="number" name="casual" value={newEmployee.leaveQuota.casual} onChange={handleQuotaChange} required />
        </div>
        <button type="submit">{editingEmployee ? 'Update Employee' : 'Add Employee'}</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.role}</td>
              <td>
                <button onClick={() => handleEditEmployee(employee)}>Edit</button>
                <button onClick={() => handleDeleteEmployee(employee._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeManagement;