const { UnauthorizedError, ForbiddenError } = require("../helpers/error");
const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models/user");

function authentication(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedError("Token is required");
    }
    if (!token.startsWith("Bearer ")) {
      throw new UnauthorizedError("Invalid token format");
    }
    const tokenValue = token.split(" ")[1];
    req.user = verifyToken(tokenValue);
    next();
  } catch (e) {
    next(e);
  }
}

function adminOnly(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      throw new ForbiddenError("This action is forbidden for non-admin users");
    }
    next();
  } catch (e) {
    next(e);
  }
}

module.exports = {
  authentication, 
  adminOnly
};