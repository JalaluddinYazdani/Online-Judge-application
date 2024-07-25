const mongoose = require("mongoose");
require("dotenv").config();

const DBConnection = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true });
    console.log("Database Connection Successfull");
  } catch (error) {
    console.log("Error in Database Connection", error.message);
  }
};
module.exports = { DBConnection };