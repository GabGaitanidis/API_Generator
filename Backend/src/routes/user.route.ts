import express from "express";
import {
  createUserController,
  getUsersController,
} from "../controllers/user.controller";
const userRouter = express.Router();

userRouter.get("/", getUsersController);
userRouter.post("/", createUserController);

export default userRouter;
