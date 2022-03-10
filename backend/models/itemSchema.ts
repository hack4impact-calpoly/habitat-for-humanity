import { ObjectId, Schema, Types } from 'mongoose';
const mongoose = require("mongoose");
import { itemConnection } from "../connection";

interface item {
    name: string;
    images: Types.Array<ObjectId>;
    size: string;
    location: string;
    donor_id: ObjectId;
    notes: string;
    time_submitted: string;
    time_accepted: string;
}
  
const itemSchema = new Schema<item>(
  {
    name: {type: String, required: false },
    images: { type: [mongoose.Schema.Types.ObjectId], required: false },
    size: { type: String, required: true },
    location: { type: String, required: true },
    donor_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    notes: { type: String, required: false },
    time_submitted: { type: String, required: false },
    time_accepted: { type: String, required: false }
  },
  { collection: "Items" }
);
  
const Item = itemConnection.model("Items", itemSchema);
export default Item;
