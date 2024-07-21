import jwt from "jsonwebtoken";
import { JWT_SECRET } from ".";
import Id from "../Id";

export function generateJwtToken(token: string) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ Id }, JWT_SECRET, {
    expiresIn: "1hr",
  });
}

export function verifyJwtToken(token: string): any {
  try {
    if (!JWT_SECRET) {
      throw new Error("No token provided");
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired data");
  }
}
