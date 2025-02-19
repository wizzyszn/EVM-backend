import { Schema,model } from "mongoose";

export interface ILease extends Document {
    tenant: Schema.Types.ObjectId;
    property: Schema.Types.ObjectId;
    startDate: Date;
    endDate: Date;
    rentAmount: number;
    status: "active" | "terminated" | "pending";
    createdAt: Date;
    updatedAt: Date;
  }
  
  const LeaseSchema = new Schema<ILease>(
    {
      tenant: { type: Schema.Types.ObjectId, ref: "User", required: true },
      property: { type: Schema.Types.ObjectId, ref: "Property", required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      rentAmount: { type: Number, required: true },
      status: { type: String, enum: ["active", "terminated", "pending"], default: "pending" },
    },
    { timestamps: true }
  );
  
  export const LeaseModel = model<ILease>("Lease", LeaseSchema);
  