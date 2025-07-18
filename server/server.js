require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors'); // Import cors middleware
const connectDB = require('./config/db');
const path = require('path');
const jwtUtils = require('./utils/jwtUtils');

const app = express();

// Enable CORS
app.use(cors());

connectDB();



app.use(express.json({ extended: false }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', jwtUtils, require('./routes/employeeRoutes')); // Use jwtUtils middleware
app.use('/api/leaves', jwtUtils, require('./routes/leaveRoutes')); // Use jwtUtils middleware
app.use('/api/reports', jwtUtils, require('./routes/reportRoutes')); // Use jwtUtils middleware

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


console.log("Backend app starting, PORT:", process.env.PORT);
console.log("Trying to connect to Mongo at:", process.env.MONGO_URI);

