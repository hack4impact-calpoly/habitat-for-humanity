// import { Schema, Types } from 'mongoose';
// const mongoose = require("mongoose");
// import { eventConnection } from "../connection";

const { eventConnection } = require("../connection");
const mongoose = require("mongoose");

// interface event {
//     title: string;
//     pick_up_availability: Types.Array<Types.Array<String>>
//     location: string;
// }
  
const eventSchema = new mongoose.Schema(
  { 
    title: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    volunteerId: { type: mongoose.Types.ObjectId, required: true },
    itemId: { type: mongoose.Types.ObjectId, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    volunteerFirstName: { type: String, required: true },
    volunteerLastName: { type: String, required: true },
    donorFirstName: { type: String, required: true },
    donorLastName: { type: String, required: true },
    itemName: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { collection: "Events" }
);
  
const Event = eventConnection.model("Events", eventSchema);
module.exports = Event;