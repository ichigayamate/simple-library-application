const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const User = require('../models/user');
const bcrypt = require('bcrypt');
require("dotenv").config();

const usersJsonPath = path.join(__dirname, 'user.json');

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const userData = JSON.parse(fs.readFileSync(usersJsonPath, 'utf-8'));

    await User.deleteMany({});
    await User.insertMany(userData.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 10)
    })));

    console.log('User seeded successfully!');
  } catch (err) {
    console.error('Seeding failed:', err);
  }
}

module.exports = seedUsers;