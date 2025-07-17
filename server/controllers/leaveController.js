const Leave = require('../models/Leave');

exports.applyForLeave = async (req, res) => {
  const { leaveType, startDate, endDate, reason } = req.body;

  try {
    const leave = new Leave({
      employeeId: req.employee.id,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await leave.save();

    res.json(leave);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getEmployeeLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employeeId: req.employee.id }).sort({ startDate: -1 });
    res.json(leaves);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ startDate: -1 });
    res.json(leaves);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) return res.status(404).json({ msg: 'Leave not found' });

    leave.status = 'approved';
    leave.comments = req.body.comments;

    await leave.save();

    res.json(leave);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.rejectLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) return res.status(404).json({ msg: 'Leave not found' });

    leave.status = 'rejected';
    leave.comments = req.body.comments;

    await leave.save();

    res.json(leave);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};