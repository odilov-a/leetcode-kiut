const { Schema, Types, model } = require("mongoose");
const FeedbackSchema = new Schema({
  student: {
    type: Types.ObjectId,
    ref: "students",
    index: true,
  },
  teacher: {
    type: Types.ObjectId,
    ref: "teachers",
    index: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = model("feedbacks", FeedbackSchema);
module.exports = Feedback;
