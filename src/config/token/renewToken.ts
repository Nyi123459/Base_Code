import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "..";
import UserModel from "../../models/User.models";
import { generateAccessToken, generateRefreshToken } from "./token";

export async function renewAccessToken(req: Request, res: Response) {
  const refreshToken = req.body.token;
  if (!refreshToken)
    return res.status(401).json({ message: "Refresh Token Required" });

  try {
    if (!REFRESH_TOKEN_SECRET) {
      throw new Error("No refresh token provided");
    }
    const decoded: any = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = await UserModel.findById(decoded._id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = newRefreshToken;

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
}
