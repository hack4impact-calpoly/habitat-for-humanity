import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  itemId: { type: String, required: true }, // This should be changed to itemId eventually
  address: { type: String, required: true },
  city: { type: String, required: true },
  zipCode: { type: String, required: true },
  donorFirstName: { type: String, required: true },
  donorLastName: { type: String, required: true },
  itemName: { type: [String], required: true },
  phone: { type: String, required: true },
  emailAddress: { type: String, required: true },
  pickupAvailability: { type: [[String]], required: true },
  location: { type: String, required: false },
});

const Events = mongoose.models.Events || mongoose.model("Events", eventSchema);

export default Events;
