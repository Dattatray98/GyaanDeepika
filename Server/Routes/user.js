const express = require("express");
const router = express.Router();
const { handleuserlogin, handleusersignup, GetsignedUsers } = require("../Controllers/user");



// ✅ User Registration
router.post("/signin", handleusersignup);

// ✅ User Login
router.post("/login", handleuserlogin);

// ✅ Get All Users
router.get("/", GetsignedUsers);

module.exports = router;
