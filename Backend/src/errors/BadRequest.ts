import AppError from "./AppError";

class BadRequestError extends AppError {
  constructor(message: string = "Bad Request") {
    super(message, 400);
  }
}

export default BadRequestError;
