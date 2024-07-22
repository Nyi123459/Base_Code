import { Request, Response } from "express";
import UserModel from "../models/User.models";

export async function logoutUser(req: Request, res: Response) {
  const userId = req.user.id;

  const user = await UserModel.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.refreshToken = null;
  await user.save();

  res.status(200).json({ message: "Logged out successfully" });
}
