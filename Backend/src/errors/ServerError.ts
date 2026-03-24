import AppError from "./AppError";

class ServerError extends AppError {
  constructor(message: string = "Bad Request") {
    super(message, 500);
  }
}

export default ServerError;
