import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: [String], required: true },
    images: { type: [String], required: false },
    size: { type: [String], required: false },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: false },
    zipCode: { type: String, required: true },
    scheduling: { type: String, required: true },
    timeAvailability: [
      {
        start: { type: String, required: false },
        end: { type: String, required: false },
      },
    ],
    donorId: { type: String, required: false },
    timeSubmitted: { type: Date, required: true },
    timeApproved: { type: Date, required: false },
    status: { type: String, required: true },
    notes: { type: String, required: false },
    timeAccepted: { type: Date, required: false },
    donorName: { type: String, required: false },
    donorEmail: { type: String, required: false },
    donorPhone: { type: String, required: false },
    estimatedValue: { type: String, required: false },
    itemDetails: { type: String, required: false },
  }
);

const Items = mongoose.models.Items || mongoose.model("Items", itemSchema);

export default Items;