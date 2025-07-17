const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const verifyToken = require('../utils/jwtUtils'); // your middleware

router.post('/register', register);
router.post('/login', login);

// Add this new route
router.get('/me', verifyToken, (req, res) => {
  // req.employee is set by verifyToken middleware
  res.json({ employee: req.employee });
});

module.exports = router;
