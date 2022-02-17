import { Schema, Types } from 'mongoose';
import { itemConnection } from "../connection";

interface item {
    images: Types.Array<Buffer>;
    size: string;
    location: string;
    lastName: string;
    donor_id: string;
    notes: string;
}
  
const itemSchema = new Schema<item>(
  {
    images: { type: [Buffer], required: false },
    size: { type: String, required: true },
    location: { type: String, required: true },
    donor_id: { type: String, required: true },
    notes: { type: String, required: false }
  },
  { collection: "Items" }
);
  
const Item = itemConnection.model("Items", itemSchema);
export default Item;