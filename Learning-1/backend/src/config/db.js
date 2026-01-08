import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database Connected !");
  } catch (error) {
    console.error("error", error);
    process.exit(1); //failure
  }
};
