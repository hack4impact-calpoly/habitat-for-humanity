import { ObjectId, Schema, Types } from 'mongoose';
const mongoose = require("mongoose");
import { itemConnection } from "../connection";

// interface item {
//     name: string;
//     email: string;
//     phone: string;
//     images: Types.Array<ObjectId>;
//     size: string;
//     address: string;
//     city: string;
//     zipCode: string;
//     donor_id: ObjectId;
//     notes: string;
//     time_submitted: string;
//     time_accepted: string;
// }

const itemSchema = new Schema(
  {
    name: {type: String, required: false },
    images: { type: [mongoose.Schema.Types.ObjectId], required: false },
    size: { type: String, required: true },
    address: {type: String, required: false },
    city: { type: String, required: false },
    zipCode: { type: String, required: true },
    donor_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    notes: { type: String, required: false },
    time_submitted: { type: String, required: false },
    time_accepted: { type: String, required: false }
  },
  { collection: "Items" }
);
  
const Item = itemConnection.model("Items", itemSchema);
export default Item;
