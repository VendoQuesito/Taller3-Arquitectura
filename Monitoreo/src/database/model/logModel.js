const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["action", "error"],
    required: true,
  },
  userId: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    default: null,
  },
  method: {
    type: String,
    enum: ["GET", "POST", "PUT", "DELETE", null],
    default: null,
  },
  url: {
    type: String,
    default: null,
  },
  message: {
    type: String,
    required: true,
  },
  meta: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Log", logSchema);
