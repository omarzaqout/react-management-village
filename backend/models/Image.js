const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    src: { type: String, required: true },
    description: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", imageSchema);