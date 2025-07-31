const express = require("express");
const router = express.Router();
const {
  handleUserSignup,
  handleUserLogin,
  getCurrentUser,
  updateUserProfile,
  getallusers,
} = require("../Controllers/user");
const upload = require('../middleware/upload');
const { verifyToken } = require("../middleware/auth");

router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.get("/me", verifyToken, getCurrentUser);
router.put('/edit', verifyToken, upload.single('avatar'), updateUserProfile);
router.get('/allusers', verifyToken, getallusers)

module.exports = router;