import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { validateLogin, validateRegister } from "./auth.validation";

import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";

import { clearAuthCookies, setAuthCookies } from "../../utils/authCookies";
import { userTable } from "../../db/schema";
import { generateApiKey } from "../../data_generation/apiKeyGenerator";

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = validateRegister(req.body);

    const existingUsers = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    if (existingUsers[0]) {
      return res.status(409).json({
        message: "Email already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const apiKey = generateApiKey();

    const insertedUsers = await db
      .insert(userTable)
      .values({
        name,
        email,
        password: hashedPassword,
        api_key: apiKey,
      })
      .returning({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
        api_key: userTable.api_key,
        createdAt: userTable.createdAt,
        password: userTable.password,
      });
    const newUser = insertedUsers[0];

    const accessToken = signAccessToken({
      sub: String(newUser.id),
      email: newUser.email,
      name: newUser.name,
    });

    const refreshToken = signRefreshToken({
      sub: String(newUser.id),
    });

    const hashedRefreshToken = sha256(refreshToken);

    await db
      .update(userTable)
      .set({ refresh_token: hashedRefreshToken })
      .where(eq(userTable.id, newUser.id));

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("register error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = validateLogin(req.body);

    console.log("incoming email:", JSON.stringify(email));
    console.log("incoming password:", JSON.stringify(password));

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required",
      });
    }

    const users = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    const user = users[0];

    if (!user) {
      console.log("no user found");
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    console.log("stored password from db:", user.password);

    const passwordMatches = await bcrypt.compare(password, user.password);

    console.log("passwordMatches:", passwordMatches);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const accessToken = signAccessToken({
      sub: String(user.id),
      email: user.email,
      name: user.name,
    });

    const refreshToken = signRefreshToken({
      sub: String(user.id),
    });

    const hashedRefreshToken = sha256(refreshToken);

    await db
      .update(userTable)
      .set({ refresh_token: hashedRefreshToken })
      .where(eq(userTable.id, user.id));

    setAuthCookies(res, accessToken, refreshToken);

    return res.json({
      message: "Logged in successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        api_key: user.api_key,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        message: "Missing refresh token",
      });
    }

    const payload = verifyRefreshToken(incomingRefreshToken);

    const users = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, Number(payload.sub)))
      .limit(1);

    const user = users[0];

    if (!user || !user.refresh_token) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const hashedIncomingRefreshToken = sha256(incomingRefreshToken);

    if (hashedIncomingRefreshToken !== user.refresh_token) {
      return res.status(401).json({
        message: "Refresh token mismatch",
      });
    }

    const newAccessToken = signAccessToken({
      sub: String(user.id),
      email: user.email,
      name: user.name,
    });

    const newRefreshToken = signRefreshToken({
      sub: String(user.id),
    });

    const newHashedRefreshToken = sha256(newRefreshToken);

    await db
      .update(userTable)
      .set({ refresh_token: newHashedRefreshToken })
      .where(eq(userTable.id, user.id));

    setAuthCookies(res, newAccessToken, newRefreshToken);

    return res.json({
      message: "Tokens refreshed",
    });
  } catch (error) {
    console.error("refresh error:", error);
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (incomingRefreshToken) {
      try {
        const payload = verifyRefreshToken(incomingRefreshToken);

        await db
          .update(userTable)
          .set({ refresh_token: null })
          .where(eq(userTable.id, Number(payload.sub)));
      } catch {
        // ignore broken token on logout
      }
    }

    clearAuthCookies(res);

    return res.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("logout error:", error);
    clearAuthCookies(res);

    return res.json({
      message: "Logged out successfully",
    });
  }
}

export async function getMe(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const users = await db
      .select({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
        api_key: userTable.api_key,
        createdAt: userTable.createdAt,
      })
      .from(userTable)
      .where(eq(userTable.id, Number(req.user.id)))
      .limit(1);

    const user = users[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json({
      message: "Authenticated user",
      user,
    });
  } catch (error) {
    console.error("getMe error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
