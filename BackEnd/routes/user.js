const express = require("express");
const router = express.Router();
const sessionID = require("../controllers/user.js")
const { handleuserlogin, handleusersignup, GetsignedUsers } = require("../controllers/user.js");



// ✅ User Registration
router.post("/signin", handleusersignup);

// ✅ User Login
router.post("/login", handleuserlogin);

// ✅ Get All Users
router.get("/", GetsignedUsers);

module.exports = router;
