import { Schema, Types } from "mongoose";
const { eventConnection } = require("../connection");
const mongoose = require("mongoose");
const donationSchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    //HAVE city: { type: String, required: true },//HAVE
    zipCode: { type: String, required: true }, //HAVE
    email: { type: String, required: true }, //Have
    donorName: { type: String, required: true }, //HAVE
    itemName: { type: String, required: true }, //HAVE
    itemDimensions: { type: String, required: false }, //HAVE
    phone: { type: String, required: true }, //HAVE
    dropOffTime: { type: [[String]], required: true }, //HAVE
    canDropOff: { type: Boolean, required: true }, //HAVE
  },
  { collection: "Donations" }
);
const Donation = donationSchema.model("Donations", eventSchema); // export default Event
module.exports = Donation;
