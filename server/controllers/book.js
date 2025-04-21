const Book = require('../models/book');
const ResponseEntity = require("../helpers/response");
const { NotFoundError, ForbiddenError } = require('../helpers/error');

class BookController {
  static async getAllBooks(req, res) {
    const books = await Book.find();
    new ResponseEntity(books).generateResponse(res);
  }

  static async getBookById(req, res) {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) throw new NotFoundError("Book not found");

    new ResponseEntity(book).generateResponse(res);
  }

  static async createBook(req, res) {
    const { title, author, genre, publishedYear } = req.body;
    const newBook = new Book({ title, author, genre, publishedYear });
    await newBook.save();
    new ResponseEntity(newBook, 201).generateResponse(res);
  }

  static async updateBook(req, res) {
    const { id } = req.params;
    const { title, author, genre, publishedYear } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, genre, publishedYear },
      { new: true }
    );
    if (!updatedBook) throw new NotFoundError("Book not found");
    new ResponseEntity(updatedBook).generateResponse(res);
  }

  static async deleteBook(req, res) {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) throw new NotFoundError("Book not found");
    new ResponseEntity(deletedBook).generateResponse(res);
  }

  static async borrowBook(req, res) {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) throw new NotFoundError("Book not found");

    const { userId } = req.user;
    const userData = await User.findById(userId);
    if (userData.borrowedBooks) {
      throw new ForbiddenError("Return your book before borrowing another one");
    }

    userData.borrowedBooks = id;
    await userData.save();

    new ResponseEntity(null).generateResponse(res, 200, "Book borrowed successfully");
  }

  static async returnBook(req, res) {
    const { userId } = req.user;
    const userData = await User.findById(userId);
    if (!userData.borrowedBooks) {
      throw new NotFoundError("You don't have any borrowed books");
    }

    userData.borrowedBooks = null;
    await userData.save();
    new ResponseEntity(null).generateResponse(res, 200, "Book returned successfully");
  }
}

module.exports = BookController;