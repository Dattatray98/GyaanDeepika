const express = require('express');
const passport = require('passport');
const router = express.Router();
const { generateToken } = require('../Service/auth');

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login', // Redirect to frontend login on failure
    session: false, // Disable Passport.js session if using JWT
  }),
  (req, res) => {
    const token = generateToken(req.user); // Generate JWT
    
    // SECURE: Set HTTP-only cookie (works for both dev/prod)
    res.cookie('token', token, {
      httpOnly: true, // Block JS access
      secure: process.env.NODE_ENV === 'production', // HTTPS-only in prod
      sameSite: 'lax', // Prevent CSRF
      maxAge: 86400000, // 1 day expiry
    });

    // Redirect to frontend (use environment variable)
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173/home');
  }
);

module.exports = router