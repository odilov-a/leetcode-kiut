const { Schema, model } = require("mongoose");
const chatSchema = new Schema(
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

const Chat = model("chats", chatSchema);
module.exports = Chat;
