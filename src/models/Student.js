const { Schema, Types, model } = require("mongoose");
const studentSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    phoneNumber: {
      type: String,
    },
    photoUrl: [
      {
        type: String,
      },
    ],
    problemsHistory: [
      {
        type: Types.ObjectId,
        ref: "problems",
        index: true,
      },
    ],
    projectsHistory: [
      {
        type: Types.ObjectId,
        ref: "projects",
        index: true,
      },
    ],
    role: {
      type: String,
      default: "student",
      required: true,
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

const Student = model("students", studentSchema);
module.exports = Student;
