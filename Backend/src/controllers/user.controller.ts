import { getUsers } from "../repository/user.repo";
import { Request, Response } from "express";
import createUserService from "../service/createUserService";

async function getUsersController(req: Request, res: Response) {
  const users = await getUsers();

  res.status(200).json({ message: "Success!", users });
}

async function createUserController(req: Request, res: Response) {
  const user = await createUserService(
    req.body.name,
    req.body.email,
    req.body.password,
  );

  res.status(201).json({ message: "User Created", user });
}

export { createUserController, getUsersController };
