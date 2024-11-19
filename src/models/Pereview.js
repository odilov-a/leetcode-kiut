const { Schema, Types, model } = require("mongoose");
const pereviewSchema = new Schema(
  {
    student: {
      type: Types.ObjectId,
      ref: "students",
      required: true,
      index: true,
    },
    project: {
      type: Types.ObjectId,
      ref: "projects",
      required: true,
      index: true,
    },
    pereviewer: {
      type: Types.ObjectId,
      ref: "students",
      index: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    isMarked: {
      type: Boolean,
      required: true,
    },
    isTeacherMarked: {
      type: Boolean,
      required: true,
    },
    projectUrl: {
      type: String,
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

const Pereviews = model("pereviews", pereviewSchema);
module.exports = Pereviews;
