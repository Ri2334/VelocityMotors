const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Vehicle = require('./src/models/Vehicle');

dotenv.config();

const users = [
  {
    name: 'Standard Client',
    email: 'client@example.com',
    password: 'Password123!', // satisfies complexity validations
    role: 'user'
  },
  {
    name: 'System Administrator',
    email: 'admin@example.com',
    password: 'Admin123!', // satisfies complexity validations
    role: 'admin'
  }
];

const vehicles = [
  {
    make: 'Honda',
    model: 'Civic',
    category: 'Sedan',
    price: 2200000,
    quantity: 5
  },
  {
    make: 'Toyota',
    model: 'Fortuner',
    category: 'SUV',
    price: 3800000,
    quantity: 3
  },
  {
    make: 'Hyundai',
    model: 'i20',
    category: 'Hatchback',
    price: 900000,
    quantity: 0
  },
  {
    make: 'Ford',
    model: 'Mustang',
    category: 'Coupe',
    price: 7500000,
    quantity: 2
  },
  {
    make: 'Tata',
    model: 'Xenon',
    category: 'Truck',
    price: 1500000,
    quantity: 4
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing records
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    console.log('Cleared existing User and Vehicle database collections...');

    // Create users individually so password pre-save hash triggers run
    for (const u of users) {
      await User.create(u);
    }
    console.log('Mock user credentials created successfully!');

    // Create vehicles
    await Vehicle.insertMany(vehicles);
    console.log('Mock vehicle listings inserted successfully!');

    console.log('Database Seeding Completed Successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding database:', err);
    process.exit(1);
  }
};

seedDB();
