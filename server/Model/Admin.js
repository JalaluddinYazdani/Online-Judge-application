const mongoose = require("mongoose");
const validator = require("validator");

const adminSchema = new mongoose.Schema({
  fullName: {
    type: String,
    default: null,
    trim: true,
    required: [true, "Full Name is required"],
  },
  phone: {
    type: Number,
    trim: true,
    default: null,
    required: [true, "Phone number is required"],
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    default: null,
    required: [true, "Email address is required"],
    validate: [validator.isEmail, "please fill the correct email"],
  },
  password: {
    trim: true,
    type: String,
    required: [true, "Password is required"],
  },
});

module.exports = mongoose.model("admin", adminSchema);