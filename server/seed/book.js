const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Book = require('../models/book');

const booksJsonPath = path.join(__dirname, 'book.json');

async function seedBooks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const booksData = JSON.parse(fs.readFileSync(booksJsonPath, 'utf-8'));

    await Book.deleteMany({});
    await Book.insertMany(booksData);

    console.log('Books seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

module.exports = seedBooks;