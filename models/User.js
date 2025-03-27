const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    githubId: String,
    username: String,
    email: String,
    publicKeyGist: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
