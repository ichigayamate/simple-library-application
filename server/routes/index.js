const router = require('express').Router();
const UserController = require("../controllers/user");
const { authentication } = require('../middleware/auth');

// user routes
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/me", authentication, UserController.getUser);

router.use("/books", require("./book"));

module.exports = router;