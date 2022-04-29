import { ObjectId, Schema, Types } from 'mongoose';
const mongoose = require("mongoose");
import { itemConnection } from "../connection";

interface item {
    name: string;
    email: string;
    phone: string;
    images: Types.Array<ObjectId>;
    size: string;
    address: string;
    city: string;
    zipCode: string;
    donorId: ObjectId;
    notes: string;
    timeSubmitted: Date;
    timeAccepted: Date;
    status: string;
}

const itemSchema = new Schema<item>(
  {
    name: {type: String, required: false },
    images: { type: [mongoose.Schema.Types.ObjectId], required: false },
    size: { type: String, required: true },
    address: {type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    donorId: { type: mongoose.Schema.Types.ObjectId, required: true },
    notes: { type: String, required: false },
    timeSubmitted: { type: Date, required: true },
    timeAccepted: { type: Date, required: false },
    status: { type: String, required: true }
  },
  { collection: "Items" }
);
  
const Item = itemConnection.model("Items", itemSchema);
export default Item;
