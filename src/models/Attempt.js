const { Schema, Types, model } = require("mongoose");
const AttemptSchema = new Schema({
  studentId: {
    type: Types.ObjectId,
    ref: "students",
    required: true,
  },
  problemId: {
    type: Types.ObjectId,
    ref: "problems",
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  failedTestCaseIndex: {
    type: Number,
    default: null,
  },
});

const Attempt = model("attempts", AttemptSchema);
module.exports = Attempt;
