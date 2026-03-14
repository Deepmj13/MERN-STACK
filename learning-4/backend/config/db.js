const mongoose = require("mongoose");
const dotenv = require("dotenv");

console.log(process.env.NAME);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Mongo db connected : ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error : ", error.message);
    process.exit(1);
  }
};
module.export = connectDB;
