// import { Schema, Types } from 'mongoose';
const { eventConnection } = require("../connection");
const mongoose = require("mongoose");


// interface event {
//     title: string;
//     pickupAvailability: Types.Array<Types.Array<String>>
//     location: string;
// }
  
const eventSchema = new mongoose.Schema(
  { 
    title: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    volunteerId: { type: String, required: true }, // This should be changed to volunteer Id eventually
    itemId: { type: String, required: true }, // This should be changed to itemId eventually
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    volunteerFirstName: { type: String, required: true },
    volunteerLastName: { type: String, required: true },
    donorFirstName: { type: String, required: true },
    donorLastName: { type: String, required: true },
    itemName: { type: String, required: true },
    phone: { type: String, required: true },
    pickupAvailability: { type: [[String]], required: true },
    location: { type: String, required: false }
  },
  { collection: "Events" }
);
  
const Event = eventConnection.model("Events", eventSchema);
// export default Event;
module.exports = Event;