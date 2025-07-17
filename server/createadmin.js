require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the employee schema
const employeeSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  leaveQuota: {
    sick: Number,
    casual: Number
  }
});

const Employee = mongoose.model('Employee', employeeSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'your-mongodb-uri-here', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const existing = await Employee.findOne({ email: 'admin@example.com' });
    if (existing) {
      console.log('Admin already exists.');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = new Employee({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      leaveQuota: {
        sick: 12,
        casual: 12
      }
    });

    await admin.save();
    console.log('✅ Admin user created successfully.');
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
