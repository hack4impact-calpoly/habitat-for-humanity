import mongoose from 'mongoose';
import { ObjectId, Schema, Types } from 'mongoose';
import { imageConnection } from "../connection";

interface image {
  _id: ObjectId;
  key: string;
  name: string;
  link: string;
}

const imageSchema = new Schema<image>(
  {
    _id: {type: mongoose.Schema.Types.ObjectId, required: true },
    key: {type: String, required: true },
    name: {type: String, required: true },
    link: { type: String, required: true }
  },
  { collection: "Images" }
);

// module.exports = mongoose.model('products', image)

const Image = imageConnection.model("Images", imageSchema);
export default Image;
