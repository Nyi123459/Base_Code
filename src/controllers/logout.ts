import { Request, Response } from "express";
import UserModel from "../models/User.models";

export async function logoutUser(req: Request, res: Response) {
  try {
    const userId = req.user?.id; // Ensure req.user exists

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Assuming user.refreshToken is the mechanism to invalidate the token
    user.refreshToken = null;
    await user.save();

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
