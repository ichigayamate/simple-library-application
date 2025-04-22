const Book = require("../models/book");
const User = require("../models/user");
const ResponseEntity = require("../helpers/response");
const { NotFoundError, ForbiddenError } = require("../helpers/error");
const dayjs = require("dayjs");

class BookController {
  static async getAllBooks(req, res) {
    const booksQuery = Book.find();
    const isAdmin = req.user.role === "admin";
    if (isAdmin) {
      booksQuery.populate("borrowedBy", "name email");
    }
    const books = await booksQuery;
    new ResponseEntity(books).generateResponse(res);
  }

  static async getBookById(req, res) {
    const { id } = req.params;
    const isAdmin = req.user.role === "admin";
    const bookQuery = Book.findById(id);
    if (isAdmin) bookQuery.populate("borrowedBy", "name email");
    const book = await bookQuery;
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

    if (deletedBook.borrowedBy) {
      throw new ForbiddenError("Book must be returned before deletion");
    }

    new ResponseEntity(deletedBook).generateResponse(res);
  }

  static async borrowBook(req, res) {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) throw new NotFoundError("Book not found");

    const userId = req.user.id;
    const userData = await User.findById(userId);
    if (userData.borrowedBook) {
      throw new ForbiddenError("Return your book before borrowing another one");
    }

    userData.borrowedBook = id;
    await userData.save();

    book.borrowedBy = userId;
    book.borrowedDate = new Date();
    book.returnDate = dayjs().add(7, "day").toDate();
    await book.save();

    new ResponseEntity(null, 200, `Book ${book.title} successfully borrowed. Return before ${dayjs(book.returnDate).format("DD MMM YYYY")}`).generateResponse(res);
  }

  static async returnBook(req, res) {
    const userId = req.user.id;
    const userData = await User.findById(userId);
    if (!userData.borrowedBook) {
      throw new NotFoundError("You don't have any borrowed books");
    }

    const book = await Book.findById(userData.borrowedBook);
    if (book) {
      book.borrowedBy = null;
      book.borrowedDate = null;
      book.returnDate = null;
      await book.save();
    }

    userData.borrowedBook = null;
    await userData.save();

    new ResponseEntity(null, 200, "Book returned successfully").generateResponse(res);
  }

  static async checkAllBorrowedBooks(req, res) {
    const books = await Book.find({ borrowedBy: { $ne: null } }).populate("borrowedBy", "name email");
    new ResponseEntity(books).generateResponse(res);
  }
}

module.exports = BookController;