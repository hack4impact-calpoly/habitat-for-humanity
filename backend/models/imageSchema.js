const mongoose = require("mongoose");
const { imageConnection } = require("../connection");

// interface image {
//   _id: ObjectId;
//   key: string;
//   name: string;
//   link: string;
// }

const imageSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    key: { type: String, required: true },
    name: { type: String, required: true },
    link: { type: String, required: true },
  },
  { collection: "Images" }
);

// module.exports = mongoose.model('products', image)

const Image = imageConnection.model("Images", imageSchema);
// export default Image;
module.exports = Image;
