import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { register, login, refresh, logout, getMe } from "./auth.controller";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);
authRouter.get("/me", requireAuth, getMe);

export default authRouter;
