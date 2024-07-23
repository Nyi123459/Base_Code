import { Request, Response } from "express";
import registerDb from "../data-access";

export default function makeLogin() {
  return async function login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          status: "FAILED",
          message: "Email and password are required",
        });
        return;
      }
      const user = await registerDb.authenticateUser({ email, password });
      if (!user) {
        res.status(400).json({
          status: "FAILED",
          message: "Invalid email or password",
        });
        return;
      }
      user.isLogin = true;
      user.save();
      res.status(200).json({
        status: "SUCCESS",
        message: "User authenticated successfully",
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        status: "FAILED",
        message: err.message,
      });
    }
  };
}
