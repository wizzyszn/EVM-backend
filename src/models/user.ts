import { Schema, model, Document } from "mongoose";

export enum UserRole {
  ADMIN = "admin",
  TENANT = "tenant",
}

export interface IUser extends Document {
  name : string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  properties?: Schema.Types.ObjectId[];
  estate: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  authenticated : boolean
};

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    authenticated: { type: Boolean, default: false },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    properties: [{ type: Schema.Types.ObjectId, ref: "Property" }], //properties owned or rented
    estate: { type: Schema.Types.ObjectId, ref: "Estate" }, // Link to Estate
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", UserSchema);