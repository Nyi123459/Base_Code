import mongoose, { Connection } from "mongoose";
import bcrypt from "bcryptjs";
import Id from "../Id";
import { makeDb } from ".";
import {
  CreateUserInput,
  User,
  VerifyUserEmailInput,
  AuthenticateUserInput,
} from "../types/register-types";
import UserModel, { IUser } from "../models/User.models";
import UserVerification from "../models/UserVerification.models";
import { sendEmailVerification } from "./emailVerification";

export default function makeRegisterDb({
  makeDb,
}: {
  makeDb: () => Promise<Connection>;
}) {
  return Object.freeze({
    createUser,
    findUserByEmail,
    generateVerificationToken,
    storeVerificationToken,
    verifyUserEmail,
    findUserByToken,
    updateUser,
    authenticateUser,
  });

  async function createUser({
    email,
    password,
    ...userInfo
  }: CreateUserInput): Promise<IUser> {
    if (!validateEmail(email)) {
      throw new Error("Invalid email format");
    }
    if (!validatePassword(password)) {
      throw new Error("Password does not meet requirements");
    }
    const hashedPassword = await hashPassword(password);
    const user = new UserModel({
      email,
      password: hashedPassword,
      ...userInfo,
    });
    await user.save();
    const verificationToken = generateVerificationToken();
    await storeVerificationToken(user._id, verificationToken);
    await sendVerificationEmail(email, verificationToken);

    return user.toObject();
  }

  async function findUserByEmail({
    email,
  }: {
    email: string;
  }): Promise<IUser | null> {
    return UserModel.findOne({ email }).exec();
  }

  function generateVerificationToken(): string {
    return Id.makeId();
  }

  async function sendVerificationEmail(
    email: string,
    token: string
  ): Promise<void> {
    await sendEmailVerification(email, token);
  }

  async function verifyUserEmail({
    token,
  }: VerifyUserEmailInput): Promise<Boolean> {
    const verification = await UserVerification.findOne({
      uniqueString: token,
    }).exec();
    if (!verification) {
      throw new Error("Invalid or expired verification token");
    }
    if (verification.expiresAt < new Date()) {
      throw new Error("Verification token has expired");
    }
    const user = await UserModel.findById(verification.userId).exec();
    if (!user) {
      throw new Error("User not found");
    }
    user.emailVerified = true;
    await user.save();

    await UserVerification.deleteOne({ uniqueString: token }).exec();
    return true;
  }

  async function findUserByToken({
    token,
  }: {
    token: string;
  }): Promise<IUser | null> {
    const verification = await UserVerification.findOne({
      uniqueString: token,
    }).exec();
    if (!verification) {
      return null;
    }
    return UserModel.findById(verification.userId).exec();
  }

  async function storeVerificationToken(
    userId: mongoose.Types.ObjectId,
    token: string
  ): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Set token expiration time (e.g., 1 hour)

    const verification = new UserVerification({
      userId,
      uniqueString: token,
      createdAt: new Date(),
      expiresAt,
    });
    await verification.save();
  }

  async function updateUser({
    _id,
    ...userInfo
  }: IUser): Promise<IUser | null> {
    const result = await UserModel.findByIdAndUpdate(_id, userInfo, {
      new: true,
    }).exec();
    return result ? result.toObject() : null;
  }

  async function authenticateUser({
    email,
    password,
  }: AuthenticateUserInput): Promise<IUser | null> {
    const user = await findUserByEmail({ email });
    if (!user || !(await comparePassword(password, user.password))) {
      throw new Error("Invalid email or password");
    }
    return user;
  }

  function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password) && password.length >= 8;
  }

  async function hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashPassword) {
      throw new Error("Not implemented");
    }
    return hashedPassword;
  }

  async function comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    const comparedPassword = await bcrypt.compare(hashedPassword, password);
    return comparedPassword;
  }
}
