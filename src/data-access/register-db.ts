import mongoose, { Connection, Document, ObjectId } from "mongoose";
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
import { userInfo } from "os";

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
    findByName,
    updateUser,
    authenticateUser,
    deleteUser,
  });

  async function createUser({
    name,
    email,
    password,
    confirmPassword,
  }: CreateUserInput): Promise<IUser> {
    if (!validateEmail(email)) {
      throw new Error("Invalid email format");
    }
    if (!validatePassword(password)) {
      throw new Error("Password does not meet requirements");
    }
    if (!confirmPassword) {
      throw new Error("Please fill in the confirm password");
    }
    if (!matchPassword(confirmPassword, password)) {
      throw new Error("Passwords do not match");
    }
    const hashedPassword = await hashPassword(password);
    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    const verificationToken = generateVerificationToken();
    await storeVerificationToken(user._id, verificationToken);
    await sendVerificationEmail(email, user._id, verificationToken);

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
    console.log("Id", Id.makeId());
    return Id.makeId();
  }

  async function sendVerificationEmail(
    email: string,
    userId: mongoose.Types.ObjectId,
    token: string
  ): Promise<void> {
    await sendEmailVerification(email, userId, token);
  }

  async function verifyUserEmail({
    token,
    userId,
  }: {
    token: string;
    userId: string;
  }): Promise<boolean> {
    const verification = await UserVerification.findOne({
      uniqueString: token,
      userId,
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

  async function findByName({ name }: { name: string }): Promise<IUser | null> {
    const user = await UserModel.findOne({ name }).exec();
    return user;
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

  async function deleteUser({ _id }: IUser): Promise<Document | null> {
    if (!_id) {
      throw new Error("No Id provided");
    }
    const result = await UserModel.findOneAndDelete({ _id });
    return result;
  }

  function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password) && password.length >= 8;
  }

  function matchPassword(confirmPassword: string, password: string): boolean {
    return confirmPassword === password;
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
