import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  emailVerified?: boolean;
  refreshToken: string | null;
  isLogin?: boolean;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  refreshToken: { type: String, default: null },
  isLogin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const UserModel: Model<IUser> = mongoose.model("User", userSchema);

export default UserModel;
