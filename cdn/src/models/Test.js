const mongoose = require("mongoose");
const testSchema = new mongoose.Schema(
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

const Test = mongoose.model("tests", testSchema);
module.exports = Test;
