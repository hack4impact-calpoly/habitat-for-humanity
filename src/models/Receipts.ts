import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema({
  pdf: { type: String, required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Items", required: true },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 90 },
});

const Receipts =
  mongoose.models.Receipts || mongoose.model("Receipts", receiptSchema);

export default Receipts;
