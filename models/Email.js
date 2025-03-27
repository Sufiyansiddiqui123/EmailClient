const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  sender: String, // GitHub username
  recipient: String, // GitHub username
  encryptedBody: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Email", emailSchema);
