const { AppError, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError, ValidationError } = require('./errors');

class ApiError {
  static badRequest(message) {
    return new BadRequestError(message);
  }

  static unauthorized(message) {
    return new UnauthorizedError(message);
  }

  static forbidden(message) {
    return new ForbiddenError(message);
  }

  static notFound(message) {
    return new NotFoundError(message);
  }

  static conflict(message) {
    return new ConflictError(message);
  }

  static validation(message, errors) {
    return new ValidationError(message, errors);
  }
}

module.exports = ApiError;
