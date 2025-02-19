import { Schema, model } from "mongoose";

export interface IPayment extends Document {
    lease: Schema.Types.ObjectId;
    tenant: Schema.Types.ObjectId;
    amount: number;
    status: "paid" | "pending" | "overdue";
    method: "cash" | "bank transfer" | "card";
    createdAt: Date;
    updatedAt: Date;
  }
  
  const PaymentSchema = new Schema<IPayment>(
    {
      lease: { type: Schema.Types.ObjectId, ref: "Lease", required: true },
      tenant: { type: Schema.Types.ObjectId, ref: "User", required: true },
      amount: { type: Number, required: true },
      status: { type: String, enum: ["paid", "pending", "overdue"], required: true },
      method: { type: String, enum: ["cash", "bank transfer", "card"], required: true },
    },
    { timestamps: true }
  );
  
  export const PaymentModel = model<IPayment>("Payment", PaymentSchema);
  