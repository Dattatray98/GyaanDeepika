const express = require("express");
const router = express.Router();
const { handleuserlogin, handleusersignup, getAllSignedUsers } = require("../Controllers/user");



// ✅ User Registration
router.post("/signin", handleusersignup);

// ✅ User Login
router.post("/login", handleuserlogin);

// ✅ Get All Users
router.get('/getsignedusers', getAllSignedUsers);

module.exports = router;
