const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  ful
    type: String,
    required: true,
    uniquelname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {: true,
  },
  role: {
    type: String,
    default: "user",
  },

});

module.exports = mongoose.model("User", userSchema);
