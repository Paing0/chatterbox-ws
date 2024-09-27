import { Schema, model } from "mongoose";

const messageSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  send_at: {
    type: Date,
    default: Date.now(),
  },
  room: {
    type: String,
    required: true,
  },
});

const messageModel = model("Message", messageSchema);

export default messageModel;
