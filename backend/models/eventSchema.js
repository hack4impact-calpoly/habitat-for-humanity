// import { Schema, Types } from 'mongoose';
const mongoose = require("mongoose");
const { eventConnection } = require("../connection");

// interface event {
//     title: string;
//     pickupAvailability: Types.Array<Types.Array<String>>
//     location: string;
// }
  
const eventSchema = new mongoose.Schema(
  { 
    title: { type: String, required: true },
    pickupAvailability: { type: [[String]], required: true },
    location: { type: String, required: true }
  },
  { collection: "Events" }
);
  
const Event = eventConnection.model("Events", eventSchema);
// export default Event;
module.exports = Event;