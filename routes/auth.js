const express = require("express");
const router = express.Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/github-exchange", async (req, res) => {
  const { code } = req.body;

  try {
    // Step 1: Exchange code for access token

    console.log({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    });

    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json", UserAgent: "Foo" },
      }
    );

    const access_token = tokenRes.data.access_token;

    // Step 2: Get user info
    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const emailRes = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const primaryEmail = emailRes.data.find(
      (e) => e.primary && e.verified
    )?.email;

    let user = await User.findOne({ githubId: userRes.data.id });
    if (!user) {
      user = await User.create({
        githubId: userRes.data.id,
        username: userRes.data.login,
        email: primaryEmail,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({ token });
  } catch (err) {
    console.error("OAuth error:", err.message);
    res.status(500).json({ error: "OAuth failed" });
  }
});

module.exports = router;
