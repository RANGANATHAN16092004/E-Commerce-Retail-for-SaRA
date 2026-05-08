const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    const adminExists = await User.findOne({ email: 'admin@stylenest.com' });

    if (adminExists) {
      console.log('Admin already exists.');
    } else {
      const admin = new User({
        name: 'StyleNest Admin',
        email: 'admin@stylenest.com',
        password: 'admin123',
        role: 'admin'
      });
      await admin.save();
      console.log('Admin account created successfully!');
      console.log('Email: admin@stylenest.com');
      console.log('Password: admin123');
    }

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
