const mongoose = require("mongoose");
const User = require("./User.js");

const problemsSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Problem title is required"],
  },
  statement: {
    type: String,
    trim: true,
    required: [true, "Problem statement is required"],
  },
  difficulty: {
    type: String,
    trim: true,
    required: [true, "Problem difficulty is required"],
  },
  input: {
    constraints: {
      type: String,
      trim: true,
      //required: [true, "Problem input constraints are required"],
    },
    sample: {
      type: String,
      trim: true,
      //required: [true, "Problem input sample is required"],
    },
  },
  output: {
    constraints: {
      type: String,
      trim: true,
      //required: [true, "Output constraints are required"],
    },
    sample: {
      type: String,
      trim: true,
      //required: [true, "Problem output sample is required"],
    },
  },
  testcases: {
    input: {
      type: String,
      trim: true,
    },
    output: {
      type: String,
      trim: true,
    },
  },
  submissions: [
    {
      userId: {
        type: mongoose.Types.ObjectId,
        default: null,
        //required: true,
      },
      firstname: {
        type: String,
        default: null,
      },
      lastname: {
        type: String,
        default: null,
      },
      language: {
        type: String,
        default: null,
      },
      solution: {
        type: String,
        default: null,
      },
      verdict: {
        type: String,
        default: null,
      },
      submissionDateTime: {
        type: Date,
        default: new Date(),
      },
      timeTaken: {
        type: Number,
        default: 0,
      },
    },
  ],
});

module.exports = mongoose.model("Problem", problemsSchema);