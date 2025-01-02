// models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },  // دور المستخدم (Admin/User)
});

const User = mongoose.model("User", userSchema);

module.exports = User;
