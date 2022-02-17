import { Schema, Types } from 'mongoose';
import { itemConnection } from "../connection";

interface item {
    images: Types.Array<Buffer>;
    size: string;
    location: string;
    donor_id: string;
    notes: string;
    time_submitted: string;
    time_accepted: string;
}
  
const itemSchema = new Schema<item>(
  {
    images: { type: [Buffer], required: false },
    size: { type: String, required: true },
    location: { type: String, required: true },
    donor_id: { type: String, required: true },
    notes: { type: String, required: false },
    time_submitted: { type: String, required: false },
    time_accepted: { type: String, required: false }
  },
  { collection: "Items" }
);
  
const Item = itemConnection.model("Items", itemSchema);
export default Item;
