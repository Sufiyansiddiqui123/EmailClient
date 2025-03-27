const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// Save/Update public key link
router.put("/public-key", auth, async (req, res) => {
  const { publicKeyGist } = req.body;
  await User.findByIdAndUpdate(req.userId, { publicKeyGist });
  res.json({ success: true });
});

// Get own profile
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.userId).select("-__v");
  res.json(user);
});

router.get("/public-key/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user?.publicKeyGist) return res.status(404).json({ error: "Not found" });
  res.json({ publicKeyGist: user.publicKeyGist });
});

router.get("/all", auth, async (req, res) => {
  const users = await User.find({}).select("username publicKeyGist");
  console.log(users);
  res.json(users);
});

module.exports = router;
