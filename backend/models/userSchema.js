import { ObjectId, Schema } from 'mongoose';
import { userConnection } from "../connection";
const mongoose = require("mongoose");

// interface user {
//     userType: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//     phone: string;
// }
  
const userSchema = new Schema(
  {
    userType: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { collection: "Users" }
);
  
const User = userConnection.model("Users", userSchema);

export default User;