import {Schema , model } from "mongoose";
export interface IMaintenanceRequest extends Document {
    property: Schema.Types.ObjectId;
    tenant: Schema.Types.ObjectId;
    description: string;
    status: "pending" | "in-progress" | "resolved";
    createdAt: Date;
    updatedAt: Date;
  }
  
  const MaintenanceRequestSchema = new Schema<IMaintenanceRequest>(
    {
      property: { type: Schema.Types.ObjectId, ref: "Property", required: true },
      tenant: { type: Schema.Types.ObjectId, ref: "User", required: true },
      description: { type: String, required: true },
      status: { type: String, enum: ["pending", "in-progress", "resolved"], default: "pending" },
    },
    { timestamps: true }
  );
  
  export const MaintenanceRequestModel = model<IMaintenanceRequest>("MaintenanceRequest", MaintenanceRequestSchema);
  