// import { ObjectId, Schema } from 'mongoose';
const mongoose = require("mongoose");
const { userConnection } = require("../connection");

// interface user {
//     id: string;
//     phone: string;
// }

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    phone: { type: String, required: true},
  },
  { collection: "Users" }
);

const User = userConnection.model("Users", userSchema);

// export default User;
module.exports = User;
