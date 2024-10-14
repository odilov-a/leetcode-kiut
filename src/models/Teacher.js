const { Schema, Types, model } = require("mongoose");
const teacherSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    subject: [
      {
        type: Types.ObjectId,
        ref: "subjects",
        required: true,
      },
    ],
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
    photoUrl: [
      {
        type: String,
      },
    ],
    role: {
      type: String,
      default: "teacher",
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

const Teacher = model("teachers", teacherSchema);
module.exports = Teacher;
