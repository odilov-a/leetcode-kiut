const { Schema, model } = require("mongoose");
const difficultySchema = new Schema(
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

const Difficulty = model("difficulties", difficultySchema);
module.exports = Difficulty;
