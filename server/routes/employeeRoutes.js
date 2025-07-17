const express = require('express');
const router = express.Router();
const { getAllEmployees, addEmployee, updateEmployee, deleteEmployee, getCurrentEmployee } = require('../controllers/employeeController');
const jwtUtils = require('../utils/jwtUtils');

router.get('/', jwtUtils, getAllEmployees);
router.get('/me', jwtUtils, getCurrentEmployee); // Use jwtUtils middleware
router.post('/', jwtUtils, addEmployee); // Use jwtUtils middleware
router.put('/:id', jwtUtils, updateEmployee); // Use jwtUtils middleware
router.delete('/:id', jwtUtils, deleteEmployee); // Use jwtUtils middleware

module.exports = router;