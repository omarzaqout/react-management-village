const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const messageSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  fromUsername: { type: String, required: true },
  toUsername: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, 
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
