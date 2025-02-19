import {Schema,model} from "mongoose";
export interface INotification extends Document {
    recipient: Schema.Types.ObjectId;
    message: string;
    type: "payment" | "maintenance" | "lease";
    isRead: boolean;
    createdAt: Date;
  }
  
  const NotificationSchema = new Schema<INotification>(
    {
      recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
      message: { type: String, required: true },
      type: { type: String, enum: ["payment", "maintenance", "lease"], required: true },
      isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
  );
  
  export const NotificationModel = model<INotification>("Notification", NotificationSchema);
  