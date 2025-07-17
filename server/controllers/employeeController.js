const Employee = require('../models/Employee');

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select('-password');
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getCurrentEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee.id).select('-password');
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.addEmployee = async (req, res) => {
  const { name, email, password, role, leaveQuota } = req.body;

  try {
    let employee = await Employee.findOne({ email });

    if (employee) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Check if the user is an admin and can create another admin
    const token = req.header('x-auth-token');
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const requestingUser = await Employee.findById(decoded.employee.id);

      if (requestingUser.role !== 'admin' && role === 'admin') {
        return res.status(403).json({ msg: 'Forbidden: Only admins can create other admins' });
      }
    }

    employee = new Employee({
      name,
      email,
      password,
      role,
      leaveQuota,
    });

    const salt = await bcrypt.genSalt(10);

    employee.password = await bcrypt.hash(password, salt);

    await employee.save();

    const payload = {
      employee: {
        id: employee.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, employee }); // Return employee details
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateEmployee = async (req, res) => {
  const { name, email, password, role, leaveQuota } = req.body;

  const employeeFields = {};
  if (name) employeeFields.name = name;
  if (email) employeeFields.email = email;
  if (role) employeeFields.role = role;
  if (leaveQuota) employeeFields.leaveQuota = leaveQuota;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    employeeFields.password = await bcrypt.hash(password, salt);
  }

  try {
    let employee = await Employee.findById(req.params.id);

    if (!employee) return res.status(404).json({ msg: 'Employee not found' });

    employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: employeeFields },
      { new: true }
    );

    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Employee removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};