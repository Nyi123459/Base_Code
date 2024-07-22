// src/types/express.d.ts
import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../models/User.model";

declare global {
  namespace Express {
    interface Request {
      user?: IUser | JwtPayload;
    }
  }
}
