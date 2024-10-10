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
      unique: true,
      required: true,
    },   
    isExtra: {
      type: Boolean,
      default: false,
    }, 
    photoUrl: [
      {
        type: String,
      },
    ],
    history: [
      {
        type: Types.ObjectId,
        ref: "problems",
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
