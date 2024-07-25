const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    default: null,
    trim: true,
    required: [true, "First Name is required"],
  },
  lastname: {
    type: String,
    trim: true,
    default: null,
    required: [true, "Last Name is required"],
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
  otp: {
    trim: true,
    type: String,
    default: null,
  },
  verified: {
    type: Boolean,
    default: true,
  },
  submissions: [
    {
      problemId: {
        type: String,
        default: null,
      },
      problemTitle: {
        type: String,
        default: null,
      },
      language: {
        type: String,
        default: null,
      },
      verdict: {
        type: String,
        default: null,
      },
      timeTaken: {
        type: Number,
        default: null,
      },
    },
  ],
});

module.exports = mongoose.model("user", userSchema);