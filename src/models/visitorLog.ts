import {Schema, model}  from "mongoose"
export interface IVisitorLog extends Document {
    visitorName: string;
    purpose: string;
    tenant: Schema.Types.ObjectId;
    entryTime: Date;
    exitTime?: Date;
    createdAt: Date;
  }
  
  const VisitorLogSchema = new Schema<IVisitorLog>(
    {
      visitorName: { type: String, required: true },
      purpose: { type: String, required: true },
      tenant: { type: Schema.Types.ObjectId, ref: "User", required: true },
      entryTime: { type: Date, required: true },
      exitTime: { type: Date },
    },
    { timestamps: true }
  );
  
  export const VisitorLogModel = model<IVisitorLog>("VisitorLog", VisitorLogSchema);
  