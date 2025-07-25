const express = require('express');
const passport = require('passport');
const router = express.Router();
const { generateToken, verifyToken } = require('../middleware/auth');

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
    failureRedirect: '/login',
    session: false,
  }),
  (req, res) => {
    const token = generateToken(req.user);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400000,
    });

    res.redirect(`${process.env.FRONTEND_URL}/oauth-redirect?token=${token}`);
  }
);

module.exports = router;