import mongoose from "mongoose";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface User {
  _id: string;
  email: string;
  password: string;
  emailVerified?: boolean;
  [key: string]: any;
}

export interface VerifyUserEmailInput {
  userId: string;
  token: string;
}

export interface AuthenticateUserInput {
  email: string;
  password: string;
}
