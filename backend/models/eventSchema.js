import { Schema, Types } from 'mongoose';
const mongoose = require("mongoose");
import { eventConnection } from "../connection";

// interface event {
//     title: string;
//     pick_up_availability: Types.Array<Types.Array<String>>
//     location: string;
// }
  
const eventSchema = new Schema(
  { 
    title: { type: String, required: true },
    pick_up_availability: { type: [[String]], required: true },
    location: { type: String, required: true }
  },
  { collection: "Events" }
);
  
const Event = eventConnection.model("Events", eventSchema);
export default Event;