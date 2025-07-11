const router = require('express').Router();
const BookController = require("../controllers/book");
const { authentication, adminOnly } = require('../middleware/auth');

router.use(authentication);
router.get("/", BookController.getAllBooks);
router.get("/borrows", adminOnly, BookController.checkAllBorrowedBooks);
router.get("/:id", BookController.getBookById);
router.post("/", adminOnly, BookController.createBook);
router.put("/:id", adminOnly, BookController.updateBook);
router.delete("/:id", adminOnly, BookController.deleteBook);

router.post("/borrow/:id", BookController.borrowBook);
router.post("/return", BookController.returnBook);

module.exports = router;