const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

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

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(`Attempting to login with email: ${email}`);

    let employee = await Employee.findOne({ email });

    if (!employee) {
      console.log(`User not found with email: ${email}`);
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    console.log(`Found user: ${employee.name}`);

    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) {
      console.log(`Password mismatch for user: ${employee.name}`);
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    console.log(`Password match for user: ${employee.name}`);

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
        if (err) {
          console.error(`JWT signing error: ${err.message}`);
          throw err;
        }
        res.json({ token, employee }); // Return employee details
      }
    );
  } catch (err) {
    console.error(`Login error: ${err.message}`);
    res.status(500).send('Server error');
  }
};