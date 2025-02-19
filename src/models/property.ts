import {Schema, model} from "mongoose";
export enum PropertyStatus {
    AVAILABLE = "available",
    OCCUPIED = "occupied",
    UNDER_MAINTENANCE = "under_maintenance",
    SOLD = "sold",
  }
  
export interface IProperty extends Document {
    name: string;
    address: string;
    type: "apartment" | "villa" | "studio" | "penthouse";
    estate : Schema.Types.ObjectId;
    size: number;
    status : PropertyStatus,
    price: number;
    owner: Schema.Types.ObjectId;
    tenants?: Schema.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  const PropertySchema = new Schema<IProperty>(
    {
      name: { type: String, required: true },
      address: { type: String, required: true },
      type: { type: String, enum: ["apartment", "villa", "studio", "penthouse"], required: true },
      estate: { type: Schema.Types.ObjectId, ref: "Estate", required: true }, // Link to Estate
      size: { type: Number },
      price: { type: Number, required: true },
      owner: { type: Schema.Types.ObjectId, ref: "User", required: true }, //Admin
      tenants: [{ type: Schema.Types.ObjectId, ref: "User" }], //Tenants renting the property
      status : {
        type : String,
        enum : Object.values(PropertyStatus),
        default : PropertyStatus.AVAILABLE
      }
    },
    { timestamps: true }
  );
  
  export const PropertyModel = model<IProperty>("Property", PropertySchema);
  