const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config({ path: './server/.env' });


const products = [
  {
    title: 'Ethereal Silk Gown',
    description: 'A hand-crafted 100% silk evening gown with subtle gold embroidery. Perfect for gala events.',
    category: 'Evening Gowns',
    price: 1200,
    stock: 5,
    sizes: ['S', 'M', 'L'],
    colors: ['Midnight Blue', 'Emerald Green'],
    images: ['https://images.unsplash.com/photo-1539008835270-301566458bb3?auto=format&fit=crop&q=80&w=1000'],
    ratings: { average: 4.8, count: 12 }
  },
  {
    title: 'Ivory Lace Cocktail',
    description: 'Delicate ivory lace overlay with a silk lining. A classic choice for high-end cocktail parties.',
    category: 'Cocktail Dresses',
    price: 850,
    stock: 10,
    sizes: ['XS', 'S', 'M'],
    colors: ['Ivory', 'Champagne'],
    images: ['https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=1000'],
    ratings: { average: 4.5, count: 8 }
  },
  {
    title: 'Crimson Velvet Maxi',
    description: 'Deep crimson velvet with a thigh-high slit. Designed for bold elegance.',
    category: 'Luxury Silk',
    price: 980,
    stock: 3,
    sizes: ['M', 'L'],
    colors: ['Crimson'],
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000'],
    ratings: { average: 4.9, count: 5 }
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    await User.deleteMany();
    await Product.deleteMany();

    await User.create({
      name: 'StyleNest Admin',
      email: 'admin@stylenest.com',
      password: 'adminpassword123',
      role: 'admin'
    });

    await Product.insertMany(products);

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
