const { Schema, model } = require("mongoose");
const subjectSchema = new Schema(
  {
    titleUz: {
      type: String,
      required: true,
      uniqe: true,
    },
    titleRu: {
      type: String,
      required: true,
      uniqe: true,
    },
    titleEn: {
      type: String,
      required: true,
      uniqe: true,
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

const Subject = model("subjects", subjectSchema);
module.exports = Subject;
