const Employee = require('../models/Employee');
const Leave = require('../models/Leave');

exports.getLeaveStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const leaves = await Leave.find();

    const now = new Date();
    const leavesThisMonth = leaves.filter(l => l.startDate.getMonth() === now.getMonth() && l.startDate.getFullYear() === now.getFullYear()).length;
    const approved = leaves.filter(l => l.status === 'approved').length;
    const pending = leaves.filter(l => l.status === 'pending').length;
    const rejected = leaves.filter(l => l.status === 'rejected').length;

    res.json({ totalEmployees, leavesThisMonth, approved, pending, rejected });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};