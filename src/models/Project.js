const { Schema, Types, model } = require("mongoose");
const projectSchema = new Schema(
  {
    titleUz: {
      type: String,
      required: true,
    },
    descriptionUz: {
      type: String,
      required: true,
    },
    titleRu: {
      type: String,
      required: true,
    },
    descriptionRu: {
      type: String,
      required: true,
    },
    titleEn: {
      type: String,
      required: true,
    },
    descriptionEn: {
      type: String,
      required: true,
    },
    point: {
      type: Number,
      required: true,
    },
    tutorials: {
      type: String,
      required: true,
    },
    subject: {
      type: Types.ObjectId,
      ref: "subjects",
      required: true,
      index: true,
    },
    difficulty: {
      type: Types.ObjectId,
      ref: "difficulties",
      required: true,
      index: true,
    },
    teacher: {
      type: Types.ObjectId,
      ref: "teachers",
      index: true,
    },
    admin: {
      type: Types.ObjectId,
      ref: "admins",
      index: true,
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

const Project = model("projects", projectSchema);
module.exports = Project;
