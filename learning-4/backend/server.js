const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

dotenv.config();
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(mongoSanitize());

const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api', orderRoutes);
app.use('/api/admin', adminRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Mongo db is connected"))
  .catch((err) => console.log(err));

app.listen(5000, () => {
  console.log("Server is running");
});
