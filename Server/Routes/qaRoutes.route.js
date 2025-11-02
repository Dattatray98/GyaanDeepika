const express = require("express");
const router = express.Router();
const { handleQuestion } = require("../Controllers/qaController.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.use(verifyToken); // 🔒 Secure route

// POST /api/qa/ask
router.post("/ask", handleQuestion);

module.exports = router;
