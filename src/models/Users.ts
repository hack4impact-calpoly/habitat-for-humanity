import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  id: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
  },
  marketingOption: { type: Boolean, default: false },
});

const Users = mongoose.models.Users || mongoose.model("Users", userSchema);

export default Users;
