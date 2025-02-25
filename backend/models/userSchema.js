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
  },
  { collection: "Users" }
);

const User = userConnection.model("Users", userSchema);

// export default User;
module.exports = User;
