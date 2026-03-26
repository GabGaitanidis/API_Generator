import { Request, Response, NextFunction } from "express";
import { validateLogin, validateRegister } from "./auth.validation";
import { setAuthCookies, clearAuthCookies } from "../../utils/authCookies";

import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  getMeUser,
} from "./auth.service";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, email, password } = validateRegister(req.body);

    const result = await registerUser({ name, email, password });

    setAuthCookies(res, result.accessToken, result.refreshToken);

    return res.status(201).json({
      message: "User registered successfully",
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = validateLogin(req.body);

    const result = await loginUser({ email, password });

    setAuthCookies(res, result.accessToken, result.refreshToken);

    return res.json({
      message: "Logged in successfully",
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Missing refresh token" });
    }

    const result = await refreshSession(token);

    setAuthCookies(res, result.accessToken, result.refreshToken);

    return res.json({ message: "Tokens refreshed" });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    await logoutUser(req.cookies?.refreshToken);
    clearAuthCookies(res);

    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    clearAuthCookies(res);
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await getMeUser(Number(req.user.id));

    return res.json({
      message: "Authenticated user",
      user,
    });
  } catch (error) {
    next(error);
  }
}
