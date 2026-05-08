const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config({ path: './server/.env' });

const clearData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    await Product.deleteMany();
    await Order.deleteMany();

    console.log('Dummy Products and Orders removed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

clearData();
