const { Schema, Types, model } = require("mongoose");
const solutionSchema = new Schema(
  {
    studentId: {
      type: Types.ObjectId,
      required: true,
      ref: "students",
    },
    problemId: {
      type: Types.ObjectId,
      required: true,
      ref: "problems",
    },
    code: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

const Solution = model("solutions", solutionSchema);
module.exports = Solution;
