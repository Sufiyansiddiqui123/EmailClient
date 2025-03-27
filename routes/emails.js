const express = require("express");
const router = express.Router();
const Email = require("../models/Email");
const auth = require("../middleware/auth");
const User = require("../models/User");

// Send message
router.post("/", auth, async (req, res) => {
  const { recipient, encryptedBody } = req.body;

  const senderUser = await User.findById(req.userId);
  if (!senderUser) return res.status(404).json({ error: "Sender not found" });

  const recipientUser = await User.findOne({ username: recipient });
  if (!recipientUser)
    return res.status(404).json({ error: "Recipient not found" });

  const email = await Email.create({
    sender: senderUser.username,
    recipient,
    encryptedBody,
  });

  res.json({ success: true, id: email._id });
});

// Get inbox
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  const emails = await Email.find({ recipient: user.username }).sort({
    timestamp: -1,
  });
  res.json(emails);
});

module.exports = router;
