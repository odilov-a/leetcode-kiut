const { Schema, model, Types } = require("mongoose");

const chatSchema = new Schema(
  {
    senderId: {
      type: Types.ObjectId,
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["student", "teacher", "admin"],
      required: true,
    },
    receiverId: {
      type: Types.ObjectId,
      required: true,
    },
    receiverRole: {
      type: String,
      enum: ["student", "teacher", "admin"],
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

const Chat = model("Chat", chatSchema);
module.exports = Chat;
