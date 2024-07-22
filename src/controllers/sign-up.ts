import { Request, Response } from "express";
import registerDb from "../data-access";

export default function makeCreateUser() {
  return async function createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, confirmPassword } = req.body;
      if (!email || !password || !confirmPassword) {
        res.status(400).json({
          status: "FAILED",
          message: "Empty email or password",
        });
        return;
      }
      const userInput = {
        name,
        email,
        password,
        confirmPassword,
      };
      const user = await registerDb.createUser(userInput);
      res.status(200).json({
        status: "SUCCESS",
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ status: "ERROR", message: err.message });
    }
  };
}
