import { Request, Response, NextFunction } from "express";

interface ApiError extends Error {
  status?: number;
}

export function notFoundHandler(_req: Request, res: Response) {
  return res.status(404).json({ message: "Route not found" });
}

export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const status = err.status ?? 500;
  const message = err.message || "Internal Server Error";

  console.error("ErrorHandler:", err);

  return res.status(status).json({ message });
}
