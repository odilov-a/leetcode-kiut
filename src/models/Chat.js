const { Schema, model, Types } = require("mongoose");
const chatSchema = new Schema(
  {
    senderId: {
      type: Types.ObjectId,
      required: true,
    },
    receiverId: {
      type: Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    photoUrls: [
      {
        type: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const Chat = model("chats", chatSchema);
module.exports = Chat;
