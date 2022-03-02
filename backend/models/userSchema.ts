import { Schema } from 'mongoose';
const mongoose = require('mongoose')
import { userConnection } from "../connection";

interface user {
    userType: string;
    userID: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    picture: string;
}
  
const userSchema = new Schema<user>(
  {
    userType: { type: String, required: true },
    userID: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, requried: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    picture: { type: String, required: true }
  },
  { collection: "Users" }
);
  
const User = userConnection.model("Users", userSchema);

export default User;