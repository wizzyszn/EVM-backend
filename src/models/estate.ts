import {Document, model, Schema} from "mongoose"
interface IEstateSchema extends Document{
    name : string;
    location : string;
    admin : Schema.Types.ObjectId,
    createdAt : Date;
    updatedAt: Date;
}
const EstateSchema = new Schema<IEstateSchema>({
    name: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    admin: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Estate Manager
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },{
    timestamps : true
  });

  export const EstateModel =  model<IEstateSchema>("Estate", EstateSchema)
  