const ResponseEntity = require("../helpers/response");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/jwt");
const { BadRequestError, UnauthorizedError } = require("../helpers/error");

class UserController {
  static async register(req, res) {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    newUser.password = undefined;
    newUser.__v = undefined;
    new ResponseEntity(newUser, 201, "User created successfully").generateResponse(res);
  }

  static async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }
    const payload = {
      id: user._id,
      role: user.role,
    }
    const token = generateToken(payload);
    new ResponseEntity({token}).generateResponse(res);
  }

  static async getUser(req, res) {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password -__v");
    if (!user) {
      throw new BadRequestError("User not found");
    }
    new ResponseEntity(user).generateResponse(res);
  }
}

module.exports = UserController;