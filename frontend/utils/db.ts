import mongoose from "mongoose";

const url: string = process.env.MONGO as string;


const connect = async () => {
  try {
    await mongoose.connect(url);
  } catch (error) {
    throw new Error("Connection failed!");
  }
};

export default connect;