// import { ObjectId, Schema, Types } from 'mongoose';
const mongoose = require("mongoose");
const { itemConnection } = require("../connection");

// interface item {
//     name: string;
//     email: string;
//     phone: string;
//     images: Types.Array<ObjectId>;
//     size: string;
//     address: string;
//     city: string;
//     zipCode: string;
//     donorId: ObjectId;
//     notes: string;
//     timeSubmitted: Date;
//     timeAccepted: Date;
//     status: string;
// }

const itemSchema = new mongoose.Schema(
  {
    name: {type: String, required: true },
    images: { type: [mongoose.Schema.ObjectId], required: true },
    size: { type: String, required: true },
    address: {type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    scheduling: {type: String, required: true},
    timeAvailability: { type: [[Date, Date]], required: true },
    //donorId: { type: mongoose.Schema.Types.ObjectId, required: true },
    timeSubmitted: { type: Date, required: true },
    timeApproved: { type: Date, required: false },
    status: { type: String, required: true },
    notes: { type: String, required: false },
    timeAccepted: { type: Date, required: false },
  },
  { collection: "Items" }
);
  
const Item = itemConnection.model("Items", itemSchema);
// export default Item;
module.exports = Item;
