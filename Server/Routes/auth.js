const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Step 1: Google OAuth start
router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

// Step 2: Google OAuth callback
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const user = req.user;

    // Check required values
    if (!user || !user._id || !user.email) {
      return res.redirect("http://localhost:5173/login?error=User not found");
    }

    // Use fallback for expiresIn if not defined
    const expiresIn = process.env.JWT_EXPIRES_IN || "1h";

    // Sign JWT token
    const token = jwt.sign({
      id: user._id,
      name: user.firstName,
      email: user.email
    }, process.env.JWT_SECRET, {
      expiresIn
    });

    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/home?token=${token}`);
  }
);

module.exports = router;
