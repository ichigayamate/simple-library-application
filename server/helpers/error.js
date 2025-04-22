const ResponseEntity = require("./response");

/**
 * Throws 400 error to client
 */
class BadRequestError extends Error {
  constructor(message = "Bad request") {
    super(message);
    this.name = 'BadRequestError';
  }
}

/**
 * Throws 401 error to client
 */
class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Throws 403 error to client
 */
class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = 'ForbiddenError';
  }
}

/**
 * Throws 404 error to client
 */
class NotFoundError extends Error {
  constructor(message = "Entity not found") {
    super(message);
    this.name = 'NotFoundError';
  }
}

module.exports = {
  errorHandler: (err, req, res, next) => {
    let status = err.status || 500;
    let message = err.message;

    if (err.name === "ValidationError") {
      const errors = {};
      status = 400;
      Object.entries(err.errors).forEach(([key, value]) => {
        errors[key] = value.message;
      });
      message = errors;
    } else if (err.name === "BadRequestError") {
      status = 400;
    } else if (err.name === "UnauthorizedError" || err.name === "JsonWebTokenError") {
      status = 401;
    } else if (err.name === "ForbiddenError") {
      status = 403;
    } else if (err.name === "NotFoundError") {
      status = 404;
    } else if (err.name === "MongoServerError") {
      if (err.code === 11000) {
        const key = Object.keys(err.keyPattern)[0];
        status = 409;
        message = `${key} already exists`;
      }
    } else {
      console.error(err);
    }

    const responseEntity = new ResponseEntity(null, status, message)
    responseEntity.generateResponse(res);
  },
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
  BadRequestError
}
