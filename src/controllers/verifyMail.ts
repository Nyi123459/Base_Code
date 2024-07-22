import { Request, Response } from "express";
import registerDb from "../data-access";

export default function makeVerifyEmail() {
  return async function verifyEmail(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const token = req.query.token as string;
      console.log("TOKEN", token);
      const userId = req.query.userId as string;
      console.log("UserId:", userId);

      if (typeof token !== "string" || typeof userId !== "string") {
        res.status(400).json({
          status: "FAILED",
          message: "Invalid token or user ID",
        });
        return;
      }

      // Call the verifyUserEmail function from the database logic
      const isVerified = await registerDb.verifyUserEmail({
        token,
        userId,
      });

      if (isVerified) {
        res.status(200).json({
          status: "SUCCESS",
          message: "Email verified successfully",
        });
      } else {
        res.status(400).json({
          status: "FAILED",
          message: "Invalid or expired verification token",
        });
      }
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ status: "ERROR", message: err.message });
    }
  };
}
