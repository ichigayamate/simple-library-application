const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  author: {
    type: String,
    required: [true, "Author is required"],
    trim: true,
  },
  genre: {
    type: String,
    required: [true, "Genre is required"],
    trim: true,
  },
  publishedYear: {
    type: Number,
    required: [true, "Published Year is required"],
  },
}, {
  timestamps: true,
});

const Book = mongoose.model("Book", userSchema);
module.exports = Book;