const express = require('express');
const router = express.Router();
const { applyForLeave, getEmployeeLeaves, getAllLeaves, approveLeave, rejectLeave } = require('../controllers/leaveController');
const jwtUtils = require('../utils/jwtUtils');

router.post('/', jwtUtils, applyForLeave); // Use jwtUtils middleware
router.get('/employee', jwtUtils, getEmployeeLeaves); // Use jwtUtils middleware
router.get('/', jwtUtils, getAllLeaves); // Use jwtUtils middleware
router.put('/approve/:id', jwtUtils, approveLeave); // Use jwtUtils middleware
router.put('/reject/:id', jwtUtils, rejectLeave); // Use jwtUtils middleware

module.exports = router;