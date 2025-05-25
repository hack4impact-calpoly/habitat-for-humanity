// import { ObjectId, Schema } from 'mongoose';
const mongoose = require("mongoose");
const { userConnection } = require("../connection");

// interface user {
//     phone: string;
//     id: string;
// }

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true },
    id: { type: String, required: true },
    address: { 
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
    },
    marketingOption: { type: Boolean, default: false },
  },
  { collection: "Users" }
);

const User = userConnection.model("Users", userSchema);

// export default User;
module.exports = User;
