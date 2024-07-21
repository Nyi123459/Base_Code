import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  emailVerified?: boolean;
  isLogin?: boolean;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  isLogin: { type: Boolean, default: false },
});

const UserModel: Model<IUser> = mongoose.model("User", userSchema);

export default UserModel;
