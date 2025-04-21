const router = require('express').Router();
const UserController = require("../controllers/user");

// user routes
router.post("/register", UserController.register);
router.post("/login", UserController.login);

module.exports = router;