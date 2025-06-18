const express = require("express");
const router = express.Router();
const { 
  handleUserSignup, 
  handleUserLogin, 
  getCurrentUser,
  getAllSignedUsers 
} = require("../Controllers/user");
const { verifyToken } = require("../middleware/auth");

router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.get("/me", verifyToken, getCurrentUser);
router.get("/getsignedusers", verifyToken, getAllSignedUsers);

module.exports = router;