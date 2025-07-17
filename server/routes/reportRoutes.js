const express = require('express');
const router = express.Router();
const { getLeaveStats } = require('../controllers/reportController');
const jwtUtils = require('../utils/jwtUtils');

router.get('/', jwtUtils, getLeaveStats); // Use jwtUtils middleware

module.exports = router;