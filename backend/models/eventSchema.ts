import { Schema, Types } from 'mongoose';
import { eventConnection } from "../connection";

interface event {
    title: string;
    start_date: string;
    end_date: string;
    location: string;
}
  
const eventSchema = new Schema<event>(
  { 
    title: { type: String, required: true },
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
    location: { type: String, required: false },
  },
  { collection: "Events" }
);
  
const Event = eventConnection.model("Events", eventSchema);
export default Event;