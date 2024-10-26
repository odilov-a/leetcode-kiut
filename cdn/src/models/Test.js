const { Schema, model } = require("mongoose");
const testSchema = new Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const Test = model("tests", testSchema);
module.exports = Test;
