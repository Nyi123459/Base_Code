import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const AUTH_EMAIL = process.env.AUTH_EMAIL;
export const AUTH_PASSWORD = process.env.AUTH_PASSWORD;
