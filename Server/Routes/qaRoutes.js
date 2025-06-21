const express = require("express");
const router = express.Router();
const { handleQuestion } = require("../Controllers/qaController");
const { verifyToken } = require("../middleware/auth");

router.use(verifyToken); // 🔒 Secure route

// POST /api/qa/ask
router.post("/ask", handleQuestion);

module.exports = router;
