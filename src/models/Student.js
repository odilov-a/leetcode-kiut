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
    history: [
      {
        type: Types.ObjectId,
        refPath: "onModel",
        index: true,
      },
    ],
    onModel: {
      type: String,
      required: true,
      enum: ["problems", "projects"],
    },
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
